import prisma from "../../prisma/prisma.client.js";
import webpush from "../../utils/webpush.js";

export const subscribe = async (uuid, subscription) => {
  const { endpoint, keys } = subscription;

  return prisma.pushSubscriptions.upsert({
    where: { endpoint },
    update: { uuid, p256dh: keys.p256dh, auth: keys.auth },
    create: { uuid, endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });
};

export const unsubscribe = async (endpoint) => {
  await prisma.pushSubscriptions.deleteMany({ where: { endpoint } });
};

// Envoie une notification push a tous les abonnements actifs. Retire
// automatiquement les abonnements qui ne sont plus valides (410/404 :
// l'utilisateur a desinstalle l'app ou revoque la permission).
export const sendToAll = async ({ title, message }) => {
  const subscriptions = await prisma.pushSubscriptions.findMany();

  const payload = JSON.stringify({ title, body: message });
  const expiredEndpoints = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        } else {
          console.error("[push] echec envoi vers", sub.endpoint, error.message);
        }
      }
    })
  );

  if (expiredEndpoints.length > 0) {
    await prisma.pushSubscriptions.deleteMany({
      where: { endpoint: { in: expiredEndpoints } },
    });
  }

  return { sent: subscriptions.length - expiredEndpoints.length, expired: expiredEndpoints.length };
};
