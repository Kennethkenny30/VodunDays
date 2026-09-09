import prisma from "../../prisma/prisma.client.js";
import { translateFields } from "../../utils/translate.js";
import { sendToAll } from "../push/push.service.js";

export const findAll = async ({ target, status, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (target && target !== "ALL") where.target = target;
  if (status) where.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, total] = await Promise.all([
    prisma.notifications.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.notifications.count({ where }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const findById = async (id) => {
  const notification = await prisma.notifications.findUnique({ where: { id } });
  if (!notification) throw { status: 404, message: "Notification introuvable" };
  return notification;
};

export const create = async ({ title, message, target = "ALL", targetId, scheduledAt, titleEn, messageEn }) => {
  const toTranslate = [];
  if (titleEn   === undefined && title)   toTranslate.push({ field: "title",   text: title });
  if (messageEn === undefined && message) toTranslate.push({ field: "message", text: message });
  const translated = await translateFields(toTranslate);

  const notification = await prisma.notifications.create({
    data: {
      title,
      message,
      target,
      targetId:    targetId    || null,
      status:      scheduledAt ? "PENDING" : "SENT",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      sentAt:      scheduledAt ? null : new Date(),
      titleEn:     titleEn   ?? translated.titleEn   ?? null,
      messageEn:   messageEn ?? translated.messageEn ?? null,
    },
  });

  // Envoi push immediat uniquement. Une notification planifiee (scheduledAt)
  // reste en PENDING : il n'y a pas de worker/cron dans ce projet pour la
  // declencher automatiquement a l'heure prevue - a ajouter separement si besoin.
  // Le ciblage (target/targetId) n'est pas encore applique au push, qui part
  // en broadcast vers tous les abonnements actifs.
  if (notification.status === "SENT") {
    try {
      await sendToAll({ title: notification.title, message: notification.message });
    } catch (error) {
      console.error("[notifications] echec envoi push:", error.message);
    }
  }

  return notification;
};

export const update = async (id, { status, sentAt } = {}) => {
  await findById(id);
  return prisma.notifications.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(sentAt && { sentAt: new Date(sentAt) }),
    },
  });
};

export const remove = async (id) => {
  await findById(id);
  return prisma.notifications.delete({ where: { id } });
};

export const getStats = async () => {
  const [total, sent, pending, failed] = await Promise.all([
    prisma.notifications.count(),
    prisma.notifications.count({ where: { status: "SENT" } }),
    prisma.notifications.count({ where: { status: "PENDING" } }),
    prisma.notifications.count({ where: { status: "FAILED" } }),
  ]);
  return { total, sent, pending, failed };
};
