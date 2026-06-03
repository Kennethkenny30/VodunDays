import prisma from "../../prisma/prisma.client.js";

const SERVER_START = Date.now();

// ─── Stats globales de la plateforme ──────────────────────────────────────────

export const getStats = async () => {
  const since24h  = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d   = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);
  const since30d  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    totalSites,
    totalEvents,
    publishedEvents,
    totalQuiz,
    activeQuiz,
    totalAnswers,
    answersLast24h,
    answersLast7d,
    openAlerts,
    totalAlerts,
    alertsLast24h,
    recentLogins,
    auditLast24h,
  ] = await Promise.all([
    prisma.users.count(),
    prisma.users.count({ where: { active: true } }),
    prisma.sites.count(),
    prisma.events.count(),
    prisma.events.count({ where: { status: "PUBLISHED" } }),
    prisma.quiz.count(),
    prisma.quiz.count({ where: { active: true } }),
    prisma.answers.count(),
    prisma.answers.count({ where: { createdAt: { gte: since24h } } }),
    prisma.answers.count({ where: { createdAt: { gte: since7d  } } }),
    prisma.alerts.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.alerts.count(),
    prisma.alerts.count({ where: { createdAt: { gte: since24h } } }),
    prisma.users.count({ where: { lastLoging: { gte: since24h } } }),
    prisma.auditLogs.count({ where: { createdAt: { gte: since24h } } }),
  ]);

  // Uptime serveur
  const uptimeMs = Date.now() - SERVER_START;
  const uptimeDays  = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const uptimeMins  = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    uptime: { days: uptimeDays, hours: uptimeHours, minutes: uptimeMins, ms: uptimeMs },
    users:  { total: totalUsers, active: activeUsers, recentLogins },
    content: {
      sites:           totalSites,
      events:          totalEvents,
      publishedEvents,
      quiz:            totalQuiz,
      activeQuiz,
    },
    engagement: {
      totalAnswers,
      answersLast24h,
      answersLast7d,
    },
    security: {
      openAlerts,
      totalAlerts,
      alertsLast24h,
      auditLast24h,
    },
  };
};

// ─── Activité récente (flux temps réel simulé) ────────────────────────────────

export const getActivity = async ({ limit = 20 } = {}) => {
  const logs = await prisma.auditLogs.findMany({
    orderBy: { createdAt: "desc" },
    take: Number(limit),
    select: {
      id:          true,
      action:      true,
      module:      true,
      description: true,
      userName:    true,
      ipAddress:   true,
      createdAt:   true,
    },
  });
  return logs;
};

// ─── Santé des services (health-check interne) ───────────────────────────────

export const getHealth = async () => {
  const checks = { database: "ok", api: "ok" };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    checks.database = "error";
  }

  return {
    status: Object.values(checks).every((v) => v === "ok") ? "healthy" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - SERVER_START) / 1000),
  };
};
