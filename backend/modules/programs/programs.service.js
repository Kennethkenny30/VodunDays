import prisma from "../../prisma/prisma.client.js";

export const findAll = async (eventId) => {
  const where = eventId ? { eventId } : {};
  return prisma.programs.findMany({
    where,
    include: { event: true },
    orderBy: { startTime: "asc" },
  });
};

export const findById = async (id) => {
  const program = await prisma.programs.findUnique({
    where: { id },
    include: { event: true },
  });
  if (!program) {
    throw { status: 404, message: "Programme non trouvé" };
  }
  return program;
};

export const create = async (data) => {
  return prisma.programs.create({
    data: {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      eventId: data.eventId,
    },
    include: { event: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.programs.update({
    where: { id },
    data: {
      ...(data.startTime !== undefined && { startTime: new Date(data.startTime) }),
      ...(data.endTime !== undefined && { endTime: new Date(data.endTime) }),
      ...(data.eventId !== undefined && { eventId: data.eventId }),
    },
    include: { event: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.programs.delete({ where: { id } });
};
