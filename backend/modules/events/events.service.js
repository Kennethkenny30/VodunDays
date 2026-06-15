import prisma from "../../prisma/prisma.client.js";

export const findAll = async (filters = {}) => {
  const where = {};
  if (filters.siteId) where.siteId = filters.siteId;
  if (filters.eventTypeId) where.eventTypeId = filters.eventTypeId;
  if (filters.status) where.status = filters.status;
  return prisma.events.findMany({
    where,
    include: {
      site: true,
      eventType: true,
      programs: true,
      artists: true,
      quizzes: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const event = await prisma.events.findUnique({
    where: { id },
    include: {
      site: true,
      eventType: true,
      programs: true,
      artists: true,
      quizzes: true,
    },
  });
  if (!event) {
    throw { status: 404, message: "Événement non trouvé" };
  }
  return event;
};

export const create = async (data) => {
  return prisma.events.create({
    data: {
      name:          data.name,
      description:   data.description,
      status:        data.status,
      siteId:        data.siteId,
      eventTypeId:   data.eventTypeId,
      createdBy:     data.createdBy,
      imageUrl:      data.imageUrl      ?? null,
      nameEn:        data.nameEn        ?? null,
      descriptionEn: data.descriptionEn ?? null,
    },
    include: { site: true, eventType: true },
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.events.update({
    where: { id },
    data: {
      ...(data.name          !== undefined && { name: data.name }),
      ...(data.description   !== undefined && { description: data.description }),
      ...(data.status        !== undefined && { status: data.status }),
      ...(data.siteId        !== undefined && { siteId: data.siteId }),
      ...(data.eventTypeId   !== undefined && { eventTypeId: data.eventTypeId }),
      ...(data.imageUrl      !== undefined && { imageUrl: data.imageUrl }),
      ...(data.nameEn        !== undefined && { nameEn: data.nameEn }),
      ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
    },
    include: { site: true, eventType: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.events.delete({ where: { id } });
};
