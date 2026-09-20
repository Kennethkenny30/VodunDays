"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Map, Bell, Navigation, Video, Wrench, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getPlatformSettings, updatePlatformSetting } from "@/lib/api/platform"

interface ModulesCardProps {
  className?: string
}

// Métadonnées d'affichage uniquement (icône, libellé, tooltip) - l'état
// enabled réel vient de PlatformSettings côté API, plus de localStorage.
const MODULE_META = [
  {
    id: "map",
    label: "Carte interactive",
    icon: Map,
    danger: false,
    tooltip: "Carte MapLibre des sites du festival - désactiver masque la carte pour tous les utilisateurs",
  },
  {
    id: "push",
    label: "Notifications push",
    icon: Bell,
    danger: false,
    tooltip: "Envoi de notifications push via FCM - désactiver stoppe toutes les notifications sortantes",
  },
  {
    id: "gps",
    label: "Tracking GPS",
    icon: Navigation,
    danger: false,
    tooltip: "Géolocalisation des festivaliers en temps réel - désactiver coupe la localisation",
  },
  {
    id: "video",
    label: "Highlights vidéo",
    icon: Video,
    danger: false,
    tooltip: "Section vidéos et replays dans l'application - module en développement",
  },
  {
    id: "maintenance",
    label: "Mode maintenance",
    icon: Wrench,
    danger: true,
    tooltip: "Attention : passe toute l'application en maintenance - les utilisateurs verront une page d'indisponibilité",
  },
] as const

const impactMap: Record<string, { enable: string; disable: string }> = {
  map: {
    enable: "La carte interactive sera accessible à tous les utilisateurs.",
    disable: "Les utilisateurs ne pourront plus voir la carte des sites du festival.",
  },
  push: {
    enable: "Les notifications push seront envoyées aux abonnés FCM.",
    disable: "Aucune notification ne sera envoyée aux utilisateurs.",
  },
  gps: {
    enable: "Le suivi GPS sera activé pour les festivaliers.",
    disable: "La géolocalisation sera désactivée pour tous les utilisateurs.",
  },
  video: {
    enable: "Les highlights vidéo seront visibles dans l'application.",
    disable: "La section vidéo sera masquée.",
  },
  maintenance: {
    enable: "L'application passera en mode maintenance - impact immédiat sur tous les utilisateurs.",
    disable: "L'application redeviendra accessible à tous les utilisateurs.",
  },
}

export function ModulesCard({ className }: ModulesCardProps) {
  const [loading,  setLoading]  = useState(true)
  const [enabled,  setEnabled]  = useState<Record<string, boolean>>({})
  const [pending,  setPending]  = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getPlatformSettings()
      if (res.success) {
        const modulesOnly = res.data.filter((s) => s.family === "modules")
        setEnabled(Object.fromEntries(modulesOnly.map((s) => [s.key, s.enabled])))
      }
    } catch {
      toast.error("Impossible de charger l'état des modules")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const handleToggle = async (id: string, newValue: boolean) => {
    setPending(id)
    try {
      const res = await updatePlatformSetting(id, newValue)
      if (res.success) {
        setEnabled((prev) => ({ ...prev, [id]: newValue }))
      } else {
        toast.error(res.message || "Échec de la mise à jour du module")
      }
    } catch {
      toast.error("Erreur réseau - le module n'a pas été modifié")
    } finally {
      setPending(null)
    }
  }

  const enabledCount = MODULE_META.filter((m) => enabled[m.id]).length

  return (
    <div className={cn("glass-card p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold tracking-tight">Modules actifs</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="text-[10px] tabular-nums border-white/15 text-muted-foreground cursor-default"
            >
              {enabledCount}/{MODULE_META.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {enabledCount} module{enabledCount > 1 ? "s" : ""} activé{enabledCount > 1 ? "s" : ""} sur {MODULE_META.length}
          </TooltipContent>
        </Tooltip>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs">Chargement...</span>
        </div>
      ) : (
        <div className="space-y-1">
          {MODULE_META.map((module) => {
            const isEnabled = enabled[module.id] ?? false
            return (
              <div
                key={module.id}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors",
                  module.danger
                    ? "hover:bg-destructive/8"
                    : "hover:bg-white/5"
                )}
              >
                {/* Icône + label + info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <module.icon
                    className={cn(
                      "size-4 shrink-0",
                      module.danger
                        ? "text-destructive"
                        : isEnabled
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm truncate",
                      module.danger
                        ? "text-destructive font-medium"
                        : isEnabled
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {module.label}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3 shrink-0 text-muted-foreground/40 hover:text-muted-foreground cursor-help transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs max-w-[220px]">
                      {module.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Toggle avec ConfirmDialog */}
                <ConfirmDialog
                  title={isEnabled ? `Désactiver ${module.label.toLowerCase()}` : `Activer ${module.label.toLowerCase()}`}
                  description={impactMap[module.id]?.[isEnabled ? "disable" : "enable"] ?? ""}
                  confirmLabel={isEnabled ? "Désactiver" : "Activer"}
                  variant={isEnabled || module.danger ? "destructive" : "default"}
                  onConfirm={() => handleToggle(module.id, !isEnabled)}
                  trigger={
                    <div className="shrink-0 ml-3">
                      {pending === module.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          id={module.id}
                          checked={isEnabled}
                          className={cn(
                            "data-[state=checked]:bg-[var(--vd-gold)]",
                            module.danger && "data-[state=checked]:bg-destructive"
                          )}
                        />
                      )}
                    </div>
                  }
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
