"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import type { CarteMapSection as CarteMapSectionType } from "@/components/carte/CarteMapSection";
import type { ComponentProps } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartePageHeader } from "@/components/carte/CartePageHeader";
import { CarteFilterBar } from "@/components/carte/CarteFilterBar";
import { CarteMapSkeleton } from "@/components/carte/CarteMapSkeleton";

// MapLibre GL nécessite les APIs navigateur - chargement client uniquement.
// CarteMapSection utilise useSearchParams() donc doit être dans un <Suspense>.
const CarteMapSection = dynamic<ComponentProps<typeof CarteMapSectionType>>(
  () => import("@/components/carte/CarteMapSection").then(mod => ({ default: mod.CarteMapSection })),
  {
    ssr: false,
    loading: () => <CarteMapSkeleton />,
  }
);

export default function CartePage() {
  // "pra" ajouté - toutes les catégories BDD activées par défaut
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all", "sites", "toilettes", "urgences", "transport", "assistance", "pra"])
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "#151419", height: "100dvh" }}
    >
      {/* Lueur ambiante */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(245,110,15,0.06), transparent 60%)",
          zIndex: 0,
        }}
      />

      {/* Carte plein écran en fond */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Suspense fallback={<CarteMapSkeleton />}>
          <CarteMapSection activeFilters={activeFilters} />
        </Suspense>
      </div>

      {/* Header + filtres en overlay glassmorphism par-dessus la carte */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="pointer-events-auto"
          style={{
            background: "linear-gradient(to bottom, rgba(21,20,25,0.90) 65%, transparent 100%)",
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <CartePageHeader />
          <CarteFilterBar
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
