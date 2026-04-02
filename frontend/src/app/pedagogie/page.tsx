"use client";

import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CultureCard } from "@/components/culture/CultureCard";
import { CultureListSkeleton } from "@/components/culture/CultureCardSkeleton";
import { BottomNav } from "@/components/layout/BottomNav";
import type { CulturalSite } from "@/lib/types";

// Mock data - source from API in production
const culturalSites: CulturalSite[] = [
  {
    id: "1",
    name: "Place Maro",
    slug: "place-maro",
    entities: ["Egungun"],
    description:
      "La Place Maro est un lieu emblématique de Ouidah où se déroulent les cérémonies Egungun. Ces masques ancestraux représentent les esprits des ancêtres revenus pour guider et bénir les vivants lors de rituels millénaires.",
    image: "/images/vodundays-3.jpg",
    thematicColor: "#8B4513",
    coordinates: { latitude: 6.3623, longitude: 2.0844 },
  },
  {
    id: "2",
    name: "Esplanade du Fort Français",
    slug: "fort-francais",
    entities: ["Zangbeto", "Terreiros du Brésil", "Kao"],
    description:
      "L'Esplanade du Fort Français accueille les cérémonies Zangbeto, gardiens nocturnes de la tradition Yoruba. Les Terreiros du Brésil témoignent des liens historiques entre le Bénin et le Brésil à travers la diaspora.",
    image: "/images/vodundays-7.jpg",
    thematicColor: "#2E8B57",
    coordinates: { latitude: 6.3612, longitude: 2.0889 },
  },
  {
    id: "3",
    name: "Place Ninsouxwé",
    slug: "place-ninsouwxe",
    entities: ["Zomadonou", "Ninsouxwé"],
    description:
      "Place sacrée dédiée aux divinités Zomadonou et Ninsouxwé, protectrices de la ville. Les cérémonies qui s'y déroulent perpétuent des traditions ancestrales transmises de génération en génération.",
    image: "/images/vodundays-9.jpg",
    thematicColor: "#4B0082",
    coordinates: { latitude: 6.3598, longitude: 2.0856 },
  },
  {
    id: "4",
    name: "Forêt sacrée de Kpassè",
    slug: "foret-kpasse",
    entities: ["Thron", "Hounvè", "Kabada", "Koku"],
    description:
      "La Forêt sacrée de Kpassè abrite les divinités Thron, Hounvè, Kabada et Koku. Ce sanctuaire naturel est un lieu de recueillement et de communion avec les forces spirituelles de la nature et des ancêtres.",
    image: "/images/vodundays-10.jpg",
    thematicColor: "#228B22",
    coordinates: { latitude: 6.3578, longitude: 2.0912 },
  },
  {
    id: "5",
    name: "Temple Mami Plage",
    slug: "temple-mami",
    entities: ["Mami", "Dan"],
    description:
      "Le Temple Mami Plage est consacré à Mami Wata, la déesse des eaux. Les cérémonies honorent cette divinité puissante qui règne sur les océans et apporte prospérité à ceux qui la vénèrent.",
    image: "/images/vodundays-11.jpg",
    thematicColor: "#00CED1",
    coordinates: { latitude: 6.3545, longitude: 2.0978 },
  },
  {
    id: "6",
    name: "Couvent Sakpata",
    slug: "couvent-sakpata",
    entities: ["Sakpata"],
    description:
      "Le Couvent Sakpata est dédié au vodun de la terre et de la variole. Sakpata est une divinité redoutée et respectée, garante de la justice divine et de l'équilibre entre le monde visible et invisible.",
    image: "/images/vodundays-12.jpg",
    thematicColor: "#8B0000",
    coordinates: { latitude: 6.3556, longitude: 2.0934 },
  },
];

// Introduction text
const introText =
  "Les Vodun Days célèbrent le 10 janvier, fête nationale du Vodun au Bénin. Cette célébration honore les divinités et ancêtres à travers des rituels, processions et cérémonies millénaires, héritiers des traditions de la côte des esclaves.";

function CultureList() {
  return (
    <div className="px-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 pb-24">
      {culturalSites.map((site, index) => (
        <CultureCard key={site.id} site={site} index={index} />
      ))}
    </div>
  );
}

export default function PedagogiePage() {
  return (
    <div className="min-h-screen bg-[#151419]">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {/* Logo */}
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vodun Days Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#878787] mb-1">
              Patrimoine Vivant
            </p>
            <h1 className="text-[22px] font-black text-white tracking-[-0.02em]">
              Contenus Pédagogiques
            </h1>
          </div>
        </motion.div>
      </header>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-4 pt-2 pb-5"
      >
        <p className="text-[13px] text-[#878787] leading-relaxed">
          {introText}
        </p>
      </motion.div>

      {/* Culture List */}
      <main className="relative z-10">
        <Suspense fallback={<CultureListSkeleton count={6} />}>
          <CultureList />
        </Suspense>
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
