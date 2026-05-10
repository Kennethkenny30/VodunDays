"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sun, Wind, Droplets, Bell, Search, Moon, SunMedium, X, MapPin, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { WeatherData } from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

type View = "idle" | "weather" | "notifications" | "search";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  icon: string;
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
  { id: 1, title: "Cérémonie ce soir", body: "Procession Vodun — 20h00", time: "2m", icon: "🔥" },
  { id: 2, title: "Alerte météo", body: "Orages possibles demain", time: "15m", icon: "⛈️" },
  { id: 3, title: "Nouveau lieu", body: "Temple Python ajouté", time: "1h", icon: "📍" },
];

// ─── Glass style (matches BottomNav) ───────────────────────────────────────────
// Outer: gradient border p-px  |  Inner: rgba(30,30,30,0.55) + blur
const GLASS_GRADIENT = "bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_100%)]";
const GLASS_BG       = "bg-[rgba(30,30,30,0.55)]";
const GLASS_BLUR     = "[backdrop-filter:blur(10px)_saturate(180%)]";
const GLASS_SHADOW   = "shadow-[0_8px_32px_rgba(0,0,0,0.4)]";

// ─── Sub-views ──────────────────────────────────────────────────────────────────

function WeatherView({ weather }: { weather: WeatherData }) {
  return (
    <div className="px-5 pt-1 pb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Sun className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[38px] font-semibold text-white leading-none tracking-tight">
              {weather.temperature}°
            </p>
            <p className="text-[11px] text-white/50 mt-1 tracking-wider uppercase">
              {weather.condition}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-white/40 text-xs mb-1">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            <span>{weather.location}</span>
          </div>
          <p className="text-white/30 text-xs">H : {weather.high}°  L : {weather.low}°</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { Icon: Wind,     val: `${weather.wind} km/h`, label: "Vent"     },
          { Icon: Droplets, val: `${weather.humidity}%`, label: "Humidité" },
          { Icon: Sun,      val: `UV ${weather.uv}`,     label: "Index UV" },
        ].map(({ Icon, val, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/6 border border-white/[0.07]">
            <Icon className="w-4 h-4 text-white/35" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-white/80">{val}</span>
            <span className="text-[10px] text-white/30">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsView({
  notifications,
  onDelete,
}: {
  notifications: Notification[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="px-4 pt-1 pb-5">
      <p className="text-[10px] uppercase tracking-widest text-white/25 mb-3 px-1">Récentes</p>
      {notifications.length === 0 ? (
        <p className="text-center text-white/25 text-sm py-4">Aucune notification</p>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.06] border border-white/[0.07]">
                  <span className="text-xl leading-none">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{n.title}</p>
                    <p className="text-[11px] text-white/40 truncate">{n.body}</p>
                  </div>
                  <span className="text-[10px] text-white/25 shrink-0 mr-1">{n.time}</span>
                  <button
                    onClick={() => onDelete(n.id)}
                    className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 active:scale-90 transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3 text-white/30 hover:text-red-400 transition-colors" strokeWidth={1.8} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function SearchView({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 pt-1 pb-5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.08] border border-white/[0.1] mb-3">
        <Search className="w-4 h-4 text-white/40 shrink-0" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Lieu, événement, artiste…"
          className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/30 outline-none"
        />
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-3.5 h-3.5 text-white/40" strokeWidth={2} />
        </button>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2 px-1">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {["Ouidah", "Temple Python", "Cotonou", "Procession", "Zangbéto"].map((s) => (
          <button
            key={s}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 text-[12px] hover:bg-white/12 hover:text-white/80 transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Expanded header ────────────────────────────────────────────────────────────

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
    <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.07]">
      <div className="flex items-center gap-2.5">
        {logoMerged && (
          <motion.div
            layoutId="vodun-logo"
            className="relative w-7 h-7 shrink-0"
            transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
          >
            <Image src={logoSrc} alt="Vodun Days" fill className="rounded-full object-contain" />
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.18 }}
          className="text-[13px] font-semibold text-white/80"
        >
          {label}
        </motion.span>
      </div>
      <button
        onClick={onClose}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/14 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-white/60" strokeWidth={2} />
      </button>
    </div>
  );
}

function CloseHandle({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="flex items-center justify-center w-full pt-1 pb-3 group">
      <div className="w-10 h-1 rounded-full bg-white/15 group-hover:bg-white/30 transition-colors" />
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
  const [view, setView]           = useState<View>("idle");
  const [theme, setTheme]         = useState<"light" | "dark">("dark");
  const [notifs, setNotifs]       = useState<Notification[]>(initialNotifications);
  const shouldReduceMotion        = useReducedMotion();
  const closeTimerRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = view !== "idle";

  // Open a view — triggers logo merge
  const openView = useCallback((v: View) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setView(v);
    onLogoMerge?.();
  }, [onLogoMerge]);

  // Close — island shrinks first, then logo flies back
  const close = useCallback(() => {
    setView("idle");
    closeTimerRef.current = setTimeout(() => {
      onLogoSeparate?.();
      closeTimerRef.current = null;
    }, 320);
  }, [onLogoSeparate]);

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Toggle theme inline — no island open
  const toggleTheme = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setTheme(t => t === "dark" ? "light" : "dark");
  }, []);

  const deleteNotif = useCallback((id: number) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  // Spring config — tuned for smoothness, no bounce on close
  const expandSpring  = { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.9 };
  const collapseSpring = { type: "spring" as const, stiffness: 380, damping: 40, mass: 0.8 };
  const layoutSpring  = isExpanded ? expandSpring : collapseSpring;
  const transition    = shouldReduceMotion ? { duration: 0 } : layoutSpring;

  const activeNotifCount = notifs.length;

  return (
    <>
      {/* ── Fixed island ── */}
      <div
        className={cn(
          // PWA safe-area: padding-top accounts for status bar on all devices
          "fixed z-50 flex pointer-events-none",
          "pt-[max(12px,env(safe-area-inset-top))]",
          isExpanded
            ? "top-0 inset-x-0 justify-center px-4"
            : "top-0 right-0 px-4"
        )}
      >
        {/* Gradient border wrapper — matches BottomNav technique */}
        <motion.div
          layout
          layoutRoot
          className={cn(
            "pointer-events-auto p-px",
            GLASS_GRADIENT,
            GLASS_SHADOW,
            isExpanded ? "w-full max-w-sm" : ""
          )}
          style={{ borderRadius: isExpanded ? 28 : 9999 }}
          transition={transition}
        >
          {/* Glass inner — same rgba + blur as BottomNav */}
          <motion.div
            layout
            className={cn("overflow-hidden", GLASS_BG, GLASS_BLUR)}
            style={{ borderRadius: isExpanded ? 27 : 9999 }}
            transition={transition}
          >
            <AnimatePresence mode="wait" initial={false}>

              {/* ── IDLE pill ── */}
              {view === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  className="flex items-center gap-0.5 px-1.5 py-1.5"
                >
                  {/* Météo */}
                  <button
                    onClick={() => openView("weather")}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold text-white">{weather.temperature}°</span>
                  </button>

                  <div className="w-px h-4 bg-white/12 mx-0.5" />

                  {/* Notifications */}
                  <button
                    onClick={() => openView("notifications")}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <Bell className="w-4 h-4 text-white/65" strokeWidth={1.5} />
                    {activeNotifCount > 0 && (
                      <span className="absolute top-1.75 right-1.75 w-1.75 h-1.75 rounded-full bg-red-500 ring-[1.5px] ring-[rgba(30,30,30,0.9)]" />
                    )}
                  </button>

                  {/* Recherche */}
                  <button
                    onClick={() => openView("search")}
                    className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <Search className="w-4 h-4 text-white/65" strokeWidth={1.5} />
                  </button>

                  {/* Thème — toggle direct, pas d'ouverture */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {theme === "dark" ? (
                        <motion.div key="moon"
                          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                          exit={{    rotate: 30,  opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon className="w-4 h-4 text-indigo-300" strokeWidth={1.5} />
                        </motion.div>
                      ) : (
                        <motion.div key="sun"
                          initial={{ rotate: 30,  opacity: 0, scale: 0.7 }}
                          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                          exit={{    rotate: -30, opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SunMedium className="w-4 h-4 text-amber-300" strokeWidth={1.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              )}

              {/* ── MÉTÉO expanded ── */}
              {view === "weather" && (
                <motion.div
                  key="weather-exp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <ExpandedHeader logoSrc={logoSrc} label="Météo" onClose={close} logoMerged={logoMerged} />
                  <WeatherView weather={weather} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}

              {/* ── NOTIFICATIONS expanded ── */}
              {view === "notifications" && (
                <motion.div
                  key="notifs-exp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <ExpandedHeader
                    logoSrc={logoSrc}
                    label={activeNotifCount > 0 ? `${activeNotifCount} notification${activeNotifCount > 1 ? "s" : ""}` : "Notifications"}
                    onClose={close}
                    logoMerged={logoMerged}
                  />
                  <NotificationsView notifications={notifs} onDelete={deleteNotif} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}

              {/* ── SEARCH expanded ── */}
              {view === "search" && (
                <motion.div
                  key="search-exp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <ExpandedHeader logoSrc={logoSrc} label="Recherche" onClose={close} logoMerged={logoMerged} />
                  <SearchView onClose={close} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
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
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </>
  );
}