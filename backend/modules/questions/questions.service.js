import prisma from "../../prisma/prisma.client.js";

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
    orderBy: { createdAt: "desc" },
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
  return prisma.questions.create({
    data: {
      wording: data.wording,
      questionTypeId: data.questionTypeId,
      quizId: data.quizId,
    },
    include: { questionType: true, quiz: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.questions.update({
    where: { id },
    data: {
      ...(data.wording !== undefined && { wording: data.wording }),
      ...(data.questionTypeId !== undefined && { questionTypeId: data.questionTypeId }),
      ...(data.quizId !== undefined && { quizId: data.quizId }),
    },
    include: { questionType: true, quiz: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.questions.delete({ where: { id } });
};
