"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sun, Wind, Droplets, Bell, Search, X, MapPin,
  CloudRain, Cloud, Zap, Thermometer, Eye, Gauge,
  ChevronRight, Clock, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { WeatherData } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────────────────────

type View = "idle" | "weather" | "notifications" | "search";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "ritual" | "alert" | "info" | "live";
}

export interface DynamicIslandProps {
  weather?: WeatherData;
  logoSrc?: string;
  logoMerged?: boolean;
  onLogoMerge?: () => void;
  onLogoSeparate?: () => void;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const defaultWeather: WeatherData = {
  temperature: 28,
  condition: "Ensoleillé",
  icon: "sun",
  high: 34,
  low: 22,
  wind: 12,
  humidity: 65,
  uv: 9,
  location: "Ouidah, Bénin",
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Procession en direct",
    body: "Cérémonie Vodun Hounvè — Temple des Pythons",
    time: "Maintenant",
    type: "live",
  },
  {
    id: 2,
    title: "Alerte météo",
    body: "Orages possibles demain après 17h",
    time: "15 min",
    type: "alert",
  },
  {
    id: 3,
    title: "Danse Zangbéto",
    body: "Commence dans 30 min · Place des Enchanteurs",
    time: "30 min",
    type: "ritual",
  },
  {
    id: 4,
    title: "Nouveau site ajouté",
    body: "Forêt sacrée de Kpassè — carte mise à jour",
    time: "1h",
    type: "info",
  },
];

const SEARCH_SUGGESTIONS = [
  "Cérémonie d'ouverture",
  "Temple des Pythons",
  "Danse Zangbéto",
  "Forêt Kpassè",
  "Route des Esclaves",
  "Masques Egungun",
];

// ─── Weather icon resolver ──────────────────────────────────────────────────────

function WeatherIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const map: Record<string, React.ElementType> = {
    sun: Sun,
    rain: CloudRain,
    cloud: Cloud,
    storm: Zap,
  };
  const Icon = map[icon] ?? Sun;
  return <Icon className={className} strokeWidth={1.5} />;
}

// ─── Notification type config ───────────────────────────────────────────────────

const notifConfig = {
  live:   { dot: "bg-red-500",    accent: "border-l-red-500/60",   label: "Live",    labelColor: "text-red-400"    },
  alert:  { dot: "bg-amber-400",  accent: "border-l-amber-400/60", label: "Alerte",  labelColor: "text-amber-400"  },
  ritual: { dot: "bg-[#F56E0F]",  accent: "border-l-[#F56E0F]/60", label: "Rituel",  labelColor: "text-[#F56E0F]"  },
  info:   { dot: "bg-blue-400",   accent: "border-l-blue-400/60",  label: "Info",    labelColor: "text-blue-400"   },
};

// ─── Hourly forecast fallback (si l'API météo n'a pas encore répondu) ──────────

const HOURLY_FALLBACK = [
  { h: "09h", t: 26, icon: "sun"   },
  { h: "12h", t: 31, icon: "sun"   },
  { h: "15h", t: 34, icon: "cloud" },
  { h: "18h", t: 30, icon: "rain"  },
  { h: "21h", t: 25, icon: "cloud" },
];

// ─── Glass style tokens ────────────────────────────────────────────────────────

const GLASS = {
  outer: "bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.02)_100%)]",
  inner: "bg-[rgba(18,18,22,0.72)] [backdrop-filter:blur(24px)_saturate(200%)]",
  shadow: "shadow-[0_8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
  border: "border border-white/[0.09]",
};

// ─── WeatherView ────────────────────────────────────────────────────────────────

function WeatherView({ weather }: { weather: WeatherData }) {
  // Prévisions réelles si disponibles, sinon fallback statique
  const hourlyData = weather.hourly?.length ? weather.hourly : HOURLY_FALLBACK;

  return (
    <div className="px-4 pt-2 pb-5">

      {/* Main row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-end gap-3">
          {/* Temp */}
          <div className="relative">
            <span className="text-[64px] font-thin text-white leading-none tracking-[-0.04em]">
              {weather.temperature}
            </span>
            <span className="absolute top-3 -right-4 text-[22px] font-light text-white/50">°</span>
          </div>
          <div className="pb-2">
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#F56E0F]/80 mb-0.5">
              {weather.condition}
            </p>
            <div className="flex items-center gap-1 text-white/35 text-[11px]">
              <MapPin className="w-2.5 h-2.5 shrink-0" strokeWidth={1.5} />
              <span>{weather.location}</span>
            </div>
          </div>
        </div>

        {/* Icon + hi/lo */}
        <div className="flex flex-col items-end gap-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/10 border border-amber-400/20 flex items-center justify-center">
            <WeatherIcon icon={weather.icon} className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-right">
            <span className="text-[12px] text-white/50 font-mono">
              ↑{weather.high}° ↓{weather.low}°
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { Icon: Wind,        val: `${weather.wind}`,  unit: "km/h", label: "Vent"     },
          { Icon: Droplets,    val: `${weather.humidity}`, unit: "%", label: "Humidité" },
          { Icon: Eye,         val: `${weather.uv}`,    unit: "UV",  label: "Index UV"  },
          { Icon: Gauge,       val: "1012",              unit: "hPa", label: "Pression"  },
        ].map(({ Icon, val, unit, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-white/[0.04] border border-white/[0.06]"
          >
            <Icon className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            <div className="text-center leading-none">
              <span className="text-[13px] font-semibold text-white/80 tabular-nums">{val}</span>
              <span className="text-[9px] text-white/30 ml-0.5">{unit}</span>
            </div>
            <span className="text-[9px] text-white/25 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Hourly strip */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2.5 font-medium">
        Prévisions du jour
      </p>
      <div className="flex items-end gap-2">
        {hourlyData.map((h, i) => {
          const maxT = Math.max(...hourlyData.map(x => x.t));
          const minT = Math.min(...hourlyData.map(x => x.t));
          const pct  = ((h.t - minT) / (maxT - minT)) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-white/40 font-mono">{h.t}°</span>
              {/* Bar */}
              <div className="w-full h-10 rounded-full bg-white/[0.05] relative overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute bottom-0 left-0 right-0 rounded-full"
                  style={{
                    background: `linear-gradient(to top, rgba(245,110,15,${0.3 + pct * 0.004}), rgba(245,110,15,0.05))`,
                  }}
                />
              </div>
              <WeatherIcon icon={h.icon} className="w-3 h-3 text-white/30" />
              <span className="text-[9px] text-white/30 font-mono">{h.h}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NotificationsView ──────────────────────────────────────────────────────────

function NotificationsView({
  notifications,
  onDelete,
}: {
  notifications: Notification[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="px-4 pt-2 pb-5">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Bell className="w-8 h-8 text-white/10" strokeWidth={1} />
          <p className="text-white/25 text-[13px]">Aucune notification</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {notifications.map((n) => {
              const cfg = notifConfig[n.type];
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "relative flex items-start gap-3 p-3 rounded-2xl",
                      "bg-white/[0.04] border border-white/[0.07]",
                      "border-l-2",
                      cfg.accent
                    )}
                  >
                    {/* Dot */}
                    <div className="pt-1 shrink-0">
                      <span className={cn("block w-1.5 h-1.5 rounded-full", cfg.dot)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider", cfg.labelColor)}>
                          {cfg.label}
                        </span>
                        {n.type === "live" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/20">
                            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase text-red-400 tracking-widest">Live</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-medium text-white leading-tight truncate">{n.title}</p>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">{n.body}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-white/20 text-[10px]">
                        <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
                        <span>{n.time}</span>
                      </div>
                      <button
                        onClick={() => onDelete(n.id)}
                        className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10 active:scale-90 transition-all"
                        aria-label="Supprimer"
                      >
                        <X className="w-2.5 h-2.5 text-white/20 hover:text-white/50 transition-colors" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── SearchView ──────────────────────────────────────────────────────────────────

function SearchView({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const filtered = query.length > 0
    ? SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_SUGGESTIONS;

  return (
    <div className="px-4 pt-2 pb-5">
      {/* Input */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white/[0.07] border border-white/[0.1] mb-4 focus-within:border-[#F56E0F]/40 transition-colors">
        <Search className="w-4 h-4 text-white/30 shrink-0" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Lieu, événement, cérémonie…"
          className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/25 outline-none caret-[#F56E0F]"
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-3 h-3 text-white/30" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Section header */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2.5 font-medium px-0.5">
        {query.length > 0 ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}` : "Suggestions"}
      </p>

      {/* Results */}
      <div className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.button
              key={s}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] active:scale-[0.98] transition-all group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#F56E0F]/10 border border-[#F56E0F]/15 flex items-center justify-center shrink-0">
                  <Flame className="w-3 h-3 text-[#F56E0F]/60" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] text-white/70 group-hover:text-white/90 transition-colors">
                  {s}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors" strokeWidth={1.5} />
            </motion.button>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/25 text-[13px] py-4"
          >
            Aucun résultat pour « {query} »
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── ExpandedHeader ─────────────────────────────────────────────────────────────

function ExpandedHeader({
  logoSrc,
  label,
  onClose,
  logoMerged,
}: {
  logoSrc: string;
  label: string;
  onClose: () => void;
  logoMerged: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-2">
        {logoMerged && (
          <motion.div
            layoutId="vodun-logo"
            className="relative w-6 h-6 shrink-0"
            transition={{ type: "spring", bounce: 0.22, duration: 0.42 }}
          >
            <Image src={logoSrc} alt="Vodun Days" fill className="rounded-full object-contain" />
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="text-[13px] font-semibold text-white/70 tracking-tight"
        >
          {label}
        </motion.span>
      </div>
      <button
        onClick={onClose}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.07] hover:bg-white/[0.12] active:scale-90 transition-all"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────────

function HairlineDivider() {
  return (
    <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  );
}

// ─── CloseHandle ────────────────────────────────────────────────────────────────

function CloseHandle({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="flex items-center justify-center w-full pt-1.5 pb-3 group"
      aria-label="Fermer"
    >
      <div className="w-9 h-1 rounded-full bg-white/[0.08] group-hover:bg-white/[0.18] transition-colors" />
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function WeatherWidget({
  weather = defaultWeather,
  logoSrc = "/images/logo.png",
  logoMerged = false,
  onLogoMerge,
  onLogoSeparate,
}: DynamicIslandProps) {
  const [view, setView]     = useState<View>("idle");
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const shouldReduceMotion  = useReducedMotion();
  const closeTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = view !== "idle";

  const openView = useCallback((v: View) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setView(v);
    onLogoMerge?.();
  }, [onLogoMerge]);

  const close = useCallback(() => {
    setView("idle");
    closeTimerRef.current = setTimeout(() => {
      onLogoSeparate?.();
      closeTimerRef.current = null;
    }, 300);
  }, [onLogoSeparate]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const deleteNotif = useCallback((id: number) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  // Labels for expanded header
  const viewLabels: Record<View, string> = {
    idle: "",
    weather: "Météo",
    notifications: notifs.length > 0
      ? `${notifs.length} notification${notifs.length > 1 ? "s" : ""}`
      : "Notifications",
    search: "Rechercher",
  };

  return (
    <>
      {/* ── Fixed container — always top-right, never moves ── */}
      <div className="fixed z-50 top-0 right-0 pointer-events-none pt-[max(10px,env(safe-area-inset-top))] pr-3">

        {/* ── IDLE PILL — always rendered, fades out when expanded ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.85 : 1 }}
          transition={{ duration: 0.18, ease: [0.32, 0, 0.67, 0] }}
          style={{ pointerEvents: isExpanded ? "none" : "auto" }}
          className={cn("p-px", GLASS.outer, GLASS.shadow, "rounded-full")}
        >
          <div className={cn("flex items-center gap-0.5 px-1.5 py-1.5 rounded-full overflow-hidden", GLASS.inner, GLASS.border)}>
            {/* Météo */}
            <button
              onClick={() => openView("weather")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150 group"
            >
              <WeatherIcon icon={weather.icon} className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-semibold text-white/90 tabular-nums">{weather.temperature}°</span>
            </button>
            {/* Séparateur */}
            <div className="w-px h-3.5 bg-white/[0.1] mx-0.5" />
            {/* Notifications */}
            <button
              onClick={() => openView("notifications")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150"
              aria-label={`${notifs.length} notifications`}
            >
              <Bell className="w-[15px] h-[15px] text-white/55" strokeWidth={1.5} />
              {notifs.length > 0 && (
                <span className="absolute top-[7px] right-[7px] min-w-[6px] h-[6px] rounded-full bg-red-500 ring-[1.5px] ring-[rgba(18,18,22,0.9)]" />
              )}
            </button>
            {/* Recherche */}
            <button
              onClick={() => openView("search")}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150"
              aria-label="Recherche"
            >
              <Search className="w-[15px] h-[15px] text-white/55" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* ── EXPANDED PANEL — scales from top-right corner ── */}
        <motion.div
          initial={false}
          animate={isExpanded
            ? { opacity: 1,   scale: 1,    y: 0    }
            : { opacity: 0,   scale: 0.72, y: -8   }
          }
          transition={shouldReduceMotion
            ? { duration: 0 }
            : isExpanded
              ? { type: "spring", stiffness: 320, damping: 28, mass: 0.9 }
              : { duration: 0.22, ease: [0.32, 0, 0.67, 0] }
          }
          style={{
            transformOrigin: "top right",
            pointerEvents: isExpanded ? "auto" : "none",
            position: "absolute",
            top: "max(10px, env(safe-area-inset-top))",
            right: 0,
            width: "min(360px, calc(100vw - 24px))",
          }}
          className={cn("p-px rounded-[32px]", GLASS.outer, GLASS.shadow)}
        >
          <div className={cn("rounded-[31px] overflow-hidden", GLASS.inner, GLASS.border)}>

            {/* Content fades between views */}
            <AnimatePresence mode="wait" initial={false}>
              {view === "weather" && (
                <motion.div key="weather"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.weather} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <WeatherView weather={weather} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
              {view === "notifications" && (
                <motion.div key="notifs"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.notifications} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <NotificationsView notifications={notifs} onDelete={deleteNotif} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
              {view === "search" && (
                <motion.div key="search"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.search} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <SearchView onClose={close} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/40 [backdrop-filter:blur(4px)]"
          />
        )}
      </AnimatePresence>
    </>
  );
}