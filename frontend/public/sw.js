// Service worker Vodun Days. Ne fait volontairement aucune interception
// de fetch/cache : la version precedente d'un SW avec strategie de cache
// avait servi des versions figees et avait du etre desactivee de force
// (voir historique). Ce SW se limite aux notifications push.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Vodun Days", body: event.data.text() };
  }

  const { title, body } = payload;

  event.waitUntil(
    self.registration.showNotification(title || "Vodun Days", {
      body: body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: payload.url || "/programme",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data || "/programme";

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: "window" });
      const existing = clientsList.find((c) => c.url.includes(targetUrl));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })()
  );
});
