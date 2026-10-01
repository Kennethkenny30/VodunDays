import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

export const findAll = async (siteId) => {
  const where = siteId ? { siteId } : {};
  return prisma.amenities.findMany({
    where,
    include: { site: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const amenity = await prisma.amenities.findUnique({
    where: { id },
    include: { site: true },
  });
  if (!amenity) {
    throw { status: 404, message: "Équipement non trouvé" };
  }
  return amenity;
};

export const create = async (data) => {
  const translated = data.name ? await translateFields([{ field: "name", text: data.name }]) : {};
  return prisma.amenities.create({
    data: {
      name:   data.name,
      siteId: data.siteId,
      nameEn: translated.nameEn ?? null,
    },
    include: { site: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  const translated = data.name !== undefined
    ? await translateFields([{ field: "name", text: data.name }])
    : {};
  return prisma.amenities.update({
    where: { id },
    data: {
      ...(data.name        !== undefined && { name: data.name }),
      ...(data.siteId      !== undefined && { siteId: data.siteId }),
      ...(translated.nameEn !== undefined && { nameEn: translated.nameEn }),
    },
    include: { site: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.amenities.delete({ where: { id } });
};
