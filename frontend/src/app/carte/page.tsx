"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartePageHeader } from "@/components/carte/CartePageHeader";
import { CarteFilterBar } from "@/components/carte/CarteFilterBar";
import { CarteMapSkeleton } from "@/components/carte/CarteMapSkeleton";

/**
 * Chargement dynamique de la section carte avec SSR désactivé.
 * MapLibre GL nécessite les APIs navigateur (window, WebGL).
 *
 * ⚠️  CarteMapSection utilise useSearchParams() pour lire les query params
 * de deep-link (?siteId=, ?lat=, ?lng=). Next.js exige que tout composant
 * appelant useSearchParams soit enveloppé dans un <Suspense> — ce qui est
 * déjà fait ici via le Suspense fallback du dynamic + le Suspense explicite.
 */
const CarteMapSection = dynamic(
  () => import("@/components/carte/CarteMapSection").then(mod => ({ default: mod.CarteMapSection })),
  {
    ssr: false,
    loading: () => <CarteMapSkeleton />,
  }
);

export default function CartePage() {
  // ✅ "pra" ajouté — toutes les catégories BDD activées par défaut
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["all", "sites", "toilettes", "urgences", "transport", "assistance", "pra"])
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

      <CartePageHeader />

      <CarteFilterBar
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      <Suspense fallback={<CarteMapSkeleton />}>
        <CarteMapSection activeFilters={activeFilters} />
      </Suspense>

      <BottomNav activeTab="carte" />
    </div>
  );
}