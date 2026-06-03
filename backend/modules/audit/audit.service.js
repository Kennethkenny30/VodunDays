import prisma from "../../prisma/prisma.client.js";

// ─── Lecture ──────────────────────────────────────────────────────────────────

export const findAll = async ({
  action,
  module,
  userId,
  search,
  startDate,
  endDate,
  page = 1,
  limit = 50,
} = {}) => {
  const where = {};

  if (action) where.action = action;
  if (module) where.module = module;
  if (userId) where.userId = userId;

  if (search) {
    where.OR = [
      { description: { contains: search, mode: "insensitive" } },
      { userName:    { contains: search, mode: "insensitive" } },
    ];
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate)   where.createdAt.lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    prisma.auditLogs.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.auditLogs.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getStats = async () => {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [total, last24h, byAction, byModule] = await Promise.all([
    prisma.auditLogs.count(),
    prisma.auditLogs.count({ where: { createdAt: { gte: since24h } } }),
    prisma.auditLogs.groupBy({ by: ["action"], _count: { action: true } }),
    prisma.auditLogs.groupBy({ by: ["module"], _count: { module: true } }),
  ]);

  return {
    total,
    last24h,
    byAction: byAction.map((r) => ({ action: r.action, count: r._count.action })),
    byModule: byModule.map((r) => ({ module: r.module, count: r._count.module })),
  };
};

// ─── Écriture (appelée en interne par le middleware) ──────────────────────────

export const log = async ({
  action,
  module,
  description,
  metadata = null,
  userId = null,
  userName = null,
  ipAddress = null,
}) => {
  // Non bloquant — on n'attend pas et on ne throw pas
  prisma.auditLogs
    .create({
      data: { action, module, description, metadata, userId, userName, ipAddress },
    })
    .catch((err) => {
      console.error("[AUDIT] Impossible d'enregistrer le log :", err.message);
    });
};
