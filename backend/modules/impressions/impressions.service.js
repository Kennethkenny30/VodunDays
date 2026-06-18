import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

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
  const translated = data.name ? await translateFields([{ field: "name", text: data.name }]) : {};
  return prisma.impressions.create({
    data: {
      name:   data.name,
      emoji:  data.emoji,
      nameEn: translated.nameEn ?? null,
    },
  });
};

export const update = async (id, data) => {
  await findById(id);
  const translated = data.name !== undefined
    ? await translateFields([{ field: "name", text: data.name }])
    : {};
  return prisma.impressions.update({
    where: { id },
    data: {
      ...(data.name        !== undefined && { name: data.name }),
      ...(data.emoji       !== undefined && { emoji: data.emoji }),
      ...(translated.nameEn !== undefined && { nameEn: translated.nameEn }),
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.impressions.delete({ where: { id } });
};
