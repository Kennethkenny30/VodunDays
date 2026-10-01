import prisma from "../../prisma/prisma.client.js";

// Fenêtre glissante : un festivalier est considéré "en ligne" s'il a envoyé
// un ping dans les N dernières minutes.
const ONLINE_WINDOW_MINUTES = 5;

const EARTH_RADIUS_M = 6371000;
const toRad = (deg) => (deg * Math.PI) / 180;

// Distance haversine en mètres entre deux points GPS
const distanceMeters = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
};

// Détermine le site correspondant à un point GPS :
//   1. zoneGeo (polygone dessiné) - précis, prioritaire
//   2. arRadius (cercle) - repli pour les sites sans zone dessinée
// Retourne null si le point ne tombe dans le périmètre d'aucun site.
const findSiteForPoint = async (latitude, longitude) => {
  const polygonMatch = await prisma.$queryRaw`
    SELECT id
    FROM "Sites"
    WHERE "zoneGeo" IS NOT NULL
      AND ST_Contains("zoneGeo", ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
    LIMIT 1
  `;
  if (polygonMatch.length > 0) return polygonMatch[0].id;

  const fallbackCandidates = await prisma.sites.findMany({
    where: { arRadius: { not: null } },
    select: { id: true, latitude: true, longitude: true, arRadius: true },
  });

  let nearestId       = null;
  let nearestDistance = Infinity;
  for (const site of fallbackCandidates) {
    const distance = distanceMeters(latitude, longitude, site.latitude, site.longitude);
    if (distance <= site.arRadius && distance < nearestDistance) {
      nearestId       = site.id;
      nearestDistance = distance;
    }
  }
  return nearestId;
};

// Enregistre un ping de présence et renvoie le site détecté (le cas échéant)
export const record = async (uuid, { latitude, longitude }) => {
  const siteId = await findSiteForPoint(latitude, longitude);

  await prisma.presenceLog.create({
    data: { uuid, siteId, latitude, longitude },
  });

  return { siteId };
};

// Festivaliers en ligne maintenant + répartition par site (dernier ping
// connu de chaque uuid dans la fenêtre glissante)
export const getOnlineNow = async () => {
  const since = new Date(Date.now() - ONLINE_WINDOW_MINUTES * 60_000);

  const recentLogs = await prisma.presenceLog.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    select: { uuid: true, siteId: true },
  });

  // Les logs sont triés du plus récent au plus ancien : la première
  // occurrence par uuid est donc son dernier ping connu.
  const latestByUuid = new Map();
  for (const log of recentLogs) {
    if (!latestByUuid.has(log.uuid)) latestByUuid.set(log.uuid, log.siteId);
  }

  const bySite = {};
  let unassigned = 0;
  for (const siteId of latestByUuid.values()) {
    if (siteId) bySite[siteId] = (bySite[siteId] || 0) + 1;
    else unassigned += 1;
  }

  return {
    windowMinutes: ONLINE_WINDOW_MINUTES,
    total: latestByUuid.size,
    unassigned,
    bySite,
  };
};
