import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

const VALID_CATEGORIES = ["SITE", "TOILETTES", "URGENCES", "TRANSPORT", "ASSISTANCE", "PRA"];

export const findAll = async ({ category } = {}) => {
  return prisma.sites.findMany({
    where: category && VALID_CATEGORIES.includes(category)
      ? { category }
      : undefined,
    include: {
      amenities: true,
      _count: { select: { events: true } },
    },
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
  const toTranslate = [
    { field: "name",        text: data.name,        skip: data.nameEn        !== undefined },
    { field: "description", text: data.description, skip: data.descriptionEn !== undefined },
    { field: "type",        text: data.type,        skip: data.typeEn        !== undefined },
    { field: "arLabel",     text: data.arLabel,     skip: data.arLabelEn     !== undefined },
    { field: "arContent",   text: data.arContent,   skip: data.arContentEn   !== undefined },
  ].filter(({ skip, text }) => !skip && text);
  const translated = await translateFields(toTranslate);

  return prisma.sites.create({
    data: {
      name:        data.name,
      description: data.description,
      latitude:    data.latitude,
      longitude:   data.longitude,
      type:        data.type,
      category:    data.category ?? "SITE",
      capacity:    data.capacity ?? 0,
      arLabel:     data.arLabel   ?? null,
      arContent:   data.arContent ?? null,
      arRadius:    data.arRadius  ?? null,
      nameEn:        data.nameEn        ?? translated.nameEn        ?? null,
      descriptionEn: data.descriptionEn ?? translated.descriptionEn ?? null,
      typeEn:        data.typeEn        ?? translated.typeEn        ?? null,
      arLabelEn:     data.arLabelEn     ?? translated.arLabelEn     ?? null,
      arContentEn:   data.arContentEn   ?? translated.arContentEn   ?? null,
    },
  });
};

export const update = async (id, data) => {
  await findById(id);

  const toTranslate = [
    { field: "name",        text: data.name,        skip: data.name        === undefined || data.nameEn        !== undefined },
    { field: "description", text: data.description, skip: data.description === undefined || data.descriptionEn !== undefined },
    { field: "type",        text: data.type,        skip: data.type        === undefined || data.typeEn        !== undefined },
    { field: "arLabel",     text: data.arLabel,     skip: data.arLabel     === undefined || data.arLabelEn     !== undefined },
    { field: "arContent",   text: data.arContent,   skip: data.arContent   === undefined || data.arContentEn   !== undefined },
  ].filter(({ skip }) => !skip);
  const translated = await translateFields(toTranslate);

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
  if (translated.nameEn        !== undefined) patch.nameEn        = translated.nameEn;
  if (translated.descriptionEn !== undefined) patch.descriptionEn = translated.descriptionEn;
  if (translated.typeEn        !== undefined) patch.typeEn        = translated.typeEn;
  if (translated.arLabelEn     !== undefined) patch.arLabelEn     = translated.arLabelEn;
  if (translated.arContentEn   !== undefined) patch.arContentEn   = translated.arContentEn;
  if (data.nameEn        !== undefined) patch.nameEn        = data.nameEn;
  if (data.descriptionEn !== undefined) patch.descriptionEn = data.descriptionEn;
  if (data.typeEn        !== undefined) patch.typeEn        = data.typeEn;
  if (data.arLabelEn     !== undefined) patch.arLabelEn     = data.arLabelEn;
  if (data.arContentEn   !== undefined) patch.arContentEn   = data.arContentEn;

  return prisma.sites.update({ where: { id }, data: patch });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.sites.delete({ where: { id } });
};