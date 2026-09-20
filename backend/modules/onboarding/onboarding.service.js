import prisma from "../../prisma/prisma.client.js";

// Vérifie si un festivalier a déjà complété l'onboarding, a partir de son
// uuid client (localStorage vd_uuid). Renvoie null si aucun profil trouvé.
export const findByUuid = async (uuid) => {
  return prisma.festivaliers.findUnique({ where: { uuid } });
};

// Crée ou met a jour le profil festivalier associe a un uuid.
// Upsert car un meme uuid ne doit jamais avoir deux lignes, et le flow
// peut en theorie etre relance (ex: reset local storage cote debug).
export const upsert = async (uuid, data) => {
  const payload = {
    language:              data.language,
    notificationsEnabled:  data.notificationsEnabled,
    gender:                data.gender,
    ageRange:              data.ageRange,
    nationality:           data.nationality,
    edition:               data.edition,
    onboardingCompletedAt: new Date(),
  };

  return prisma.festivaliers.upsert({
    where:  { uuid },
    create: { uuid, ...payload },
    update: payload,
  });
};

// Stats agregees pour le dashboard admin (repartition par tranche d'age,
// nationalite, genre, edition). from/to (dates ISO) filtrent sur la date
// d'enregistrement du profil (createdAt) - utilise par le dashboard INStaD.
export const getStats = async ({ from, to } = {}) => {
  const createdAt = {};
  if (from) createdAt.gte = new Date(from);
  if (to)   createdAt.lte = new Date(to);
  const where = Object.keys(createdAt).length > 0 ? { createdAt } : {};

  const [total, byGender, byAgeRange, byEdition, byLanguage, topNationalities] = await Promise.all([
    prisma.festivaliers.count({ where }),
    prisma.festivaliers.groupBy({ by: ["gender"],      _count: true, where }),
    prisma.festivaliers.groupBy({ by: ["ageRange"],    _count: true, where }),
    prisma.festivaliers.groupBy({ by: ["edition"],     _count: true, where }),
    prisma.festivaliers.groupBy({ by: ["language"],    _count: true, where }),
    prisma.festivaliers.groupBy({
      by: ["nationality"],
      _count: true,
      where,
      orderBy: { _count: { nationality: "desc" } },
      take: 10,
    }),
  ]);

  return { total, byGender, byAgeRange, byEdition, byLanguage, topNationalities };
};
