"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartePageHeader } from "@/components/carte/CartePageHeader";
import { CarteFilterBar } from "@/components/carte/CarteFilterBar";
import { CarteMapSkeleton } from "@/components/carte/CarteMapSkeleton";

/**
 * Chargement dynamique de la section carte avec SSR désactivé
 * MapLibre GL nécessite les APIs navigateur (window, WebGL)
 */
const CarteMapSection = dynamic(
  () => import("@/components/carte/CarteMapSection").then(mod => ({ default: mod.CarteMapSection })),
  {
    ssr: false,
    loading: () => <CarteMapSkeleton />,
  }
);

/**
 * Page Carte Interactive
 * Affiche une carte MapLibre GL avec les points d'intérêt du festival
 */
export default function CartePage() {
  // État des filtres actifs - tous activés par défaut
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all", "sites", "toilettes", "urgences", "transport", "assistance"])
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "#151419" }}
    >
      {/* Lueur ambiante */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(245,110,15,0.06), transparent 60%)",
        }}
      />

      {/* En-tête de la page */}
      <CartePageHeader />

      {/* Barre de filtres */}
      <CarteFilterBar
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      {/* Section carte (chargée dynamiquement) */}
      <Suspense fallback={<CarteMapSkeleton />}>
        <CarteMapSection activeFilters={activeFilters} />
      </Suspense>

      {/* Navigation inférieure */}
      <BottomNav activeTab="carte" />
    </div>
  );
}
