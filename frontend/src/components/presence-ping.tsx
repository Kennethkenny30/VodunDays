"use client";

/**
 * PresencePing
 * ─────────────────────────────────────────────────────────────────────────────
 * Envoie périodiquement la position GPS du festivalier pour alimenter les
 * statistiques de fréquentation (dashboard superadmin + futur dashboard
 * INStaD). Inactif sur les espaces admin/superadmin/connexion et lorsque
 * l'onglet n'est pas visible. Le consentement est celui, natif, de la
 * permission de géolocalisation du navigateur - aucune donnée n'est envoyée
 * tant qu'elle n'est pas accordée.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getOrCreateFestivalierUuid } from "@/lib/festivalier";
import { sendPresencePing } from "@/lib/api/presence";

const PING_INTERVAL_MS = 60_000;
const EXCLUDED_PREFIXES = ["/admin", "/superadmin", "/connexion"];

export function PresencePing() {
  const pathname = usePathname();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const excluded = EXCLUDED_PREFIXES.some(prefix => pathname?.startsWith(prefix));

  useEffect(() => {
    if (excluded) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    const sendPing = () => {
      if (document.visibilityState !== "visible") return;
      navigator.geolocation.getCurrentPosition(
        pos => {
          sendPresencePing({
            uuid:      getOrCreateFestivalierUuid(),
            latitude:  pos.coords.latitude,
            longitude: pos.coords.longitude,
          }).catch(() => {});
        },
        () => {
          // Permission refusée ou position indisponible : on retente au
          // prochain intervalle, sans bloquer ni notifier l'utilisateur.
        },
        { enableHighAccuracy: false, maximumAge: 30_000, timeout: 10_000 },
      );
    };

    sendPing(); // premier ping immédiat
    intervalRef.current = setInterval(sendPing, PING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [excluded]);

  return null;
}
