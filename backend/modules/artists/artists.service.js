import prisma from "../../prisma/prisma.client.js";

export const findAll = async (eventId) => {
  const where = eventId ? { eventId } : {};
  return prisma.artists.findMany({
    where,
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const artist = await prisma.artists.findUnique({
    where: { id },
    include: { event: true },
  });
  if (!artist) {
    throw { status: 404, message: "Artiste non trouvé" };
  }
  return artist;
};

export const create = async (data) => {
  return prisma.artists.create({
    data: {
      name: data.name,
      eventId: data.eventId,
    },
    include: { event: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.artists.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.eventId !== undefined && { eventId: data.eventId }),
    },
    include: { event: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.artists.delete({ where: { id } });
};
