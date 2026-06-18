"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarCheck, ChevronRight, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlanner } from "@/providers/FestivalPlannerProvider";
import type { AgendaItem } from "@/providers/FestivalPlannerProvider";

function getNextEvent(agenda: AgendaItem[]): AgendaItem | null {
  if (!agenda.length) return null;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return agenda.find((e) => e.startTime >= hhmm) ?? agenda[0];
}

function DayDots({ agendaByDay }: { agendaByDay: Record<number, AgendaItem[]> }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((day) => {
        const count = agendaByDay[day]?.length ?? 0;
        return (
          <div key={day} className="flex flex-col items-center gap-0.5">
            <div className={cn(
              "h-1 rounded-full transition-all duration-300",
              count > 0
                ? "bg-[#F56E0F] shadow-[0_0_6px_rgba(245,110,15,0.6)]"
                : "bg-foreground/15",
              count >= 3 ? "w-5" : count === 2 ? "w-4" : count === 1 ? "w-3" : "w-2",
            )} />
            <span className="text-[8px] text-foreground/25 tabular-nums">J{day}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PlannerCard() {
  const router = useRouter();
  const t = useTranslations("common");
  const { agenda, agendaByDay, totalCount, conflicts, hydrated } = usePlanner();

  const visible      = hydrated && totalCount > 0;
  const nextEvent    = visible ? getNextEvent(agenda) : null;
  const hasConflicts = conflicts.length > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="planner-card"
          /*
           * sticky top-0 z-20 - colle en haut au scroll, sous WeatherWidget (z-50).
           * Le wrapper lui-même est transparent, sans blur ni fond.
           * Tout le blur est localisé sur le bouton interne.
           */
          className="sticky z-20 px-4 py-2"
          style={{ top: "calc(64px + max(0px, env(safe-area-inset-top)))" }}
          initial={{ opacity: 0, y: -12, scale: 0.95, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, scale: 0.97, filter: "blur(3px)" }}
          transition={{ type: "spring", stiffness: 340, damping: 26, mass: 0.85 }}
        >
          {/*
           * Le bouton est le seul élément avec backdrop-filter.
           * Le blur est donc strictement contenu dans les bords arrondis
           * du bouton - rien ne déborde sur DayFilter ou les ProgramCards.
           */}
          <motion.button
            whileTap={{ scale: 0.975 }}
            onClick={() => router.push("/planner")}
            style={{
              WebkitTapHighlightColor: "transparent",
              /*
               * backdrop-filter ici = blur localisé sur le bouton uniquement.
               * Il floute le contenu qui passe en dessous de ce bouton au scroll.
               */
              backdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
              WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
            }}
            className={cn(
              "w-full rounded-2xl overflow-hidden",
              "relative flex items-center gap-3 px-4 py-3",
              // Fond semi-transparent pour que le blur soit visible
              "bg-vd-card-surface/55",
              "shadow-[0_2px_32px_rgba(0,0,0,0.2)]",
              "border border-vd-border-soft",
            )}
          >
            {/* Lueur orange subtile */}
            <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,110,15,0.06),transparent_55%)] pointer-events-none" />

            {/* Icône + badge compteur */}
            <div className={cn(
              "relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-[rgba(245,110,15,0.18)] border border-[rgba(245,110,15,0.28)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_2px_8px_rgba(245,110,15,0.18)]",
            )}>
              <CalendarCheck className="w-5 h-5 text-[#F56E0F]" strokeWidth={1.8} />
              <motion.span
                key={totalCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-[#F56E0F] text-[#FBFBFB] text-[10px] font-black flex items-center justify-center shadow-[0_2px_8px_rgba(245,110,15,0.5)] px-1"
              >
                {totalCount}
              </motion.span>
            </div>

            {/* Texte */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-bold text-foreground/90 leading-none">{t("planner.title")}</span>
                {hasConflicts && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">{t("planner.conflict")}</span>
                  </motion.div>
                )}
              </div>

              {nextEvent ? (
                <div className="flex items-center gap-1 text-[11px] text-foreground/40 truncate">
                  <Clock className="w-3 h-3 shrink-0 text-[#F56E0F]/60" strokeWidth={1.5} />
                  <span className="truncate">
                    <span className="text-[#F56E0F]/80 font-semibold">{nextEvent.startTime}</span>
                    {" · "}
                    <span className="truncate">{nextEvent.title}</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-foreground/30">
                  <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                  <span>{t("planner.empty")}</span>
                </div>
              )}
            </div>

            {/* Dots + chevron */}
            <div className="flex items-center gap-3 shrink-0">
              <DayDots agendaByDay={agendaByDay} />
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-foreground/7 border border-foreground/8">
                <ChevronRight className="w-3.5 h-3.5 text-foreground/40" strokeWidth={2.5} />
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}