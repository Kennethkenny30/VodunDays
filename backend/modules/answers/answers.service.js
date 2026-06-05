import prisma from "../../prisma/prisma.client.js";

export const findAll = async (questionId) => {
  const where = questionId ? { questionId } : {};
  return prisma.answers.findMany({
    where,
    include: { question: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const answer = await prisma.answers.findUnique({
    where: { id },
    include: { question: true },
  });
  if (!answer) {
    throw { status: 404, message: "Réponse non trouvée" };
  }
  return answer;
};

export const create = async (data) => {
  return prisma.answers.create({
    data: {
      response: data.response,
      questionId: data.questionId,
      ...(data.uuid && { uuid: data.uuid }),
    },
    include: { question: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.answers.update({
    where: { id },
    data: {
      ...(data.response !== undefined && { response: data.response }),
      ...(data.questionId !== undefined && { questionId: data.questionId }),
    },
    include: { question: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.answers.delete({ where: { id } });
};
