"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ShieldAlert, Stethoscope, ShieldCheck,
  MapPin, Clock, User, ChevronRight, ChevronLeft,
  HeartPulse, AlertTriangle, UserX, Baby,
  Swords, Lock, EyeOff, PersonStanding,
  Siren, HelpCircle, Flame,
  Radio, CheckCircle2, UserCheck, CircleCheck,
  Loader2, Navigation, Locate, ExternalLink,
  Copy, Check,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import {
  type AlertRequest, type EmergencyService, type EmergencyType, type AlertStatus,
  SERVICE_LABELS, TYPE_LABELS, STATUS_CONFIG, SERVICE_CONFIG,
} from "./emergency-mock"

// ─── Config icons (miroir du WeatherWidget) ───────────────────────────────────

const SERVICE_ICONS: Record<EmergencyService, React.ElementType> = {
  SOINS_MEDICAUX:    Stethoscope,
  POLICE:            ShieldCheck,
  SECURITE_FESTIVAL: ShieldAlert,
}

const TYPE_ICONS: Record<EmergencyType, React.ElementType> = {
  MALAISE:           HeartPulse,
  BLESSURE:          AlertTriangle,
  INCONSCIENT:       UserX,
  ACCOUCHEMENT:      Baby,
  ALTERCATION:       Swords,
  VOL:               Lock,
  AGRESSION:         ShieldAlert,
  PERSONNE_DISPARUE: EyeOff,
  BOUSCULADE:        PersonStanding,
  INTRUSION:         Siren,
  OBJET_SUSPECT:     HelpCircle,
  INCENDIE:          Flame,
}

const TRACKING_STEPS: { status: AlertStatus; label: string; icon: React.ElementType }[] = [
  { status: "EN_ATTENTE", label: "Alerte reçue",        icon: Radio        },
  { status: "RECU",       label: "Dossier pris en charge", icon: CheckCircle2 },
  { status: "EN_COURS",   label: "Intervenant assigné", icon: UserCheck    },
  { status: "RESOLU",     label: "Situation résolue",   icon: CircleCheck  },
]

const STATUS_ORDER: AlertStatus[] = ["EN_ATTENTE", "RECU", "EN_COURS", "RESOLU"]

const NEXT_STATUS: Partial<Record<AlertStatus, { status: AlertStatus; label: string }>> = {
  EN_ATTENTE: { status: "RECU",     label: "Marquer comme reçu"     },
  RECU:       { status: "EN_COURS", label: "Démarrer l'intervention" },
  EN_COURS:   { status: "RESOLU",   label: "Marquer comme résolu"   },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr }) }
  catch { return "-" }
}

// Calcule le point de repère le plus proche (sites festival Ouidah)
const FESTIVAL_SITES = [
  { name: "Place de l'Aube",         lat: 6.3569, lng: 2.0778 },
  { name: "Temple des Pythons",       lat: 6.3601, lng: 2.0753 },
  { name: "Route des Esclaves",       lat: 6.3421, lng: 2.0865 },
  { name: "Place des Enchanteurs",    lat: 6.3555, lng: 2.0799 },
  { name: "Forêt sacrée de Kpassè",  lat: 6.3648, lng: 2.0712 },
  { name: "Cathédrale de Ouidah",    lat: 6.3578, lng: 2.0760 },
]

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getNearestSite(lat: number, lng: number) {
  let nearest = FESTIVAL_SITES[0]
  let minDist = Infinity
  for (const site of FESTIVAL_SITES) {
    const d = haversineMeters(lat, lng, site.lat, site.lng)
    if (d < minDist) { minDist = d; nearest = site }
  }
  return { site: nearest, distanceM: Math.round(minDist) }
}

// ─── LocationBlock ────────────────────────────────────────────────────────────

interface LocationBlockProps {
  alert: AlertRequest
}

function LocationBlock({ alert }: LocationBlockProps) {
  const [copied, setCopied] = useState(false)

  // Parse coords si présentes dans les données
  const hasCoords = !!alert.coords
  const coords    = alert.coords

  const nearest = hasCoords && coords
    ? getNearestSite(coords.lat, coords.lng)
    : null

  const coordsStr = coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : null
  const mapsUrl   = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : null

  const handleCopy = async () => {
    if (!coordsStr) return
    await navigator.clipboard.writeText(coordsStr)
    setCopied(true)
    toast.success("Coordonnées copiées")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Localisation textuelle déclarée */}
      {alert.location && (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <MapPin className="size-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-0.5">Localisation déclarée</p>
            <p className="text-[13px] text-foreground/80 font-medium">{alert.location}</p>
          </div>
        </div>
      )}

      {/* Coordonnées GPS */}
      {hasCoords && coords && nearest ? (
        <div className="rounded-xl border border-white/[0.09] overflow-hidden">
          {/* Header GPS */}
          <div className="px-3.5 py-2.5 bg-emerald-500/[0.06] border-b border-emerald-500/[0.12] flex items-center gap-2">
            <div className="size-5 rounded-md bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Locate className="size-2.5 text-emerald-400" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Position GPS obtenue</span>
          </div>

          <div className="px-3.5 py-3 space-y-3 bg-white/[0.02]">
            {/* Coordonnées + copie */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-0.5">Coordonnées exactes</p>
                <p className="text-[13px] font-mono text-foreground/80">{coordsStr}</p>
              </div>
              <button
                onClick={handleCopy}
                className="size-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 hover:bg-white/[0.10] transition-colors"
              >
                {copied
                  ? <Check className="size-3 text-emerald-400" />
                  : <Copy className="size-3 text-muted-foreground/40" />}
              </button>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Point de repère le plus proche */}
            <div>
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1.5">Point de repère le plus proche</p>
              <div className="flex items-center gap-2">
                <Navigation className="size-3 text-[#F56E0F]/70 shrink-0" />
                <p className="text-[13px] text-foreground/80 font-medium">
                  À{" "}
                  <span className="text-[#F56E0F] font-bold">
                    {nearest.distanceM < 1000
                      ? `${nearest.distanceM} m`
                      : `${(nearest.distanceM / 1000).toFixed(1)} km`}
                  </span>
                  {" "}de{" "}
                  <span className="font-semibold">{nearest.site.name}</span>
                </p>
              </div>
              {nearest.distanceM > 500 && (
                <p className="text-[11px] text-amber-400/70 mt-1 flex items-center gap-1">
                  <AlertTriangle className="size-2.5 shrink-0" />
                  Hors périmètre immédiat des sites festival
                </p>
              )}
            </div>

            {/* Ouvrir dans Maps */}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="size-3" />
                Ouvrir dans Google Maps
              </a>
            )}
          </div>
        </div>
      ) : (
        // Pas de coords GPS
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="size-5 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
            <Locate className="size-2.5 text-muted-foreground/30" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground/40">Position GPS non disponible</p>
            <p className="text-[10px] text-muted-foreground/25 mt-0.5">L'utilisateur n'a pas autorisé la géolocalisation</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AlertDetailModal ─────────────────────────────────────────────────────────

interface AlertDetailModalProps {
  alert:      AlertRequest | null
  advancing?: boolean  // état de chargement géré par le parent
  onClose:    () => void
  onAdvance:  (id: string, nextStatus: AlertRequest["status"], note?: string) => Promise<void>
}

export function AlertDetailModal({ alert, advancing = false, onClose, onAdvance }: AlertDetailModalProps) {
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [activeTab,    setActiveTab]    = useState<"details" | "timeline">("details")
  const [noteValue,    setNoteValue]    = useState("")

  // Reset tab + note quand on change d'alerte
  useEffect(() => {
    setActiveTab("details")
    setConfirmOpen(false)
    setNoteValue("")
  }, [alert?.id])

  if (!alert) return null

  const svcCfg      = SERVICE_CONFIG[alert.service]
  const ServiceIcon = SERVICE_ICONS[alert.service]  ?? ShieldAlert
  const TypeIcon    = TYPE_ICONS[alert.type]        ?? HelpCircle
  const statusCfg   = STATUS_CONFIG[alert.status]
  const next        = NEXT_STATUS[alert.status]
  const currentIdx  = STATUS_ORDER.indexOf(alert.status)
  const isResolved  = alert.status === "RESOLU"

  const handleAdvance = async () => {
    if (!next) return
    setConfirmOpen(false)
    await onAdvance(alert.id, next.status, noteValue.trim() || undefined)
    setNoteValue("")
  }

  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 16 : -16 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -16 : 16 }),
  }

  return (
    <>
      <Dialog open={!!alert} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className={cn(
          "max-w-lg w-full p-0 overflow-hidden gap-0",
          "bg-[oklch(0.11_0.018_260)] border-white/[0.09]",
          "shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]",
        )}>

          {/* ── Bande colorée service ── */}
          <div className={cn(
            "relative px-6 pt-5 pb-4 border-b border-white/[0.07]",
            "bg-gradient-to-br",
            alert.service === "SOINS_MEDICAUX"    && "from-emerald-500/[0.10] to-transparent",
            alert.service === "POLICE"            && "from-blue-500/[0.10] to-transparent",
            alert.service === "SECURITE_FESTIVAL" && "from-[#F56E0F]/[0.10] to-transparent",
          )}>
            {/* Lueur ambiante */}
            <div className={cn(
              "absolute inset-0 pointer-events-none",
              alert.service === "SOINS_MEDICAUX"    && "bg-[radial-gradient(ellipse_at_top_left,rgba(52,211,153,0.08),transparent_60%)]",
              alert.service === "POLICE"            && "bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_60%)]",
              alert.service === "SECURITE_FESTIVAL" && "bg-[radial-gradient(ellipse_at_top_left,rgba(245,110,15,0.08),transparent_60%)]",
            )} />

            <DialogHeader className="space-y-0">
              <div className="flex items-start gap-3">
                {/* Icône service */}
                <div className={cn(
                  "size-11 rounded-2xl flex items-center justify-center border shrink-0",
                  "shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
                  svcCfg.bg, svcCfg.border,
                )}>
                  <ServiceIcon className={cn("size-5", svcCfg.color)} strokeWidth={1.7} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <DialogTitle className={cn("text-base font-bold leading-none", svcCfg.color)}>
                      {SERVICE_LABELS[alert.service]}
                    </DialogTitle>
                    <Badge variant="outline" className={cn("text-[10px] font-semibold", statusCfg.badgeClass)}>
                      <span className={cn("size-1.5 rounded-full mr-1.5 inline-block shrink-0", statusCfg.dotClass)} />
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground/40">{alert.ref}</p>
                </div>
              </div>

              {/* Nature de l'urgence */}
              <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <TypeIcon className="size-3.5 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-foreground/75 font-medium flex-1">{TYPE_LABELS[alert.type]}</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/30">
                  <Clock className="size-2.5" />
                  <span>{timeAgo(alert.createdAt)}</span>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-white/[0.07] px-6">
            {(["details", "timeline"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-3 px-1 mr-6 text-[12px] font-semibold uppercase tracking-widest border-b-2 -mb-px transition-colors",
                  activeTab === tab
                    ? "border-[#F56E0F] text-foreground/90"
                    : "border-transparent text-muted-foreground/40 hover:text-muted-foreground/70",
                )}
              >
                {tab === "details" ? "Détails" : "Historique"}
              </button>
            ))}
          </div>

          {/* ── Contenu des tabs ── */}
          <ScrollArea className="max-h-[420px]">
            <AnimatePresence mode="wait">
              {activeTab === "details" ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="px-6 py-5 space-y-5"
                >
                  {/* ── Step 1 recap : Service + Type ── */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/35 mb-3">
                      Service & Urgence
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={cn("rounded-xl border p-3", svcCfg.bg, svcCfg.border)}>
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1">Service</p>
                        <div className="flex items-center gap-1.5">
                          <ServiceIcon className={cn("size-3.5 shrink-0", svcCfg.color)} strokeWidth={1.6} />
                          <p className={cn("text-[13px] font-semibold", svcCfg.color)}>{SERVICE_LABELS[alert.service]}</p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1">Type</p>
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className="size-3.5 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
                          <p className="text-[13px] font-medium text-foreground/75">{TYPE_LABELS[alert.type]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/[0.06]" />

                  {/* ── Step 2 recap : Déclarant + Description ── */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/35 mb-3">
                      Informations déclarées
                    </p>
                    <div className="space-y-2.5">
                      {/* Nom (obligatoire) */}
                      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                        <User className="size-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-0.5">
                            Déclarant <span className="text-red-400/60">*</span>
                          </p>
                          <p className="text-[13px] text-foreground/80 font-semibold">{alert.name}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {alert.note && (
                        <div className="px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1.5">Description de la situation</p>
                          <p className="text-[13px] text-foreground/70 leading-relaxed">{alert.note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-white/[0.06]" />

                  {/* ── Step 3 recap : Localisation (géo) ── */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/35 mb-3">
                      Localisation
                    </p>
                    <LocationBlock alert={alert} />
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="px-6 py-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/35 mb-4">
                    Suivi en temps réel
                  </p>

                  <div className="relative flex flex-col">
                    {TRACKING_STEPS.map((step, i) => {
                      const StepIcon  = step.icon
                      const isDone    = STATUS_ORDER.indexOf(step.status) <= currentIdx
                      const isCurrent = step.status === alert.status
                      const isLast    = i === TRACKING_STEPS.length - 1
                      const event     = alert.timeline.find((e) => e.status === step.status)

                      return (
                        <div key={step.status} className="flex gap-3">
                          {/* Spine */}
                          <div className="flex flex-col items-center shrink-0 w-7">
                            <motion.div
                              initial={false}
                              animate={{
                                backgroundColor: isDone
                                  ? isResolved ? "rgba(52,211,153,0.85)" : "rgba(239,68,68,0.8)"
                                  : "rgba(255,255,255,0.06)",
                                borderColor: isDone
                                  ? isResolved ? "rgba(52,211,153,0.35)" : "rgba(239,68,68,0.30)"
                                  : "rgba(255,255,255,0.07)",
                                scale: isCurrent ? 1.12 : 1,
                              }}
                              transition={{ duration: 0.35 }}
                              className="size-7 rounded-xl border flex items-center justify-center shrink-0"
                            >
                              <StepIcon
                                className={cn(
                                  "size-3.5",
                                  isDone ? "text-white" : "text-white/20",
                                  isCurrent && !isResolved && "animate-pulse",
                                )}
                                strokeWidth={isCurrent ? 2 : 1.5}
                              />
                            </motion.div>
                            {!isLast && (
                              <div
                                className="w-px flex-1 my-1.5 min-h-[20px]"
                                style={{
                                  background: isDone
                                    ? isResolved ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"
                                    : "rgba(255,255,255,0.05)",
                                }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className={cn("pb-4 flex-1 min-w-0", isLast && "pb-0")}>
                            <div className="flex items-center gap-2 justify-between">
                              <p className={cn(
                                "text-[13px] font-semibold",
                                isDone ? "text-foreground/85" : "text-muted-foreground/25",
                              )}>
                                {step.label}
                              </p>
                              {event && (
                                <span className="text-[10px] text-muted-foreground/30 font-mono shrink-0">{event.time}</span>
                              )}
                            </div>
                            {event && (
                              <p className="text-[12px] text-muted-foreground/45 mt-0.5 leading-relaxed">{event.detail}</p>
                            )}
                            {isCurrent && !isResolved && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="size-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                                <span className="text-[10px] text-red-400/55">En attente de mise à jour…</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          {/* ── Footer : action principale ── */}
          {next && (
            <div className="px-6 py-4 border-t border-white/[0.07] bg-white/[0.01]">
              {!confirmOpen ? (
                <Button
                  onClick={() => setConfirmOpen(true)}
                  disabled={advancing}
                  className={cn(
                    "w-full h-11 text-[13px] font-bold gap-2",
                    "bg-[#F56E0F] hover:bg-[#F56E0F]/90 text-[#0e0d12]",
                    "shadow-[0_0_24px_rgba(245,110,15,0.25)] transition-all",
                  )}
                >
                  {advancing
                    ? <Loader2 className="size-4 animate-spin" />
                    : <ChevronRight className="size-4" />}
                  {next.label}
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-[12px] text-center text-muted-foreground/60">
                    Confirmer : <span className="text-foreground/80 font-medium">{next.label}</span> pour <span className="font-mono text-[#F56E0F]">{alert.ref}</span> ?
                  </p>
                  {/* Champ note optionnel - transmis à la timeline BDD */}
                  <textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Note optionnelle (visible dans l'historique)…"
                    rows={2}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl resize-none text-[12px]",
                      "bg-white/[0.05] border border-white/[0.10]",
                      "text-foreground/80 placeholder:text-muted-foreground/30",
                      "outline-none focus:border-[#F56E0F]/40 transition-colors",
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 text-[13px]"
                      onClick={() => { setConfirmOpen(false); setNoteValue("") }}
                    >
                      <ChevronLeft className="size-4 mr-1" />
                      Annuler
                    </Button>
                    <Button
                      onClick={handleAdvance}
                      disabled={advancing}
                      className="flex-1 h-10 text-[13px] font-bold bg-[#F56E0F] hover:bg-[#F56E0F]/90 text-[#0e0d12]"
                    >
                      {advancing
                        ? <Loader2 className="size-4 mr-1.5 animate-spin" />
                        : <CheckCircle2 className="size-4 mr-1.5" />}
                      Confirmer
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {isResolved && (
            <div className="px-6 py-4 border-t border-white/[0.07]">
              <Button
                variant="outline"
                className="w-full h-10 text-[13px] border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                onClick={onClose}
              >
                <CircleCheck className="size-4 mr-2" />
                Fermer
              </Button>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  )
}