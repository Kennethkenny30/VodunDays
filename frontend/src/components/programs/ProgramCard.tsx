"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CalendarPlus, CalendarCheck, AlertTriangle } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Program, ProgramType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlanner } from "@/providers/FestivalPlannerProvider";

// ── Badge styles ──────────────────────────────────────────────────────────────

const programTypeBadgeStyles: Record<ProgramType, { bg: string; text: string; border: string }> = {
  RITUAL:     { bg: "rgba(245, 110, 15, 0.30)", text: "#F56E0F",  border: "rgba(245, 110, 15, 0.40)" },
  ANIMATION:  { bg: "rgba(245, 110, 15, 0.22)", text: "#FFA060",  border: "rgba(245, 110, 15, 0.32)" },
  CONCERT:    { bg: "rgba(245, 110, 15, 0.16)", text: "#FFC090",  border: "rgba(245, 110, 15, 0.26)" },
  EXHIBITION: { bg: "rgba(245, 110, 15, 0.10)", text: "#FFD0A0",  border: "rgba(245, 110, 15, 0.20)" },
  CONFERENCE: { bg: "rgba(245, 110, 15, 0.07)", text: "#FFE0C0",  border: "rgba(245, 110, 15, 0.15)" },
};

const programTypeLabels: Record<ProgramType, string> = {
  RITUAL: "RITUEL", ANIMATION: "ANIMATION", CONCERT: "CONCERT",
  EXHIBITION: "EXPOSITION", CONFERENCE: "CONFÉRENCE",
};

// ── Ripple ────────────────────────────────────────────────────────────────────

function AddRipple({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          key="ripple"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 rounded-lg bg-[#F56E0F]/30 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

// ── ProgramCard ───────────────────────────────────────────────────────────────

interface ProgramCardProps {
  program: Program;
  index?: number;
}

export function ProgramCard({ program, index = 0 }: ProgramCardProps) {
  const router = useRouter();
  const { addToAgenda, removeFromAgenda, isInAgenda, conflicts } = usePlanner();

  const inAgenda    = isInAgenda(program.id);
  const hasConflict = conflicts.includes(program.id);
  const badgeStyle  = programTypeBadgeStyles[program.type];
  const [ripple, setRipple] = useState(false);

  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  function handleAgendaToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (inAgenda) {
      removeFromAgenda(program.id);
    } else {
      addToAgenda(program);
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    }
  }

  /**
   * Deep-link vers la carte avec focal sur le site de l'événement.
   *
   * Stratégie URL :
   *   /carte?siteId=<uuid>            → site BDD (priorité)
   *   /carte?lat=<n>&lng=<n>&name=<s> → fallback coords brutes si pas de siteId
   *
   * CarteMapSection lit ces params au mount et fait flyTo + sélection du marqueur.
   */
  function handleViewOnMap(e: React.MouseEvent) {
    e.stopPropagation();

    if (program.siteId) {
      // Cas nominal : site BDD avec UUID - CarteMapSection le retrouvera dans loadPOIs
      router.push(`/carte?siteId=${program.siteId}`);
      return;
    }

    if (program.siteLat !== null && program.siteLng !== null) {
      // Fallback : on envoie les coordonnées brutes + nom pour un simple flyTo
      const params = new URLSearchParams({
        lat:  String(program.siteLat),
        lng:  String(program.siteLng),
        name: program.location,
      });
      router.push(`/carte?${params.toString()}`);
      return;
    }

    // Dernier recours : on ouvre la carte sans focal
    router.push("/carte");
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 28, filter: "blur(4px)" }
      }
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative rounded-[20px] overflow-hidden",
        "bg-[#1B1B1E] backdrop-blur-md cursor-pointer",
        "border",
        hasConflict
          ? "border-amber-500/40 shadow-[0_4px_24px_rgba(245,158,11,0.15)]"
          : "border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
      )}
    >
      {/* Conflict banner */}
      {hasConflict && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
            Conflit horaire détecté
          </span>
        </div>
      )}

      {/* Image */}
      <div className={cn("relative aspect-16/10 overflow-hidden", hasConflict && "mt-7")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={program.image}
          alt={program.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              target.src = "/images/vodundays-3.jpg";
            }
          }}
        />

        {program.isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.3 }}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#F56E0F] text-[#FBFBFB] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_2px_12px_rgba(245,110,15,0.5)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBFBFB] animate-pulse" />
            En Direct
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1E] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
            style={{
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              border: `1px solid ${badgeStyle.border}`,
            }}
          >
            {programTypeLabels[program.type]}
          </span>
          <span className="text-[13px] font-bold text-[#F56E0F]">
            {program.startTime} – {program.endTime}
          </span>
        </div>

        <h3 className="text-[16px] font-extrabold text-[#FBFBFB] leading-tight mb-1">
          {program.title}
        </h3>

        <p className="flex items-center gap-1.5 text-[12px] text-[#878787] mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {program.location}
        </p>

        <div className="flex gap-2">
          {/* Bouton "Voir sur la carte" */}
          <button
            onClick={handleViewOnMap}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2",
              "text-[11px] font-bold",
              "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
              "border border-[rgba(245,110,15,0.30)]",
              "transition-all duration-150 active:scale-[0.97] hover:bg-[rgba(245,110,15,0.25)]"
            )}
          >
            <MapPin className="w-3 h-3" />
            Voir sur la carte
          </button>

          {/* Agenda toggle */}
          <motion.button
            whileTap={{ scale: 0.86 }}
            onClick={handleAgendaToggle}
            aria-label={inAgenda ? "Retirer de mon agenda" : "Ajouter à mon agenda"}
            className={cn(
              "relative py-1.5 px-3 rounded-lg overflow-hidden",
              "flex items-center justify-center",
              "border transition-all duration-300",
              inAgenda
                ? "bg-[rgba(245,110,15,0.18)] border-[rgba(245,110,15,0.45)] shadow-[0_0_12px_rgba(245,110,15,0.2)]"
                : "bg-[rgba(255,255,255,0.06)] border-white/10",
            )}
          >
            <AddRipple active={ripple} />
            <AnimatePresence mode="wait" initial={false}>
              {inAgenda ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CalendarCheck className="w-4 h-4 text-[#F56E0F]" />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CalendarPlus className="w-4 h-4 text-[#878787] group-hover:text-white transition-colors" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function ProgramCardSkeleton() {
  return (
    <div className={cn("relative rounded-[20px] overflow-hidden", "bg-[#1B1B1E]", "border border-white/8")}>
      <div className="aspect-16/10 bg-[#262626] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full bg-[#262626] animate-pulse" />
          <div className="h-4 w-20 rounded bg-[#262626] animate-pulse" />
        </div>
        <div className="h-5 w-3/4 rounded bg-[#262626] animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-[#262626] animate-pulse" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 rounded-lg bg-[#262626] animate-pulse" />
          <div className="w-10 h-8 rounded-lg bg-[#262626] animate-pulse" />
        </div>
      </div>
    </div>
  );
}