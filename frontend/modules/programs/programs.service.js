import prisma from "../../prisma/prisma.client.js";

const includeRelations = { event: true, artists: true };

export const findAll = async (eventId) => {
  const where = eventId ? { eventId } : {};
  return prisma.programs.findMany({
    where,
    include: includeRelations,
    orderBy: { startTime: "asc" },
  });
};

export const findById = async (id) => {
  const program = await prisma.programs.findUnique({
    where: { id },
    include: includeRelations,
  });
  if (!program) {
    throw { status: 404, message: "Programme non trouvé" };
  }
  return program;
};

// data.artistIds : ids des artistes programmés sur ce créneau (0, 1 ou
// plusieurs - b2b/collectif). Optionnel : un créneau peut n'avoir aucun
// artiste assigné (ex. entracte, changement de plateau).
export const create = async (data) => {
  return prisma.programs.create({
    data: {
      startTime: new Date(data.startTime),
      endTime:   new Date(data.endTime),
      eventId:   data.eventId,
      ...(data.artistIds !== undefined && {
        artists: { connect: data.artistIds.map((id) => ({ id })) },
      }),
    },
    include: includeRelations,
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.programs.update({
    where: { id },
    data: {
      ...(data.startTime !== undefined && { startTime: new Date(data.startTime) }),
      ...(data.endTime   !== undefined && { endTime: new Date(data.endTime) }),
      ...(data.eventId   !== undefined && { eventId: data.eventId }),
      // "set" remplace intégralement la liste (pas d'ajout incrémental) -
      // cohérent avec un multi-select "artistes de ce créneau" côté UI.
      ...(data.artistIds !== undefined && {
        artists: { set: data.artistIds.map((id) => ({ id })) },
      }),
    },
    include: includeRelations,
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.programs.delete({ where: { id } });
};
