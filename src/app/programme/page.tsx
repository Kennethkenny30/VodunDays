"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DayFilter } from "@/components/programs/DayFilter";
import { WeatherWidget } from "@/components/programs/WeatherWidget";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProgramList } from "@/components/programs/ProgramList";
import type { Program } from "@/lib/types";

const mockPrograms: Program[] = [
  // Jour 1
  { id: "1",  title: "Cérémonie d'Ouverture",   description: "Cérémonie traditionnelle d'ouverture du festival", type: "RITUAL",    startTime: "09:00", endTime: "11:30", location: "Plage de Ouidah",      rating: 5.0, image: "/images/vodundays-3.jpg",  isLive: true,  day: 1 },
  { id: "2",  title: "Danse Zangbéto",          description: "Spectacle de danse traditionnelle Zangbéto",       type: "ANIMATION", startTime: "14:30", endTime: "16:00", location: "Place des Enchanteurs", rating: 4.8, image: "/images/vodundays-7.jpg",  isLive: false, day: 1 },
  { id: "3",  title: "Procession Vodun Hounve", description: "Procession traditionnelle au Temple des Pythons",  type: "RITUAL",    startTime: "17:00", endTime: "19:00", location: "Temple des Pythons",    rating: 5.0, image: "/images/vodundays-9.jpg",  isLive: false, day: 1 },
  // Jour 2
  { id: "4",  title: "Danse des Egungun",       description: "Représentation des masques Egungun",               type: "RITUAL",    startTime: "10:00", endTime: "12:00", location: "Place Chacha",          rating: 4.9, image: "/images/vodundays-10.jpg", isLive: false, day: 2 },
  { id: "5",  title: "Masques Guèlèdé",         description: "Spectacle des masques sacrés Guèlèdé",             type: "ANIMATION", startTime: "15:00", endTime: "17:30", location: "Forêt Sacrée",          rating: 4.7, image: "/images/vodundays-11.jpg", isLive: false, day: 2 },
  { id: "9",  title: "Cérémonie des Ancêtres",  description: "Hommage aux ancêtres et esprits protecteurs",      type: "RITUAL",    startTime: "18:00", endTime: "20:00", location: "Temple Ancestral",      rating: 5.0, image: "/images/vodundays-18.jpg", isLive: false, day: 2 },
  // Jour 3
  { id: "6",  title: "Danse Guerrière",         description: "Performance de danse guerrière traditionnelle",    type: "CONCERT",   startTime: "09:30", endTime: "11:00", location: "Arène Centrale",        rating: 4.6, image: "/images/vodundays-12.jpg", isLive: false, day: 3 },
  { id: "7",  title: "Cérémonie Sakpata",       description: "Cérémonie dédiée au vodun Sakpata",               type: "RITUAL",    startTime: "14:00", endTime: "16:30", location: "Temple Sakpata",        rating: 5.0, image: "/images/vodundays-13.jpg", isLive: false, day: 3 },
  { id: "10", title: "Procession Royale",       description: "Grande procession avec les dignitaires royaux",    type: "RITUAL",    startTime: "17:30", endTime: "19:30", location: "Route des Esclaves",    rating: 4.9, image: "/images/vodundays-9.jpg",  isLive: false, day: 3 },
];

/*
  Variantes pour l'entrée orchestrée de la page.
  Le container déclenche ses enfants en cascade (staggerChildren).
*/
const pageVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Chaque section descend depuis le haut avec un léger flou
const itemVariants = {
  hidden:  { opacity: 0, y: -14, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Glow ambient : simple fondu lent au montage
const glowVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

export default function ProgrammePage() {
  const [activeDay, setActiveDay]   = useState(1);
  const [logoMerged, setLogoMerged] = useState(false);

  const filteredPrograms = mockPrograms.filter((p) => p.day === activeDay);

  return (
    /*
      Conteneur racine avec stagger :
      au montage, chaque enfant motion.* entre en décalé (header → dayfilter → liste).
    */
    <motion.div
      className="min-h-screen bg-[#151419]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Glow ambient — fondu lent indépendant du stagger */}
      <motion.div
        variants={glowVariants}
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)" }}
      />

      {/*
        Header — premier élément à entrer.
        Safe-area PWA : padding-top adapté notch/status bar sur tous les appareils.
      */}
      <motion.header
        variants={itemVariants}
        className="relative z-10 px-4 flex items-end pb-2"
        style={{
          paddingTop: "max(12px, env(safe-area-inset-top))",
          minHeight: "calc(52px + max(12px, env(safe-area-inset-top)))",
        }}
      >
        <AnimatePresence>
          {!logoMerged && (
            <motion.div
              layoutId="vodun-logo"
              key="logo-header"
              className="relative w-11 h-11 shrink-0"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ type: "spring", bounce: 0.28, duration: 0.42 }}
            >
              <Image
                src="/images/logo.png"
                alt="Vodun Days"
                fill
                className="rounded-full object-contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Dynamic Island — fixed à droite en idle, s'étend au centre à l'ouverture */}
      <WeatherWidget
        logoSrc="/images/logo.png"
        logoMerged={logoMerged}
        onLogoMerge={() => setLogoMerged(true)}
        onLogoSeparate={() => setLogoMerged(false)}
      />

      {/* Sélecteur de jour — deuxième à entrer */}
      <motion.div variants={itemVariants}>
        <DayFilter activeDay={activeDay} onDayChange={setActiveDay} totalDays={3} />
      </motion.div>

      {/*
        Liste des programmes — troisième à entrer.
        Les ProgramCard s'animent ensuite individuellement au scroll (useInView dans ProgramCard).
        La prop activeDay déclenche l'AnimatePresence dans ProgramList au changement de jour.
      */}
      <motion.main variants={itemVariants} className="relative z-10 py-2">
        <ProgramList programs={filteredPrograms} activeDay={activeDay} />
      </motion.main>

      {/* BottomNav */}
      <BottomNav />
    </motion.div>
  );
}