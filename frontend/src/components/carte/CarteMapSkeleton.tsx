"use client";

import { useTranslations } from "next-intl";

/**
 * Skeleton de chargement pour la carte interactive
 * Affiché pendant le chargement lazy de MapLibre GL
 */
export function CarteMapSkeleton() {
  const t = useTranslations("carte");
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "var(--vd-page-bg)" }}
    >
      {/* Animation shimmer (pas de spinner : cohérence avec les autres skeletons du site) */}
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      <p className="text-[13px] font-medium text-muted-foreground">
        {t("loading")}
      </p>
    </div>
  );
}
