"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState }     from "@/components/dashboard/empty-state"
import { SitesMapModal }  from "./SitesMapModal"
import {
  Plus, MoreHorizontal, Pencil, MapPin, Trash2,
  Navigation, Info, CheckCircle2, AlertCircle, Loader2,
  Map, Building2, Users, ChevronRight, ChevronLeft,
  Eye, Landmark, Toilet, Siren, Bus, LifeBuoy, Scan,
  Tag, Package,
} from "lucide-react"
import { toast } from "sonner"
import type { Site, SiteCreatePayload } from "@/lib/types/api"
import { getSites, createSite, updateSite, deleteSite } from "@/lib/api/sites"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Payload étendu pour inclure la catégorie de marqueur et les champs PRA.
 * SiteCreatePayload de base reste inchangé côté API - on cast à la soumission.
 */
type ExtendedSitePayload = Partial<SiteCreatePayload> & {
  category?: MarkerCategory
  arLabel?:   string
  arContent?: string
  arRadius?:  number
}

type MarkerCategory = "SITE" | "TOILETTES" | "URGENCES" | "TRANSPORT" | "ASSISTANCE" | "PRA"

// ─── Config : catégories de marqueurs ────────────────────────────────────────

const MARKER_CATEGORIES: Record<MarkerCategory, {
  label:       string
  color:       string
  border:      string
  bg:          string
  textClass:   string
  icon:        React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  description: string
}> = {
  SITE: {
    label: "Site Culturel",     color: "#F56E0F", border: "border-orange-500/30", bg: "bg-orange-500/10", textClass: "text-orange-400",
    icon: Landmark,
    description: "Lieu emblématique culturel ou patrimonial du festival",
  },
  TOILETTES: {
    label: "Toilettes",     color: "#4488FF", border: "border-blue-500/30", bg: "bg-blue-500/10", textClass: "text-blue-400",
    icon: Toilet,
    description: "Sanitaires publics, blocs WC mobiles ou fixes",
  },
  URGENCES: {
    label: "Urgences",     color: "#FF3333", border: "border-red-500/30", bg: "bg-red-500/10", textClass: "text-red-400",
    icon: Siren,
    description: "Poste médical, secours, premiers soins",
  },
  TRANSPORT: {
    label: "Transport",     color: "#FFbb00", border: "border-yellow-500/30", bg: "bg-yellow-500/10", textClass: "text-yellow-400",
    icon: Bus,
    description: "Navettes, parking, arrêts de transport en commun",
  },
  ASSISTANCE: {
    label: "Assistance",     color: "#AA44FF", border: "border-purple-500/30", bg: "bg-purple-500/10", textClass: "text-purple-400",
    icon: LifeBuoy,
    description: "Point d'information, bureau d'accueil, objets trouvés",
  },
  PRA: {
    label: "Réalité Augm.",     color: "#00E5CC", border: "border-teal-500/30", bg: "bg-teal-500/10", textClass: "text-teal-400",
    icon: Scan,
    description: "Point de Réalité Augmentée - expérience immersive AR",
  },
}

// ─── Sous-types fonctionnels par catégorie ────────────────────────────────────

const SUBTYPES: Record<MarkerCategory, { value: string; label: string }[]> = {
  SITE:       [
    { value: "CULTUREL",       label: "Culturel"       },
    { value: "PATRIMOINE",     label: "Patrimoine"     },
    { value: "RELIGIEUX",      label: "Religieux"      },
    { value: "MUSEE",          label: "Musée"          },
    { value: "PLACE_PUBLIQUE", label: "Place publique" },
    { value: "FORET_SACREE",   label: "Forêt sacrée"  },
  ],
  TOILETTES:  [
    { value: "BLOC_FIXE",   label: "Bloc fixe"         },
    { value: "MOBILE",      label: "Cabine mobile"     },
    { value: "PMR",         label: "Accessible PMR"    },
  ],
  URGENCES:   [
    { value: "MEDICAL",     label: "Poste médical"     },
    { value: "SECOURS",     label: "Poste de secours"  },
    { value: "PHARMACIE",   label: "Pharmacie"         },
  ],
  TRANSPORT:  [
    { value: "NAVETTE",     label: "Navette festival"  },
    { value: "ZEMIDJAN",    label: "Station Zémidjan"  },
    { value: "PARKING",     label: "Parking"           },
    { value: "ARRET_BUS",   label: "Arrêt bus"         },
  ],
  ASSISTANCE: [
    { value: "INFO",        label: "Point info"        },
    { value: "ACCUEIL",     label: "Bureau d'accueil"  },
    { value: "OBJETS",      label: "Objets trouvés"    },
  ],
  PRA:        [
    { value: "PRA_SCENE",   label: "Scène AR"          },
    { value: "PRA_HISTOIRE",label: "Histoire immersive"},
    { value: "PRA_NATURE",  label: "Nature augmentée"  },
    { value: "PRA_RITUEL",  label: "Rituel AR"         },
  ],
}

// ─── Étapes du formulaire ────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Catégorie",    icon: Tag       },
  { id: 2, label: "Identité",     icon: Building2 },
  { id: 3, label: "Localisation", icon: MapPin    },
  { id: 4, label: "Capacité",     icon: Users     },
]

// ─── Score de complétion ──────────────────────────────────────────────────────

function completionScore(data: ExtendedSitePayload): number {
  const base = [data.category, data.name, data.type, data.description, data.latitude, data.longitude, data.capacity]
  const praFields = data.category === "PRA"
    ? [data.arLabel, data.arContent, data.arRadius]
    : []
  const all = [...base, ...praFields]
  return Math.round((all.filter(Boolean).length / all.length) * 100)
}

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField({
  label, required, tooltip, error, children,
}: {
  label: string; required?: boolean; tooltip?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-[var(--vd-gold)] ml-0.5">*</span>}
        </Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-muted-foreground/40 hover:text-muted-foreground cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-[220px]">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="size-3" /> {error}
        </p>
      )}
    </div>
  )
}

// ─── SiteModal ────────────────────────────────────────────────────────────────

interface SiteModalProps {
  open:        boolean
  onClose:     () => void
  editingSite: Site | null
  onSave:      (data: ExtendedSitePayload) => void
}

function SiteModal({ open, onClose, editingSite, onSave }: SiteModalProps) {
  const [step,       setStep]       = useState(1)
  const [formData,   setFormData]   = useState<ExtendedSitePayload>({})
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoStatus,  setGeoStatus]  = useState<"idle" | "success" | "error">("idle")
  const [mapPickOpen,setMapPickOpen]= useState(false)

  // ── Reset à l'ouverture ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setStep(editingSite ? 2 : 1)   // édition : sauter l'étape catégorie
      setErrors({})
      setGeoStatus("idle")
      setGeoLoading(false)
      setMapPickOpen(false)
      setFormData(
        editingSite
          ? {
              category:   (editingSite as Site & { category?: MarkerCategory }).category ?? "SITE",
              name:        editingSite.name,
              description: editingSite.description || "",
              latitude:    editingSite.latitude,
              longitude:   editingSite.longitude,
              type:        editingSite.type,
              capacity:    editingSite.capacity,
              arLabel:     (editingSite as Site & { arLabel?: string }).arLabel,
              arContent:   (editingSite as Site & { arContent?: string }).arContent,
              arRadius:    (editingSite as Site & { arRadius?: number }).arRadius,
            }
          : {}
      )
    }
  }, [open, editingSite])

  const handleOpenChange = (o: boolean) => { if (!o) onClose() }

  const set = (key: keyof ExtendedSitePayload, value: unknown) => {
    setFormData(p => ({ ...p, [key]: value }))
    setErrors(p => { const n = { ...p }; delete n[key as string]; return n })
  }

  // Validation par étape
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!formData.category) e.category = "Choisissez une catégorie de marqueur"
    }
    if (s === 2) {
      if (!formData.name?.trim()) e.name = "Le nom est obligatoire"
      if (!formData.type)         e.type = "Choisissez un sous-type"
    }
    if (s === 3) {
      if (!formData.latitude)  e.latitude  = "La latitude est obligatoire"
      if (!formData.longitude) e.longitude = "La longitude est obligatoire"
      if (formData.latitude  && (formData.latitude  < -90  || formData.latitude  > 90))  e.latitude  = "Latitude invalide (-90 à 90)"
      if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) e.longitude = "Longitude invalide (-180 à 180)"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Nombre d'étapes : 4 normalement, réduit à 3 si édition (on skip catégorie)
  const totalSteps = editingSite ? 3 : 4
  const effectiveSteps = editingSite ? STEPS.slice(1) : STEPS

  const nextStep = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 4)) }
  const prevStep = () => setStep(s => Math.max(s - 1, editingSite ? 2 : 1))

  // Géolocalisation
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) { toast.error("Géolocalisation non disponible"); return }
    setGeoLoading(true)
    setGeoStatus("idle")
    navigator.geolocation.getCurrentPosition(
      pos => {
        set("latitude",  Math.round(pos.coords.latitude  * 1e6) / 1e6)
        set("longitude", Math.round(pos.coords.longitude * 1e6) / 1e6)
        setGeoLoading(false)
        setGeoStatus("success")
        toast.success("Position capturée", { description: `Précision : ±${Math.round(pos.coords.accuracy)}m` })
      },
      err => {
        setGeoLoading(false)
        setGeoStatus("error")
        const msg = err.code === 1 ? "Permission refusée" : err.code === 2 ? "Position indisponible" : "Délai dépassé"
        toast.error(msg)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  const handleMapPick = useCallback((lat: number, lng: number) => {
    set("latitude",  lat)
    set("longitude", lng)
    setGeoStatus("success")
    toast.success("Coordonnées sélectionnées", { description: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })
  }, [])

  const handleSubmit = () => {
    if (!validateStep(step)) return
    onSave(formData)
    onClose()
  }

  const score      = completionScore(formData)
  const activeCat  = formData.category ? MARKER_CATEGORIES[formData.category] : null
  const subtypes   = formData.category ? SUBTYPES[formData.category] : []
  const isPRA      = formData.category === "PRA"

  // Étape courante dans les étapes effectives (pour affichage stepper en mode édition)
  const currentStepIndex = effectiveSteps.findIndex(s => s.id === step)

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden gap-0 bg-[oklch(0.13_0.02_260/0.98)] border-white/10">

          {/* ── Header ── */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                {activeCat && (
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-md"
                    style={{ background: `${activeCat.color}20` }}
                  >
                    <activeCat.icon
                      className="size-3.5"
                      style={{ color: activeCat.color } as React.CSSProperties}
                    />
                  </div>
                )}
                {editingSite ? "Modifier le site" : "Nouveau site"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingSite
                  ? `Mise à jour de « ${editingSite.name} »`
                  : activeCat
                    ? `Catégorie : ${activeCat.label} - ${activeCat.description}`
                    : "Ajoutez un nouveau site au festival Vodun Days"
                }
              </DialogDescription>
            </DialogHeader>

            {/* Barre de progression */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">Complétion</span>
                <span className="text-[10px] font-mono text-muted-foreground/60">{score}%</span>
              </div>
              <Progress
                value={score}
                className="h-1 bg-white/8 [&>div]:transition-all [&>div]:duration-500"
                style={{ ["--progress-color" as string]: activeCat?.color ?? "var(--vd-gold)" }}
              />
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 mt-4">
              {effectiveSteps.map((s, idx) => {
                const isActive   = s.id === step
                const isDone     = s.id < step
                const isReachable= s.id < step || (s.id === step)
                return (
                  <div key={s.id} className="flex items-center gap-1 flex-1">
                    <button
                      type="button"
                      onClick={() => { if (isReachable) setStep(s.id) }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
                        isActive  ? "border text-white"
                          : isDone  ? "text-green-400 bg-green-500/8 border border-green-500/20"
                          : "text-muted-foreground/50 border border-transparent"
                      )}
                      style={isActive ? {
                        background: activeCat ? `${activeCat.color}18` : "rgba(245,166,35,0.12)",
                        borderColor: activeCat ? `${activeCat.color}45` : "rgba(245,166,35,0.35)",
                        color:       activeCat?.color ?? "var(--vd-gold)",
                      } : undefined}
                    >
                      {isDone
                        ? <CheckCircle2 className="size-3.5 shrink-0" />
                        : <s.icon className="size-3.5 shrink-0" />
                      }
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {idx < effectiveSteps.length - 1 && (
                      <ChevronRight className="size-3 text-muted-foreground/30 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Contenu par étape ── */}
          <ScrollArea className="max-h-[460px]">
            <div className="px-6 py-5 space-y-5">

              {/* ═══════════════════════════════════════════════════════════════
                   ÉTAPE 1 - Catégorie de marqueur
                  ═══════════════════════════════════════════════════════════════ */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    La catégorie définit l'icône et la couleur du marqueur sur la carte,
                    ainsi que les champs spécifiques du formulaire.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {(Object.entries(MARKER_CATEGORIES) as [MarkerCategory, typeof MARKER_CATEGORIES[MarkerCategory]][]).map(([key, cat]) => {
                      const isSelected = formData.category === key
                      const Icon = cat.icon
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            set("category", key)
                            // Reset type quand on change de catégorie
                            set("type", "")
                          }}
                          className={cn(
                            "group flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                            isSelected
                              ? `${cat.bg} ${cat.border} border`
                              : "border-white/8 hover:border-white/15 hover:bg-white/4"
                          )}
                        >
                          <div
                            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: isSelected ? `${cat.color}25` : "rgba(255,255,255,0.06)" }}
                          >
                            <Icon
                              className="size-4"
                              style={{ color: isSelected ? cat.color : undefined } as React.CSSProperties}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={cn(
                              "flex items-center gap-1.5 text-xs font-semibold",
                              isSelected ? cat.textClass : "text-foreground"
                            )}>
                              <span className="truncate">{cat.label}</span>
                              {isSelected && <CheckCircle2 className="size-3 ml-auto shrink-0" />}
                            </div>
                            <p className="mt-0.5 text-[10px] text-muted-foreground/60 leading-relaxed line-clamp-2">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {errors.category && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.category}
                    </p>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════
                   ÉTAPE 2 - Identité
                  ═══════════════════════════════════════════════════════════════ */}
              {step === 2 && (
                <div className="space-y-5">

                  {/* Bandeau catégorie active */}
                  {activeCat && !editingSite && (
                    <div
                      className="flex items-center gap-3 rounded-xl border p-3"
                      style={{
                        background:   `${activeCat.color}10`,
                        borderColor:  `${activeCat.color}30`,
                      }}
                    >
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: `${activeCat.color}20` }}
                      >
                        <activeCat.icon
                          className="size-4"
                          style={{ color: activeCat.color } as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: activeCat.color }}>
                          {activeCat.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60">{activeCat.description}</p>
                      </div>
                    </div>
                  )}

                  <FormField
                    label="Nom du site"
                    required
                    tooltip="Nom officiel tel qu'il apparaîtra dans l'application et sur la carte"
                    error={errors.name}
                  >
                    <Input
                      value={formData.name || ""}
                      onChange={e => set("name", e.target.value)}
                      placeholder={
                        formData.category === "SITE"       ? "ex : Temple des Pythons"
                        : formData.category === "TOILETTES" ? "ex : Toilettes Place Maro"
                        : formData.category === "URGENCES"  ? "ex : Poste Médical Central"
                        : formData.category === "TRANSPORT" ? "ex : Station Zémidjan Centre"
                        : formData.category === "ASSISTANCE"? "ex : Point Info Festival"
                        : formData.category === "PRA"       ? "ex : Scène AR - Forêt Kpassè"
                        : "Nom du site"
                      }
                      className={cn(errors.name && "border-destructive")}
                    />
                  </FormField>

                  {/* Sous-type fonctionnel */}
                  <FormField
                    label="Sous-type"
                    required
                    tooltip="Précise la nature fonctionnelle du site au sein de sa catégorie"
                    error={errors.type}
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {subtypes.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => set("type", t.value)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-all text-left font-medium",
                            formData.type === t.value
                              ? `${activeCat?.bg} ${activeCat?.textClass} ${activeCat?.border}`
                              : "border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/5"
                          )}
                        >
                          <Package className="size-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{t.label}</span>
                          {formData.type === t.value && (
                            <CheckCircle2 className="size-3 ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.type && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="size-3" /> {errors.type}
                      </p>
                    )}
                  </FormField>

                  <FormField
                    label="Description"
                    tooltip="Courte présentation - visible dans la fiche détail de l'application festivalier"
                  >
                    <Textarea
                      value={formData.description || ""}
                      onChange={e => set("description", e.target.value)}
                      placeholder={
                        formData.category === "PRA"
                          ? "Décrivez l'expérience de réalité augmentée proposée sur ce point..."
                          : "Décrivez brièvement ce site et son rôle durant le festival..."
                      }
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground/50 text-right">
                      {(formData.description || "").length}/300
                    </p>
                  </FormField>

                  {/* ── Champs PRA spécifiques ── */}
                  {isPRA && (
                    <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Scan className="size-4 text-teal-400" />
                        <p className="text-sm font-semibold text-teal-400">Configuration Réalité Augmentée</p>
                      </div>
                      <p className="text-xs text-muted-foreground/70 -mt-2">
                        Ces champs définissent le comportement du point AR dans l'application.
                      </p>

                      <FormField
                        label="Label AR"
                        tooltip="Texte affiché en overlay dans la vue caméra AR de l'application"
                        error={errors.arLabel}
                      >
                        <Input
                          value={formData.arLabel || ""}
                          onChange={e => set("arLabel", e.target.value)}
                          placeholder="ex : Découvrez l'histoire de la Forêt Kpassè"
                        />
                      </FormField>

                      <FormField
                        label="Contenu AR"
                        tooltip="URL vers la vidéo, l'image ou le fichier JSON décrivant le contenu AR à afficher"
                        error={errors.arContent}
                      >
                        <Input
                          value={formData.arContent || ""}
                          onChange={e => set("arContent", e.target.value)}
                          placeholder="https://cdn.vodundays.bj/ar/foret-kpasse.mp4"
                          className="font-mono text-xs"
                        />
                      </FormField>

                      <FormField
                        label="Rayon de détection (mètres)"
                        tooltip="Distance en mètres à partir de laquelle l'application active l'expérience AR"
                        error={errors.arRadius}
                      >
                        <div className="relative">
                          <Scan className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                          <Input
                            type="number"
                            min={5}
                            max={500}
                            value={formData.arRadius || ""}
                            onChange={e => set("arRadius", Number(e.target.value))}
                            placeholder="ex : 50"
                            className="pl-9"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground/50">
                          Recommandé : 20–100 m selon l'environnement du site
                        </p>
                      </FormField>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════
                   ÉTAPE 3 - Localisation
                  ═══════════════════════════════════════════════════════════════ */}
              {step === 3 && (
                <div className="space-y-5">

                  {/* Méthode 1 : carte interactive */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Map className="size-4" style={{ color: activeCat?.color ?? "var(--vd-gold)" }} />
                      <p className="text-sm font-medium">Pointer sur la carte</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground/40 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs max-w-[240px]">
                          Ouvre une carte interactive centrée sur Ouidah. Cliquez précisément à l'emplacement du site.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      <strong>Méthode recommandée :</strong> Naviguez sur la carte et cliquez à l'endroit exact du site.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMapPickOpen(true)}
                      className={cn(
                        "w-full border-white/15 transition-all",
                        formData.latitude && formData.longitude && geoStatus !== "error"
                          && "border-[var(--vd-gold)]/40 text-[var(--vd-gold)] bg-[var(--vd-gold)]/8"
                      )}
                    >
                      {formData.latitude && formData.longitude
                        ? <><CheckCircle2 className="size-4 mr-2" /> Modifier sur la carte</>
                        : <><Map className="size-4 mr-2" /> Ouvrir la carte interactive</>
                      }
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1 bg-white/8" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">ou</span>
                    <Separator className="flex-1 bg-white/8" />
                  </div>

                  {/* Méthode 2 : GPS navigateur */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="size-4" style={{ color: activeCat?.color ?? "var(--vd-gold)" }} />
                      <p className="text-sm font-medium">Utiliser ma position actuelle</p>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      Rendez-vous physiquement sur le site, activez le GPS, puis cliquez.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGeolocate}
                      disabled={geoLoading}
                      className={cn(
                        "w-full border-white/15 transition-all",
                        geoStatus === "success" && "border-green-500/40 text-green-400 bg-green-500/8",
                        geoStatus === "error"   && "border-destructive/40 text-destructive"
                      )}
                    >
                      {geoLoading
                        ? <><Loader2 className="size-4 mr-2 animate-spin" /> Localisation en cours...</>
                        : geoStatus === "success"
                          ? <><CheckCircle2 className="size-4 mr-2" /> Position capturée</>
                          : <><Navigation className="size-4 mr-2" /> Capturer ma position GPS</>
                      }
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1 bg-white/8" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">ou saisir manuellement</span>
                    <Separator className="flex-1 bg-white/8" />
                  </div>

                  {/* Méthode 3 : saisie manuelle */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Latitude" required
                      tooltip="Coordonnée Nord/Sud entre -90 et 90. Ex : 6.3654 pour Ouidah"
                      error={errors.latitude}
                    >
                      <Input
                        type="number" step="0.000001"
                        value={formData.latitude || ""}
                        onChange={e => set("latitude", Number(e.target.value))}
                        placeholder="6.365400"
                        className={cn("font-mono text-sm", errors.latitude && "border-destructive")}
                      />
                    </FormField>
                    <FormField
                      label="Longitude" required
                      tooltip="Coordonnée Est/Ouest entre -180 et 180. Ex : 2.0878 pour Ouidah"
                      error={errors.longitude}
                    >
                      <Input
                        type="number" step="0.000001"
                        value={formData.longitude || ""}
                        onChange={e => set("longitude", Number(e.target.value))}
                        placeholder="2.087800"
                        className={cn("font-mono text-sm", errors.longitude && "border-destructive")}
                      />
                    </FormField>
                  </div>

                  {/* Aperçu coordonnées */}
                  {formData.latitude && formData.longitude && (
                    <div className="rounded-lg bg-white/4 border border-white/8 px-3 py-2 flex items-center gap-2">
                      <MapPin className="size-3.5 shrink-0" style={{ color: activeCat?.color ?? "var(--vd-gold)" }} />
                      <span className="font-mono text-xs text-muted-foreground">
                        {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => setMapPickOpen(true)}
                              className="text-[10px] text-[var(--vd-gold)]/70 hover:text-[var(--vd-gold)] transition-colors flex items-center gap-1"
                            >
                              <Eye className="size-3" /> Voir sur carte
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">Visualiser et ajuster la position</TooltipContent>
                        </Tooltip>
                        <span className="text-white/10">|</span>
                        <a
                          href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-muted-foreground/50 hover:text-[var(--vd-gold)] transition-colors underline underline-offset-2"
                        >
                          Google Maps ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════
                   ÉTAPE 4 - Capacité & récapitulatif
                  ═══════════════════════════════════════════════════════════════ */}
              {step === 4 && (
                <div className="space-y-5">

                  <FormField
                    label="Capacité maximale"
                    tooltip="Nombre maximum de personnes pouvant être accueillies simultanément. Mettre 0 si non applicable."
                    error={errors.capacity}
                  >
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                      <Input
                        type="number"
                        value={formData.capacity || ""}
                        onChange={e => set("capacity", Number(e.target.value))}
                        placeholder={
                          formData.category === "TOILETTES"  ? "ex : 4 (cabines)"
                          : formData.category === "TRANSPORT" ? "ex : 30 (places)"
                          : "ex : 500"
                        }
                        className="pl-9"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground/50">
                      Utilisé pour la gestion des flux et les alertes de surcharge
                    </p>
                  </FormField>

                  {/* Récapitulatif complet */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                      Récapitulatif
                    </p>

                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Catégorie",  value: activeCat ? activeCat.label : undefined,                           icon: Tag       },
                        { label: "Nom",        value: formData.name,                                                                        icon: Building2 },
                        { label: "Sous-type",  value: subtypes.find(t => t.value === formData.type)?.label,                                 icon: Package   },
                        { label: "Latitude",   value: formData.latitude?.toFixed(6),                                                        icon: MapPin    },
                        { label: "Longitude",  value: formData.longitude?.toFixed(6),                                                       icon: MapPin    },
                        { label: "Capacité",   value: formData.capacity ? `${formData.capacity.toLocaleString("fr-FR")} pers.` : undefined, icon: Users     },
                        ...(isPRA ? [
                          { label: "Label AR",  value: formData.arLabel,   icon: Scan },
                          { label: "Rayon AR",  value: formData.arRadius ? `${formData.arRadius} m` : undefined, icon: Scan },
                        ] : []),
                      ].map(row => (
                        <div key={row.label} className="flex items-center gap-2">
                          <row.icon className="size-3.5 text-muted-foreground/40 shrink-0" />
                          <span className="text-muted-foreground/60 w-20 text-xs shrink-0">{row.label}</span>
                          <span className={cn("font-medium text-xs truncate flex-1", row.value ? "text-foreground" : "text-muted-foreground/30 italic")}>
                            {row.value || "Non renseigné"}
                          </span>
                          {row.value
                            ? <CheckCircle2 className="size-3 text-green-400 ml-auto shrink-0" />
                            : <AlertCircle  className="size-3 text-muted-foreground/30 ml-auto shrink-0" />
                          }
                        </div>
                      ))}
                    </div>

                    {/* Aperçu carte */}
                    {formData.latitude && formData.longitude && (
                      <button
                        type="button"
                        onClick={() => setMapPickOpen(true)}
                        className="mt-2 w-full flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60 hover:text-[var(--vd-gold)] transition-colors py-2 rounded-lg border border-white/8 hover:border-[var(--vd-gold)]/25 bg-white/3"
                      >
                        <Eye className="size-3.5" />
                        Visualiser la position sur la carte
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <Button
              variant="ghost" size="sm"
              onClick={step === (editingSite ? 2 : 1) ? onClose : prevStep}
              className="text-muted-foreground"
            >
              {step === (editingSite ? 2 : 1)
                ? "Annuler"
                : <><ChevronLeft className="size-4 mr-1" /> Retour</>
              }
            </Button>

            {/* Dots indicateurs */}
            <div className="flex items-center gap-1.5">
              {effectiveSteps.map(s => (
                <div
                  key={s.id}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width:      step === s.id ? 24 : 6,
                    background: step === s.id
                      ? (activeCat?.color ?? "var(--vd-gold)")
                      : s.id < step ? "#22c55e" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {step < 4 ? (
              <Button
                size="sm"
                onClick={nextStep}
                className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
              >
                Suivant <ChevronRight className="size-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
              >
                <CheckCircle2 className="size-4 mr-1.5" />
                {editingSite ? "Enregistrer" : "Créer le site"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal carte intégrée (étape localisation + récap) */}
      <SitesMapModal
        open={mapPickOpen}
        onClose={() => setMapPickOpen(false)}
        mode="pick"
        initialLat={formData.latitude}
        initialLng={formData.longitude}
        onPick={handleMapPick}
      />
    </>
  )
}

// ─── Composant principal : SitesManager ──────────────────────────────────────

interface SitesManagerProps {
  className?: string
}

export function SitesManager({ className }: SitesManagerProps) {
  const [sites,       setSites]       = useState<Site[]>([])
  const [loading,     setLoading]     = useState(true)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [viewMapSite, setViewMapSite] = useState<Site | null>(null)
  const [viewMapOpen, setViewMapOpen] = useState(false)

  // ─── Chargement ─────────────────────────────────────────────────────────────
  const fetchSites = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getSites()
      if (res.success) setSites(res.data)
      else toast.error(res.message || "Impossible de charger les sites")
    } catch {
      toast.error("Erreur réseau lors du chargement des sites")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSites() }, [fetchSites])

  const handleOpen        = (site?: Site) => { setEditingSite(site || null); setModalOpen(true) }
  const handleViewOnMap   = (site: Site)  => { setViewMapSite(site); setViewMapOpen(true) }

  const handleSave = async (data: ExtendedSitePayload) => {
    try {
      if (editingSite) {
        const res = await updateSite(editingSite.id, data as Partial<SiteCreatePayload>)
        if (res.success) {
          setSites(prev => prev.map(s => s.id === editingSite.id ? res.data : s))
          toast.success("Site mis à jour avec succès")
        } else {
          toast.error(res.message || "Erreur lors de la mise à jour"); return
        }
      } else {
        const res = await createSite(data as SiteCreatePayload)
        if (res.success) {
          setSites(prev => [...prev, res.data])
          toast.success("Site créé avec succès", { description: `${res.data.name} a été ajouté au festival` })
        } else {
          toast.error(res.message || "Erreur lors de la création"); return
        }
      }
      setModalOpen(false)
      setEditingSite(null)
    } catch {
      toast.error("Erreur réseau")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSite(id)
      if (res.success) {
        setSites(prev => prev.filter(s => s.id !== id))
        toast.success("Site supprimé")
      } else {
        toast.error(res.message || "Erreur lors de la suppression")
      }
    } catch {
      toast.error("Erreur réseau")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
        <Loader2 className="size-4 animate-spin" />
        Chargement des sites…
      </div>
    )
  }

  // ─── Compteurs par catégorie ─────────────────────────────────────────────────
  const countByCategory = (sites as (Site & { category?: MarkerCategory })[]).reduce<Record<string, number>>(
    (acc, s) => {
      const cat = s.category ?? "SITE"
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    },
    {}
  )

  return (
    <>
      <div className={cn("glass-card p-6", className)}>

        {/* ── En-tête ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Sites & géographie</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sites.length} site{sites.length > 1 ? "s" : ""} configuré{sites.length > 1 ? "s" : ""}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleOpen()}
                size="sm"
                className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
              >
                <Plus className="size-4 mr-1.5" />
                Ajouter un site
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">Ouvrir le formulaire de création</TooltipContent>
          </Tooltip>
        </div>

        {/* ── Capsules de comptage par catégorie ── */}
        {sites.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {(Object.entries(MARKER_CATEGORIES) as [MarkerCategory, typeof MARKER_CATEGORIES[MarkerCategory]][])
              .filter(([key]) => countByCategory[key] > 0)
              .map(([key, cat]) => (
                <div
                  key={key}
                  className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold", cat.bg, cat.border, cat.textClass)}
                >
                  <cat.icon className="size-3 shrink-0" />
                  <span>{cat.label}</span>
                  <span className="opacity-60">·</span>
                  <span>{countByCategory[key]}</span>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Table / empty state ── */}
        {sites.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucun site configuré"
            description="Commencez par ajouter les sites, toilettes, urgences, transports, points d'assistance et points AR du festival."
            action={{ label: "Ajouter un site", onClick: () => handleOpen() }}
          />
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="hidden md:table-cell">Sous-type</TableHead>
                  <TableHead className="hidden md:table-cell">Capacité</TableHead>
                  <TableHead className="hidden lg:table-cell">Coordonnées</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Événements</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sites as (Site & { category?: MarkerCategory })[]).map(site => {
                  const cat = site.category ? MARKER_CATEGORIES[site.category] : MARKER_CATEGORIES.SITE
                  const CatIcon = cat.icon
                  return (
                    <TableRow key={site.id} className="group">

                      {/* Nom */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CatIcon
                            className="size-3.5 shrink-0 opacity-70"
                            style={{ color: cat.color } as React.CSSProperties}
                          />
                          {site.name}
                        </div>
                      </TableCell>

                      {/* Badge catégorie */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-medium gap-1.5 inline-flex items-center", cat.bg, cat.textClass, cat.border)}
                        >
                          <CatIcon className="size-3 shrink-0" />
                          <span className="hidden sm:inline">{cat.label}</span>
                        </Badge>
                      </TableCell>

                      {/* Sous-type */}
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {site.type
                          ? (SUBTYPES[site.category ?? "SITE"]?.find(t => t.value === site.type)?.label ?? site.type)
                          : <span className="opacity-30 italic">-</span>
                        }
                      </TableCell>

                      {/* Capacité */}
                      <TableCell className="hidden md:table-cell text-sm tabular-nums">
                        {site.capacity > 0
                          ? site.capacity.toLocaleString("fr-FR")
                          : <span className="text-muted-foreground/30 text-xs italic">-</span>
                        }
                      </TableCell>

                      {/* Coordonnées cliquables */}
                      <TableCell className="hidden lg:table-cell">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleViewOnMap(site)}
                              className="font-mono text-xs text-muted-foreground hover:text-[var(--vd-gold)] transition-colors flex items-center gap-1.5 group/coords"
                            >
                              <MapPin className="size-3 opacity-0 group-hover/coords:opacity-100 transition-opacity text-[var(--vd-gold)]" />
                              {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">Cliquer pour visualiser sur la carte</TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Nombre d'événements */}
                      <TableCell className="hidden sm:table-cell text-center">
                        <Badge variant="outline" className="text-[10px] border-white/10">
                          {site._count?.events || 0}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost" size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpen(site)}>
                              <Pencil className="mr-2 size-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewOnMap(site)}>
                              <Eye className="mr-2 size-4" /> Voir sur la carte
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MapPin className="mr-2 size-4" /> Google Maps ↗
                              </a>
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Supprimer le site"
                              description={`Êtes-vous sûr de vouloir supprimer "${site.name}" ? Cette action est irréversible.`}
                              confirmLabel="Supprimer"
                              variant="destructive"
                              onConfirm={() => handleDelete(site.id)}
                              trigger={
                                <DropdownMenuItem variant="destructive" onSelect={e => e.preventDefault()}>
                                  <Trash2 className="mr-2 size-4" /> Supprimer
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* Modal formulaire */}
      <SiteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingSite={editingSite}
        onSave={handleSave}
      />

      {/* Modal carte visualisation */}
      <SitesMapModal
        open={viewMapOpen}
        onClose={() => { setViewMapOpen(false); setViewMapSite(null) }}
        site={viewMapSite}
        mode="view"
      />
    </>
  )
}