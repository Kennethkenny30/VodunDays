import webpush from "web-push";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT || "mailto:contact@vodundays.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn("[webpush] VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY manquantes - les notifications push sont desactivees.");
}

export default webpush;
