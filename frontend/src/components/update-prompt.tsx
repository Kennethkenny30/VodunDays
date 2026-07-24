"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, X } from "lucide-react";

// Version inlinée au build (SHA du commit Vercel) = version en cours d'exécution
const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
const POLL_MS = 60_000;

// Toast global : détecte un nouveau déploiement (SHA live != SHA du build) et propose de recharger.
export function UpdatePrompt() {
  const t = useTranslations("pwa");
  const [latest, setLatest] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/api/version?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.version === "string") setLatest(data.version);
    } catch {
      // Hors ligne ou erreur : on ignore, nouvelle tentative au prochain cycle
    }
  }, []);

  useEffect(() => {
    // Pas de vérification en local (build sans SHA -> "dev")
    if (CURRENT_VERSION === "dev") return;
    // Première vérification différée (hors du corps synchrone de l'effet)
    const first = setTimeout(check, 0);
    const id = setInterval(check, POLL_MS);
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, [check]);

  const updateAvailable =
    CURRENT_VERSION !== "dev" && latest !== null && latest !== CURRENT_VERSION && latest !== dismissed;

  const handleUpdate = useCallback(async () => {
    // Purge best-effort de tout cache/SW résiduel avant de recharger sur la dernière version
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch {
      // On recharge quoi qu'il arrive
    }
    window.location.reload();
  }, []);

  if (!updateAvailable) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ position: "fixed", top: "calc(env(safe-area-inset-top, 0px) + 12px)", left: "50%", transform: "translateX(-50%)", zIndex: 9999, width: "calc(100% - 24px)", maxWidth: 420 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px 12px 16px", borderRadius: 16, background: "var(--vd-dropdown-bg)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid var(--vd-glass-border-color)", boxShadow: "0 12px 36px rgba(0,0,0,0.4)" }}>
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(245,110,15,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <RefreshCw size={16} style={{ color: "#F56E0F" }} />
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
          {t("updateAvailable")}
        </span>
        <button
          onClick={handleUpdate}
          style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 99, background: "linear-gradient(135deg, #F56E0F, #F56E0FCC)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          {t("update")}
        </button>
        <button
          onClick={() => setDismissed(latest)}
          aria-label={t("later")}
          style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "var(--vd-inner-tint)", border: "1px solid var(--vd-glass-border-color)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
