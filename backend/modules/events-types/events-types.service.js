import prisma from "../../prisma/prisma.client.js";

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
  return prisma.eventsTypes.create({
    data: { name: data.name },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.eventsTypes.update({
    where: { id },
    data: { ...(data.name !== undefined && { name: data.name }) },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.eventsTypes.delete({ where: { id } });
};
