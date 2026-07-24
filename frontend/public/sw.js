// Kill-switch : ce service worker se désenregistre lui-même et purge tous les caches.
// Objectif : supprimer définitivement l'ancien SW "network-first" qui servait des versions figées.
// Le navigateur re-télécharge sw.js à chaque navigation (hors de son propre cache),
// donc ce fichier atteint même un navigateur ou une PWA installée restés bloqués.
// Un vrai SW de production versionné pourra être réintroduit plus tard.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
