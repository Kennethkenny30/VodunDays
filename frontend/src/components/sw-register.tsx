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
      navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
      if (window.caches) caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
    }
  }, []);

  return null;
}
