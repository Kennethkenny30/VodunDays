import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";

const includeRelations = { event: true, programs: true };

export const findAll = async (eventId) => {
  const where = eventId ? { eventId } : {};
  return prisma.artists.findMany({
    where,
    include: includeRelations,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

export const findById = async (id) => {
  const artist = await prisma.artists.findUnique({
    where: { id },
    include: includeRelations,
  });
  if (!artist) {
    throw { status: 404, message: "Artiste non trouvé" };
  }
  return artist;
};

export const create = async (data) => {
  const translated = await translateFields(
    data.bioEn === undefined && data.bio ? [{ field: "bio", text: data.bio }] : []
  );

  return prisma.artists.create({
    data: {
      name:         data.name,
      eventId:      data.eventId,
      bio:          data.bio          ?? null,
      bioEn:        data.bioEn        ?? translated.bioEn ?? null,
      imageUrl:     data.imageUrl     ?? null,
      genre:        data.genre        ?? null,
      instagramUrl: data.instagramUrl ?? null,
      spotifyUrl:   data.spotifyUrl   ?? null,
      websiteUrl:   data.websiteUrl   ?? null,
      order:        data.order        ?? null,
    },
    include: includeRelations,
  });
};

export const update = async (id, data) => {
  await findById(id);

  const translated = await translateFields(
    data.bio !== undefined && data.bioEn === undefined ? [{ field: "bio", text: data.bio }] : []
  );

  const patch = {};
  if (data.name         !== undefined) patch.name         = data.name;
  if (data.eventId      !== undefined) patch.eventId      = data.eventId;
  if (data.bio          !== undefined) patch.bio          = data.bio;
  if (data.imageUrl     !== undefined) patch.imageUrl     = data.imageUrl;
  if (data.genre        !== undefined) patch.genre        = data.genre;
  if (data.instagramUrl !== undefined) patch.instagramUrl = data.instagramUrl;
  if (data.spotifyUrl   !== undefined) patch.spotifyUrl   = data.spotifyUrl;
  if (data.websiteUrl   !== undefined) patch.websiteUrl   = data.websiteUrl;
  if (data.order        !== undefined) patch.order        = data.order;
  if (translated.bioEn  !== undefined) patch.bioEn         = translated.bioEn;
  if (data.bioEn        !== undefined) patch.bioEn        = data.bioEn;

  return prisma.artists.update({
    where: { id },
    data: patch,
    include: includeRelations,
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.artists.delete({ where: { id } });
};
