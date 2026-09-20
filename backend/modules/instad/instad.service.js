import prisma from "../../prisma/prisma.client.js";
import * as onboardingService from "../onboarding/onboarding.service.js";
import * as presenceService from "../presence/presence.service.js";
import * as surveyService from "../survey/survey.service.js";
import { resolveDemographicUuids } from "../survey/survey.service.js";

// Vue d'ensemble agrégée pour le dashboard INStaD : démographie des
// festivaliers, présence en temps réel (répartition par site), satisfaction,
// et la liste des sites (pour la carte de géolocalisation).
//
// Filtres optionnels :
//  - from/to (dates ISO)              : période d'enregistrement/de réponse
//  - gender/ageRange/nationality      : croisement démographique (satisfaction)
// La présence ("en ligne maintenant") reste toujours en temps réel - un
// filtre de période n'a pas de sens sur cette donnée.
export const getOverview = async ({ from, to, gender, ageRange, nationality } = {}) => {
  const [demographics, presence, satisfaction, sites, totalSites] = await Promise.all([
    onboardingService.getStats({ from, to }),
    presenceService.getOnlineNow(),
    surveyService.getStats({ from, to, gender, ageRange, nationality }),
    prisma.sites.findMany({
      select: {
        id: true, name: true, category: true,
        latitude: true, longitude: true, capacity: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.sites.count(),
  ]);

  // Répartition de la présence, enrichie avec le nom/la catégorie du site
  const siteById = new Map(sites.map((s) => [s.id, s]));
  const presenceBySite = Object.entries(presence.bySite)
    .map(([siteId, count]) => ({
      siteId,
      name:     siteById.get(siteId)?.name     ?? "Site inconnu",
      category: siteById.get(siteId)?.category ?? null,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    demographics,
    satisfaction,
    presence: {
      windowMinutes: presence.windowMinutes,
      onlineNow:     presence.total,
      unassigned:    presence.unassigned,
      bySite:        presenceBySite,
    },
    sites: {
      total: totalSites,
      list:  sites,
    },
  };
};

// Points de présence anonymisés (jamais d'uuid exposé) pour la vue "détail"
// de la carte de géolocalisation - fenêtre récente, volume borné, filtrable
// par site.
export const getPresencePoints = async ({ minutes = 15, limit = 2000, siteId } = {}) => {
  const windowMinutes = Math.min(Number(minutes) || 15, 180);
  const take          = Math.min(Number(limit) || 2000, 5000);
  const since         = new Date(Date.now() - windowMinutes * 60_000);

  return prisma.presenceLog.findMany({
    where: {
      createdAt: { gte: since },
      ...(siteId ? { siteId } : {}),
    },
    select:  { latitude: true, longitude: true, siteId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take,
  });
};

const GENDER_LABELS = { MALE: "Homme", FEMALE: "Femme", UNDISCLOSED: "Non précisé" };
const AGE_LABELS = {
  UNDER_18: "Moins de 18 ans",
  FROM_18_TO_24: "18-24 ans",
  FROM_25_TO_34: "25-34 ans",
  FROM_35_TO_44: "35-44 ans",
  FROM_45_TO_54: "45-54 ans",
  FROM_55_AND_ABOVE: "55 ans et +",
};
const EDITION_LABELS = {
  FIRST: "1ère édition", SECOND: "2e édition", THIRD: "3e édition", FOURTH_AND_ABOVE: "4e édition et +",
};

const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });
const countryName = (code) => {
  try { return regionNames.of(code) ?? code; } catch { return code; }
};

// Échappe une valeur pour une cellule CSV (guillemets doublés, entourée de ")
const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const csvRow  = (cells) => cells.map(csvCell).join(",") + "\n";

// Construit le rapport CSV complet (résumé + démographie + affluence +
// satisfaction) à partir des mêmes filtres que le dashboard.
export const exportCsv = async (filters = {}) => {
  const overview = await getOverview(filters);
  const { demographics, satisfaction, presence, sites } = overview;

  let csv = "";
  csv += csvRow(["Rapport statistiques - Vodun Days (INStaD)"]);
  csv += csvRow(["Généré le", new Date().toLocaleString("fr-FR")]);
  if (filters.from || filters.to) {
    csv += csvRow(["Période", `${filters.from ?? "début"} → ${filters.to ?? "aujourd'hui"}`]);
  }
  csv += "\n";

  csv += csvRow(["Résumé"]);
  csv += csvRow(["Indicateur", "Valeur"]);
  csv += csvRow(["Festivaliers enregistrés", demographics.total]);
  csv += csvRow(["En ligne maintenant", presence.onlineNow]);
  csv += csvRow(["Sites suivis", sites.total]);
  csv += csvRow(["Note moyenne", satisfaction.totalResponses > 0 ? `${satisfaction.averageRating}/5` : "-"]);
  csv += csvRow(["Taux de satisfaction", satisfaction.totalResponses > 0 ? `${satisfaction.satisfactionRate}%` : "-"]);
  csv += "\n";

  csv += csvRow(["Démographie - Genre"]);
  csv += csvRow(["Genre", "Effectif"]);
  demographics.byGender.forEach((g) => csv += csvRow([GENDER_LABELS[g.gender] ?? g.gender, g._count]));
  csv += "\n";

  csv += csvRow(["Démographie - Tranche d'âge"]);
  csv += csvRow(["Tranche d'âge", "Effectif"]);
  demographics.byAgeRange.forEach((a) => csv += csvRow([AGE_LABELS[a.ageRange] ?? a.ageRange, a._count]));
  csv += "\n";

  csv += csvRow(["Démographie - Édition de première participation"]);
  csv += csvRow(["Édition", "Effectif"]);
  demographics.byEdition.forEach((e) => csv += csvRow([EDITION_LABELS[e.edition] ?? e.edition, e._count]));
  csv += "\n";

  csv += csvRow(["Démographie - Nationalités (top 10)"]);
  csv += csvRow(["Pays", "Effectif"]);
  demographics.topNationalities.forEach((n) => csv += csvRow([countryName(n.nationality), n._count]));
  csv += "\n";

  csv += csvRow(["Affluence par site (fenêtre de", `${presence.windowMinutes} minutes)`]);
  csv += csvRow(["Site", "Catégorie", "Festivaliers en ligne"]);
  presence.bySite.forEach((s) => csv += csvRow([s.name, s.category ?? "-", s.count]));
  if (presence.unassigned > 0) csv += csvRow(["Hors zone connue", "-", presence.unassigned]);
  csv += "\n";

  csv += csvRow(["Satisfaction - Distribution des notes"]);
  csv += csvRow(["Note", "Nombre de réponses"]);
  [5, 4, 3, 2, 1].forEach((r) => csv += csvRow([`${r} étoile${r > 1 ? "s" : ""}`, satisfaction.ratingDistribution[r] ?? 0]));

  return csv;
};

// ═════════════════════════════════════════════════════════════════════════
// Questionnaires soumis par les festivaliers - accès et outils statistiques
// conventionnels (moyenne, médiane, mode, écart-type, tris à plat) pour
// l'INStaD, indépendamment du dashboard "satisfaction" (qui ne couvre que
// les questions de type Note/Texte). Ici, TOUTES les questions de TOUS les
// quiz sont accessibles, quel que soit leur type (RATING, SINGLE, MULTIPLE,
// TEXT).
// ═════════════════════════════════════════════════════════════════════════

// Liste des questionnaires disponibles, avec nombre de questions et de
// réponses reçues - pour le sélecteur du dashboard.
export const listQuizzes = async () => {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true, title: true, scope: true, active: true, createdAt: true,
      event: { select: { name: true } },
      questions: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(quizzes.map(async (q) => {
    const totalResponses = q.questions.length > 0
      ? await prisma.answers.count({ where: { questionId: { in: q.questions.map((x) => x.id) } } })
      : 0;
    return {
      id: q.id,
      title: q.title,
      scope: q.scope,
      active: q.active,
      eventTitle: q.event?.name ?? null,
      questionCount: q.questions.length,
      totalResponses,
    };
  }));
};

const round1 = (n) => Math.round(n * 10) / 10;

// Statistiques descriptives conventionnelles pour une question à réponse
// numérique (RATING) : moyenne, médiane, mode, écart-type, min/max, distribution.
function computeRatingStats(answers) {
  const values = answers.map((a) => parseInt(a.response, 10)).filter((n) => Number.isFinite(n));
  const count = values.length;
  if (count === 0) return { count: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / count;
  const median = count % 2 === 0
    ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    : sorted[(count - 1) / 2];

  const freq = {};
  values.forEach((v) => { freq[v] = (freq[v] ?? 0) + 1; });
  const mode = Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]);

  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / count;
  const stdDev = Math.sqrt(variance);

  return {
    count,
    mean: round1(mean),
    median,
    mode,
    stdDev: round1(stdDev),
    min: sorted[0],
    max: sorted[count - 1],
    distribution: [1, 2, 3, 4, 5].map((value) => ({ value, count: freq[value] ?? 0 })),
  };
}

// Tri à plat pour une question à choix (SINGLE : une valeur ; MULTIPLE :
// tableau JSON de libellés) - effectif et pourcentage par modalité.
function computeChoiceStats(question, answers) {
  const counts = {};
  question.choices.forEach((c) => { counts[c.wording] = 0; });

  answers.forEach((a) => {
    let selected;
    if (question.questionType.kind === "MULTIPLE") {
      try {
        const parsed = JSON.parse(a.response);
        selected = Array.isArray(parsed) ? parsed : [a.response];
      } catch {
        selected = [a.response];
      }
    } else {
      selected = [a.response];
    }
    selected.forEach((wording) => { counts[wording] = (counts[wording] ?? 0) + 1; });
  });

  const distribution = Object.entries(counts)
    .map(([wording, count]) => ({
      wording,
      count,
      percentage: answers.length > 0 ? Math.round((count / answers.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return { count: answers.length, distribution };
}

const TEXT_STOPWORDS = new Set([
  "le", "la", "les", "de", "des", "du", "un", "une", "et", "est", "à", "a",
  "en", "que", "qui", "pour", "dans", "sur", "avec", "ce", "cette", "au",
  "aux", "se", "sa", "son", "ses", "je", "tu", "il", "elle", "nous", "vous",
  "ils", "elles", "pas", "plus", "très", "bien", "été", "être", "avoir",
  "mais", "on", "ne", "y", "ou", "donc", "or", "ni", "car",
]);

// Fréquence des mots les plus utilisés + liste des réponses brutes (bornée)
// pour une question à réponse libre (TEXT).
function computeTextStats(answers) {
  const responses = answers
    .filter((a) => a.response && a.response.trim() !== "")
    .map((a) => ({ response: a.response, createdAt: a.createdAt }));

  const wordFreq = {};
  responses.forEach((r) => {
    r.response.toLowerCase().split(/[^a-zà-öø-ÿ']+/i).filter(Boolean).forEach((w) => {
      if (w.length < 3 || TEXT_STOPWORDS.has(w)) return;
      wordFreq[w] = (wordFreq[w] ?? 0) + 1;
    });
  });

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  return { count: responses.length, topWords, responses: responses.slice(0, 300) };
}

// Statistiques d'un questionnaire, question par question, avec les mêmes
// filtres (période, démographie) que le reste du dashboard INStaD.
export const getQuizStatistics = async (quizId, { from, to, gender, ageRange, nationality } = {}) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      event: { select: { name: true } },
      questions: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { questionType: true, choices: true },
      },
    },
  });
  if (!quiz) throw { status: 404, message: "Questionnaire non trouvé" };

  const createdAt = {};
  if (from) createdAt.gte = new Date(from);
  if (to)   createdAt.lte = new Date(to);

  const demographicUuids = await resolveDemographicUuids({ gender, ageRange, nationality });

  const questions = await Promise.all(quiz.questions.map(async (q) => {
    const answers = demographicUuids !== null && demographicUuids.length === 0
      ? []
      : await prisma.answers.findMany({
          where: {
            questionId: q.id,
            ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
            ...(demographicUuids !== null ? { uuid: { in: demographicUuids } } : {}),
          },
          select: { response: true, uuid: true, createdAt: true },
        });

    const kind = q.questionType.kind;
    const stats =
      kind === "RATING" ? computeRatingStats(answers) :
      kind === "TEXT"   ? computeTextStats(answers) :
      computeChoiceStats(q, answers); // SINGLE ou MULTIPLE

    return {
      id: q.id,
      wording: q.wording,
      kind,
      typeLabel: q.questionType.types,
      totalResponses: answers.length,
      stats,
    };
  }));

  return {
    id: quiz.id,
    title: quiz.title,
    scope: quiz.scope,
    eventTitle: quiz.event?.name ?? null,
    questions,
  };
};

// Export CSV des micro-données brutes d'un questionnaire (une ligne par
// réponse), enrichies des attributs démographiques anonymes du répondant
// (via son uuid) - pour un traitement dans un outil statistique externe
// (R, SPSS, Excel...). Aucune donnée personnelle identifiante n'est exposée :
// uuid est le même identifiant anonyme utilisé dans toute l'application.
export const exportQuizCsv = async (quizId, { from, to, gender, ageRange, nationality } = {}) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { questionType: true },
      },
    },
  });
  if (!quiz) throw { status: 404, message: "Questionnaire non trouvé" };

  const createdAt = {};
  if (from) createdAt.gte = new Date(from);
  if (to)   createdAt.lte = new Date(to);

  const demographicUuids = await resolveDemographicUuids({ gender, ageRange, nationality });
  const questionIds = quiz.questions.map((q) => q.id);

  const answers = questionIds.length === 0 || (demographicUuids !== null && demographicUuids.length === 0)
    ? []
    : await prisma.answers.findMany({
        where: {
          questionId: { in: questionIds },
          ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
          ...(demographicUuids !== null ? { uuid: { in: demographicUuids } } : {}),
        },
        select: { uuid: true, response: true, questionId: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

  // Attributs démographiques anonymes des répondants concernés (jointure par uuid)
  const respondentUuids = [...new Set(answers.map((a) => a.uuid).filter(Boolean))];
  const festivaliers = respondentUuids.length > 0
    ? await prisma.festivaliers.findMany({
        where: { uuid: { in: respondentUuids } },
        select: { uuid: true, gender: true, ageRange: true, nationality: true, edition: true },
      })
    : [];
  const festivalierByUuid = new Map(festivaliers.map((f) => [f.uuid, f]));
  const questionById = new Map(quiz.questions.map((q) => [q.id, q]));

  let csv = "";
  csv += csvRow([`Micro-données - ${quiz.title}`]);
  csv += csvRow(["Généré le", new Date().toLocaleString("fr-FR")]);
  csv += "\n";
  csv += csvRow(["uuid festivalier", "genre", "tranche_age", "nationalite", "edition", "question", "type", "reponse", "date"]);

  answers.forEach((a) => {
    const f = a.uuid ? festivalierByUuid.get(a.uuid) : null;
    const q = questionById.get(a.questionId);
    csv += csvRow([
      a.uuid ?? "",
      f?.gender ?? "",
      f?.ageRange ?? "",
      f?.nationality ?? "",
      f?.edition ?? "",
      q?.wording ?? "",
      q?.questionType?.kind ?? "",
      a.response,
      a.createdAt.toLocaleString("fr-FR"),
    ]);
  });

  return csv;
};