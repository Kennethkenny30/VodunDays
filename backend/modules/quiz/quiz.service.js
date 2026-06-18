import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

export const findAll = async (eventId, activeOnly, scope) => {
  const where = {};
  if (activeOnly === "true") where.active = true;
  if (scope)   where.scope = scope;
  if (eventId) where.eventId = eventId;
  return prisma.quiz.findMany({
    where,
    include: { event: true, questions: true },
    orderBy: { createdAt: "desc" },
  });
};

// Consommation publique : retourne le quiz EVENT de l'événement + les quiz globaux actifs.
// Utilisé par les festivaliers, sans casser le filtre strict de l'admin.
export const findPublic = async (eventId) => {
  const orConditions = [
    { scope: "FESTIVAL",   active: true },
    { scope: "ALL_EVENTS", active: true },
  ];

  if (eventId) {
    orConditions.push({ scope: "EVENT", eventId, active: true });
  }

  return prisma.quiz.findMany({
    where: { OR: orConditions },
    include: { event: true, questions: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { event: true, questions: true },
  });
  if (!quiz) {
    throw { status: 404, message: "Quiz non trouvé" };
  }
  return quiz;
};

export const create = async (data) => {
  const scope = data.scope ?? "FESTIVAL";

  const toTranslate = [];
  if (data.titleEn       === undefined && data.title)       toTranslate.push({ field: "title",       text: data.title });
  if (data.descriptionEn === undefined && data.description) toTranslate.push({ field: "description", text: data.description });
  const translated = await translateFields(toTranslate);

  return prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description,
      active: data.active ?? false,
      scope,
      eventId: scope === "EVENT" ? (data.eventId ?? null) : null,
      titleEn:       data.titleEn       ?? translated.titleEn       ?? null,
      descriptionEn: data.descriptionEn ?? translated.descriptionEn ?? null,
    },
    include: { event: true },
  });
};

export const update = async (id, data) => {
  const existing = await findById(id);

  const newScope = data.scope;

  // 400 uniquement si on passe EN EVENT sans eventId fourni ET sans eventId déjà en base
  if (newScope === "EVENT" && data.eventId === undefined && !existing.eventId) {
    throw { status: 400, message: "eventId requis pour le scope EVENT" };
  }

  // Si on change de scope vers autre chose que EVENT, effacer l'eventId
  let eventIdUpdate;
  if (newScope !== undefined && newScope !== "EVENT") {
    eventIdUpdate = null;
  } else if (data.eventId !== undefined) {
    eventIdUpdate = data.eventId || null;
  }

  const toTranslate = [];
  if (data.title       !== undefined && data.titleEn       === undefined) toTranslate.push({ field: "title",       text: data.title });
  if (data.description !== undefined && data.descriptionEn === undefined) toTranslate.push({ field: "description", text: data.description });
  const translated = await translateFields(toTranslate);

  return prisma.quiz.update({
    where: { id },
    data: {
      ...(data.title         !== undefined && { title: data.title }),
      ...(data.description   !== undefined && { description: data.description }),
      ...(data.active        !== undefined && { active: data.active }),
      ...(newScope           !== undefined && { scope: newScope }),
      ...(eventIdUpdate      !== undefined && { eventId: eventIdUpdate }),
      ...(translated.titleEn       !== undefined && { titleEn: translated.titleEn }),
      ...(translated.descriptionEn !== undefined && { descriptionEn: translated.descriptionEn }),
      ...(data.titleEn       !== undefined && { titleEn: data.titleEn }),
      ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
    },
    include: { event: true },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.quiz.delete({ where: { id } });
};
