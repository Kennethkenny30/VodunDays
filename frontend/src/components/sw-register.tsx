"use client";

import { useEffect } from "react";

export function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    } else {
      // En dev, un SW actif sert des chunks Next.js périmés (stratégie réseau d'abord,
      // cache en repli) et masque les changements : on le désenregistre et on purge ses caches.
      // .catch() nécessaire : un fast refresh Turbopack peut invalider le document
      // pendant l'appel et rejeter la promesse (InvalidStateError), sans rapport avec
      // la logique elle-même.
      navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
      if (window.caches) caches.keys().then(ks => ks.forEach(k => caches.delete(k))).catch(() => {});
    }
  }, []);

  return null;
}