import prisma from "../../prisma/prisma.client.js";

export const findAll = async () => {
  return prisma.questionsTypes.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const questionType = await prisma.questionsTypes.findUnique({
    where: { id },
    include: { questions: true },
  });
  if (!questionType) {
    throw { status: 404, message: "Type de question non trouvé" };
  }
  return questionType;
};

export const create = async (data) => {
  return prisma.questionsTypes.create({
    data: { types: data.types },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.questionsTypes.update({
    where: { id },
    data: { ...(data.types !== undefined && { types: data.types }) },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.questionsTypes.delete({ where: { id } });
};
