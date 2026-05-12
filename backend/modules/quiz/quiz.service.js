import prisma from "../../prisma/prisma.client.js";

export const findAll = async (eventId, activeOnly) => {
  const where = {};
  if (eventId) where.eventId = eventId;
  if (activeOnly === "true") where.active = true;
  return prisma.quiz.findMany({
    where,
    include: { event: true, questions: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { event: true, questions: true },
  });
  if (!quiz) {
    throw { status: 404, message: "Quiz non trouvé" };
  }
  return quiz;
};

export const create = async (data) => {
  return prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description,
      active: data.active ?? false,
      eventId: data.eventId,
    },
    include: { event: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.quiz.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.eventId !== undefined && { eventId: data.eventId }),
    },
    include: { event: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.quiz.delete({ where: { id } });
};
