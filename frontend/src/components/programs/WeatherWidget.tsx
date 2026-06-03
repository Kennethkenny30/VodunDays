"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sun, Wind, Droplets, Bell, Search, X, MapPin,
  CloudRain, Cloud, Zap, Thermometer, Eye, Gauge,
  ChevronRight, Clock, Flame, ShieldAlert,
  Stethoscope, ShieldCheck, UserX, AlertTriangle,
  ChevronLeft, Send, CheckCircle2,
  HeartPulse, Car, Swords, Baby, Siren,
  PersonStanding, HelpCircle, Lock, EyeOff,
  Radio, Loader2, UserCheck, CircleCheck, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { WeatherData } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "idle" | "weather" | "notifications" | "search" | "emergency" | "tracking";

type TrackingStatus = "EN_ATTENTE" | "RECU" | "EN_COURS" | "RESOLU";

interface TrackingEvent {
  status: TrackingStatus;
  label:  string;
  detail: string;
  time:   string;
}

interface AlertRequest {
  ref:       string;
  _dbId?:    string; // UUID BDD retourné par POST /api/urgences
  service:   EmergencyService;
  type:      EmergencyType;
  name:      string;
  status:    TrackingStatus;
  createdAt: string;
  timeline:  TrackingEvent[];
}

type EmergencyService = "SOINS_MEDICAUX" | "POLICE" | "SECURITE_FESTIVAL";
type EmergencyType =
  | "MALAISE" | "BLESSURE" | "INCONSCIENT" | "ACCOUCHEMENT"
  | "ALTERCATION" | "VOL" | "AGRESSION" | "PERSONNE_DISPARUE"
  | "BOUSCULADE" | "INTRUSION" | "OBJET_SUSPECT" | "INCENDIE";
type EmergencyStep    = 1 | 2 | 3;

interface EmergencyForm {
  service:     EmergencyService | null;
  type:        EmergencyType    | null;
  name:        string;
  description: string;
}

interface Notification {
  id:    number;
  _uid?: string; // uuid BDD — présent sur les notifs chargées depuis l'API
  title: string;
  body:  string;
  time:  string;
  type:  "ritual" | "alert" | "info" | "live";
}

export interface DynamicIslandProps {
  weather?:        WeatherData;
  logoSrc?:        string;
  logoMerged?:     boolean;
  onLogoMerge?:    () => void;
  onLogoSeparate?: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// ─── UUID festivalier persisté ────────────────────────────────────────────────

function getOrCreateUUID(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let uuid = localStorage.getItem("vd_uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("vd_uuid", uuid);
  }
  return uuid;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultWeather: WeatherData = {
  temperature: 28,
  condition:   "Ensoleillé",
  icon:        "sun",
  high:        34,
  low:         22,
  wind:        12,
  humidity:    65,
  uv:          9,
  location:    "Ouidah, Bénin",
};

// ─── Notification helpers ─────────────────────────────────────────────────────

/** Déduit un type visuel depuis le titre de la notification BDD */
function inferNotifType(title: string): Notification["type"] {
  const t = title.toLowerCase();
  if (t.includes("live") || t.includes("direct") || t.includes("procession")) return "live";
  if (t.includes("alerte") || t.includes("urgent") || t.includes("météo"))    return "alert";
  if (t.includes("rituel") || t.includes("vodun") || t.includes("zangbéto")
   || t.includes("cérémonie") || t.includes("danse"))                          return "ritual";
  return "info";
}

/** Formate une date ISO en durée relative courte */
function formatRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 60)           return "Maintenant";
  if (diff < 3600)         return `${Math.floor(diff / 60)} min`;
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

/** Type retourné par GET /api/notifications */
interface BackendNotification {
  id:          string;
  title:       string;
  message:     string;
  status:      string;
  sentAt:      string | null;
  createdAt:   string;
}

/** Mappe une notification BDD vers le type interne du widget */
function mapNotification(n: BackendNotification, idx: number): Notification {
  return {
    id:   idx,           // numérique interne pour AnimatePresence
    _uid: n.id,          // uuid BDD pour identifier lors de la suppression
    title: n.title,
    body:  n.message,
    time:  formatRelativeTime(n.sentAt ?? n.createdAt),
    type:  inferNotifType(n.title),
  };
}

const HOURLY_FALLBACK = [
  { h: "09h", t: 26, icon: "sun"   },
  { h: "12h", t: 31, icon: "sun"   },
  { h: "15h", t: 34, icon: "cloud" },
  { h: "18h", t: 30, icon: "rain"  },
  { h: "21h", t: 25, icon: "cloud" },
];

// ─── Emergency config ─────────────────────────────────────────────────────────

const SERVICES: { id: EmergencyService; label: string; icon: React.ElementType; color: string; border: string; text: string; bg: string }[] = [
  {
    id:     "SOINS_MEDICAUX",
    label:  "Soins Médicaux",
    icon:   Stethoscope,
    color:  "text-emerald-400",
    border: "border-emerald-500/30",
    text:   "text-emerald-400",
    bg:     "bg-[rgba(16,185,129,0.12)]",
  },
  {
    id:     "POLICE",
    label:  "Police",
    icon:   ShieldCheck,
    color:  "text-blue-400",
    border: "border-blue-500/30",
    text:   "text-blue-400",
    bg:     "bg-[rgba(59,130,246,0.12)]",
  },
  {
    id:     "SECURITE_FESTIVAL",
    label:  "Sécurité Festival",
    icon:   ShieldAlert,
    color:  "text-[#F56E0F]",
    border: "border-[rgba(245,110,15,0.30)]",
    text:   "text-[#F56E0F]",
    bg:     "bg-[rgba(245,110,15,0.12)]",
  },
];

const TYPES: { id: EmergencyType; label: string; icon: React.ElementType }[] = [
  // Soins Médicaux
  { id: "MALAISE",          label: "Malaise médical",    icon: HeartPulse      },
  { id: "BLESSURE",         label: "Blessure",           icon: AlertTriangle   },
  { id: "INCONSCIENT",      label: "Personne inconsciente", icon: UserX        },
  { id: "ACCOUCHEMENT",     label: "Accouchement",       icon: Baby            },
  // Police
  { id: "ALTERCATION",      label: "Altercation",        icon: Swords          },
  { id: "VOL",              label: "Vol",                icon: Lock            },
  { id: "AGRESSION",        label: "Agression",          icon: ShieldAlert     },
  { id: "PERSONNE_DISPARUE",label: "Personne disparue",  icon: EyeOff          },
  // Sécurité Festival
  { id: "BOUSCULADE",       label: "Bousculade",         icon: PersonStanding  },
  { id: "INTRUSION",        label: "Intrusion",          icon: Siren           },
  { id: "OBJET_SUSPECT",    label: "Objet suspect",      icon: HelpCircle      },
  { id: "INCENDIE",         label: "Incendie",           icon: Flame           },
];

/** Types d'urgence disponibles selon le service sélectionné */
const SERVICE_TYPES: Record<EmergencyService, EmergencyType[]> = {
  SOINS_MEDICAUX:    ["MALAISE", "BLESSURE", "INCONSCIENT", "ACCOUCHEMENT"],
  POLICE:            ["ALTERCATION", "VOL", "AGRESSION", "PERSONNE_DISPARUE"],
  SECURITE_FESTIVAL: ["BOUSCULADE", "INTRUSION", "OBJET_SUSPECT", "INCENDIE"],
};

// ─── Glass tokens ─────────────────────────────────────────────────────────────

const GLASS = {
  outer:  "bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.02)_100%)]",
  inner:  "bg-[rgba(18,18,22,0.72)] [backdrop-filter:blur(24px)_saturate(200%)]",
  shadow: "shadow-[0_8px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
  border: "border border-white/[0.09]",
};

// ─── WeatherIcon ──────────────────────────────────────────────────────────────

function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  const map: Record<string, React.ElementType> = {
    sun: Sun, rain: CloudRain, cloud: Cloud, storm: Zap,
  };
  const Icon = map[icon] ?? Sun;
  return <Icon className={className} strokeWidth={1.5} />;
}

// ─── notifConfig ──────────────────────────────────────────────────────────────

const notifConfig = {
  live:   { dot: "bg-red-500",    accent: "border-l-red-500/60",   label: "Live",   labelColor: "text-red-400"   },
  alert:  { dot: "bg-amber-400",  accent: "border-l-amber-400/60", label: "Alerte", labelColor: "text-amber-400" },
  ritual: { dot: "bg-[#F56E0F]",  accent: "border-l-[#F56E0F]/60", label: "Rituel", labelColor: "text-[#F56E0F]" },
  info:   { dot: "bg-blue-400",   accent: "border-l-blue-400/60",  label: "Info",   labelColor: "text-blue-400"  },
};

// ─── WeatherView ──────────────────────────────────────────────────────────────

function WeatherView({ weather }: { weather: WeatherData }) {
  const hourlyData = weather.hourly?.length ? weather.hourly : HOURLY_FALLBACK;
  return (
    <div className="px-4 pt-2 pb-5">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-end gap-3">
          <div className="relative">
            <span className="text-[64px] font-thin text-white leading-none tracking-[-0.04em]">{weather.temperature}</span>
            <span className="absolute top-3 -right-4 text-[22px] font-light text-white/50">°</span>
          </div>
          <div className="pb-2">
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#F56E0F]/80 mb-0.5">{weather.condition}</p>
            <div className="flex items-center gap-1 text-white/35 text-[11px]">
              <MapPin className="w-2.5 h-2.5 shrink-0" strokeWidth={1.5} />
              <span>{weather.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/10 border border-amber-400/20 flex items-center justify-center">
            <WeatherIcon icon={weather.icon} className="w-6 h-6 text-amber-400" />
          </div>
          <span className="text-[12px] text-white/50 font-mono">↑{weather.high}° ↓{weather.low}°</span>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { Icon: Wind,     val: `${weather.wind}`,     unit: "km/h", label: "Vent"     },
          { Icon: Droplets, val: `${weather.humidity}`, unit: "%",    label: "Humidité" },
          { Icon: Eye,      val: `${weather.uv}`,       unit: "UV",   label: "Index UV" },
          { Icon: Gauge,    val: "1012",                 unit: "hPa",  label: "Pression" },
        ].map(({ Icon, val, unit, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <Icon className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
            <div className="text-center leading-none">
              <span className="text-[13px] font-semibold text-white/80 tabular-nums">{val}</span>
              <span className="text-[9px] text-white/30 ml-0.5">{unit}</span>
            </div>
            <span className="text-[9px] text-white/25 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2.5 font-medium">Prévisions du jour</p>
      <div className="flex items-end gap-2">
        {hourlyData.map((h, i) => {
          const maxT = Math.max(...hourlyData.map(x => x.t));
          const minT = Math.min(...hourlyData.map(x => x.t));
          const pct  = ((h.t - minT) / (maxT - minT)) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-white/40 font-mono">{h.t}°</span>
              <div className="w-full h-10 rounded-full bg-white/[0.05] relative overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute bottom-0 left-0 right-0 rounded-full"
                  style={{ background: `linear-gradient(to top, rgba(245,110,15,${0.3 + pct * 0.004}), rgba(245,110,15,0.05))` }}
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

// ─── NotificationsView ────────────────────────────────────────────────────────

function NotificationsView({ notifications, onDelete, loading }: { notifications: Notification[]; onDelete: (id: number) => void; loading?: boolean }) {
  return (
    <div className="px-4 pt-2 pb-5">
      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[62px] rounded-2xl bg-white/[0.04] border border-white/[0.07] animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
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
                <motion.div key={n.id} layout
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className={cn("relative flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] border-l-2", cfg.accent)}>
                    <div className="pt-1 shrink-0"><span className={cn("block w-1.5 h-1.5 rounded-full", cfg.dot)} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider", cfg.labelColor)}>{cfg.label}</span>
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
                        <Clock className="w-2.5 h-2.5" strokeWidth={1.5} /><span>{n.time}</span>
                      </div>
                      <button onClick={() => onDelete(n.id)} className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10 active:scale-90 transition-all">
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

// ─── SearchView ───────────────────────────────────────────────────────────────

interface SearchResult {
  id:       string;
  label:    string;
  sub?:     string;
  kind:     "event" | "site";
}

function SearchView({ onClose }: { onClose: () => void }) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState<SearchResult[]>([]);
  const [allItems, setAllItems]       = useState<SearchResult[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Charge events + sites une seule fois à l'ouverture du panel
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);

    setLoadingData(true);
    Promise.all([
      fetch(`${API_BASE}/events?status=PUBLISHED`, { credentials: "include" })
        .then(r => r.ok ? r.json() : { success: false })
        .catch(() => ({ success: false })),
      fetch(`${API_BASE}/sites`, { credentials: "include" })
        .then(r => r.ok ? r.json() : { success: false })
        .catch(() => ({ success: false })),
    ]).then(([evRes, siteRes]) => {
      const items: SearchResult[] = [];

      if (evRes.success && Array.isArray(evRes.data)) {
        evRes.data.forEach((e: { id: string; name: string; site?: { name: string } }) => {
          items.push({ id: e.id, label: e.name, sub: e.site?.name, kind: "event" });
        });
      }
      if (siteRes.success && Array.isArray(siteRes.data)) {
        siteRes.data.forEach((s: { id: string; name: string; type?: string }) => {
          items.push({ id: s.id, label: s.name, sub: s.type, kind: "site" });
        });
      }

      setAllItems(items);
      setResults(items.slice(0, 8)); // Suggestions initiales
    }).finally(() => setLoadingData(false));

    return () => clearTimeout(t);
  }, []);

  // Filtre avec debounce 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setResults(allItems.slice(0, 8));
        return;
      }
      const q = query.toLowerCase();
      setResults(
        allItems
          .filter(i => i.label.toLowerCase().includes(q) || i.sub?.toLowerCase().includes(q))
          .slice(0, 10)
      );
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, allItems]);

  return (
    <div className="px-4 pt-2 pb-5">
      <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white/[0.07] border border-white/[0.1] mb-4 focus-within:border-[#F56E0F]/40 transition-colors">
        {loadingData
          ? <Loader2 className="w-4 h-4 text-white/30 shrink-0 animate-spin" strokeWidth={1.5} />
          : <Search className="w-4 h-4 text-white/30 shrink-0" strokeWidth={1.5} />
        }
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Lieu, événement, cérémonie…"
          className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/25 outline-none caret-[#F56E0F]" />
        {query.length > 0 && (
          <button onClick={() => setQuery("")} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-3 h-3 text-white/30" strokeWidth={2} />
          </button>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2.5 font-medium px-0.5">
        {query.length > 0
          ? `${results.length} résultat${results.length > 1 ? "s" : ""}`
          : loadingData ? "Chargement…" : "Suggestions"}
      </p>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {results.map((item, i) => (
            <motion.button key={item.id} layout
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] active:scale-[0.98] transition-all group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border",
                  item.kind === "event"
                    ? "bg-[#F56E0F]/10 border-[#F56E0F]/15"
                    : "bg-blue-500/10 border-blue-500/15",
                )}>
                  {item.kind === "event"
                    ? <Flame className="w-3 h-3 text-[#F56E0F]/60" strokeWidth={1.5} />
                    : <MapPin className="w-3 h-3 text-blue-400/60" strokeWidth={1.5} />
                  }
                </div>
                <div className="min-w-0">
                  <span className="text-[13px] text-white/70 group-hover:text-white/90 transition-colors block truncate">{item.label}</span>
                  {item.sub && (
                    <span className="text-[10px] text-white/30 block truncate">{item.sub}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors shrink-0" strokeWidth={1.5} />
            </motion.button>
          ))}
        </AnimatePresence>
        {!loadingData && results.length === 0 && query.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/25 text-[13px] py-4">
            Aucun résultat pour « {query} »
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── EmergencyView ────────────────────────────────────────────────────────────

function EmergencyView({ onClose, onSent }: { onClose: () => void; onSent: (req: AlertRequest) => void }) {
  const [step, setStep]       = useState<EmergencyStep>(1);
  const [form, setForm]       = useState<EmergencyForm>({ service: null, type: null, name: "", description: "" });
  const [errors, setErrors]   = useState<{ name?: string; description?: string }>({});
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const directionRef = useRef<1 | -1>(1);

  // Géoloc dès l'ouverture
  useEffect(() => {
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoStatus("ok"); },
      ()    => setGeoStatus("error"),
      { timeout: 8000, maximumAge: 30000 },
    );
  }, []);

  // Countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) { handleSend(); return; } // eslint-disable-line react-hooks/exhaustive-deps
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [countdown]);

  function validateStep2(): boolean {
    const e: typeof errors = {};
    if (form.name.trim().length < 3)        e.name        = "Nom requis (min. 3 caractères)";
    if (form.description.trim().length < 10) e.description = "Description requête (min. 10 caractères)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goTo(s: EmergencyStep, dir: 1 | -1) {
    directionRef.current = dir;
    setStep(s);
  }

  // Mapping type interne → type BDD (simplifié)
  const TYPE_TO_DB: Record<EmergencyType, string> = {
    MALAISE:           "MEDICAL",
    BLESSURE:          "MEDICAL",
    INCONSCIENT:       "MEDICAL",
    ACCOUCHEMENT:      "MEDICAL",
    ALTERCATION:       "SECURITY",
    VOL:               "SECURITY",
    AGRESSION:         "SECURITY",
    PERSONNE_DISPARUE: "LOST",
    BOUSCULADE:        "SECURITY",
    INTRUSION:         "SECURITY",
    OBJET_SUSPECT:     "SECURITY",
    INCENDIE:          "FIRE",
  };

  async function handleSend() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    const now     = new Date();
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const body: Record<string, unknown> = {
      uuid:        getOrCreateUUID(),
      displayName: form.name,
      type:        TYPE_TO_DB[form.type!] ?? "OTHER",
      description: form.description,
    };
    if (geoCoords) {
      body.latitude  = geoCoords.lat;
      body.longitude = geoCoords.lng;
    }

    let dbId: string | undefined;
    try {
      const res  = await fetch(`${API_BASE}/urgences`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success && json.data?.id) dbId = json.data.id;
    } catch {
      // Erreur réseau — on continue sans dbId (tracking désactivé)
    }

    const ref = dbId
      ? `URG-${dbId.slice(0, 6).toUpperCase()}`
      : `URG-${Math.floor(1000 + Math.random() * 9000)}`;

    const req: AlertRequest = {
      ref,
      _dbId:   dbId,
      service: form.service!,
      type:    form.type!,
      name:    form.name,
      status:  "EN_ATTENTE",
      createdAt: timeStr,
      timeline: [
        { status: "EN_ATTENTE", label: "Alerte envoyée", detail: "Votre demande a été transmise", time: timeStr },
      ],
    };
    onSent(req);
  }

  function cancelCountdown() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  }

  const selectedService = SERVICES.find(s => s.id === form.service);

  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
  };

  return (
    <div className="pb-4 overflow-hidden">

      {/* ── Step indicator ── */}
      <div className="flex items-center justify-center gap-2 pt-1 pb-3 px-4">
        {([1, 2, 3] as EmergencyStep[]).map(s => (
          <div key={s} className={cn(
            "h-1 rounded-full transition-all duration-300",
            s === step ? "w-8 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                        : s < step ? "w-4 bg-red-500/40" : "w-4 bg-white/10",
          )} />
        ))}
      </div>

      {/* ── Steps ── */}
      <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>
        {step === 1 && (
          <motion.div key="step1"
            custom={directionRef.current}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-4"
          >
            {/* Services */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2.5 font-medium">
              Service à contacter
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {SERVICES.map((svc) => {
                const Icon     = svc.icon;
                const isActive = form.service === svc.id;
                return (
                  <motion.button
                    key={svc.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setForm(f => ({ ...f, service: svc.id, type: null }))}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200",
                      isActive
                        ? `${svc.bg} ${svc.border} shadow-[0_0_16px_rgba(0,0,0,0.2)]`
                        : "bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.07]",
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", isActive ? `${svc.bg} ${svc.border}` : "bg-white/[0.06] border-white/[0.08]")}>
                      <Icon className={cn("w-4.5 h-4.5", isActive ? svc.color : "text-white/35")} strokeWidth={1.6} />
                    </div>
                    <span className={cn("text-[14px] font-semibold transition-colors", isActive ? svc.text : "text-white/55")}>
                      {svc.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="service-check"
                        className={cn("ml-auto w-4 h-4 rounded-full border flex items-center justify-center", svc.border, svc.bg)}
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full", svc.color.replace("text-", "bg-"))} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Categories */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2.5 font-medium">
              Nature de l'urgence
            </p>
            {!form.service ? (
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <HelpCircle className="w-4 h-4 text-white/15 shrink-0" strokeWidth={1.5} />
                <span className="text-[12px] text-white/20 italic">Sélectionnez d'abord un service</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {TYPES.filter(t => SERVICE_TYPES[form.service!].includes(t.id)).map(t => {
                  const isActive = form.type === t.id;
                  const TypeIcon = t.icon;
                  return (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setForm(f => ({ ...f, type: t.id }))}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all duration-200",
                        isActive
                          ? "bg-red-500/15 border-red-500/35 text-red-300"
                          : "bg-white/[0.05] border-white/[0.08] text-white/45 hover:bg-white/[0.08]",
                      )}
                    >
                      <TypeIcon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-red-300" : "text-white/35")} strokeWidth={1.5} />
                      <span>{t.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Géoloc status */}
            <div className="flex items-center gap-1.5 mb-4 text-[11px]">
              <MapPin className={cn("w-3 h-3 shrink-0", geoStatus === "ok" ? "text-emerald-400" : geoStatus === "error" ? "text-white/25" : "text-white/25")} strokeWidth={1.5} />
              <span className={cn(geoStatus === "ok" ? "text-emerald-400/70" : "text-white/25")}>
                {geoStatus === "loading" && "Position en cours de récupération..."}
                {geoStatus === "ok"      && "Position obtenue"}
                {geoStatus === "error"   && "Position non disponible"}
                {geoStatus === "idle"    && ""}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!form.service || !form.type}
              onClick={() => goTo(2, 1)}
              className={cn(
                "w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all duration-200",
                form.service && form.type
                  ? "bg-red-500/20 border border-red-500/35 text-red-400 shadow-[0_4px_16px_rgba(239,68,68,0.15)]"
                  : "bg-white/[0.04] border border-white/[0.07] text-white/20 cursor-not-allowed",
              )}
            >
              Continuer
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2"
            custom={directionRef.current}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-3 font-medium">
              Informations requises
            </p>

            {/* Nom */}
            <div className="mb-3">
              <label className="text-[11px] text-white/35 mb-1.5 block">Nom complet *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(err => ({ ...err, name: undefined })); }}
                placeholder="Votre nom complet"
                className={cn(
                  "w-full px-3.5 py-3 rounded-2xl bg-white/[0.06] border text-white text-[13px] placeholder:text-white/20 outline-none caret-red-400 transition-colors",
                  errors.name ? "border-red-500/40" : "border-white/[0.10] focus:border-red-500/30",
                )}
              />
              {errors.name && <p className="text-[11px] text-red-400/80 mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-[11px] text-white/35 mb-1.5 block">Description de la situation *</label>
              <textarea
                value={form.description}
                onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(err => ({ ...err, description: undefined })); }}
                placeholder="Décrivez brièvement la situation (lieu, état de la personne…)"
                rows={3}
                className={cn(
                  "w-full px-3.5 py-3 rounded-2xl bg-white/[0.06] border text-white text-[13px] placeholder:text-white/20 outline-none caret-red-400 resize-none transition-colors",
                  errors.description ? "border-red-500/40" : "border-white/[0.10] focus:border-red-500/30",
                )}
              />
              {errors.description && <p className="text-[11px] text-red-400/80 mt-1">{errors.description}</p>}
            </div>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => goTo(1, -1)}
                className="px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/40 text-[13px] font-semibold flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                Retour
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { if (validateStep2()) goTo(3, 1); }}
                className="flex-1 py-3 rounded-2xl bg-red-500/20 border border-red-500/35 text-red-400 text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(239,68,68,0.12)] transition-all"
              >
                Vérifier
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3"
            custom={directionRef.current}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-3 font-medium">
              Récapitulatif
            </p>

            {/* Recap card */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3.5 mb-4 space-y-2.5">
              {selectedService && (
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center border shrink-0", selectedService.bg, selectedService.border)}>
                    <selectedService.icon className={cn("w-3.5 h-3.5", selectedService.color)} strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Service</p>
                    <p className={cn("text-[13px] font-semibold", selectedService.text)}>{selectedService.label}</p>
                  </div>
                </div>
              )}
              <div className="h-px bg-white/[0.06]" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">Urgence</p>
                {(() => {
                  const found = TYPES.find(t => t.id === form.type);
                  const RecapIcon = found?.icon;
                  return (
                    <div className="flex items-center gap-1.5">
                      {RecapIcon && <RecapIcon className="w-3.5 h-3.5 text-white/50 shrink-0" strokeWidth={1.5} />}
                      <p className="text-[13px] text-white/80">{found?.label}</p>
                    </div>
                  );
                })()}
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">Nom</p>
                <p className="text-[13px] text-white/80">{form.name}</p>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">Situation</p>
                <p className="text-[12px] text-white/60 leading-relaxed">{form.description}</p>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex items-center gap-1.5">
                <MapPin className={cn("w-3 h-3 shrink-0", geoStatus === "ok" ? "text-emerald-400" : "text-white/20")} strokeWidth={1.5} />
                <p className={cn("text-[11px]", geoStatus === "ok" ? "text-emerald-400/70" : "text-white/25")}>
                  {geoStatus === "ok" && geoCoords
                    ? `${geoCoords.lat.toFixed(4)}, ${geoCoords.lng.toFixed(4)}`
                    : "Position non disponible"}
                </p>
              </div>
            </div>

            {/* Countdown button */}
            {countdown !== null ? (
              <div className="space-y-2">
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(countdown / 5) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-red-400/70">Envoi dans {countdown}s…</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelCountdown}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.07] border border-white/[0.10] text-[12px] font-semibold text-white/50 transition-all"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goTo(2, -1)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/40 text-[13px] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  Retour
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCountdown(5)}
                  className="flex-1 py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(239,68,68,0.18)] active:bg-red-500/30 transition-all"
                >
                  <Send className="w-4 h-4" strokeWidth={2} />
                  Envoyer l'alerte
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TrackingView ─────────────────────────────────────────────────────────────

const TRACKING_STEPS: { status: TrackingStatus; label: string; icon: React.ElementType }[] = [
  { status: "EN_ATTENTE", label: "Alerte envoyée",      icon: Radio        },
  { status: "RECU",       label: "Alerte reçue",        icon: CheckCircle2 },
  { status: "EN_COURS",   label: "Intervenant assigné", icon: UserCheck    },
  { status: "RESOLU",     label: "Situation résolue",   icon: CircleCheck  },
];

const STATUS_ORDER: TrackingStatus[] = ["EN_ATTENTE", "RECU", "EN_COURS", "RESOLU"];

function TrackingView({ request, onClose, onResolved }: { request: AlertRequest; onClose: () => void; onResolved: () => void }) {
  const service      = SERVICES.find(s => s.id === request.service)!;
  const type         = TYPES.find(t => t.id === request.type)!;
  const TypeIcon     = type?.icon ?? HelpCircle;
  const currentIndex = STATUS_ORDER.indexOf(request.status);
  const isResolved   = request.status === "RESOLU";

  return (
    <div className="px-4 pt-2 pb-5">

      {/* Ref + service badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border shrink-0", service.bg, service.border)}>
            <service.icon className={cn("w-4 h-4", service.color)} strokeWidth={1.6} />
          </div>
          <div>
            <p className={cn("text-[12px] font-bold", service.text)}>{service.label}</p>
            <p className="text-[10px] text-white/30 font-mono">{request.ref}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
          isResolved
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
            : "bg-amber-500/10 border-amber-500/25 text-amber-400",
        )}>
          {isResolved
            ? <CircleCheck className="w-3 h-3" strokeWidth={2} />
            : <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} />
          }
          {isResolved ? "Résolu" : "En cours"}
        </div>
      </div>

      {/* Nature de l'urgence */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] mb-4">
        <TypeIcon className="w-3.5 h-3.5 text-white/40 shrink-0" strokeWidth={1.5} />
        <span className="text-[12px] text-white/60">{type?.label}</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-white/25">
          <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
          {request.createdAt}
        </span>
      </div>

      {/* Timeline */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-3 font-medium">Suivi en temps réel</p>
      <div className="relative flex flex-col gap-0">
        {TRACKING_STEPS.map((step, i) => {
          const StepIcon  = step.icon;
          const isDone    = STATUS_ORDER.indexOf(step.status) <= currentIndex;
          const isCurrent = step.status === request.status;
          const isLast    = i === TRACKING_STEPS.length - 1;
          const event     = request.timeline.find(e => e.status === step.status);
          return (
            <div key={step.status} className="flex gap-3">
              {/* Spine */}
              <div className="flex flex-col items-center shrink-0" style={{ width: 28 }}>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isDone
                      ? isResolved ? "rgba(52,211,153,0.9)" : "rgba(239,68,68,0.85)"
                      : "rgba(255,255,255,0.08)",
                    borderColor: isDone
                      ? isResolved ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.35)"
                      : "rgba(255,255,255,0.08)",
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0"
                >
                  <StepIcon className={cn("w-3.5 h-3.5", isDone ? "text-white" : "text-white/20", isCurrent && "animate-pulse")} strokeWidth={isCurrent ? 2 : 1.5} />
                </motion.div>
                {!isLast && (
                  <div className="w-px flex-1 my-1" style={{ background: isDone ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)", minHeight: 16 }} />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-3 flex-1 min-w-0", isLast && "pb-0")}>
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-[13px] font-semibold leading-tight", isDone ? "text-white/85" : "text-white/25")}>
                    {step.label}
                  </p>
                  {event && <span className="text-[10px] text-white/25 font-mono shrink-0">{event.time}</span>}
                </div>
                {event && (
                  <p className="text-[11px] text-white/40 mt-0.5 leading-snug">{event.detail}</p>
                )}
                {isCurrent && !isResolved && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-red-400/60">En attente de mise à jour…</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {isResolved ? (
        <motion.button
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResolved}
          className="mt-4 w-full py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <CircleCheck className="w-4 h-4" strokeWidth={2} />
          Fermer
        </motion.button>
      ) : (
        <p className="mt-4 text-center text-[11px] text-white/20 leading-relaxed">
          Vous serez notifié à chaque mise à jour.<br />Restez en sécurité.
        </p>
      )}
    </div>
  );
}

// ─── ExpandedHeader ───────────────────────────────────────────────────────────

function ExpandedHeader({ logoSrc, label, onClose, logoMerged, isEmergency = false }: {
  logoSrc: string; label: string; onClose: () => void; logoMerged: boolean; isEmergency?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-2">
        {logoMerged && !isEmergency && (
          <motion.div layoutId="vodun-logo" className="relative w-6 h-6 shrink-0"
            transition={{ type: "spring", bounce: 0.22, duration: 0.42 }}>
            <Image src={logoSrc} alt="Vodun Days" fill className="rounded-full object-contain" />
          </motion.div>
        )}
        {isEmergency && (
          <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" strokeWidth={1.8} />
          </div>
        )}
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className={cn("text-[13px] font-semibold tracking-tight", isEmergency ? "text-red-400" : "text-white/70")}
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

// ─── HairlineDivider ──────────────────────────────────────────────────────────

function HairlineDivider() {
  return <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />;
}

// ─── CloseHandle ──────────────────────────────────────────────────────────────

function CloseHandle({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="flex items-center justify-center w-full pt-1.5 pb-3 group" aria-label="Fermer">
      <div className="w-9 h-1 rounded-full bg-white/[0.08] group-hover:bg-white/[0.18] transition-colors" />
    </button>
  );
}

// ─── Main WeatherWidget ───────────────────────────────────────────────────────

export function WeatherWidget({
  weather: weatherProp,
  logoSrc = "/images/logo.png",
  logoMerged = false,
  onLogoMerge,
  onLogoSeparate,
}: DynamicIslandProps) {
  // Guard: parent may pass null/undefined even though prop is optional
  const weather = weatherProp ?? defaultWeather;
  const [view, setView]               = useState<View>("idle");
  const [notifs, setNotifs]           = useState<Notification[]>([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [activeAlert, setActiveAlert] = useState<AlertRequest | null>(null);
  const shouldReduceMotion            = useReducedMotion();
  const closeTimerRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifIdRef                    = useRef(100);
  const progressionTimersRef          = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pollingRef                    = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch notifications depuis l'API ──────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setNotifsLoading(true);
      const res  = await fetch(`${API_BASE}/notifications?status=SENT&limit=20`, { credentials: "include" });
      // Route protégée : si pas connecté en tant qu'admin, on ignore silencieusement
      if (res.status === 401) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.notifications)) {
        setNotifs(json.data.notifications.map(mapNotification));
        // Sync le compteur interne pour éviter les collisions d'ids lors des alertes urgences
        notifIdRef.current = Math.max(100, json.data.notifications.length + 10);
      }
    } catch {
      // Erreur réseau silencieuse — notifs restent vides
    } finally {
      setNotifsLoading(false);
    }
  }, []);

  // Chargement initial + polling toutes les 60s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const isExpanded  = view !== "idle";
  const isEmergency = view === "emergency" || view === "tracking";

  const openView = useCallback((v: View) => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    setView(v);
    onLogoMerge?.();
  }, [onLogoMerge]);

  const close = useCallback(() => {
    setView("idle");
    closeTimerRef.current = setTimeout(() => { onLogoSeparate?.(); closeTimerRef.current = null; }, 300);
  }, [onLogoSeparate]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    progressionTimersRef.current.forEach(clearTimeout);
    if (pollingRef.current) clearInterval(pollingRef.current);
  }, []);

  const deleteNotif = useCallback((id: number) => setNotifs(prev => prev.filter(n => n.id !== id)), []);

  /** Called when EmergencyView sends the alert */
  const handleAlertSent = useCallback((req: AlertRequest) => {
    setActiveAlert(req);
    setView("tracking");

    // Add initial notification
    const firstNotifId = ++notifIdRef.current;
    setNotifs(prev => [{
      id:    firstNotifId,
      title: `Alerte ${req.ref} envoyée`,
      body:  `${TYPES.find(t => t.id === req.type)?.label} · En attente de prise en charge`,
      time:  "Maintenant",
      type:  "alert",
    }, ...prev]);

    // ── Polling réel sur GET /api/urgences/:id toutes les 5s ──────────────────
    // Mapping statuts BDD → statuts internes du widget
    const STATUS_MAP: Record<string, TrackingStatus> = {
      OPEN:        "RECU",
      IN_PROGRESS: "EN_COURS",
      RESOLVED:    "RESOLU",
      CLOSED:      "RESOLU",
    };

    const LABEL_MAP: Record<string, string> = {
      OPEN:        "Alerte reçue",
      IN_PROGRESS: "Intervenant assigné",
      RESOLVED:    "Situation résolue",
      CLOSED:      "Situation résolue",
    };

    const DETAIL_MAP: Record<string, string> = {
      OPEN:        "Un opérateur a pris connaissance de votre demande",
      IN_PROGRESS: "Un intervenant est en route vers votre position",
      RESOLVED:    "L'intervention est terminée. Merci de votre vigilance",
      CLOSED:      "L'intervention est terminée. Merci de votre vigilance",
    };

    // dbAlertId est stocké dans req.ref si c'est un vrai UUID BDD
    // (sinon le polling est silencieusement ignoré — cas hors-ligne)
    const isRealAlert = req._dbId != null;
    if (!isRealAlert) return;

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/urgences/track/${getOrCreateUUID()}`, { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success || !json.data) return;

        const alert = json.data;
        const mappedStatus = STATUS_MAP[alert.status] ?? "EN_ATTENTE";

        // Timeline BDD → événements internes
        const timeline: TrackingEvent[] = [
          {
            status: "EN_ATTENTE",
            label:  "Alerte envoyée",
            detail: "Votre demande a été transmise",
            time:   new Date(alert.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          },
          ...(alert.timeline ?? []).map((t: { status: string; note?: string; createdAt: string }) => ({
            status: STATUS_MAP[t.status] ?? "RECU",
            label:  LABEL_MAP[t.status]  ?? t.status,
            detail: t.note               ?? DETAIL_MAP[t.status] ?? "",
            time:   new Date(t.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          })),
        ];

        setActiveAlert(prev => {
          if (!prev) return prev;
          if (prev.status === mappedStatus) return prev; // pas de changement
          return { ...prev, status: mappedStatus, timeline };
        });

        // Notif au changement de statut
        if (["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(alert.status)) {
          const nid = ++notifIdRef.current;
          const label = LABEL_MAP[alert.status];
          if (label) {
            setNotifs(prev => {
              if (prev.some(n => n.title === `${req.ref} — ${label}`)) return prev;
              return [{ id: nid, title: `${req.ref} — ${label}`, body: DETAIL_MAP[alert.status] ?? "", time: "Maintenant", type: "alert" }, ...prev];
            });
          }
        }

        // Arrêt du polling quand résolu
        if (alert.status === "RESOLVED" || alert.status === "CLOSED") {
          if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
        }
      } catch {
        // Erreur réseau silencieuse
      }
    }, 5_000);
  }, []);

  /** Reset everything after a resolved alert is dismissed */
  const handleAlertReset = useCallback(() => {
    progressionTimersRef.current.forEach(clearTimeout);
    progressionTimersRef.current = [];
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    setActiveAlert(null);
    setView("idle");
    closeTimerRef.current = setTimeout(() => { onLogoSeparate?.(); closeTimerRef.current = null; }, 300);
  }, [onLogoSeparate]);

  const viewLabels: Record<View, string> = {
    idle:          "",
    weather:       "Météo",
    notifications: notifsLoading ? "Chargement…" : notifs.length > 0 ? `${notifs.length} notification${notifs.length > 1 ? "s" : ""}` : "Notifications",
    search:        "Rechercher",
    emergency:     "Urgence",
    tracking:      activeAlert ? `Suivi ${activeAlert.ref}` : "Suivi",
  };

  return (
    <>
      {/* ── Fixed container ── */}
      <div className="fixed z-50 top-0 right-0 pointer-events-none pt-[max(10px,env(safe-area-inset-top))] pr-3">

        {/* ── IDLE PILL ── */}
        <motion.div
          animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.85 : 1 }}
          transition={{ duration: 0.18, ease: [0.32, 0, 0.67, 0] }}
          style={{ pointerEvents: isExpanded ? "none" : "auto" }}
          className={cn("p-px", GLASS.outer, GLASS.shadow, "rounded-full")}
        >
          <div className={cn("flex items-center gap-0.5 px-1.5 py-1.5 rounded-full overflow-hidden", GLASS.inner, GLASS.border)}>
            {/* Météo */}
            <button onClick={() => openView("weather")} className="flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150 group">
              <WeatherIcon icon={weather.icon} className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-semibold text-white/90 tabular-nums">{weather.temperature}°</span>
            </button>
            <div className="w-px h-3.5 bg-white/[0.1] mx-0.5" />
            {/* Notifications */}
            <button onClick={() => openView("notifications")} className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150" aria-label={`${notifs.length} notifications`}>
              <Bell className="w-[15px] h-[15px] text-white/55" strokeWidth={1.5} />
              {notifs.length > 0 && <span className="absolute top-[7px] right-[7px] min-w-[6px] h-[6px] rounded-full bg-red-500 ring-[1.5px] ring-[rgba(18,18,22,0.9)]" />}
            </button>
            {/* Recherche */}
            <button onClick={() => openView("search")} className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all duration-150" aria-label="Recherche">
              <Search className="w-[15px] h-[15px] text-white/55" strokeWidth={1.5} />
            </button>
            <div className="w-px h-3.5 bg-white/[0.1] mx-0.5" />
            {/* ── Bouton Urgence / Tracking ── */}
            <button
              onClick={() => openView(activeAlert ? "tracking" : "emergency")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all duration-150 group"
              aria-label={activeAlert ? "Suivi urgence" : "Urgence"}
            >
              <ShieldAlert className="w-[15px] h-[15px] text-red-400/70 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
              {activeAlert && activeAlert.status !== "RESOLU" && (
                <span className="absolute top-[7px] right-[7px] min-w-[6px] h-[6px] rounded-full bg-red-500 ring-[1.5px] ring-[rgba(18,18,22,0.9)] animate-pulse" />
              )}
            </button>
          </div>
        </motion.div>

        {/* ── EXPANDED PANEL ── */}
        <motion.div
          initial={false}
          animate={isExpanded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.72, y: -8 }}
          transition={shouldReduceMotion ? { duration: 0 } : isExpanded
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
          className={cn(
            "p-px rounded-[32px]",
            GLASS.outer,
            // Bordure rouge subtile en mode urgence
            isEmergency
              ? "shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(239,68,68,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : GLASS.shadow,
          )}
        >
          <div className={cn(
            "rounded-[31px] overflow-hidden",
            GLASS.inner,
            isEmergency ? "border border-red-500/[0.12]" : GLASS.border,
          )}>
            <AnimatePresence mode="wait" initial={false}>
              {view === "weather" && (
                <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.weather} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <WeatherView weather={weather} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
              {view === "notifications" && (
                <motion.div key="notifs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.notifications} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <NotificationsView notifications={notifs} onDelete={deleteNotif} loading={notifsLoading} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
              {view === "search" && (
                <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.search} onClose={close} logoMerged={logoMerged} />
                  <HairlineDivider />
                  <SearchView onClose={close} />
                  <CloseHandle onClose={close} />
                </motion.div>
              )}
              {view === "emergency" && (
                <motion.div key="emergency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.emergency} onClose={close} logoMerged={logoMerged} isEmergency />
                  <HairlineDivider />
                  <EmergencyView onClose={close} onSent={handleAlertSent} />
                </motion.div>
              )}
              {view === "tracking" && activeAlert && (
                <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ExpandedHeader logoSrc={logoSrc} label={viewLabels.tracking} onClose={close} logoMerged={logoMerged} isEmergency />
                  <HairlineDivider />
                  <TrackingView request={activeAlert} onClose={close} onResolved={handleAlertReset} />
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className={cn(
              "fixed inset-0 z-40",
              isEmergency
                ? "bg-black/60 [backdrop-filter:blur(6px)]"
                : "bg-black/40 [backdrop-filter:blur(4px)]",
            )}
          />
        )}
      </AnimatePresence>
    </>
  );
}