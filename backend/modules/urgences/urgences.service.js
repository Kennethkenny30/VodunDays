import prisma from "../../prisma/prisma.client.js";

const VALID_TYPES   = ["MEDICAL", "SECURITY", "FIRE", "LOST", "TECHNICAL", "OTHER"];
const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

// ─── Lecture ──────────────────────────────────────────────────────────────────

export const findAll = async ({ status, type, siteId, page = 1, limit = 30 } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (type)   where.type   = type;
  if (siteId) where.siteId = siteId;

  const skip = (Number(page) - 1) * Number(limit);

  const [alerts, total] = await Promise.all([
    prisma.alerts.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: {
        site:     { select: { id: true, name: true } },
        timeline: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.alerts.count({ where }),
  ]);

  return {
    alerts,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const findById = async (id) => {
  const alert = await prisma.alerts.findUnique({
    where: { id },
    include: {
      site:     { select: { id: true, name: true } },
      timeline: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!alert) throw { status: 404, message: "Alerte introuvable" };
  return alert;
};

export const findByUuid = async (uuid) => {
  const alert = await prisma.alerts.findFirst({
    where: { uuid },
    orderBy: { createdAt: "desc" },
    include: {
      site:     { select: { id: true, name: true } },
      timeline: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!alert) throw { status: 404, message: "Alerte introuvable" };
  return alert;
};

export const getStats = async () => {
  const [total, open, inProgress, resolved, closed, byType] = await Promise.all([
    prisma.alerts.count(),
    prisma.alerts.count({ where: { status: "OPEN" } }),
    prisma.alerts.count({ where: { status: "IN_PROGRESS" } }),
    prisma.alerts.count({ where: { status: "RESOLVED" } }),
    prisma.alerts.count({ where: { status: "CLOSED" } }),
    prisma.alerts.groupBy({ by: ["type"], _count: { type: true } }),
  ]);

  return {
    total,
    byStatus: { open, inProgress, resolved, closed },
    byType: byType.map((r) => ({ type: r.type, count: r._count.type })),
  };
};

// ─── Création (festivalier anonyme) ──────────────────────────────────────────

export const create = async ({ uuid, displayName, type, description, siteId, latitude, longitude }) => {
  if (!VALID_TYPES.includes(type)) {
    throw { status: 400, message: `Type invalide. Valeurs acceptées : ${VALID_TYPES.join(", ")}` };
  }

  const alert = await prisma.alerts.create({
    data: {
      uuid,
      displayName,
      type,
      description,
      siteId:    siteId    || null,
      latitude:  latitude  || null,
      longitude: longitude || null,
      status:    "OPEN",
    },
    include: {
      site:     { select: { id: true, name: true } },
      timeline: true,
    },
  });

  // Entrée initiale dans la timeline
  await prisma.alertTimeline.create({
    data: {
      alertId:  alert.id,
      status:   "OPEN",
      note:     "Alerte créée par le festivalier",
      userId:   null,
      userName: displayName,
    },
  });

  return prisma.alerts.findUnique({
    where: { id: alert.id },
    include: { site: { select: { id: true, name: true } }, timeline: { orderBy: { createdAt: "asc" } } },
  });
};

// ─── Changement de statut (admin) ────────────────────────────────────────────

export const updateStatus = async (id, { status, note }, operator) => {
  if (!VALID_STATUSES.includes(status)) {
    throw { status: 400, message: `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(", ")}` };
  }

  await findById(id);

  await prisma.alerts.update({
    where: { id },
    data: { status },
  });

  // Entrée dans la timeline
  await prisma.alertTimeline.create({
    data: {
      alertId:  id,
      status,
      note:     note || null,
      userId:   operator?.id   || null,
      userName: operator ? `${operator.firstname ?? ""} ${operator.lastname ?? ""}`.trim() || operator.email : null,
    },
  });

  return findById(id);
};
