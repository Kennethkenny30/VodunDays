import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

export const findAll = async (quizId) => {
  const where = quizId ? { quizId } : {};
  return prisma.questions.findMany({
    where,
    include: {
      questionType: true,
      quiz: true,
      impressions: { include: { impression: true } },
      choices: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
};

export const findById = async (id) => {
  const question = await prisma.questions.findUnique({
    where: { id },
    include: {
      questionType: true,
      quiz: true,
      impressions: { include: { impression: true } },
      choices: true,
      answers: true,
    },
  });
  if (!question) {
    throw { status: 404, message: "Question non trouvée" };
  }
  return question;
};

export const create = async (data) => {
  // Calcule l'ordre suivant pour ce quiz
  const aggregate = await prisma.questions.aggregate({
    where: { quizId: data.quizId },
    _max: { order: true },
  });
  const nextOrder = (aggregate._max.order ?? -1) + 1;

  const translated = data.wordingEn === undefined && data.wording
    ? await translateFields([{ field: "wording", text: data.wording }])
    : {};

  return prisma.questions.create({
    data: {
      wording:        data.wording,
      questionTypeId: data.questionTypeId,
      quizId:         data.quizId,
      order:          nextOrder,
      wordingEn:      data.wordingEn ?? translated.wordingEn ?? null,
    },
    include: { questionType: true, quiz: true },
  });
};

export const update = async (id, data) => {
  const existing = await findById(id);

  // Si le type change vers un kind sans choix, supprime les choices orphelins
  if (
    data.questionTypeId !== undefined &&
    data.questionTypeId !== existing.questionTypeId
  ) {
    const newType = await prisma.questionsTypes.findUnique({
      where: { id: data.questionTypeId },
    });
    if (newType && newType.kind !== "SINGLE" && newType.kind !== "MULTIPLE") {
      await prisma.choices.deleteMany({ where: { questionId: id } });
    }
  }

  const translated = data.wording !== undefined && data.wordingEn === undefined
    ? await translateFields([{ field: "wording", text: data.wording }])
    : {};

  return prisma.questions.update({
    where: { id },
    data: {
      ...(data.wording        !== undefined && { wording: data.wording }),
      ...(data.questionTypeId !== undefined && { questionTypeId: data.questionTypeId }),
      ...(data.quizId         !== undefined && { quizId: data.quizId }),
      ...(translated.wordingEn !== undefined && { wordingEn: translated.wordingEn }),
      ...(data.wordingEn      !== undefined && { wordingEn: data.wordingEn }),
    },
    include: { questionType: true, quiz: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.questions.delete({ where: { id } });
};

// Met à jour l'ordre de toutes les questions d'après la liste d'ids fournie (indice = nouvel ordre)
export const reorder = async (orderedIds) => {
  await prisma.$transaction(
    orderedIds.map((questionId, index) =>
      prisma.questions.update({
        where: { id: questionId },
        data: { order: index },
      })
    )
  );
};
