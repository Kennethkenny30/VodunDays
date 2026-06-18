"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CultureCard } from "@/components/culture/CultureCard";
import { CultureListSkeleton } from "@/components/culture/CultureCardSkeleton";
import { BottomNav } from "@/components/layout/BottomNav";
import { ARModeSwitcher } from "./components/ARModeSwitcher";
import type { CulturalSite } from "@/lib/types";

// Chargement paresseux - getUserMedia n'existe pas côté serveur
const DynamicCameraView = dynamic(
  () => import("./components/CameraView").then((m) => m.CameraView),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-vd-page-bg" />,
  }
);

type PageMode = "content" | "ar";

// Données statiques des sites culturels (hors traduction)
const SITE_STATIC = [
  { key: "placeMaro",      slug: "place-maro",      entities: ["Egungun"],                             image: "/images/vodundays-3.jpg",  thematicColor: "#8B4513", coordinates: { latitude: 6.3623, longitude: 2.0844 } },
  { key: "esplanade",      slug: "fort-francais",   entities: ["Zangbeto", "Terreiros du Brésil", "Kao"], image: "/images/vodundays-7.jpg",  thematicColor: "#2E8B57", coordinates: { latitude: 6.3612, longitude: 2.0889 } },
  { key: "placeNinsouxwe", slug: "place-ninsouwxe", entities: ["Zomadonou", "Ninsouxwé"],              image: "/images/vodundays-9.jpg",  thematicColor: "#4B0082", coordinates: { latitude: 6.3598, longitude: 2.0856 } },
  { key: "foretSacree",    slug: "foret-kpasse",    entities: ["Thron", "Hounvè", "Kabada", "Koku"],   image: "/images/vodundays-10.jpg", thematicColor: "#228B22", coordinates: { latitude: 6.3578, longitude: 2.0912 } },
  { key: "templeMami",     slug: "temple-mami",     entities: ["Mami", "Dan"],                         image: "/images/vodundays-11.jpg", thematicColor: "#00CED1", coordinates: { latitude: 6.3545, longitude: 2.0978 } },
  { key: "couventSakpata", slug: "couvent-sakpata", entities: ["Sakpata"],                             image: "/images/vodundays-12.jpg", thematicColor: "#8B0000", coordinates: { latitude: 6.3556, longitude: 2.0934 } },
];

function CultureList({ sites }: { sites: CulturalSite[] }) {
  return (
    <div className="px-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 pb-24">
      {sites.map((site, index) => (
        <CultureCard key={site.id} site={site} index={index} />
      ))}
    </div>
  );
}

export default function PedagogiePage() {
  const t = useTranslations("pedagogie");
  const [mode, setMode] = useState<PageMode>("content");
  const prefersReduced = useReducedMotion();

  const fadeDuration = prefersReduced ? 0 : 0.28;

  const culturalSites: CulturalSite[] = SITE_STATIC.map((s, i) => ({
    id: String(i + 1),
    name: t(`sites.${s.key}.name`),
    slug: s.slug,
    entities: s.entities,
    description: t(`sites.${s.key}.description`),
    image: s.image,
    thematicColor: s.thematicColor,
    coordinates: s.coordinates,
  }));

  return (
    <div className="min-h-screen bg-vd-page-bg">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)",
        }}
      />

      <div
        className="fixed left-0 right-0 z-70 flex justify-center pb-2 pointer-events-none"
        style={{ top: 0, paddingTop: "max(16px, env(safe-area-inset-top))" }}
      >
        <div className="pointer-events-auto">
          <ARModeSwitcher mode={mode} onChange={setMode} />
        </div>
      </div>

      <AnimatePresence>
        {mode === "ar" && (
          <motion.div
            key="camera"
            className="fixed inset-0 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: "easeInOut" }}
          >
            <DynamicCameraView onBack={() => setMode("content")} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "content" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
            transition={{ duration: fadeDuration }}
          >
            <div className="h-18" />

            <header className="relative z-10 px-4 pt-6 pb-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
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
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {t("heritage")}
                  </p>
                </div>
              </motion.div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="px-4 pt-2 pb-5"
            >
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {t("intro")}
              </p>
            </motion.div>

            <main className="relative z-10">
              <Suspense fallback={<CultureListSkeleton count={6} />}>
                <CultureList sites={culturalSites} />
              </Suspense>
            </main>

            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
