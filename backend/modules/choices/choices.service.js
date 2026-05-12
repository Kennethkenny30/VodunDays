import prisma from "../../prisma/prisma.client.js";

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
  return prisma.choices.create({
    data: {
      wording: data.wording,
      questionId: data.questionId,
    },
    include: { question: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.choices.update({
    where: { id },
    data: {
      ...(data.wording !== undefined && { wording: data.wording }),
      ...(data.questionId !== undefined && { questionId: data.questionId }),
    },
    include: { question: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.choices.delete({ where: { id } });
};
