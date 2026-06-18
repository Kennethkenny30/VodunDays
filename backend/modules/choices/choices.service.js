import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

export const findAll = async (questionId) => {
  const where = questionId ? { questionId } : {};
  return prisma.choices.findMany({
    where,
    include: { question: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const choice = await prisma.choices.findUnique({
    where: { id },
    include: { question: true },
  });
  if (!choice) {
    throw { status: 404, message: "Choix non trouvé" };
  }
  return choice;
};

export const create = async (data) => {
  const translated = data.wordingEn === undefined && data.wording
    ? await translateFields([{ field: "wording", text: data.wording }])
    : {};

  return prisma.choices.create({
    data: {
      wording:    data.wording,
      questionId: data.questionId,
      wordingEn:  data.wordingEn ?? translated.wordingEn ?? null,
    },
    include: { question: true },
  });
};

export const update = async (id, data) => {
  await findById(id);

  const translated = data.wording !== undefined && data.wordingEn === undefined
    ? await translateFields([{ field: "wording", text: data.wording }])
    : {};

  return prisma.choices.update({
    where: { id },
    data: {
      ...(data.wording    !== undefined && { wording: data.wording }),
      ...(data.questionId !== undefined && { questionId: data.questionId }),
      ...(translated.wordingEn !== undefined && { wordingEn: translated.wordingEn }),
      ...(data.wordingEn  !== undefined && { wordingEn: data.wordingEn }),
    },
    include: { question: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.choices.delete({ where: { id } });
};
