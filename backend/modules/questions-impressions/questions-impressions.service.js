import prisma from "../../prisma/prisma.client.js";

export const findAll = async (questionId, impressionId) => {
  const where = {};
  if (questionId) where.questionId = questionId;
  if (impressionId) where.impressionId = impressionId;
  return prisma.questions_impressions.findMany({
    where,
    include: { question: true, impression: true },
  });
};

export const create = async (data) => {
  return prisma.questions_impressions.create({
    data: {
      questionId: data.questionId,
      impressionId: data.impressionId,
    },
    include: { question: true, impression: true },
  });
};

export const remove = async (questionId, impressionId) => {
  const existing = await prisma.questions_impressions.findUnique({
    where: {
      questionId_impressionId: { questionId, impressionId },
    },
  });
  if (!existing) {
    throw { status: 404, message: "Lien question-impression non trouvé" };
  }
  return prisma.questions_impressions.delete({
    where: {
      questionId_impressionId: { questionId, impressionId },
    },
  });
};
