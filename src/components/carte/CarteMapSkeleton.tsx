"use client";

/**
 * Skeleton de chargement pour la carte interactive
 * Affiché pendant le chargement lazy de MapLibre GL
 */
export function CarteMapSkeleton() {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{
        height: "calc(100vh - 180px)",
        background: "#1B1B1E",
      }}
    >
      {/* Animation shimmer */}
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      
      {/* Texte de chargement */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#F56E0F", borderTopColor: "transparent" }}
        />
        <p
          className="text-[13px] font-medium"
          style={{ color: "#878787" }}
        >
          Chargement de la carte...
        </p>
      </div>
    </div>
  );
}
