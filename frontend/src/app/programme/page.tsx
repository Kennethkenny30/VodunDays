"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DayFilter }               from "@/components/programs/DayFilter";
import { WeatherWidget }           from "@/components/programs/WeatherWidget";
import { BottomNav }               from "@/components/layout/BottomNav";
import { ProgramList }             from "@/components/programs/ProgramList";
import { PlannerCard }             from "@/components/programs/PlannerCard";
import { FestivalPlannerProvider } from "@/providers/FestivalPlannerProvider";
import { useWeather }              from "@/hooks/useWeather";
import type { Program, ProgramType } from "@/lib/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const TYPE_IMAGES: Record<string, string> = {
  RITUAL:      "/images/vodundays-3.jpg",
  ANIMATION:   "/images/vodundays-7.jpg",
  CONCERT:     "/images/vodundays-12.jpg",
  EXHIBITION:  "/images/vodundays-9.jpg",
  CONFERENCE:  "/images/vodundays-11.jpg",
};

const TYPE_MAP: Record<string, ProgramType> = {
  RITUAL:     "RITUAL",
  ANIMATION:  "ANIMATION",
  CONCERT:    "CONCERT",
  EXHIBITION: "EXHIBITION",
  CONFERENCE: "CONFERENCE",
};

// ─── Types backend ────────────────────────────────────────────────────────────

type BackendProgram = {
  id:        string;
  startTime: string;
  endTime:   string;
};

type BackendSite = {
  id:          string;
  name:        string;
  latitude:    number;
  longitude:   number;
  description?: string | null;
  amenities?:  { name: string }[];
};

type BackendEvent = {
  id:          string;
  name:        string;
  description: string;
  status:      string;
  imageUrl?:   string | null;
  // ✅ site complet — le backend fait include: { site: true }
  site?:       BackendSite;
  eventType?:  { name: string };
  programs?:   BackendProgram[];
};

// ─── Dates du festival ────────────────────────────────────────────────────────

function getFestivalYear(): number {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), 0, 10, 23, 59, 59);
  return now > cutoff ? now.getFullYear() + 1 : now.getFullYear();
}

function getFestivalStartDate(): Date {
  return new Date(getFestivalYear(), 0, 8);
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
// Transporte maintenant siteId + siteLat + siteLng pour le deep-link carte.

function mapEventToPrograms(event: BackendEvent): Program[] {
  const typeName = event.eventType?.name?.toUpperCase() ?? "ANIMATION";
  const type: ProgramType = TYPE_MAP[typeName] ?? "ANIMATION";
  const image = event.imageUrl || TYPE_IMAGES[type] || "/images/vodundays-3.jpg";

  const festivalStart = getFestivalStartDate();
  const festivalDay = new Date(
    festivalStart.getFullYear(),
    festivalStart.getMonth(),
    festivalStart.getDate()
  );

  // Coordonnées réelles du site BDD
  const siteId  = event.site?.id       ?? null;
  const siteLat = event.site?.latitude  ?? null;
  const siteLng = event.site?.longitude ?? null;

  if (!event.programs?.length) {
    return [{
      id:          event.id,
      eventId:     event.id,
      title:       event.name,
      description: event.description,
      type,
      startTime:   "09:00",
      endTime:     "11:00",
      location:    event.site?.name ?? "Ouidah",
      rating:      4.8,
      image,
      isLive:      false,
      day:         1,
      // ✅ Deep-link carte
      siteId,
      siteLat,
      siteLng,
    }];
  }

  return event.programs.map((program): Program => {
    const startDate = new Date(program.startTime);
    const endDate   = new Date(program.endTime);

    const startTime = startDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const endTime   = endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const eventDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const diffDays = Math.round(
      (eventDay.getTime() - festivalDay.getTime()) / (1000 * 60 * 60 * 24)
    );
    const day = diffDays >= 0 && diffDays <= 2 ? diffDays + 1 : 1;

    return {
      id:          `${event.id}__${program.id}`,
      eventId:     event.id,
      title:       event.name,
      description: event.description,
      type,
      startTime,
      endTime,
      location:    event.site?.name ?? "Ouidah",
      rating:      4.8,
      image,
      isLive:      false,
      day,
      // ✅ Deep-link carte
      siteId,
      siteLat,
      siteLng,
    };
  });
}

// ─── Animations ───────────────────────────────────────────────────────────────

const pageVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: -14, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const glowVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

// ─── Contenu ──────────────────────────────────────────────────────────────────

function ProgrammeContent() {
  const [activeDay, setActiveDay]   = useState(1);
  const [logoMerged, setLogoMerged] = useState(false);
  const [programs, setPrograms]     = useState<Program[]>([]);
  const [loading, setLoading]       = useState(true);
  const { weather } = useWeather();

  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/events?status=PUBLISHED`, { credentials: "include" });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.flatMap((e: BackendEvent) => mapEventToPrograms(e));
          setPrograms(mapped);
        }
      } catch {
        // fallback silencieux
      } finally {
        setLoading(false);
      }
    }
    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter((p) => p.day === activeDay);

  return (
    <motion.div
      className="min-h-screen bg-[#151419]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={glowVariants}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.45 0.18 50 / 0.25), transparent)",
        }}
      />

      <WeatherWidget weather={weather} compact />

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-32">

        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setLogoMerged((v) => !v)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="/images/logo.png"
              alt="Vodun Days"
              width={40}
              height={40}
              className="rounded-full"
            />
            <AnimatePresence>
              {!logoMerged && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-white font-semibold text-lg"
                >
                  Programme
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PlannerCard />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DayFilter activeDay={activeDay} onDayChange={setActiveDay} totalDays={3} />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">
              Aucun événement pour ce jour.
            </p>
          ) : (
            <ProgramList programs={filteredPrograms} />
          )}
        </motion.div>

      </div>

      <BottomNav />
    </motion.div>
  );
}

export default function ProgrammePage() {
  return (
    <FestivalPlannerProvider>
      <ProgrammeContent />
    </FestivalPlannerProvider>
  );
}