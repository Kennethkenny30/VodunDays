"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { DayFilter }               from "@/components/programs/DayFilter";
import { WeatherWidget }           from "@/components/programs/WeatherWidget";
import { BottomNav }               from "@/components/layout/BottomNav";
import { ProgramList }             from "@/components/programs/ProgramList";
import { PlannerCard }             from "@/components/programs/PlannerCard";
import { FestivalPlannerProvider } from "@/providers/FestivalPlannerProvider";
import { useWeather }              from "@/hooks/useWeather";
import type { Program, ProgramType } from "@/lib/types";
import { PwaInstallPrompt }        from "@/components/pwa-install-prompt";
import { OnboardingFlow }          from "@/components/onboarding/OnboardingFlow";
import { getApiBase }              from "@/lib/api/client";
import { getFestivalStartDate }    from "@/lib/festival";

// Config

const API_BASE = getApiBase();

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

// Types backend

type BackendProgram = {
  id:        string;
  startTime: string;
  endTime:   string;
};

type BackendSite = {
  id:          string;
  name:        string;
  nameEn?:     string | null;
  latitude:    number;
  longitude:   number;
  description?: string | null;
  amenities?:  { name: string }[];
};

type BackendEvent = {
  id:            string;
  name:          string;
  nameEn?:       string | null;
  description:   string;
  descriptionEn?: string | null;
  status:        string;
  imageUrl?:     string | null;
  // site complet - le backend fait include: { site: true }
  site?:         BackendSite;
  eventType?:    { name: string };
  programs?:     BackendProgram[];
};

// Mapper
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
      id:            event.id,
      eventId:       event.id,
      title:         event.name,
      titleEn:       event.nameEn ?? null,
      description:   event.description,
      descriptionEn: event.descriptionEn ?? null,
      type,
      startTime:     "09:00",
      endTime:       "11:00",
      location:      event.site?.name ?? "Ouidah",
      locationEn:    event.site?.nameEn ?? null,
      rating:        4.8,
      image,
      isLive:        false,
      day:           1,
      // Deep-link carte
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
      id:            `${event.id}__${program.id}`,
      eventId:       event.id,
      title:         event.name,
      titleEn:       event.nameEn ?? null,
      description:   event.description,
      descriptionEn: event.descriptionEn ?? null,
      type,
      startTime,
      endTime,
      location:      event.site?.name ?? "Ouidah",
      locationEn:    event.site?.nameEn ?? null,
      rating:        4.8,
      image,
      isLive:        false,
      day,
      // Deep-link carte
      siteId,
      siteLat,
      siteLng,
    };
  });
}

// Animations

const pageVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: -14, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const glowVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

// Contenu

function ProgrammeContent() {
  const t = useTranslations("programme");
  const router       = useRouter();
  const searchParams = useSearchParams();
  const eventParam   = searchParams.get("event");
  const [activeDay, setActiveDay]   = useState(1);
  const [programs, setPrograms]     = useState<Program[]>([]);
  const [loading, setLoading]       = useState(true);
  const [highlightEventId, setHighlightEventId] = useState<string | null>(null);
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

  // Deep-link ?event=<id> (recherche du WeatherWidget) : sélectionne le jour
  // du premier programme de l'événement puis déclenche scroll + surbrillance
  useEffect(() => {
    if (!eventParam || programs.length === 0) return;
    const matches = programs.filter((p) => p.eventId === eventParam);
    if (matches.length === 0) return;
    const target = [...matches].sort(
      (a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime)
    )[0];
    setActiveDay(target.day);
    setHighlightEventId(eventParam);
    // Nettoie le param pour qu'une recherche ultérieure du même événement re-déclenche
    router.replace("/programme", { scroll: false });
  }, [eventParam, programs, router]);

  // La surbrillance est temporaire : on la retire une fois l'attention captée
  useEffect(() => {
    if (!highlightEventId) return;
    const t = setTimeout(() => setHighlightEventId(null), 2600);
    return () => clearTimeout(t);
  }, [highlightEventId]);

  const filteredPrograms = programs.filter((p) => p.day === activeDay);

  return (
    <motion.div
      className="min-h-screen bg-vd-page-bg"
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

      <WeatherWidget weather={weather ?? undefined} />

      <div
        className="relative z-10 max-w-md mx-auto px-4 pb-32"
        style={{ paddingTop: "max(24px, env(safe-area-inset-top))" }}
      >

        <motion.div variants={itemVariants} className="mb-6">
          <Image
            src="/images/logo.png"
            alt="Vodun Days"
            width={40}
            height={40}
            className="rounded-full"
          />
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
                <div key={i} className="h-28 rounded-2xl bg-vd-skeleton animate-pulse" />
              ))}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">
              {t("empty")}
            </p>
          ) : (
            <ProgramList
              programs={filteredPrograms}
              activeDay={activeDay}
              highlightEventId={highlightEventId}
            />
          )}
        </motion.div>

      </div>

      <OnboardingFlow />
      <PwaInstallPrompt />
      <BottomNav />
    </motion.div>
  );
}

export default function ProgrammePage() {
  return (
    <FestivalPlannerProvider>
      {/* Suspense requis par useSearchParams dans ProgrammeContent */}
      <Suspense>
        <ProgrammeContent />
      </Suspense>
    </FestivalPlannerProvider>
  );
}