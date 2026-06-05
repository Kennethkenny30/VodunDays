/**
 * Module Survey - Enquête satisfaction
 *
 * Exploite les modèles existants (Answers, Questions, Quiz)
 * pour produire des statistiques de satisfaction.
 *
 * Convention : la "note" d'un festivalier est une réponse numérique (1-5)
 * à une question dont QuestionType.types contient RATING_TYPE_KEYWORD.
 * Les commentaires sont les réponses texte libres dont le type contient TEXT_TYPE_KEYWORD.
 * Si les libellés changent en base, mettre à jour ces deux constantes.
 */

import prisma from "../../prisma/prisma.client.js";

// Mots-clés attendus dans QuestionType.types pour identifier les types de question
const RATING_TYPE_KEYWORD = "Note";   // ex : "Note étoilée"
const TEXT_TYPE_KEYWORD   = "Texte";  // ex : "Texte libre"

export const getStats = async ({ eventId } = {}) => {
  // Récupère les réponses numériques (réponses parsables en 1-5)
  const ratingAnswers = await prisma.answers.findMany({
    where: {
      question: {
        ...(eventId && { quiz: { eventId } }),
        questionType: { types: { contains: RATING_TYPE_KEYWORD, mode: "insensitive" } },
      },
    },
    select: { response: true, createdAt: true },
  });

  const validRatings = ratingAnswers
    .map((a) => parseInt(a.response, 10))
    .filter((n) => n >= 1 && n <= 5);

  const totalResponses = validRatings.length;

  if (totalResponses === 0) {
    return {
      averageRating: 0,
      totalResponses: 0,
      satisfactionRate: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      trend: [],
    };
  }

  const averageRating =
    validRatings.reduce((sum, n) => sum + n, 0) / totalResponses;

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  validRatings.forEach((n) => { ratingDistribution[n]++; });

  // Taux de satisfaction = % de notes >= 4
  const satisfied = validRatings.filter((n) => n >= 4).length;
  const satisfactionRate = Math.round((satisfied / totalResponses) * 100);

  // Tendance par jour (7 derniers jours)
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentAnswers = ratingAnswers.filter(
    (a) => new Date(a.createdAt) >= since7d
  );

  const trendMap = {};
  recentAnswers.forEach((a) => {
    const day = a.createdAt.toISOString().slice(0, 10);
    if (!trendMap[day]) trendMap[day] = { date: day, count: 0, sum: 0 };
    const n = parseInt(a.response, 10);
    if (n >= 1 && n <= 5) {
      trendMap[day].count++;
      trendMap[day].sum += n;
    }
  });

  const trend = Object.values(trendMap)
    .map((d) => ({
      date:   d.date,
      count:  d.count,
      avg:    d.count > 0 ? Math.round((d.sum / d.count) * 10) / 10 : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalResponses,
    satisfactionRate,
    ratingDistribution,
    trend,
  };
};

export const getComments = async ({
  eventId,
  page = 1,
  limit = 20,
  minRating,
  maxRating,
} = {}) => {
  const skip = (Number(page) - 1) * Number(limit);

  // Cherche les réponses texte libres
  const where = {
    question: {
      ...(eventId && { quiz: { eventId } }),
      questionType: { types: { contains: TEXT_TYPE_KEYWORD, mode: "insensitive" } },
    },
    NOT: { response: "" },
  };

  const [answers, total] = await Promise.all([
    prisma.answers.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: {
        question: {
          select: {
            wording: true,
            quiz: { select: { title: true, event: { select: { name: true } } } },
          },
        },
      },
    }),
    prisma.answers.count({ where }),
  ]);

  const comments = answers.map((a) => ({
    id:        a.id,
    text:      a.response,
    question:  a.question?.wording || "",
    quiz:      a.question?.quiz?.title || "",
    event:     a.question?.quiz?.event?.name || "",
    uuid:      a.uuid,
    createdAt: a.createdAt,
  }));

  return {
    comments,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const exportCsv = async ({ eventId } = {}) => {
  const answers = await prisma.answers.findMany({
    where: {
      ...(eventId && { question: { quiz: { eventId } } }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      question: {
        select: {
          wording:      true,
          questionType: { select: { types: true } },
          quiz:         { select: { title: true } },
        },
      },
    },
  });

  // Génération CSV simple
  const header = "uuid,quiz,question,type,réponse,date\n";
  const rows = answers
    .map((a) =>
      [
        a.uuid || "",
        `"${(a.question?.quiz?.title || "").replace(/"/g, '""')}"`,
        `"${(a.question?.wording || "").replace(/"/g, '""')}"`,
        `"${(a.question?.questionType?.types || "").replace(/"/g, '""')}"`,
        `"${(a.response || "").replace(/"/g, '""')}"`,
        a.createdAt.toISOString(),
      ].join(",")
    )
    .join("\n");

  return header + rows;
};
