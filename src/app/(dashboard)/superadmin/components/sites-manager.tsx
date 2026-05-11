"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { SitesMapModal } from "./SitesMapModal"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  MapPin,
  Trash2,
  Navigation,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Map,
  Building2,
  Users,
  ChevronRight,
  ChevronLeft,
  Star,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import type { Site, SiteCreatePayload } from "@/lib/types/api"

// ─── Config ───────────────────────────────────────────────────────────────────

const siteTypes = [
  { value: "CULTUREL",       label: "Culturel",        icon: Star,      color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { value: "PLACE_PUBLIQUE", label: "Place publique",  icon: Map,       color: "text-green-400",  bg: "bg-green-500/10"  },
  { value: "MUSEE",          label: "Musée",           icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  { value: "PATRIMOINE",     label: "Patrimoine",      icon: MapPin,    color: "text-amber-400",  bg: "bg-amber-500/10"  },
  { value: "RELIGIEUX",      label: "Religieux",       icon: Star,      color: "text-red-400",    bg: "bg-red-500/10"    },
]

const typeColors: Record<string, string> = {
  CULTUREL:       "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PLACE_PUBLIQUE: "bg-green-500/10 text-green-400 border-green-500/20",
  MUSEE:          "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PATRIMOINE:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  RELIGIEUX:      "bg-red-500/10 text-red-400 border-red-500/20",
}

const mockSites: Site[] = [
  {
    id: "1", name: "Temple des Pythons",
    description: "Temple sacré abritant les pythons royaux",
    latitude: 6.3654, longitude: 2.0878, type: "RELIGIEUX", capacity: 200,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    _count: { events: 5 },
  },
  {
    id: "2", name: "Place Chacha",
    description: "Place historique du marché aux esclaves",
    latitude: 6.3612, longitude: 2.0834, type: "PATRIMOINE", capacity: 500,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    _count: { events: 3 },
  },
  {
    id: "3", name: "Musée d'Histoire de Ouidah",
    description: "Musée retraçant l'histoire de la ville",
    latitude: 6.3678, longitude: 2.0912, type: "MUSEE", capacity: 150,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    _count: { events: 2 },
  },
]

// ─── Étapes du formulaire ────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Identité",      icon: Building2  },
  { id: 2, label: "Localisation",  icon: MapPin     },
  { id: 3, label: "Capacité",      icon: Users      },
]

// ─── Indicateur de complétion ────────────────────────────────────────────────

function completionScore(data: Partial<SiteCreatePayload>): number {
  const fields = [data.name, data.type, data.description, data.latitude, data.longitude, data.capacity]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}

// ─── Champ avec validation visuelle ─────────────────────────────────────────

function FormField({
  label, required, tooltip, error, children,
}: {
  label: string
  required?: boolean
  tooltip?: string
  error?: string
  children: React.ReactNode
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
            <TooltipContent side="right" className="text-xs max-w-[220px]">
              {tooltip}
            </TooltipContent>
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

// ─── Modal principal (formulaire) ─────────────────────────────────────────────

interface SiteModalProps {
  open: boolean
  onClose: () => void
  editingSite: Site | null
  onSave: (data: Partial<SiteCreatePayload>) => void
}

function SiteModal({ open, onClose, editingSite, onSave }: SiteModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SiteCreatePayload>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState<"idle" | "success" | "error">("idle")

  // ── Carte de sélection intégrée dans l'étape 2 ──────────────────────────────
  const [mapPickOpen, setMapPickOpen] = useState(false)

  // ── Reset complet à chaque ouverture ─────────────────────────────────────────
  // useEffect garantit le reset même si le composant Dialog ne se démonte pas
  useEffect(() => {
    if (open) {
      setStep(1)
      setErrors({})
      setGeoStatus("idle")
      setGeoLoading(false)
      setMapPickOpen(false)
      setFormData(
        editingSite
          ? {
              name: editingSite.name,
              description: editingSite.description || "",
              latitude: editingSite.latitude,
              longitude: editingSite.longitude,
              type: editingSite.type,
              capacity: editingSite.capacity,
            }
          : {}
      )
    }
  }, [open, editingSite])

  // Fermeture via Dialog onOpenChange (Escape, overlay click)
  const handleOpenChange = (o: boolean) => {
    if (!o) onClose()
  }

  const set = (key: keyof SiteCreatePayload, value: unknown) => {
    setFormData((p) => ({ ...p, [key]: value }))
    setErrors((p) => { const n = { ...p }; delete n[key]; return n })
  }

  // Validation par étape
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!formData.name?.trim()) e.name = "Le nom est obligatoire"
      if (!formData.type)         e.type = "Choisissez un type de site"
    }
    if (s === 2) {
      if (!formData.latitude)  e.latitude  = "La latitude est obligatoire"
      if (!formData.longitude) e.longitude = "La longitude est obligatoire"
      if (formData.latitude  && (formData.latitude  < -90  || formData.latitude  > 90))  e.latitude  = "Latitude invalide (-90 à 90)"
      if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) e.longitude = "Longitude invalide (-180 à 180)"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 3)) }
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  // Géolocalisation GPS navigateur
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas disponible sur ce navigateur")
      return
    }
    setGeoLoading(true)
    setGeoStatus("idle")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("latitude",  Math.round(pos.coords.latitude  * 1e6) / 1e6)
        set("longitude", Math.round(pos.coords.longitude * 1e6) / 1e6)
        setGeoLoading(false)
        setGeoStatus("success")
        toast.success("Position capturée avec succès", {
          description: `Précision : ±${Math.round(pos.coords.accuracy)}m`,
        })
      },
      (err) => {
        setGeoLoading(false)
        setGeoStatus("error")
        const msg =
          err.code === 1 ? "Permission refusée — autorisez la localisation dans votre navigateur"
          : err.code === 2 ? "Position indisponible — vérifiez votre connexion GPS"
          : "Délai dépassé — réessayez en extérieur"
        toast.error(msg)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  // Callback depuis SitesMapModal (mode pick)
  const handleMapPick = useCallback((lat: number, lng: number) => {
    set("latitude",  lat)
    set("longitude", lng)
    setGeoStatus("success")
    toast.success("Coordonnées sélectionnées sur la carte", {
      description: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    })
  }, [])

  const handleSubmit = () => {
    if (!validateStep(step)) return
    onSave(formData)
    onClose()
  }

  const score = completionScore(formData)

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden gap-0 bg-[oklch(0.13_0.02_260/0.98)] border-white/10">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingSite ? "Modifier le site" : "Nouveau site"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingSite
                  ? "Mettez à jour les informations du site géographique"
                  : "Ajoutez un nouveau site au festival Vodun Days"}
              </DialogDescription>
            </DialogHeader>

            {/* Barre de progression globale */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                  Complétion du formulaire
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/60">{score}%</span>
              </div>
              <Progress
                value={score}
                className="h-1 bg-white/8 [&>div]:bg-[var(--vd-gold)] [&>div]:transition-all [&>div]:duration-500"
              />
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 mt-4">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-1 flex-1">
                  <button
                    type="button"
                    onClick={() => { if (s.id < step || validateStep(step)) setStep(s.id) }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
                      step === s.id
                        ? "bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] border border-[var(--vd-gold)]/30"
                        : s.id < step
                        ? "text-green-400 bg-green-500/8 border border-green-500/20"
                        : "text-muted-foreground/50 border border-transparent"
                    )}
                  >
                    {s.id < step
                      ? <CheckCircle2 className="size-3.5 shrink-0" />
                      : <s.icon className="size-3.5 shrink-0" />
                    }
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="size-3 text-muted-foreground/30 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenu par étape */}
          <ScrollArea className="max-h-[420px]">
            <div className="px-6 py-5 space-y-5">

              {/* ── Étape 1 : Identité ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <FormField
                    label="Nom du site"
                    required
                    tooltip="Nom officiel du lieu tel qu'il apparaîtra dans l'application et sur la carte"
                    error={errors.name}
                  >
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="ex : Temple des Pythons"
                      className={cn(errors.name && "border-destructive")}
                    />
                  </FormField>

                  <FormField
                    label="Type de site"
                    required
                    tooltip="Catégorise le site pour le filtrage sur la carte et dans les listes"
                    error={errors.type}
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {siteTypes.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => set("type", t.value)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all text-left",
                            formData.type === t.value
                              ? `${t.bg} ${t.color} border-current`
                              : "border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/5"
                          )}
                        >
                          <t.icon className="size-3.5 shrink-0" />
                          <span className="text-xs font-medium">{t.label}</span>
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
                    tooltip="Courte présentation du site — visible dans la fiche détail de l'application"
                  >
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Décrivez brièvement ce site et son importance culturelle..."
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground/50 text-right">
                      {(formData.description || "").length}/300
                    </p>
                  </FormField>
                </div>
              )}

              {/* ── Étape 2 : Localisation ── */}
              {step === 2 && (
                <div className="space-y-5">

                  {/* === MÉTHODE 1 : Pointer sur la carte === */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Map className="size-4 text-[var(--vd-gold)]" />
                      <p className="text-sm font-medium">Pointer sur la carte</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground/40 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs max-w-[240px]">
                          Ouvre une carte interactive centrée sur Ouidah. Cliquez à l'endroit exact du site pour capturer les coordonnées GPS.
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      🗺️ <strong>Méthode recommandée :</strong> Naviguez sur la carte et cliquez précisément sur l'emplacement du site pour définir ses coordonnées.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMapPickOpen(true)}
                      className={cn(
                        "w-full border-white/15 transition-all",
                        (formData.latitude && formData.longitude && geoStatus !== "error")
                          && "border-[var(--vd-gold)]/40 text-[var(--vd-gold)] bg-[var(--vd-gold)]/8"
                      )}
                    >
                      {formData.latitude && formData.longitude ? (
                        <><CheckCircle2 className="size-4 mr-2" /> Modifier sur la carte</>
                      ) : (
                        <><Map className="size-4 mr-2" /> Ouvrir la carte interactive</>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1 bg-white/8" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">ou</span>
                    <Separator className="flex-1 bg-white/8" />
                  </div>

                  {/* === MÉTHODE 2 : GPS navigateur === */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="size-4 text-[var(--vd-gold)]" />
                      <p className="text-sm font-medium">Utiliser ma position actuelle</p>
                    </div>

                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      📍 <strong>Pour une localisation terrain :</strong> rendez-vous physiquement sur le site, activez le GPS de votre appareil, puis cliquez ci-dessous.
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
                      {geoLoading ? (
                        <><Loader2 className="size-4 mr-2 animate-spin" /> Localisation en cours...</>
                      ) : geoStatus === "success" ? (
                        <><CheckCircle2 className="size-4 mr-2" /> Position capturée</>
                      ) : (
                        <><Navigation className="size-4 mr-2" /> Capturer ma position GPS</>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1 bg-white/8" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                      ou saisir manuellement
                    </span>
                    <Separator className="flex-1 bg-white/8" />
                  </div>

                  {/* === MÉTHODE 3 : Saisie manuelle === */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Latitude"
                      required
                      tooltip="Coordonnée Nord/Sud entre -90 et 90. Ex : 6.3654 pour Ouidah"
                      error={errors.latitude}
                    >
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData.latitude || ""}
                        onChange={(e) => set("latitude", Number(e.target.value))}
                        placeholder="6.365400"
                        className={cn("font-mono text-sm", errors.latitude && "border-destructive")}
                      />
                    </FormField>

                    <FormField
                      label="Longitude"
                      required
                      tooltip="Coordonnée Est/Ouest entre -180 et 180. Ex : 2.0878 pour Ouidah"
                      error={errors.longitude}
                    >
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData.longitude || ""}
                        onChange={(e) => set("longitude", Number(e.target.value))}
                        placeholder="2.087800"
                        className={cn("font-mono text-sm", errors.longitude && "border-destructive")}
                      />
                    </FormField>
                  </div>

                  {/* Instructions détaillées de localisation précise */}
                  <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                      Instructions pour une localisation précise
                    </p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground/70">
                      <li className="flex gap-2"><span className="text-[var(--vd-gold)] shrink-0">1.</span> Rendez-vous physiquement sur le site à localiser</li>
                      <li className="flex gap-2"><span className="text-[var(--vd-gold)] shrink-0">2.</span> Activez le GPS de votre appareil et attendez le signal satellite</li>
                      <li className="flex gap-2"><span className="text-[var(--vd-gold)] shrink-0">3.</span> Placez-vous à l'entrée principale ou au centre du site</li>
                      <li className="flex gap-2"><span className="text-[var(--vd-gold)] shrink-0">4.</span> Cliquez sur "Capturer ma position GPS" ou pointez sur la carte</li>
                      <li className="flex gap-2"><span className="text-[var(--vd-gold)] shrink-0">5.</span> Vérifiez la position sur Google Maps avant d'enregistrer</li>
                    </ul>
                  </div>

                  {/* Aperçu coordonnées + vérification */}
                  {formData.latitude && formData.longitude && (
                    <div className="rounded-lg bg-white/4 border border-white/8 px-3 py-2 flex items-center gap-2">
                      <MapPin className="size-3.5 text-[var(--vd-gold)] shrink-0" />
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
                              <Eye className="size-3" />
                              Voir sur carte
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Visualiser et ajuster la position sur la carte
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-white/10">|</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-muted-foreground/50 hover:text-[var(--vd-gold)] transition-colors underline underline-offset-2"
                            >
                              Google Maps ↗
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Ouvrir Google Maps pour vérifier la position
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Étape 3 : Capacité & récap ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <FormField
                    label="Capacité maximale"
                    tooltip="Nombre maximum de personnes pouvant être accueillies sur le site simultanément"
                    error={errors.capacity}
                  >
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                      <Input
                        type="number"
                        value={formData.capacity || ""}
                        onChange={(e) => set("capacity", Number(e.target.value))}
                        placeholder="ex : 500"
                        className="pl-9"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground/50">
                      Utilisé pour la gestion des flux de visiteurs et les alertes de surcharge
                    </p>
                  </FormField>

                  {/* Récapitulatif */}
                  <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                      Récapitulatif
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Nom",      value: formData.name,        icon: Building2  },
                        { label: "Type",     value: siteTypes.find(t => t.value === formData.type)?.label, icon: Map },
                        { label: "Latitude", value: formData.latitude?.toFixed(6),  icon: MapPin },
                        { label: "Longitude",value: formData.longitude?.toFixed(6), icon: MapPin },
                        { label: "Capacité", value: formData.capacity ? `${formData.capacity.toLocaleString("fr-FR")} personnes` : undefined, icon: Users },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-2">
                          <row.icon className="size-3.5 text-muted-foreground/40 shrink-0" />
                          <span className="text-muted-foreground/60 w-20 text-xs">{row.label}</span>
                          <span className={cn("font-medium text-xs truncate", row.value ? "text-foreground" : "text-muted-foreground/30 italic")}>
                            {row.value || "Non renseigné"}
                          </span>
                          {row.value
                            ? <CheckCircle2 className="size-3 text-green-400 ml-auto shrink-0" />
                            : <AlertCircle  className="size-3 text-muted-foreground/30 ml-auto shrink-0" />
                          }
                        </div>
                      ))}
                    </div>

                    {/* Lien aperçu carte depuis le récap */}
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

          {/* Footer navigation */}
          <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={step === 1 ? onClose : prevStep}
              className="text-muted-foreground"
            >
              {step === 1 ? "Annuler" : <><ChevronLeft className="size-4 mr-1" /> Retour</>}
            </Button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    step === s.id ? "w-6 bg-[var(--vd-gold)]" : s.id < step ? "w-1.5 bg-green-500" : "w-1.5 bg-white/15"
                  )}
                />
              ))}
            </div>

            {step < 3 ? (
              <Button size="sm" onClick={nextStep} className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90">
                Suivant <ChevronRight className="size-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSubmit} className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90">
                <CheckCircle2 className="size-4 mr-1.5" />
                {editingSite ? "Enregistrer" : "Créer le site"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* === SitesMapModal en mode pick (déclenché depuis étape 2 ou récap) === */}
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

// ─── Composant principal ──────────────────────────────────────────────────────

interface SitesManagerProps {
  className?: string
}

export function SitesManager({ className }: SitesManagerProps) {
  const [sites, setSites]           = useState<Site[]>(mockSites)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  // Modal carte de visualisation (depuis la table)
  const [viewMapSite, setViewMapSite] = useState<Site | null>(null)
  const [viewMapOpen, setViewMapOpen] = useState(false)

  const handleOpen = (site?: Site) => {
    setEditingSite(site || null)
    setModalOpen(true)
  }

  const handleViewOnMap = (site: Site) => {
    setViewMapSite(site)
    setViewMapOpen(true)
  }

  const handleSave = (data: Partial<SiteCreatePayload>) => {
    if (editingSite) {
      setSites((prev) => prev.map((s) =>
        s.id === editingSite.id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
      ))
      toast.success("Site mis à jour avec succès")
    } else {
      const newSite: Site = {
        id: String(Date.now()),
        name: data.name!,
        description: data.description || null,
        latitude: data.latitude!,
        longitude: data.longitude!,
        type: data.type!,
        capacity: data.capacity || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { events: 0 },
      }
      setSites((prev) => [...prev, newSite])
      toast.success("Site créé avec succès", {
        description: `${newSite.name} a été ajouté au festival`,
      })
    }
  }

  const handleDelete = (id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id))
    toast.success("Site supprimé")
  }

  return (
    <>
      <div className={cn("glass-card p-6", className)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Sites & géographie</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{sites.length} site{sites.length > 1 ? "s" : ""} configuré{sites.length > 1 ? "s" : ""}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => handleOpen()} size="sm" className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90">
                <Plus className="size-4 mr-1.5" />
                Ajouter un site
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Ouvrir le formulaire de création de site
            </TooltipContent>
          </Tooltip>
        </div>

        {sites.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucun site configuré"
            description="Commencez par ajouter les sites du festival pour pouvoir y associer des événements."
            action={{ label: "Ajouter un site", onClick: () => handleOpen() }}
          />
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Capacité</TableHead>
                  <TableHead className="hidden lg:table-cell">Coordonnées</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Événements</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id} className="group">
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-medium", typeColors[site.type])}>
                        {siteTypes.find((t) => t.value === site.type)?.label || site.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm tabular-nums">
                      {site.capacity.toLocaleString("fr-FR")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {/* Clic sur les coordonnées = ouvre la carte */}
                          <button
                            type="button"
                            onClick={() => handleViewOnMap(site)}
                            className="font-mono text-xs text-muted-foreground hover:text-[var(--vd-gold)] transition-colors flex items-center gap-1.5 group/coords"
                          >
                            <MapPin className="size-3 opacity-0 group-hover/coords:opacity-100 transition-opacity text-[var(--vd-gold)]" />
                            {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          Cliquer pour visualiser sur la carte
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <Badge variant="outline" className="text-[10px] border-white/10">
                        {site._count?.events || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpen(site)}>
                            <Pencil className="mr-2 size-4" /> Modifier
                          </DropdownMenuItem>

                          {/* ── Voir sur carte (MapCN intégré) ── */}
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
                              <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 size-4" /> Supprimer
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* === Modal carte de visualisation (depuis table) === */}
      <SitesMapModal
        open={viewMapOpen}
        onClose={() => { setViewMapOpen(false); setViewMapSite(null); }}
        site={viewMapSite}
        mode="view"
      />
    </>
  )
}