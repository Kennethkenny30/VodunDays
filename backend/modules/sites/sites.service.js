import prisma from "../../prisma/prisma.client.js";

export const findAll = async () => {
  return prisma.sites.findMany({
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
      name: data.name,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
      capacity: data.capacity,
    },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.sites.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.sites.delete({ where: { id } });
};
