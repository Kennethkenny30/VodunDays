import prisma from "../../prisma/prisma.client.js";

export const findAll = async () => {
  return prisma.impressions.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const impression = await prisma.impressions.findUnique({
    where: { id },
    include: { questions: true },
  });
  if (!impression) {
    throw { status: 404, message: "Impression non trouvée" };
  }
  return impression;
};

export const create = async (data) => {
  return prisma.impressions.create({
    data: {
      name: data.name,
      emoji: data.emoji,
    },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.impressions.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.emoji !== undefined && { emoji: data.emoji }),
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.impressions.delete({ where: { id } });
};
