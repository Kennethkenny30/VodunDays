"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarCheck, Clock, MapPin, Trash2,
  AlertTriangle, Sparkles, ChevronDown, ChevronUp,
  Route, Calendar, Zap,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FestivalPlannerProvider, usePlanner, type AgendaItem } from "@/providers/FestivalPlannerProvider";
import type { ProgramType } from "@/lib/types";

// ── Tokens ────────────────────────────────────────────────────────────────────

const GLASS_CARD = [
  "bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_100%)]",
  "[backdrop-filter:blur(20px)_saturate(180%)]",
  "border border-white/[0.09]",
  "shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
].join(" ");

const typeColors: Record<ProgramType, { dot: string; pill: string; text: string }> = {
  RITUAL:     { dot: "bg-[#F56E0F]",  pill: "bg-[rgba(245,110,15,0.18)] border-[rgba(245,110,15,0.35)]",  text: "text-[#F56E0F]"  },
  ANIMATION:  { dot: "bg-orange-400", pill: "bg-[rgba(251,146,60,0.15)] border-[rgba(251,146,60,0.30)]",  text: "text-orange-400" },
  CONCERT:    { dot: "bg-amber-400",  pill: "bg-[rgba(251,191,36,0.12)] border-[rgba(251,191,36,0.25)]",  text: "text-amber-400"  },
  EXHIBITION: { dot: "bg-sky-400",    pill: "bg-[rgba(56,189,248,0.10)] border-[rgba(56,189,248,0.22)]",  text: "text-sky-400"    },
  CONFERENCE: { dot: "bg-violet-400", pill: "bg-[rgba(167,139,250,0.10)] border-[rgba(167,139,250,0.22)]",text: "text-violet-400" },
};

const typeLabels: Record<ProgramType, string> = {
  RITUAL: "Rituel", ANIMATION: "Animation", CONCERT: "Concert",
  EXHIBITION: "Exposition", CONFERENCE: "Conférence",
};

const DAY_NAMES: Record<number, string> = { 1: "Jour 1 - Vendredi", 2: "Jour 2 - Samedi", 3: "Jour 3 - Dimanche" };
const DAY_DATES: Record<number, string> = { 1: "10 Janv.", 2: "11 Janv.", 3: "12 Janv." };

function getDurationMin(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={cn(
          "w-20 h-20 rounded-3xl flex items-center justify-center mb-6",
          "bg-[rgba(245,110,15,0.10)] border border-[rgba(245,110,15,0.20)]",
          "shadow-[0_8px_32px_rgba(245,110,15,0.10),inset_0_1px_0_rgba(255,255,255,0.08)]",
        )}
      >
        <Calendar className="w-9 h-9 text-[#F56E0F]/70" strokeWidth={1.4} />
      </motion.div>
      <h3 className="text-[20px] font-black text-white/80 mb-2 tracking-tight">Agenda vide</h3>
      <p className="text-[14px] text-white/35 leading-relaxed mb-8 max-w-xs">
        Ajoutez des événements depuis la page Programme pour construire votre expérience Vodun Days.
      </p>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onBack}
        className={cn(
          "px-6 py-3 rounded-2xl",
          "bg-[rgba(245,110,15,0.20)] border border-[rgba(245,110,15,0.35)]",
          "text-[#F56E0F] text-[14px] font-bold",
          "shadow-[0_4px_16px_rgba(245,110,15,0.18),inset_0_1px_0_rgba(255,255,255,0.10)]",
          "active:scale-[0.97] transition-all duration-150",
        )}
      >
        Découvrir le programme
      </motion.button>
    </motion.div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ agenda, conflicts }: { agenda: AgendaItem[]; conflicts: string[] }) {
  const totalDays = new Set(agenda.map(e => e.day)).size;
  const totalMin  = agenda.reduce((acc, e) => acc + getDurationMin(e.startTime, e.endTime), 0);
  const totalH    = Math.floor(totalMin / 60);
  const totalM    = totalMin % 60;
  const conflictCount = Math.floor(conflicts.length / 2);

  const stats = [
    { icon: CalendarCheck, value: String(agenda.length),                   label: "Événements", color: "text-[#F56E0F]"  },
    { icon: Clock,         value: `${totalH}h${totalM > 0 ? totalM : ""}`, label: "Durée",      color: "text-amber-400"  },
    { icon: Calendar,      value: String(totalDays),                        label: `Jour${totalDays > 1 ? "s" : ""}`, color: "text-sky-400" },
    { icon: AlertTriangle, value: String(conflictCount),                    label: "Conflits",   color: conflictCount > 0 ? "text-amber-400" : "text-white/20" },
  ];

  return (
    <div className={cn("grid grid-cols-4 gap-2 mx-4 mb-4 p-3 rounded-2xl", GLASS_CARD)}>
      {stats.map(({ icon: Icon, value, label, color }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <Icon className={cn("w-3.5 h-3.5 mb-0.5", color)} strokeWidth={1.8} />
          <span className={cn("text-[16px] font-black tabular-nums", color)}>{value}</span>
          <span className="text-[9px] text-white/25 text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────

function TimelineItem({
  item, index, isLast, hasConflict, onRemove,
}: {
  item: AgendaItem; index: number; isLast: boolean; hasConflict: boolean; onRemove: (id: string) => void;
}) {
  const router   = useRouter();
  const [expanded, setExpanded] = useState(false);
  const colors   = typeColors[item.type];
  const duration = getDurationMin(item.startTime, item.endTime);

  /**
   * Bouton "Itinéraire" - deep-link vers /carte avec focal sur le site.
   *
   * Priorité :
   *   1. item.siteId  → site BDD, CarteMapSection le retrouve via loadPOIs()
   *   2. item.site    → objet site complet persisté dans l'AgendaItem
   *   3. fallback     → ouvre la carte sans focal
   */
  function handleItineraire(e: React.MouseEvent) {
    e.stopPropagation();

    if (item.siteId) {
      router.push(`/carte?siteId=${item.siteId}`);
      return;
    }

    if (item.site?.latitude !== undefined && item.site?.longitude !== undefined) {
      const params = new URLSearchParams({
        lat:  String(item.site.latitude),
        lng:  String(item.site.longitude),
        name: item.site.name ?? item.location,
      });
      router.push(`/carte?${params.toString()}`);
      return;
    }

    // Dernier recours - ouvre la carte sans focal
    router.push("/carte");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 16, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex gap-3"
    >
      {/* Spine */}
      <div className="flex flex-col items-center pt-1 shrink-0" style={{ width: 36 }}>
        <div className={cn(
          "relative w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          hasConflict ? "bg-amber-500/15 border-amber-500/35" : "bg-[rgba(245,110,15,0.12)] border-[rgba(245,110,15,0.25)]",
        )}>
          <div className={cn("w-2 h-2 rounded-full", hasConflict ? "bg-amber-400" : colors.dot)} />
        </div>
        {!isLast && <div className="flex-1 w-px mt-1 bg-gradient-to-b from-white/10 to-transparent min-h-[20px]" />}
      </div>

      {/* Card */}
      <motion.div
        layout
        className={cn("flex-1 mb-3 rounded-2xl overflow-hidden cursor-pointer", GLASS_CARD, hasConflict && "border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.12)]")}
        onClick={() => setExpanded(!expanded)}
        whileTap={{ scale: 0.985 }}
      >
        {hasConflict && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/15">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Chevauchement horaire</span>
          </div>
        )}

        <div className="flex items-start gap-3 p-3">
          <div className="shrink-0 flex flex-col items-start gap-0.5">
            <span className="text-[13px] font-black text-[#F56E0F] tabular-nums leading-none">{item.startTime}</span>
            <span className="text-[10px] text-white/25 tabular-nums">{item.endTime}</span>
          </div>

          <div className={cn("w-0.5 self-stretch rounded-full mt-0.5 opacity-60", colors.dot)} />

          <div className="flex-1 min-w-0">
            <span className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide mb-1 border",
              colors.pill, colors.text,
            )}>
              {typeLabels[item.type]}
            </span>
            <h4 className="text-[14px] font-extrabold text-white/90 leading-tight truncate mb-0.5">{item.title}</h4>
            <div className="flex items-center gap-1 text-[11px] text-white/35">
              <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{item.location}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-red-500/15 hover:border-red-500/25 transition-colors"
            >
              <Trash2 className="w-3 h-3 text-white/30 hover:text-red-400 transition-colors" />
            </motion.button>
            <span className="text-[9px] text-white/20 tabular-nums">{duration}min</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/20" /> : <ChevronDown className="w-3.5 h-3.5 text-white/20" />}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-0 border-t border-white/[0.05]">
                <p className="text-[12px] text-white/40 leading-relaxed mt-2 mb-3">{item.description}</p>
                <div className="flex gap-2">
                  {/* Bouton itinéraire - deep-link /carte?siteId= */}
                  <button
                    onClick={handleItineraire}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[11px] font-bold",
                      "bg-[rgba(245,110,15,0.12)] border border-[rgba(245,110,15,0.25)] text-[#F56E0F]",
                      "active:scale-[0.97] transition-all",
                    )}
                  >
                    <Route className="w-3 h-3 inline mr-1.5 -mt-0.5" />Itinéraire
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[11px] font-bold",
                      "bg-white/[0.05] border border-white/[0.08] text-white/50",
                      "active:scale-[0.97] transition-all",
                    )}
                  >
                    <Zap className="w-3 h-3 inline mr-1.5 -mt-0.5" />Rappel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Day section ───────────────────────────────────────────────────────────────

function DaySection({ day, items, conflicts, onRemove }: { day: number; items: AgendaItem[]; conflicts: string[]; onRemove: (id: string) => void }) {
  return (
    <motion.section layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mb-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("px-2.5 py-1 rounded-xl", "bg-[rgba(245,110,15,0.15)] border border-[rgba(245,110,15,0.25)]", "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]")}>
            <span className="text-[11px] font-black text-[#F56E0F] uppercase tracking-wider">{DAY_NAMES[day]}</span>
          </div>
          <span className="text-[11px] text-white/25">{DAY_DATES[day]}</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-white/30">
          {items.length} événement{items.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="px-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLast={i === items.length - 1} hasConflict={conflicts.includes(item.id)} onRemove={onRemove} />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ── Inner page (uses context) ─────────────────────────────────────────────────

function PlannerContent() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { agenda, agendaByDay, totalCount, conflicts, removeFromAgenda, clearAgenda } = usePlanner();
  const [confirmClear, setConfirmClear] = useState(false);

  const days = Object.keys(agendaByDay).map(Number).sort();

  return (
    <div className="min-h-screen bg-[#0E0D12] flex flex-col">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[rgba(245,110,15,0.06)] blur-[80px]" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-[rgba(245,110,15,0.04)] blur-[60px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-[rgba(120,80,20,0.04)] blur-[90px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex items-center justify-between px-4 pb-4"
        style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-2xl", "bg-[rgba(255,255,255,0.06)] border border-white/[0.09]", "[backdrop-filter:blur(12px)]", "active:scale-[0.95] transition-all duration-150")}
        >
          <ArrowLeft className="w-4 h-4 text-white/60" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white/60">Programme</span>
        </motion.button>

        <div className="flex flex-col items-center">
          <h1 className="text-[16px] font-black text-white tracking-tight leading-none">Mon Festival</h1>
          <span className="text-[11px] text-white/30 mt-0.5">Agenda personnel</span>
        </div>

        {totalCount > 0 ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setConfirmClear(true)}
            className={cn("px-3 py-2 rounded-2xl", "bg-[rgba(239,68,68,0.08)] border border-red-500/[0.15]", "text-[12px] font-semibold text-red-400/70", "active:scale-[0.95] transition-all")}
          >
            Vider
          </motion.button>
        ) : (
          <div className="w-[72px]" />
        )}
      </motion.header>

      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {totalCount === 0 ? (
          <EmptyState onBack={() => router.back()} />
        ) : (
          <div className="flex-1 overflow-y-auto pb-32">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StatsBar agenda={agenda} conflicts={conflicts} />
            </motion.div>

            <AnimatePresence>
              {conflicts.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mx-4 mb-4 overflow-hidden">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-500/[0.08] border border-amber-500/[0.20]">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-bold text-amber-400 mb-0.5">Conflits horaires détectés</p>
                      <p className="text-[11px] text-amber-400/60 leading-relaxed">Certains événements se chevauchent. Réorganisez votre agenda pour profiter pleinement du festival.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {days.map((day) => (
                <DaySection key={day} day={day} items={agendaByDay[day] ?? []} conflicts={conflicts} onRemove={removeFromAgenda} />
              ))}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mx-4 mt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <Sparkles className="w-4 h-4 text-[#F56E0F]/40 shrink-0" strokeWidth={1.5} />
                <p className="text-[11px] text-white/20 leading-relaxed">Appuyez sur un événement pour voir les détails, planifier un itinéraire ou activer un rappel.</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Clear confirmation */}
      <AnimatePresence>
        {confirmClear && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmClear(false)} className="fixed inset-0 z-50 bg-black/60 [backdrop-filter:blur(6px)]" />
            <motion.div key="sheet" initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ type: "spring", stiffness: 360, damping: 28 }} className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className={cn("rounded-3xl overflow-hidden p-6", "bg-[linear-gradient(145deg,rgba(30,28,36,0.98),rgba(20,18,24,0.98))]", "border border-white/[0.10]", "shadow-[0_-8px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)]", "[backdrop-filter:blur(32px)]")}>
                <div className="w-9 h-1 rounded-full bg-white/10 mx-auto mb-5" />
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-red-400" strokeWidth={1.6} />
                  </div>
                  <h3 className="text-[18px] font-black text-white mb-1">Vider l&apos;agenda ?</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed max-w-xs">Tous vos {totalCount} événements planifiés seront supprimés. Cette action est irréversible.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmClear(false)} className={cn("flex-1 py-3.5 rounded-2xl bg-white/[0.07] border border-white/[0.09] text-[14px] font-bold text-white/60 active:scale-[0.97] transition-all")}>Annuler</button>
                  <button onClick={() => { clearAgenda(); setConfirmClear(false); }} className={cn("flex-1 py-3.5 rounded-2xl bg-red-500/20 border border-red-500/30 text-[14px] font-bold text-red-400 active:scale-[0.97] transition-all")}>Vider l&apos;agenda</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Default export ────────────────────────────────────────────────────────────

export default function PlannerPage() {
  return (
    <FestivalPlannerProvider>
      <PlannerContent />
    </FestivalPlannerProvider>
  );
}