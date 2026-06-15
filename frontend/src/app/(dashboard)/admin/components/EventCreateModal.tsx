"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Send,
  Tag,
  Trash2,
  X,
  Wifi,
  WifiOff,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { createEvent, updateEvent } from "@/lib/api/events"
import { createEventType } from "@/lib/api/event-types"
import { createProgram, deleteProgram, getPrograms } from "@/lib/api/programs"
import {
  type OfflineDraft,
  getOfflineDrafts,
  removeOfflineDraft,
  saveOfflineDraft,
  updateOfflineDraft,
} from "@/lib/offline-drafts"
import type {
  Event,
  EventCreatePayload,
  EventType,
  Program,
  ProgramCreatePayload,
  Site,
} from "@/lib/types/api"

// ─── Constantes ───────────────────────────────────────────────────────────────

const TARGET_RATIO  = 16 / 10
const OUT_WIDTH     = 800
const OUT_HEIGHT    = Math.round(OUT_WIDTH / TARGET_RATIO)
const MAX_FILE_SIZE = 5 * 1024 * 1024

const STEPS = [
  { id: 1, label: "Informations",      short: "Infos",    icon: FileText      },
  { id: 2, label: "Créneaux & Médias", short: "Médias",   icon: CalendarClock },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlotDraft { startTime: string; endTime: string }

export interface EventModalProps {
  open:                 boolean
  onClose:              () => void
  sites:                Site[]
  eventTypes:           EventType[]
  onDone:               () => void
  onEventTypeCreated?:  (newType: EventType) => void
  editingEvent?:        Event | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genLocalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return "local-" + Math.random().toString(36).slice(2, 11)
}

async function cropTo16x10(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const { naturalWidth: srcW, naturalHeight: srcH } = img
      const srcRatio = srcW / srcH
      let sx = 0, sy = 0, sw = srcW, sh = srcH
      if (srcRatio > TARGET_RATIO) { sw = Math.round(srcH * TARGET_RATIO); sx = Math.round((srcW - sw) / 2) }
      else                         { sh = Math.round(srcW / TARGET_RATIO); sy = Math.round((srcH - sh) / 2) }
      const canvas = document.createElement("canvas")
      canvas.width  = OUT_WIDTH
      canvas.height = OUT_HEIGHT
      canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, OUT_WIDTH, OUT_HEIGHT)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.88))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Chargement image échoué")) }
    img.src = url
  })
}

function formatSlot(s: string, e: string) {
  try {
    return `${format(new Date(s), "dd MMM yyyy, HH:mm", { locale: fr })} → ${format(new Date(e), "HH:mm", { locale: fr })}`
  } catch { return `${s} → ${e}` }
}

function completionScore(data: Partial<EventCreatePayload>): number {
  return Math.round([data.name, data.eventTypeId, data.siteId, data.description].filter(Boolean).length / 4 * 100)
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

// ─── Dates du festival ────────────────────────────────────────────────────────
// Le festival se tient les 8, 9 et 10 janvier chaque année.
// Après le 10 janvier, on pointe automatiquement vers l'édition suivante.

function getFestivalYear(): number {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), 0, 10, 23, 59, 59);
  return now > cutoff ? now.getFullYear() + 1 : now.getFullYear();
}

/**
 * Sélecteur date + heure custom shadcn.
 * value / onChange : chaîne ISO-like "YYYY-MM-DDTHH:mm" (compatible datetime-local).
 * Le calendrier est restreint aux 3 dates du festival (8, 9, 10 janvier).
 */
function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Choisir…",
  disabled,
}: {
  value:       string
  onChange:    (v: string) => void
  label?:      string
  placeholder?: string
  disabled?:   boolean
}) {
  const [open, setOpen] = useState(false)

  // Parse la valeur courante
  const parsed = value ? new Date(value) : undefined
  const dateStr = parsed && !isNaN(parsed.getTime())
    ? format(parsed, "dd MMM yyyy", { locale: fr })
    : null
  const timeStr = parsed && !isNaN(parsed.getTime())
    ? format(parsed, "HH:mm", { locale: fr })
    : null

  // Extrait HH et mm depuis la valeur
  const hh = value?.split("T")[1]?.slice(0, 2) ?? ""
  const mm = value?.split("T")[1]?.slice(3, 5) ?? ""
  const datepart = value?.split("T")[0] ?? ""

  // ── Dates autorisées : 8, 9, 10 janvier de l'année du festival ──────────
  const festivalYear  = getFestivalYear()
  const festivalDates = [
    new Date(festivalYear, 0, 8),
    new Date(festivalYear, 0, 9),
    new Date(festivalYear, 0, 10),
  ]
  const festivalMonth = new Date(festivalYear, 0, 1)

  const isDisabledDate = (date: Date): boolean =>
    !festivalDates.some(
      (fd) =>
        fd.getFullYear() === date.getFullYear() &&
        fd.getMonth()    === date.getMonth()    &&
        fd.getDate()     === date.getDate()
    )

  const updateTime = (newHH: string, newMM: string) => {
    const d = datepart || format(new Date(), "yyyy-MM-dd")
    const h = newHH.padStart(2, "0")
    const m = newMM.padStart(2, "0")
    onChange(`${d}T${h}:${m}`)
  }

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return
    const d = format(day, "yyyy-MM-dd")
    const h = hh || "00"
    const m = mm || "00"
    onChange(`${d}T${h}:${m}`)
    // Ne ferme pas le popover : l'utilisateur va souvent régler l'heure ensuite
  }

  // ── iOS-style scroll wheel for hours & minutes ────────────────────────────
  const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  const ITEM_H = 36 // px per item in the wheel
  const VISIBLE = 5 // visible items (must be odd)
  const WHEEL_H = ITEM_H * VISIBLE

  function TimeWheel({
    items, selected, onSelect, label,
  }: { items: string[]; selected: string; onSelect: (v: string) => void; label: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const selectedIdx = Math.max(0, items.indexOf(selected))
    const isScrollingRef = useRef(false)
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Scroll to selected item on mount / external change
    useEffect(() => {
      const el = ref.current
      if (!el || isScrollingRef.current) return
      el.scrollTop = selectedIdx * ITEM_H
    }, [selectedIdx])

    const snapToNearest = (el: HTMLDivElement) => {
      const idx = Math.round(el.scrollTop / ITEM_H)
      const clamped = Math.max(0, Math.min(items.length - 1, idx))
      // Snap scroll position
      el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" })
      if (items[clamped] !== selected) onSelect(items[clamped])
    }

    const handleScroll = () => {
      isScrollingRef.current = true
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false
        if (ref.current) snapToNearest(ref.current)
      }, 120)
    }

    // Allow mouse wheel scroll when hovering the wheel (no page scroll)
    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const el = ref.current
      if (!el) return
      el.scrollTop += e.deltaY > 0 ? ITEM_H : -ITEM_H
    }

    const step = (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(items.length - 1, selectedIdx + dir))
      onSelect(items[next])
      ref.current?.scrollTo({ top: next * ITEM_H, behavior: "smooth" })
    }

    const half = Math.floor(VISIBLE / 2)

    return (
      <div className="flex flex-col items-center gap-0.5 select-none">
        {/* Label */}
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 mb-0.5">{label}</span>

        {/* Up button */}
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex items-center justify-center w-8 h-5 rounded text-muted-foreground/30 hover:text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 transition-all"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Wheel */}
        <div className="relative" style={{ width: 40, height: WHEEL_H }}>
          {/* Selection highlight band */}
          <div
            className="pointer-events-none absolute inset-x-0 rounded-lg bg-[var(--vd-gold)]/10 border border-[var(--vd-gold)]/30 z-10"
            style={{ top: half * ITEM_H, height: ITEM_H }}
          />
          {/* Top fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 rounded-t-lg"
            style={{ height: half * ITEM_H, background: "linear-gradient(to bottom, oklch(0.14 0.018 260 / 0.98), oklch(0.14 0.018 260 / 0.3))" }} />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 rounded-b-lg"
            style={{ height: half * ITEM_H, background: "linear-gradient(to top, oklch(0.14 0.018 260 / 0.98), oklch(0.14 0.018 260 / 0.3))" }} />

          <div
            ref={ref}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className="absolute inset-0 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {/* Top padding - half items above center */}
            <div style={{ height: half * ITEM_H }} />
            {items.map((item) => (
              <div
                key={item}
                onClick={() => {
                  onSelect(item)
                  ref.current?.scrollTo({ top: items.indexOf(item) * ITEM_H, behavior: "smooth" })
                }}
                className="flex items-center justify-center cursor-pointer"
                style={{ height: ITEM_H, width: 40 }}
              >
                <span className={cn(
                  "font-mono text-[14px] transition-all duration-100",
                  item === selected
                    ? "text-[var(--vd-gold)] font-bold"
                    : "text-muted-foreground/35 hover:text-muted-foreground/60"
                )}>
                  {item}
                </span>
              </div>
            ))}
            {/* Bottom padding */}
            <div style={{ height: half * ITEM_H }} />
          </div>
        </div>

        {/* Down button */}
        <button
          type="button"
          onClick={() => step(1)}
          className="flex items-center justify-center w-8 h-5 rounded text-muted-foreground/30 hover:text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 transition-all"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 h-9 rounded-lg border text-left",
            "bg-white/[0.04] border-white/[0.1]",
            "hover:border-white/20 hover:bg-white/[0.06]",
            "focus-visible:outline-none focus-visible:border-[var(--vd-gold)]/40",
            "transition-all duration-200 text-[12px]",
            open && "border-[var(--vd-gold)]/40 bg-white/[0.06]",
            !value && "text-muted-foreground/40",
          )}
        >
          <CalendarDays className={cn(
            "size-3.5 shrink-0 transition-colors",
            value ? "text-[var(--vd-gold)]" : "text-muted-foreground/30"
          )} />
          <span className="flex-1 truncate">
            {dateStr
              ? <><span className="text-foreground/80">{dateStr}</span>{timeStr && <span className="text-muted-foreground/50 ml-1.5">à {timeStr}</span>}</>
              : placeholder}
          </span>
          <Clock className="size-3 shrink-0 text-muted-foreground/25" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className={cn(
          "w-auto p-0 border border-white/[0.1]",
          "bg-[oklch(0.14_0.018_260/0.98)] shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
          "rounded-xl overflow-hidden",
        )}
      >
        {/* Layout : calendrier à gauche, roues à droite */}
        <div className="flex items-stretch">
          {/* Calendrier - restreint aux 3 dates du festival */}
          <Calendar
            mode="single"
            selected={parsed && !isNaN(parsed.getTime()) ? parsed : undefined}
            onSelect={handleDaySelect}
            locale={fr}
            className="p-3 flex-shrink-0"
            month={festivalMonth}
            onMonthChange={() => {}}
            startMonth={festivalMonth}
            endMonth={festivalMonth}
            disabled={isDisabledDate}
            classNames={{
              selected:
                "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 focus:bg-[var(--vd-gold)]",
              today:
                "border border-[var(--vd-gold)]/40 text-[var(--vd-gold)]",
              disabled:
                "text-muted-foreground/20 cursor-not-allowed opacity-30",
            }}
          />

          {/* Séparateur vertical */}
          <div className="w-px bg-white/[0.07] my-3" />

          {/* Colonne heure : roues + bouton OK */}
          <div className="flex flex-col items-center justify-between px-4 py-3 gap-3">
            <div className="flex items-center gap-1">
              <Clock className="size-3 text-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-medium">Heure</span>
            </div>

            <div className="flex items-center gap-1">
              <TimeWheel
                items={HOURS}
                selected={hh.padStart(2, "0") || "00"}
                onSelect={(v) => updateTime(v, mm)}
                label="H"
              />
              <span className="text-[var(--vd-gold)] font-bold text-base select-none pb-6">:</span>
              <TimeWheel
                items={MINUTES}
                selected={mm.padStart(2, "0") || "00"}
                onSelect={(v) => updateTime(hh, v)}
                label="M"
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setOpen(false)}
              className={cn(
                "w-full h-7 px-3 text-[11px] font-semibold rounded-lg",
                "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90",
              )}
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function FormField({ label, required, tooltip, error, hint, children }: {
  label: string
  required?: boolean
  tooltip?: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label className="text-[13px] font-medium text-foreground/80 tracking-wide">
          {label}
          {required && <span className="text-[var(--vd-gold)] ml-0.5">*</span>}
        </Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground/70 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-[220px]">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{hint}</p>}
      {error && (
        <p className="text-[11px] text-destructive flex items-center gap-1.5 font-medium">
          <AlertCircle className="size-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

/** Chip de sélection générique (type d'événement, site) */
function SelectChip({
  selected, onClick, icon: Icon, label,
}: { selected: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] font-medium transition-all duration-200 text-left w-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vd-gold)]/40",
        selected
          ? "bg-[var(--vd-gold)]/12 border-[var(--vd-gold)]/50 text-[var(--vd-gold)] shadow-[0_0_0_1px_var(--vd-gold)/20,inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-white/[0.06]"
      )}
    >
      {/* Dot indicateur de sélection */}
      <span className={cn(
        "size-2 rounded-full shrink-0 transition-all duration-200",
        selected ? "bg-[var(--vd-gold)] shadow-[0_0_6px_var(--vd-gold)]" : "bg-white/15 group-hover:bg-white/25"
      )} />
      <Icon className="size-3.5 shrink-0 opacity-70" />
      <span className="truncate leading-none">{label}</span>
      {selected && <CheckCircle2 className="size-3.5 ml-auto shrink-0 text-[var(--vd-gold)]" />}
    </button>
  )
}

/** Barre de progression de complétion stylisée */
function CompletionBar({ score }: { score: number }) {
  const segments = [
    { threshold: 25,  label: "Nom" },
    { threshold: 50,  label: "Type" },
    { threshold: 75,  label: "Site" },
    { threshold: 100, label: "Desc." },
  ]
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Complétion</span>
        <span className={cn(
          "text-[11px] font-mono font-semibold transition-colors",
          score === 100 ? "text-green-400" : score >= 50 ? "text-[var(--vd-gold)]" : "text-muted-foreground/60"
        )}>{score}%</span>
      </div>
      {/* Segments */}
      <div className="flex gap-1">
        {segments.map(({ threshold, label }) => (
          <div key={threshold} className="flex-1 group relative">
            <div className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              score >= threshold ? "bg-[var(--vd-gold)]" : "bg-white/8"
            )} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Stepper horizontal */
function StepIndicator({ step, steps }: { step: number; steps: typeof STEPS }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, idx) => {
        const isDone    = s.id < step
        const isActive  = s.id === step
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className={cn(
              "flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-300 justify-center",
              isActive  ? "bg-[var(--vd-gold)]/12 text-[var(--vd-gold)] border border-[var(--vd-gold)]/30 shadow-[0_0_12px_var(--vd-gold)/10]"
              : isDone  ? "text-green-400 bg-green-500/6 border border-green-500/20"
                        : "text-muted-foreground/40 border border-transparent"
            )}>
              <span className={cn(
                "size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                isActive ? "bg-[var(--vd-gold)] text-[var(--vd-deep)]"
                : isDone ? "bg-green-500/20 text-green-400"
                         : "bg-white/8 text-muted-foreground/40"
              )}>
                {isDone ? <CheckCircle2 className="size-3" /> : s.id}
              </span>
              <span className="hidden sm:inline truncate">{s.label}</span>
              <span className="sm:hidden truncate">{s.short}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "h-px w-4 shrink-0 mx-1 transition-all duration-500",
                step > s.id ? "bg-green-500/40" : "bg-white/8"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export function EventCreateModal({
  open, onClose, sites, eventTypes, onDone, onEventTypeCreated, editingEvent = null,
}: EventModalProps) {
  const isEdit = editingEvent !== null

  const [step,          setStep]          = useState(1)
  const [formData,      setFormData]      = useState<Partial<EventCreatePayload>>({ status: "DRAFT" })
  const [errors,        setErrors]        = useState<Record<string, string>>({})
  const [creatingEvent, setCreatingEvent] = useState(false)

  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [backendSynced, setBackendSynced] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const [imagePreview,  setImagePreview]  = useState<string | null>(null)
  const [imageDataUrl,  setImageDataUrl]  = useState<string | null>(null)
  const [imageError,    setImageError]    = useState<string | null>(null)
  const [imageLoading,  setImageLoading]  = useState(false)
  // Cropper states
  const [cropMode,      setCropMode]      = useState(false)
  const [rawImageUrl,   setRawImageUrl]   = useState<string | null>(null)
  const [cropOffset,    setCropOffset]    = useState({ x: 0, y: 0 })
  const [cropScale,     setCropScale]     = useState(1)
  // Refs mirror state so renderCroppedImage always reads the latest value (no stale closure)
  const cropOffsetRef   = useRef({ x: 0, y: 0 })
  const cropScaleRef    = useRef(1)
  const rawImageUrlRef  = useRef<string | null>(null)
  const dragStartRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)

  const [publicDesc,    setPublicDesc]    = useState("")
  const [publicDescEn, setPublicDescEn]  = useState("")
  const [nameTab,      setNameTab]       = useState<"fr" | "en">("fr")
  const [descTab,      setDescTab]       = useState<"fr" | "en">("fr")
  const [slots,         setSlots]         = useState<Program[]>([])
  const [loadingSlots,  setLoadingSlots]  = useState(false)
  const [slotDraft,     setSlotDraft]     = useState<SlotDraft>({ startTime: "", endTime: "" })
  const [addingSlot,    setAddingSlot]    = useState(false)
  const [removingSlot,  setRemovingSlot]  = useState<string | null>(null)
  const [publishing,    setPublishing]    = useState(false)

  // ── Création inline de type d'événement ───────────────────────────────────
  const [showNewType,    setShowNewType]    = useState(false)
  const [newTypeName,    setNewTypeName]    = useState("")
  const [newTypeLoading, setNewTypeLoading] = useState(false)
  const [newTypeError,   setNewTypeError]   = useState<string | null>(null)
  const newTypeInputRef = useRef<HTMLInputElement>(null)

  const handleCreateEventType = async () => {
    const name = newTypeName.trim()
    if (!name) { setNewTypeError("Le nom est requis"); return }
    setNewTypeLoading(true)
    setNewTypeError(null)
    try {
      const res = await createEventType(name)
      if (!res.success) {
        setNewTypeError(res.message ?? "Erreur lors de la création")
        return
      }
      const created = res.data
      onEventTypeCreated?.(created)
      set("eventTypeId", created.id)
      setNewTypeName("")
      setShowNewType(false)
      toast.success(`Type "${created.name}" créé`, { description: "Sélectionné automatiquement." })
    } catch {
      setNewTypeError("Erreur réseau - réessayez")
    } finally {
      setNewTypeLoading(false)
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    setErrors({})
    setCreatingEvent(false)
    setImagePreview(null); setImageDataUrl(null); setImageError(null); setImageLoading(false)
    setCropMode(false); setRawImageUrl(null); rawImageUrlRef.current = null
    setCropOffset({ x: 0, y: 0 }); cropOffsetRef.current = { x: 0, y: 0 }
    setCropScale(1); cropScaleRef.current = 1
    setSlotDraft({ startTime: "", endTime: "" })
    setPublishing(false)
    setShowNewType(false)
    setNewTypeName("")
    setNewTypeError(null)

    if (isEdit && editingEvent) {
      const isOffline = editingEvent.id.startsWith("local-")
      setStep(2)
      setActiveEventId(editingEvent.id)
      setBackendSynced(!isOffline)
      setFormData({
        name:        editingEvent.name,
        description: editingEvent.description || "",
        status:      editingEvent.status,
        siteId:      editingEvent.siteId,
        eventTypeId: editingEvent.eventTypeId,
        nameEn:      editingEvent.nameEn || undefined,
      })
      setPublicDesc(editingEvent.description || "")
      setPublicDescEn(editingEvent.descriptionEn || "")
      if (editingEvent.imageUrl) setImagePreview(editingEvent.imageUrl)
      if (isOffline) {
        // Brouillon offline - créneaux déjà dans programs, pas d'appel API
        setSlots(editingEvent.programs ?? [])
        setLoadingSlots(false)
      } else {
        setSlots([]); setLoadingSlots(true)
        getPrograms(editingEvent.id)
          .then((res) => { if (res.success) setSlots(res.data ?? []) })
          .catch(() => {})
          .finally(() => setLoadingSlots(false))
      }
    } else {
      setStep(1)
      setActiveEventId(null)
      setBackendSynced(false)
      setFormData({ status: "DRAFT" })
      setPublicDesc("")
      setSlots([])
    }
  }, [open, isEdit, editingEvent])

  const handleOpenChange = (o: boolean) => { if (!o) onClose() }

  const set = (key: keyof EventCreatePayload, value: unknown) => {
    setFormData((p) => ({ ...p, [key]: value }))
    setErrors((p) => { const n = { ...p }; delete n[key as string]; return n })
  }

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {}
    if (!formData.name?.trim()) e.name        = "Le nom est obligatoire"
    if (!formData.eventTypeId)  e.eventTypeId = "Choisissez un type d'événement"
    if (!formData.siteId)       e.siteId      = "Sélectionnez un site"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreateAndContinue = async () => {
    if (!validateStep1()) return
    setCreatingEvent(true)
    try {
      const payload: EventCreatePayload = {
        name:          formData.name!,
        description:   formData.description || undefined,
        status:        "DRAFT",
        siteId:        formData.siteId!,
        eventTypeId:   formData.eventTypeId!,
        ...(formData.nameEn?.trim() ? { nameEn: formData.nameEn.trim() } : {}),
      }
      const res = await createEvent(payload)
      if (res.success && res.data?.id) {
        setActiveEventId(res.data.id)
        setBackendSynced(true)
        toast.success("Événement créé en brouillon", { description: "Ajoutez créneaux et médias." })
      } else {
        // Backend inaccessible - on persiste immédiatement en localStorage
        const localId = genLocalId()
        const draft: OfflineDraft = {
          id:             localId,
          status:         "DRAFT",
          offlinePending: true,
          createdAt:      new Date().toISOString(),
          name:           formData.name!,
          description:    formData.description || undefined,
          siteId:         formData.siteId!,
          eventTypeId:    formData.eventTypeId!,
          slots:          [],
        }
        saveOfflineDraft(draft)
        setActiveEventId(localId)
        setBackendSynced(false)
        toast.warning("Mode hors ligne", { description: "Brouillon sauvegardé localement - synchronisé dès reconnexion." })
      }
    } catch {
      // Erreur réseau - même traitement
      const localId = genLocalId()
      const draft: OfflineDraft = {
        id:             localId,
        status:         "DRAFT",
        offlinePending: true,
        createdAt:      new Date().toISOString(),
        name:           formData.name!,
        description:    formData.description || undefined,
        siteId:         formData.siteId!,
        eventTypeId:    formData.eventTypeId!,
        slots:          [],
      }
      saveOfflineDraft(draft)
      setActiveEventId(localId)
      setBackendSynced(false)
      toast.warning("Mode hors ligne", { description: "Brouillon sauvegardé localement - synchronisé dès reconnexion." })
    } finally {
      setCreatingEvent(false)
      setStep(2)
    }
  }

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError(null)
    if (!file.type.startsWith("image/")) { setImageError("Format non supporté - JPEG, PNG ou WebP"); return }
    if (file.size > MAX_FILE_SIZE)        { setImageError("Fichier trop volumineux (max 5 Mo)");       return }
    // Load raw image for cropper - no auto-crop
    const url = URL.createObjectURL(file)
    rawImageUrlRef.current = url
    setRawImageUrl(url)
    cropOffsetRef.current = { x: 0, y: 0 }
    cropScaleRef.current = 1
    setCropOffset({ x: 0, y: 0 })
    setCropScale(1)
    setCropMode(true)
    if (fileRef.current) fileRef.current.value = ""
  }, [])

  // Renders the current crop position into a 16:10 canvas → base64.
  // Takes explicit container dimensions so it never depends on a DOM ref
  // (which may be null when ImageCropper remounts between renders).
  const renderCroppedImage = useCallback((cw: number, ch: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = rawImageUrlRef.current
      const offset = cropOffsetRef.current
      const scale = cropScaleRef.current
      if (!url) { reject(new Error("No image URL")); return }
      const img = new Image()
      img.onload = () => {
        const { naturalWidth: nw, naturalHeight: nh } = img
        // L'image CSS a width = cw * scale (car style={{ width: `${scale*100}%` }})
        // La hauteur CSS se déduit du ratio naturel
        const displayW = cw * scale
        const displayH = nh * (displayW / nw)
        // Position du coin supérieur gauche de l'image dans le viewport
        const imgLeft = cw / 2 - displayW / 2 + offset.x
        const imgTop  = ch / 2 - displayH / 2 + offset.y
        // Ratio pixels affichés → pixels naturels
        const scaleToNatural = nw / displayW
        const sx = Math.max(0, -imgLeft * scaleToNatural)
        const sy = Math.max(0, -imgTop  * scaleToNatural)
        const sw = Math.min(nw - sx, cw * scaleToNatural)
        const sh = Math.min(nh - sy, ch * scaleToNatural)
        const canvas = document.createElement("canvas")
        canvas.width  = OUT_WIDTH
        canvas.height = OUT_HEIGHT
        canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, OUT_WIDTH, OUT_HEIGHT)
        resolve(canvas.toDataURL("image/jpeg", 0.88))
      }
      img.onerror = () => reject(new Error("Image load failed"))
      img.src = url
    })
  }, []) // stable - reads only from refs

  // Called by the Confirm button inside ImageCropper.
  // cw/ch are measured at click time directly from the button's nearest container.
  const handleCropConfirm = useCallback(async (cw: number, ch: number) => {
    setImageLoading(true)
    try {
      const cropped = await renderCroppedImage(cw, ch)
      setImageDataUrl(cropped)
      setImagePreview(cropped)
      setCropMode(false)
    } catch (err) {
      console.error("Crop error:", err)
      setImageError("Impossible de recadrer l'image")
    }
    finally { setImageLoading(false) }
  }, [renderCroppedImage])

  // Drag handlers for the cropper
  const handleCropPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: cropOffsetRef.current.x, oy: cropOffsetRef.current.y }
  }
  const handleCropPointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.mx
    const dy = e.clientY - dragStartRef.current.my
    const next = { x: dragStartRef.current.ox + dx, y: dragStartRef.current.oy + dy }
    cropOffsetRef.current = next
    setCropOffset(next)
  }
  const handleCropPointerUp = () => { dragStartRef.current = null }

  // Zoom via wheel
  const handleCropWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const next = Math.max(0.5, Math.min(4, cropScaleRef.current - e.deltaY * 0.001))
    cropScaleRef.current = next
    setCropScale(next)
  }

  /** Inline image cropper UI */
  function ImageCropper() {
    if (!rawImageUrl) return null
    // Local ref to the viewport div - used only for display and to measure dimensions at confirm time
    const viewportRef = useRef<HTMLDivElement>(null)

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground/60 font-medium">
            Faites glisser pour recadrer · molette pour zoomer
          </span>
          <span className="text-[10px] font-mono text-[var(--vd-gold)]/60">16:10</span>
        </div>
        {/* Crop viewport - fixed 16:10 */}
        <div
          ref={viewportRef}
          className="relative rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-[var(--vd-gold)]/30 select-none"
          style={{ aspectRatio: "16/10" }}
          onPointerDown={handleCropPointerDown}
          onPointerMove={handleCropPointerMove}
          onPointerUp={handleCropPointerUp}
          onPointerLeave={handleCropPointerUp}
          onWheel={handleCropWheel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rawImageUrl}
            alt="Recadrage"
            draggable={false}
            className="absolute max-w-none pointer-events-none"
            style={{
              width: `${cropScale * 100}%`,
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px))`,
            }}
          />
          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "33.33% 33.33%",
          }} />
          {/* Corner marks */}
          {[["top-1 left-1","border-t border-l"],["top-1 right-1","border-t border-r"],["bottom-1 left-1","border-b border-l"],["bottom-1 right-1","border-b border-r"]].map(([pos, bdr]) => (
            <div key={pos} className={`pointer-events-none absolute ${pos} w-4 h-4 ${bdr} border-[var(--vd-gold)] rounded-sm`} />
          ))}
        </div>
        {/* Zoom slider */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-muted-foreground/40 w-4">−</span>
          <input
            type="range" min={50} max={300} step={1}
            value={Math.round(cropScale * 100)}
            onChange={(e) => { const v = Number(e.target.value) / 100; cropScaleRef.current = v; setCropScale(v) }}
            className="flex-1 h-1 accent-[var(--vd-gold)] cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground/40 w-4">+</span>
          <span className="text-[10px] font-mono text-muted-foreground/40 w-8 text-right">{Math.round(cropScale * 100)}%</span>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button" variant="outline" size="sm"
            onClick={() => { setCropMode(false); setRawImageUrl(null); rawImageUrlRef.current = null }}
            className="flex-1 h-8 text-[12px] border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
          >
            Annuler
          </Button>
          <Button
            type="button" size="sm"
            disabled={imageLoading}
            onClick={() => {
              // Measure viewport dimensions right now, at click time - guaranteed to be non-null
              const el = viewportRef.current
              if (!el) { setImageError("Erreur: zone de recadrage introuvable"); return }
              handleCropConfirm(el.clientWidth, el.clientHeight)
            }}
            className="flex-1 h-8 text-[12px] bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
          >
            {imageLoading ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" />Recadrage…</> : <>Appliquer le recadrage</>}
          </Button>
        </div>
      </div>
    )
  }

  const handleAddSlot = async () => {
    if (!activeEventId || !slotDraft.startTime || !slotDraft.endTime) {
      toast.error("Renseignez les dates de début et de fin"); return
    }
    const newStart = new Date(slotDraft.startTime)
    const newEnd   = new Date(slotDraft.endTime)
    if (newEnd <= newStart) {
      toast.error("La fin doit être après le début"); return
    }
    // Vérifie le chevauchement avec les créneaux existants
    const overlapping = slots.find((s) => {
      const sStart = new Date(s.startTime)
      const sEnd   = new Date(s.endTime)
      // Chevauchement si : newStart < sEnd ET newEnd > sStart
      return newStart < sEnd && newEnd > sStart
    })
    if (overlapping) {
      const label = formatSlot(overlapping.startTime, overlapping.endTime)
      toast.error("Créneau en conflit", {
        description: `Ce créneau chevauche : ${label}`,
      })
      return
    }
    if (!backendSynced) {
      const localSlot = {
        id: genLocalId(), eventId: activeEventId,
        startTime: new Date(slotDraft.startTime).toISOString(),
        endTime:   new Date(slotDraft.endTime).toISOString(),
      } as Program
      const nextSlots = [...slots, localSlot]
      setSlots(nextSlots)
      setSlotDraft({ startTime: "", endTime: "" })
      // Persister les créneaux dans le draft localStorage
      const drafts = getOfflineDrafts()
      const draft = drafts.find((d) => d.id === activeEventId)
      if (draft) {
        draft.slots = nextSlots.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime }))
        saveOfflineDraft(draft)
      }
      toast.success("Créneau ajouté")
      return
    }
    setAddingSlot(true)
    try {
      const res = await createProgram({
        eventId: activeEventId,
        startTime: new Date(slotDraft.startTime).toISOString(),
        endTime:   new Date(slotDraft.endTime).toISOString(),
      } as ProgramCreatePayload)
      if (res.success && res.data) {
        setSlots((p) => [...p, res.data])
        setSlotDraft({ startTime: "", endTime: "" })
        toast.success("Créneau ajouté")
      } else { toast.error(res.message) }
    } catch { toast.error("Erreur réseau") }
    finally { setAddingSlot(false) }
  }

  const handleRemoveSlot = async (id: string) => {
    if (!backendSynced || id.startsWith("local-")) {
      const nextSlots = slots.filter((s) => s.id !== id)
      setSlots(nextSlots)
      // Persister la suppression dans le draft localStorage
      if (activeEventId) {
        const drafts = getOfflineDrafts()
        const draft = drafts.find((d) => d.id === activeEventId)
        if (draft) {
          draft.slots = nextSlots.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime }))
          saveOfflineDraft(draft)
        }
      }
      return
    }
    setRemovingSlot(id)
    try {
      const res = await deleteProgram(id)
      if (res.success) setSlots((p) => p.filter((s) => s.id !== id))
      else toast.error(res.message)
    } catch { toast.error("Erreur réseau") }
    finally { setRemovingSlot(null) }
  }

  const handleFinish = async (publish: boolean) => {
    setPublishing(true)
    try {
      if (!backendSynced) {
        // Tentative de sync vers le backend
        const payload: EventCreatePayload = {
          name:          formData.name!,
          description:   publicDesc.trim() || formData.description || undefined,
          status:        publish ? "PUBLISHED" : "DRAFT",
          siteId:        formData.siteId!,
          eventTypeId:   formData.eventTypeId!,
          ...(imageDataUrl ? { imageUrl: imageDataUrl } : {}),
          ...(formData.nameEn?.trim()   ? { nameEn: formData.nameEn.trim() }           : {}),
          ...(publicDescEn.trim()       ? { descriptionEn: publicDescEn.trim() }       : {}),
        }
        const res = await createEvent(payload)
        if (res.success && res.data?.id) {
          const realId = res.data.id
          // Sync des créneaux
          await Promise.allSettled(
            slots.map((s) => createProgram({ eventId: realId, startTime: s.startTime, endTime: s.endTime } as ProgramCreatePayload))
          )
          // Brouillon local synchronisé - on le retire du localStorage
          if (activeEventId) removeOfflineDraft(activeEventId)
          toast.success(publish ? "Événement publié" : "Événement enregistré",
            { description: publish ? "Visible par les festivaliers." : undefined })
          onDone(); onClose()
        } else {
          // Toujours offline - on met à jour le draft avec les dernières données (image, description…)
          if (activeEventId) {
            const drafts = getOfflineDrafts()
            const draft = drafts.find((d) => d.id === activeEventId)
            if (draft) {
              draft.description = publicDesc.trim() || formData.description || undefined
              if (imageDataUrl) draft.imageUrl = imageDataUrl
              saveOfflineDraft(draft)
            }
          }
          toast.warning("Toujours hors ligne", { description: "Brouillon mis à jour localement." })
          onDone(); onClose()
        }
        return
      }
      // ── Cas backend synchronisé ──────────────────────────────────────────────
      if (!activeEventId) return
      // Édition d'un brouillon offline - mise à jour localStorage uniquement
      if (activeEventId.startsWith("local-")) {
        updateOfflineDraft(activeEventId, {
          name:        formData.name!,
          description: publicDesc.trim() || formData.description || undefined,
          siteId:      formData.siteId!,
          eventTypeId: formData.eventTypeId!,
          slots:       slots.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
          ...(imageDataUrl ? { imageUrl: imageDataUrl } : {}),
        })
        toast.success("Brouillon mis à jour")
        onDone(); onClose()
        return
      }
      const patches: Partial<EventCreatePayload> & Record<string, unknown> = {}
      if (publish)              patches.status        = "PUBLISHED"
      if (publicDesc.trim())    patches.description   = publicDesc.trim()
      if (imageDataUrl)         patches.imageUrl      = imageDataUrl
      if (formData.nameEn?.trim()) patches.nameEn     = formData.nameEn.trim()
      if (publicDescEn.trim())  patches.descriptionEn = publicDescEn.trim()
      if (Object.keys(patches).length > 0) {
        const res = await updateEvent(activeEventId, patches as Partial<EventCreatePayload>)
        if (!res.success) { toast.error(res.message); return }
      }
      toast.success(publish ? "Événement publié" : "Enregistré en brouillon",
        { description: publish ? "Visible par les festivaliers." : undefined })
      onDone(); onClose()
    } catch {
      // Erreur inattendue - on sauvegarde quand même les dernières données localement
      if (!backendSynced && activeEventId) {
        const drafts = getOfflineDrafts()
        const draft = drafts.find((d) => d.id === activeEventId)
        if (draft) {
          draft.description = publicDesc.trim() || formData.description || undefined
          if (imageDataUrl) draft.imageUrl = imageDataUrl
          saveOfflineDraft(draft)
        }
        toast.warning("Erreur réseau", { description: "Brouillon conservé localement." })
        onDone(); onClose()
      } else {
        toast.error("Erreur réseau")
      }
    } finally { setPublishing(false) }
  }

  const score = completionScore(formData)

  // ─── Rendu ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(
        // Reset padding/gap par défaut du Dialog
        "p-0 gap-0",
        // Masque le bouton close natif injecté par shadcn/Radix - on utilise notre X custom
        "[&>button:first-of-type]:hidden",
        // Fond et bordure
        "border border-white/[0.08] bg-[oklch(0.12_0.018_260/0.97)]",
        // Layout interne en colonne - hauteur contrainte pour que le scroll fonctionne
        "flex flex-col",
        // overflow hidden sur le conteneur global pour éviter le double scroll
        "overflow-hidden",

        // ── Mobile : drawer depuis le bas ──────────────────────────────
        "fixed bottom-0 left-0 right-0 top-auto",
        "rounded-t-3xl rounded-b-none",
        // Hauteur fixe sur mobile pour que flex-1 sur ScrollArea ait un parent contraint
        "h-[92dvh] max-h-[92dvh] w-full",
        "translate-x-0 translate-y-0",

        // ── Desktop : dialog centré ────────────────────────────────────
        "sm:inset-auto sm:left-1/2 sm:top-1/2",
        "sm:-translate-x-1/2 sm:-translate-y-1/2",
        "sm:rounded-2xl",
        // Hauteur fixe desktop - ScrollArea prend le reste
        "sm:h-[88dvh] sm:max-h-[88dvh]",
        "sm:w-[min(580px,calc(100vw-2rem))]",
        "sm:max-w-none",

        // Ombre profonde
        "shadow-[0_-8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        "sm:shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
      )}>

        {/* ═══════════════════════════════════════════════════════════════
            HEADER FIXE
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex-none">
          {/* Drag handle mobile */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* Top bar : titre + close */}
          <div className="flex items-start justify-between px-5 pt-4 pb-3">
            <DialogHeader className="gap-0.5 flex-1 min-w-0 pr-3">
              <DialogTitle className="text-[15px] sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-7 rounded-lg bg-[var(--vd-gold)]/12 border border-[var(--vd-gold)]/25 shrink-0">
                  <CalendarPlus className="size-4 text-[var(--vd-gold)]" />
                </span>
                {isEdit ? "Modifier l'événement" : "Nouvel événement"}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                {isEdit
                  ? "Modifiez les créneaux et les médias de l'événement."
                  : step === 1
                    ? "Renseignez les informations - l'événement sera créé en brouillon."
                    : "Complétez avec créneaux horaires et médias."}
              </DialogDescription>
            </DialogHeader>

            {/* Bouton fermer personnalisé */}
            <button
              onClick={onClose}
              className="shrink-0 size-7 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-white/8 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Barre de complétion (step 1 uniquement) */}
          {!isEdit && step === 1 && (
            <div className="px-5 pb-3">
              <CompletionBar score={score} />
            </div>
          )}

          {/* Stepper */}
          {!isEdit && (
            <div className="px-5 pb-3">
              <StepIndicator step={step} steps={STEPS} />
            </div>
          )}

          {/* Séparateur */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CORPS SCROLLABLE
        ═══════════════════════════════════════════════════════════════ */}
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-5 py-5 space-y-5">

            {/* ══ STEP 1 : Informations ══════════════════════════════════ */}
            {step === 1 && !isEdit && (
              <div className="space-y-5">

                {/* Nom avec onglets FR/EN */}
                <FormField
                  label="Nom de l'événement"
                  required
                  tooltip="Titre affiché dans le programme et sur la carte festivalière"
                  error={errors.name}
                >
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08] mb-2 w-fit">
                    {(["fr", "en"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setNameTab(tab)}
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold uppercase transition-colors",
                          nameTab === tab
                            ? "bg-[var(--vd-gold)]/20 text-[var(--vd-gold)]"
                            : "text-muted-foreground/50 hover:text-foreground"
                        )}
                      >{tab}</button>
                    ))}
                  </div>
                  {nameTab === "fr" ? (
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="ex : Cérémonie d'ouverture"
                      className={cn(
                        "h-10 text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl",
                        "placeholder:text-muted-foreground/30",
                        "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
                        "transition-all duration-200",
                        errors.name && "border-destructive/60 focus:border-destructive/60"
                      )}
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={formData.nameEn || ""}
                      onChange={(e) => set("nameEn", e.target.value)}
                      placeholder="ex : Opening Ceremony (optional)"
                      className={cn(
                        "h-10 text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl",
                        "placeholder:text-muted-foreground/30",
                        "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
                        "transition-all duration-200"
                      )}
                    />
                  )}
                </FormField>

                {/* Type d'événement */}
                <FormField
                  label="Type d'événement"
                  required
                  tooltip="Catégorie utilisée pour le filtrage dans l'app mobile"
                  error={errors.eventTypeId}
                >
                  <div className="space-y-2.5">
                    {/* Grille des types existants + bouton + */}
                    <div className="grid grid-cols-2 gap-2">
                      {eventTypes.map((t) => (
                        <SelectChip
                          key={t.id}
                          selected={formData.eventTypeId === t.id}
                          onClick={() => set("eventTypeId", t.id)}
                          icon={Tag}
                          label={t.name}
                        />
                      ))}
                      {/* Bouton ajouter un type */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewType((v) => !v)
                          setNewTypeError(null)
                          setNewTypeName("")
                          setTimeout(() => newTypeInputRef.current?.focus(), 80)
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 h-10 rounded-xl border text-[12px] font-medium transition-all duration-200",
                          showNewType
                            ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/40 text-[var(--vd-gold)]"
                            : "bg-white/[0.025] border-white/[0.08] border-dashed text-muted-foreground/40 hover:border-[var(--vd-gold)]/30 hover:text-[var(--vd-gold)]/70 hover:bg-[var(--vd-gold)]/5"
                        )}
                      >
                        <Plus className={cn(
                          "size-3.5 transition-transform duration-200",
                          showNewType && "rotate-45"
                        )} />
                        <span>{showNewType ? "Annuler" : "Nouveau type"}</span>
                      </button>
                    </div>

                    {/* Panel inline de création - animé */}
                    {showNewType && (
                      <div className="rounded-xl border border-[var(--vd-gold)]/20 bg-[var(--vd-gold)]/[0.04] p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* En-tête */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center size-5 rounded-md bg-[var(--vd-gold)]/15 border border-[var(--vd-gold)]/25 shrink-0">
                            <Tag className="size-3 text-[var(--vd-gold)]" />
                          </span>
                          <p className="text-[11px] font-semibold text-[var(--vd-gold)]/80 uppercase tracking-wider">
                            Nouveau type d'événement
                          </p>
                        </div>

                        {/* Input + bouton sur la même ligne */}
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              ref={newTypeInputRef}
                              type="text"
                              value={newTypeName}
                              onChange={(e) => { setNewTypeName(e.target.value); setNewTypeError(null) }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); handleCreateEventType() }
                                if (e.key === "Escape") { setShowNewType(false) }
                              }}
                              placeholder="ex : Cérémonie, Atelier, Concert…"
                              maxLength={60}
                              className={cn(
                                "w-full h-9 px-3 rounded-lg border text-[12px] bg-white/[0.05] outline-none transition-all duration-200",
                                "placeholder:text-muted-foreground/30 text-foreground/90",
                                newTypeError
                                  ? "border-red-400/50 focus:border-red-400/70"
                                  : "border-white/[0.1] focus:border-[var(--vd-gold)]/50 focus:bg-white/[0.07]"
                              )}
                            />
                            {newTypeName && (
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/25 font-mono pointer-events-none">
                                {newTypeName.length}/60
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleCreateEventType}
                            disabled={newTypeLoading || !newTypeName.trim()}
                            className={cn(
                              "shrink-0 h-9 px-3.5 rounded-lg text-[12px] font-semibold transition-all duration-200 flex items-center gap-1.5",
                              "bg-[var(--vd-gold)] text-[var(--vd-deep)]",
                              "hover:bg-[var(--vd-gold)]/90 shadow-[0_0_12px_var(--vd-gold)/20]",
                              "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            )}
                          >
                            {newTypeLoading
                              ? <Loader2 className="size-3.5 animate-spin" />
                              : <><Plus className="size-3.5" />Créer</>}
                          </button>
                        </div>

                        {/* Message d'erreur */}
                        {newTypeError && (
                          <div className="flex items-center gap-1.5 text-[11px] text-red-400 animate-in fade-in duration-150">
                            <AlertCircle className="size-3 shrink-0" />
                            {newTypeError}
                          </div>
                        )}

                        {/* Hint */}
                        {!newTypeError && (
                          <p className="text-[10px] text-muted-foreground/35">
                            Appuyez sur <kbd className="px-1 py-0.5 rounded bg-white/8 text-[9px] font-mono border border-white/10">Entrée</kbd> pour créer · <kbd className="px-1 py-0.5 rounded bg-white/8 text-[9px] font-mono border border-white/10">Échap</kbd> pour annuler
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Site */}
                <FormField
                  label="Site de déroulement"
                  required
                  tooltip="Lieu physique à Ouidah où se tient l'événement"
                  error={errors.siteId}
                >
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {sites.map((site) => (
                      <SelectChip
                        key={site.id}
                        selected={formData.siteId === site.id}
                        onClick={() => set("siteId", site.id)}
                        icon={MapPin}
                        label={site.name}
                      />
                    ))}
                  </div>
                </FormField>

                {/* Description interne */}
                <FormField
                  label="Notes internes"
                  tooltip="Mémo pour l'équipe admin - non visible par les festivaliers"
                  hint="Ex : contraintes logistiques, contacts, matériel requis…"
                >
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Notes pour l'équipe…"
                    rows={2}
                    className={cn(
                      "text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl resize-none",
                      "placeholder:text-muted-foreground/30",
                      "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
                      "transition-all duration-200"
                    )}
                  />
                </FormField>
              </div>
            )}

            {/* ══ STEP 2 : Créneaux & Médias ════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-6">

                {/* Statut de synchronisation */}
                {!isEdit && (
                  <div className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] font-medium",
                    backendSynced
                      ? "bg-green-500/6 border-green-500/20 text-green-400"
                      : "bg-amber-500/6 border-amber-500/20 text-amber-400"
                  )}>
                    {backendSynced
                      ? <><Wifi className="size-3.5 shrink-0" /><span>Synchronisé - <span className="font-mono text-[11px] opacity-70">{activeEventId?.slice(0, 8)}…</span></span></>
                      : <><WifiOff className="size-3.5 shrink-0" /><span>Mode hors ligne - données envoyées à la publication</span></>
                    }
                  </div>
                )}

                {/* ── Image ─────────────────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-[13px] font-medium text-foreground/80">Image descriptive</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground/70 cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs max-w-[240px]">
                        Recadrée en 16/10 pour les cartes de l'app. Glissez et zoomez pour ajuster le cadrage.
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Crop mode */}
                  {cropMode ? (
                    <ImageCropper />
                  ) : imageLoading ? (
                    <div
                      className="relative rounded-xl border-2 border-dashed border-[var(--vd-gold)]/30 overflow-hidden"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                        <Loader2 className="size-7 text-[var(--vd-gold)] animate-spin" />
                        <p className="text-[11px] text-muted-foreground">Recadrage 16/10…</p>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <div
                      className="relative rounded-xl overflow-hidden group border border-[var(--vd-gold)]/40"
                      style={{ aspectRatio: "16/10" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Aperçu" className="absolute inset-0 w-full h-full object-cover" />
                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm hover:bg-black/85 transition-all"
                        >
                          <Pencil className="size-3.5" /> Changer
                        </button>
                        {rawImageUrl && (
                          <button
                            type="button"
                            onClick={() => { cropOffsetRef.current = { x: 0, y: 0 }; cropScaleRef.current = 1; setCropOffset({ x: 0, y: 0 }); setCropScale(1); setCropMode(true) }}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--vd-gold)]/80 text-[var(--vd-deep)] text-[11px] font-medium backdrop-blur-sm hover:bg-[var(--vd-gold)] transition-all"
                          >
                            <Pencil className="size-3.5" /> Recadrer
                          </button>
                        )}
                      </div>
                      {/* Badge format */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-[var(--vd-gold)] backdrop-blur-sm">16:10</div>
                      {/* Supprimer */}
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageDataUrl(null); setRawImageUrl(null) }}
                        className="absolute top-2 left-2 size-6 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/70 transition-all backdrop-blur-sm"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => !imageLoading && fileRef.current?.click()}
                      className={cn(
                        "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group",
                        "w-full border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]"
                      )}
                      style={{ aspectRatio: "16/10" }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="size-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-[var(--vd-gold)]/10 transition-colors border border-white/[0.08] group-hover:border-[var(--vd-gold)]/20">
                          <ImagePlus className="size-5 text-muted-foreground/40 group-hover:text-[var(--vd-gold)] transition-colors" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] text-muted-foreground/60 group-hover:text-foreground/70 transition-colors font-medium">
                            Cliquez pour téléverser
                          </p>
                          <p className="text-[10px] text-muted-foreground/35">JPEG · PNG · WebP - max 5 Mo</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                  {imageError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1.5 font-medium">
                      <AlertCircle className="size-3 shrink-0" /> {imageError}
                    </p>
                  )}
                </div>

                {/* ── Description publique avec onglets FR/EN ──────── */}
                <FormField
                  label="Description festivaliers"
                  tooltip="Texte affiché sur la fiche de l'événement dans l'app mobile - visible par tous les festivaliers"
                  hint={descTab === "fr" ? `${publicDesc.length} / 500 caractères recommandés` : "Version anglaise optionnelle"}
                >
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08] mb-2 w-fit">
                    {(["fr", "en"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setDescTab(tab)}
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold uppercase transition-colors",
                          descTab === tab
                            ? "bg-[var(--vd-gold)]/20 text-[var(--vd-gold)]"
                            : "text-muted-foreground/50 hover:text-foreground"
                        )}
                      >{tab}</button>
                    ))}
                  </div>
                  {descTab === "fr" ? (
                    <Textarea
                      value={publicDesc}
                      onChange={(e) => setPublicDesc(e.target.value)}
                      placeholder="Ambiance, accès, tenue recommandée…"
                      rows={3}
                      className={cn(
                        "text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl resize-none",
                        "placeholder:text-muted-foreground/30",
                        "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
                        "transition-all duration-200"
                      )}
                    />
                  ) : (
                    <Textarea
                      value={publicDescEn}
                      onChange={(e) => setPublicDescEn(e.target.value)}
                      placeholder="Atmosphere, access, recommended attire… (optional)"
                      rows={3}
                      className={cn(
                        "text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl resize-none",
                        "placeholder:text-muted-foreground/30",
                        "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
                        "transition-all duration-200"
                      )}
                    />
                  )}
                </FormField>

                {/* ── Créneaux horaires ─────────────────────────────── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-[13px] font-medium text-foreground/80 flex items-center gap-2">
                      <CalendarClock className="size-4 text-[var(--vd-gold)]" />
                      Créneaux horaires
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground/70 cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs max-w-[240px]">
                        Ajoutez une ou plusieurs plages horaires. Chaque créneau apparaît dans le programme du festival.
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Formulaire ajout créneau */}
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                          <Label className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wide">Début</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs max-w-[180px]">Date et heure de début du créneau</TooltipContent>
                          </Tooltip>
                        </div>
                        <DateTimePicker
                          value={slotDraft.startTime}
                          onChange={(v) => setSlotDraft((p) => ({ ...p, startTime: v }))}
                          placeholder="Date & heure…"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                          <Label className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wide">Fin</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs max-w-[180px]">Doit être postérieure à l'heure de début</TooltipContent>
                          </Tooltip>
                        </div>
                        <DateTimePicker
                          value={slotDraft.endTime}
                          onChange={(v) => setSlotDraft((p) => ({ ...p, endTime: v }))}
                          placeholder="Date & heure…"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSlot}
                      disabled={addingSlot || !slotDraft.startTime || !slotDraft.endTime}
                      className="w-full h-9 border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40 hover:text-[var(--vd-gold)] rounded-lg text-[12px] font-medium transition-all"
                    >
                      {addingSlot
                        ? <><Loader2 className="mr-2 size-3.5 animate-spin" />Ajout…</>
                        : <><CalendarPlus className="mr-2 size-3.5" />Ajouter ce créneau</>}
                    </Button>
                  </div>

                  {/* Liste des créneaux */}
                  {loadingSlots ? (
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
                      ))}
                    </div>
                  ) : slots.length > 0 ? (
                    <div className="space-y-2">
                      {slots.map((slot, idx) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] group hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="size-5 rounded-md bg-[var(--vd-gold)]/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-[var(--vd-gold)]">
                              {idx + 1}
                            </span>
                            <span className="text-[12px] text-foreground/70 truncate">{formatSlot(slot.startTime, slot.endTime)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(slot.id)}
                            disabled={removingSlot === slot.id}
                            className="ml-2 shrink-0 size-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            {removingSlot === slot.id
                              ? <Loader2 className="size-3.5 animate-spin" />
                              : <Trash2 className="size-3.5" />}
                          </button>
                        </div>
                      ))}
                      <p className="text-[10px] text-muted-foreground/40 text-center pt-0.5">
                        {slots.length} créneau{slots.length > 1 ? "x" : ""} enregistré{slots.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-4 text-center">
                      <CalendarClock className="size-5 text-muted-foreground/20" />
                      <p className="text-[11px] text-muted-foreground/35">Aucun créneau - vous pourrez en ajouter plus tard.</p>
                    </div>
                  )}
                </div>

                {/* ── Récapitulatif ─────────────────────────────────── */}
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Récapitulatif</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Nom",      value: formData.name },
                      { label: "Type",     value: eventTypes.find(t => t.id === formData.eventTypeId)?.name },
                      { label: "Site",     value: sites.find(s => s.id === formData.siteId)?.name },
                      { label: "Créneaux", value: slots.length > 0 ? `${slots.length} créneau${slots.length > 1 ? "x" : ""}` : undefined },
                      { label: "Image",    value: imageDataUrl ? "Téléversée" : undefined },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground/50 w-16 shrink-0">{row.label}</span>
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <div className={cn(
                            "h-px flex-1",
                            row.value ? "bg-white/10" : "bg-white/[0.05]"
                          )} />
                          <span className={cn(
                            "text-[12px] font-medium shrink-0 max-w-[140px] truncate",
                            row.value ? "text-foreground/80" : "text-muted-foreground/25 italic"
                          )}>
                            {row.value || "-"}
                          </span>
                        </div>
                        {row.value
                          ? <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />
                          : <div className="size-3.5 rounded-full border border-white/10 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </ScrollArea>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER FIXE - collé en bas, jamais scrollé
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex-none shrink-0 bg-[oklch(0.12_0.018_260/0.97)]">
          {/* Séparateur avec dégradé subtil */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {/* Légère ombre intérieure vers le haut pour marquer la séparation */}
          <div className="h-3 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3">

            {/* Gauche : retour / annuler */}
            <Button
              variant="ghost"
              size="sm"
              onClick={step === 1 || isEdit ? onClose : () => setStep(1)}
              disabled={creatingEvent || publishing}
              className="text-muted-foreground/70 hover:text-foreground h-9 px-3 text-[13px] rounded-lg"
            >
              {step === 1 || isEdit
                ? "Annuler"
                : <><ChevronLeft className="size-4 mr-1" />Retour</>}
            </Button>

            {/* Centre : indicateur de step (dots) */}
            {!isEdit && (
              <div className="flex items-center gap-1.5">
                {STEPS.map((s) => (
                  <div key={s.id} className={cn(
                    "rounded-full transition-all duration-300",
                    step === s.id ? "w-5 h-1.5 bg-[var(--vd-gold)]" : s.id < step ? "w-1.5 h-1.5 bg-green-500/60" : "w-1.5 h-1.5 bg-white/15"
                  )} />
                ))}
              </div>
            )}

            {/* Droite : action principale */}
            {step === 1 && !isEdit ? (
              <Button
                size="sm"
                onClick={handleCreateAndContinue}
                disabled={creatingEvent}
                className="h-9 px-4 text-[13px] font-semibold rounded-lg bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_16px_var(--vd-gold)/25] transition-all"
              >
                {creatingEvent
                  ? <><Loader2 className="size-4 mr-1.5 animate-spin" />Création…</>
                  : <>Créer et continuer <ChevronRight className="size-4 ml-1" /></>}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFinish(false)}
                  disabled={publishing}
                  className="h-9 px-3 text-[13px] rounded-lg border-white/12 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.04]"
                >
                  {publishing ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleFinish(true)}
                  disabled={publishing}
                  className="h-9 px-4 text-[13px] font-semibold rounded-lg bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_16px_var(--vd-gold)/25] transition-all"
                >
                  {publishing
                    ? <Loader2 className="size-4 animate-spin mr-1.5" />
                    : <Send className="size-4 mr-1.5" />}
                  Publier
                </Button>
              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}