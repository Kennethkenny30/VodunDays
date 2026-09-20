"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { StatusPulse } from "@/components/dashboard/status-pulse"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Bug, Wrench, Navigation, BellOff, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getPlatformSettings, updatePlatformSetting } from "@/lib/api/platform"

interface IncidentCardProps {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  tooltip: string
  impact: string
  enabled: boolean
  pending: boolean
  onToggle: (enabled: boolean) => void
}

function IncidentCard({
  id,
  icon: Icon,
  title,
  description,
  tooltip,
  impact,
  enabled,
  pending,
  onToggle,
}: IncidentCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [canConfirm, setCanConfirm] = useState(false)

  useEffect(() => {
    if (dialogOpen && !enabled) {
      setCountdown(5)
      setCanConfirm(false)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanConfirm(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    } else if (dialogOpen && enabled) {
      setCanConfirm(true)
    }
  }, [dialogOpen, enabled])

  const handleConfirm = () => {
    onToggle(!enabled)
    setDialogOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          "glass-card p-4 transition-all duration-200",
          enabled && "glass-card-danger border-red-500/60"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icône + texte */}
          <div className="flex items-start gap-3 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "rounded-lg p-2 shrink-0 cursor-default transition-colors",
                    enabled ? "bg-red-500/20" : "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      enabled ? "text-red-500" : "text-muted-foreground"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs max-w-[200px]">
                {enabled
                  ? `Actif - ${impact}`
                  : tooltip}
              </TooltipContent>
            </Tooltip>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Label
                  htmlFor={id}
                  className={cn(
                    "text-sm font-medium cursor-pointer leading-tight",
                    enabled && "text-red-400"
                  )}
                >
                  {title}
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 shrink-0 text-muted-foreground/40 hover:text-muted-foreground cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-[220px]">
                    <p className="font-semibold mb-1">{title}</p>
                    <p className="text-muted-foreground">{impact}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="shrink-0">
                {pending ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  <Switch
                    id={id}
                    checked={enabled}
                    onCheckedChange={() => setDialogOpen(true)}
                    className="data-[state=checked]:bg-red-500"
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {enabled ? "Cliquer pour désactiver" : "Cliquer pour activer - confirmation requise"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {enabled
                ? `Désactiver ${title.toLowerCase()}`
                : `Activer ${title.toLowerCase()}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {enabled
                ? `Êtes-vous sûr de vouloir désactiver cette mesure d'urgence ?`
                : `Attention : cette action aura un impact immédiat sur tous les utilisateurs. ${impact}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={cn(
                !enabled && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {!canConfirm ? `Confirmer (${countdown}s)` : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface IncidentCenterProps {
  className?: string
}

const INCIDENT_META = [
  {
    id: "degradedMode",
    icon: Wrench,
    title: "Mode dégradé",
    description: "App statique, sans WebSocket ni temps réel",
    tooltip: "Bascule l'application en mode statique - désactive les connexions temps réel",
    impact: "L'application passe en mode statique. Les WebSockets, le GPS et les notifications en temps réel sont coupés.",
  },
  {
    id: "gpsTracking",
    icon: Navigation,
    title: "Couper le tracking",
    description: "Désactive la géolocalisation pour tous les festivaliers",
    tooltip: "Coupe immédiatement la géolocalisation de tous les utilisateurs actifs",
    impact: "La géolocalisation est désactivée pour tous les festivaliers connectés. La carte en temps réel ne sera plus mise à jour.",
  },
  {
    id: "pushNotifications",
    icon: BellOff,
    title: "Suspendre les push",
    description: "Stoppe toutes les notifications sortantes",
    tooltip: "Bloque l'envoi de toutes les notifications push - aucun message ne sera envoyé",
    impact: "Toutes les notifications push sont suspendues. Les messages en file d'attente ne seront pas délivrés.",
  },
] as const

export function IncidentCenter({ className }: IncidentCenterProps) {
  const [loading,   setLoading]   = useState(true)
  const [incidents, setIncidents] = useState<Record<string, boolean>>({})
  const [pending,   setPending]   = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getPlatformSettings()
      if (res.success) {
        const incidentsOnly = res.data.filter((s) => s.family === "incidents")
        setIncidents(Object.fromEntries(incidentsOnly.map((s) => [s.key, s.enabled])))
      }
    } catch {
      toast.error("Impossible de charger l'état des mesures d'urgence")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const hasActiveIncident = Object.values(incidents).some(Boolean)
  const activeCount = Object.values(incidents).filter(Boolean).length
  const status = hasActiveIncident ? "incident" : "online"

  const handleToggle = (key: string) => async (enabled: boolean) => {
    const meta = INCIDENT_META.find((m) => m.id === key)
    setPending(key)
    try {
      const res = await updatePlatformSetting(key, enabled)
      if (res.success) {
        setIncidents((prev) => ({ ...prev, [key]: enabled }))
        toast.success(`${meta?.title ?? key} ${enabled ? "activé" : "désactivé"}`, {
          duration: enabled ? Infinity : 3000,
        })
      } else {
        toast.error(res.message || "Échec de la bascule - aucun changement appliqué")
      }
    } catch {
      toast.error("Erreur réseau - la mesure d'urgence n'a pas été appliquée")
    } finally {
      setPending(null)
    }
  }

  return (
    <div
      className={cn(
        "glass-card p-6 transition-all duration-300",
        hasActiveIncident && "glass-card-danger",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Bug
              className={cn(
                "size-4 cursor-default transition-colors",
                hasActiveIncident ? "text-red-500" : "text-muted-foreground"
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs max-w-[220px]">
            Interrupteurs d'urgence - permettent de couper des fonctionnalités critiques instantanément en cas d'incident
          </TooltipContent>
        </Tooltip>

        <h2 className="text-base font-semibold tracking-tight">
          Centre d'incidents
        </h2>

        {hasActiveIncident && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5 cursor-default">
                {activeCount} actif{activeCount > 1 ? "s" : ""}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {activeCount} mesure{activeCount > 1 ? "s" : ""} d'urgence active{activeCount > 1 ? "s" : ""} en ce moment
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="ml-auto">
              <StatusPulse status={status} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {hasActiveIncident
              ? "Incident actif - des mesures d'urgence sont en cours"
              : "Tous les systèmes sont opérationnels"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Cards incidents */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs">Chargement...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INCIDENT_META.map((meta) => (
            <IncidentCard
              key={meta.id}
              id={meta.id}
              icon={meta.icon}
              title={meta.title}
              description={meta.description}
              tooltip={meta.tooltip}
              impact={meta.impact}
              enabled={incidents[meta.id] ?? false}
              pending={pending === meta.id}
              onToggle={handleToggle(meta.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
