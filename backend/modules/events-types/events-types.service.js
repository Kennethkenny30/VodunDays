import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

export const findAll = async () => {
  return prisma.eventsTypes.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const eventType = await prisma.eventsTypes.findUnique({
    where: { id },
    include: { events: true },
  });
  if (!eventType) {
    throw { status: 404, message: "Type d'événement non trouvé" };
  }
  return eventType;
};

export const create = async (data) => {
  const translated = data.name ? await translateFields([{ field: "name", text: data.name }]) : {};
  return prisma.eventsTypes.create({
    data: { name: data.name, nameEn: translated.nameEn ?? null },
  });
};

export const update = async (id, data) => {
  await findById(id);
  const translated = data.name !== undefined
    ? await translateFields([{ field: "name", text: data.name }])
    : {};
  return prisma.eventsTypes.update({
    where: { id },
    data: {
      ...(data.name        !== undefined && { name: data.name }),
      ...(translated.nameEn !== undefined && { nameEn: translated.nameEn }),
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.eventsTypes.delete({ where: { id } });
};
