import prisma from "../../prisma/prisma.client.js";

const VALID_CATEGORIES = ["SITE", "TOILETTES", "URGENCES", "TRANSPORT", "ASSISTANCE", "PRA"];

export const findAll = async ({ category } = {}) => {
  return prisma.sites.findMany({
    where: category && VALID_CATEGORIES.includes(category)
      ? { category }
      : undefined,
    include: { amenities: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const site = await prisma.sites.findUnique({
    where: { id },
    include: { amenities: true, events: true },
  });
  if (!site) {
    throw { status: 404, message: "Site non trouvé" };
  }
  return site;
};

export const create = async (data) => {
  return prisma.sites.create({
    data: {
      name:        data.name,
      description: data.description,
      latitude:    data.latitude,
      longitude:   data.longitude,
      type:        data.type,
      category:    data.category ?? "SITE",
      capacity:    data.capacity ?? 0,
      // Champs PRA — ignorés si category !== PRA mais stockés si fournis
      arLabel:     data.arLabel   ?? null,
      arContent:   data.arContent ?? null,
      arRadius:    data.arRadius  ?? null,
    },
  });
};

export const update = async (id, data) => {
  await findById(id);

  const patch = {};
  if (data.name        !== undefined) patch.name        = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.latitude    !== undefined) patch.latitude    = data.latitude;
  if (data.longitude   !== undefined) patch.longitude   = data.longitude;
  if (data.type        !== undefined) patch.type        = data.type;
  if (data.category    !== undefined) patch.category    = data.category;
  if (data.capacity    !== undefined) patch.capacity    = data.capacity;
  if (data.arLabel     !== undefined) patch.arLabel     = data.arLabel;
  if (data.arContent   !== undefined) patch.arContent   = data.arContent;
  if (data.arRadius    !== undefined) patch.arRadius    = data.arRadius;

  return prisma.sites.update({ where: { id }, data: patch });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.sites.delete({ where: { id } });
};