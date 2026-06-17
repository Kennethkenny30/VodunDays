const CACHE = 'vodundays-v2';

const PRECACHE = [
  '/',
  '/offline',
  '/programme',
  '/carte',
  '/planner',
  '/pedagogie',
  '/culture',
  '/urgences',
  '/avis',
  '/parametres',
  '/connexion',
  '/transition/carte',
  '/transition/connexion',
  '/transition/pedagogie',
  '/transition/programme',
  '/images/logo.png',
  '/icon.png',
  '/icon-192.png',
  '/icon-512-maskable.png',
  '/apple-icon.png',
];

// Préchargement des routes festivaliers à l'installation.
// On met en cache chaque URL individuellement : une seule réponse en échec
// ne doit pas empêcher la mise en cache des autres (contrairement à addAll).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(
        PRECACHE.map((url) => cache.add(url))
      )
    )
  );
  self.skipWaiting();
});

// Nettoyage des anciens caches à l'activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Exclure routes admin et API backend
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/superadmin') ||
    url.pathname.startsWith('/api/')
  ) return;

  // Stratégie réseau d'abord, cache en repli
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache uniquement les réponses valides du même domaine
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached ?? caches.match('/offline'))
      )
  );
});
