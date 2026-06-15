"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Map, Bell, Navigation, Video, Wrench, Info } from "lucide-react"

interface ModulesCardProps {
  className?: string
}

const defaultModules = [
  {
    id: "map",
    label: "Carte interactive",
    icon: Map,
    enabled: true,
    danger: false,
    tooltip: "Carte MapLibre des sites du festival - désactiver masque la carte pour tous les utilisateurs",
  },
  {
    id: "push",
    label: "Notifications push",
    icon: Bell,
    enabled: true,
    danger: false,
    tooltip: "Envoi de notifications push via FCM - désactiver stoppe toutes les notifications sortantes",
  },
  {
    id: "gps",
    label: "Tracking GPS",
    icon: Navigation,
    enabled: true,
    danger: false,
    tooltip: "Géolocalisation des festivaliers en temps réel - désactiver coupe la localisation",
  },
  {
    id: "video",
    label: "Highlights vidéo",
    icon: Video,
    enabled: false,
    danger: false,
    tooltip: "Section vidéos et replays dans l'application - module en développement",
  },
  {
    id: "maintenance",
    label: "Mode maintenance",
    icon: Wrench,
    enabled: false,
    danger: true,
    tooltip: "Attention : passe toute l'application en maintenance - les utilisateurs verront une page d'indisponibilité",
  },
]

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

const LS_KEY = "superadmin_modules"

export function ModulesCard({ className }: ModulesCardProps) {
  const [modules, setModules] = useState(defaultModules)

  // Hydratation post-mount depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (!saved) return
      const parsed: { id: string; enabled: boolean }[] = JSON.parse(saved)
      setModules(defaultModules.map((m) => ({
        ...m,
        enabled: parsed.find((p) => p.id === m.id)?.enabled ?? m.enabled,
      })))
    } catch {
      // données corrompues - on repart des défauts
    }
  }, [])

  const handleToggle = (id: string, newValue: boolean) => {
    setModules((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, enabled: newValue } : m))
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next.map((m) => ({ id: m.id, enabled: m.enabled }))))
      } catch { /* quota dépassé - non critique */ }
      return next
    })
  }

  const enabledCount = modules.filter((m) => m.enabled).length

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
              {enabledCount}/{modules.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {enabledCount} module{enabledCount > 1 ? "s" : ""} activé{enabledCount > 1 ? "s" : ""} sur {modules.length}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Liste modules */}
      <div className="space-y-1">
        {modules.map((module) => (
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
                    : module.enabled
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-sm truncate",
                  module.danger
                    ? "text-destructive font-medium"
                    : module.enabled
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
              title={module.enabled ? `Désactiver ${module.label.toLowerCase()}` : `Activer ${module.label.toLowerCase()}`}
              description={impactMap[module.id]?.[module.enabled ? "disable" : "enable"] ?? ""}
              confirmLabel={module.enabled ? "Désactiver" : "Activer"}
              variant={module.enabled || module.danger ? "destructive" : "default"}
              onConfirm={() => handleToggle(module.id, !module.enabled)}
              trigger={
                <div className="shrink-0 ml-3">
                  <Switch
                    id={module.id}
                    checked={module.enabled}
                    className={cn(
                      "data-[state=checked]:bg-[var(--vd-gold)]",
                      module.danger && "data-[state=checked]:bg-destructive"
                    )}
                  />
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}