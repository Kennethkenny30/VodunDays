"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Info, CheckCircle, Settings, Activity, ArrowRight, Trash2, Loader2, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { getPlatformActivity } from "@/lib/api/platform"
import type { PlatformActivity } from "@/lib/api/platform"

interface ActivityCardProps { className?: string }

const ACTION_CONFIG: Record<string, { icon: typeof Shield; color: string; bg: string; label: string }> = {
  AUTH:     { icon: Shield,        color: "text-blue-400",         bg: "bg-blue-500/10",  label: "Auth"         },
  UPDATE:   { icon: Info,          color: "text-amber-400",        bg: "bg-amber-500/10", label: "Modif."       },
  CONFIG:   { icon: Settings,      color: "text-muted-foreground", bg: "bg-white/8",      label: "Config"       },
  INCIDENT: { icon: AlertTriangle, color: "text-red-400",          bg: "bg-red-500/10",   label: "Incident"     },
  CREATE:   { icon: CheckCircle,   color: "text-green-400",        bg: "bg-green-500/10", label: "Création"     },
  DELETE:   { icon: Trash2,        color: "text-red-400",          bg: "bg-red-500/10",   label: "Suppression"  },
}
const FALLBACK_CONFIG = { icon: Activity, color: "text-muted-foreground", bg: "bg-white/8", label: "Action" }

const MODULE_LABELS: Record<string, string> = {
  auth:              "Auth",
  users:             "Utilisateurs",
  events:            "Evénements",
  sites:             "Sites",
  urgences:          "Urgences",
  quiz:              "Quiz",
  questions:         "Questions",
  "questions-types": "Types Q.",
  notifications:     "Notifications",
  programs:          "Créneaux",
  answers:           "Réponses",
}

const MODULE_FILTERS = [
  { value: "",              label: "Tous"          },
  { value: "events",        label: "Evénements"    },
  { value: "quiz",          label: "Quiz"          },
  { value: "questions",     label: "Questions"     },
  { value: "notifications", label: "Notifications" },
  { value: "urgences",      label: "Urgences"      },
  { value: "users",         label: "Utilisateurs"  },
  { value: "sites",         label: "Sites"         },
]

// Intervalle de rafraîchissement automatique (30 secondes)
const REFRESH_INTERVAL_MS = 30_000

export function ActivityCard({ className }: ActivityCardProps) {
  const router = useRouter()
  const [mounted,      setMounted]      = useState(false)
  const [activities,   setActivities]   = useState<PlatformActivity[]>([])
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [activeModule, setActiveModule] = useState("")

  const fetchActivity = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await getPlatformActivity({
        limit: 5,
        module: activeModule || undefined,
      })
      if (res.success) setActivities(res.data)
    } catch {
      // widget non critique - échec silencieux
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeModule])

  useEffect(() => {
    setMounted(true)
    fetchActivity()
  }, [fetchActivity])

  // Rafraîchissement automatique toutes les 30s
  useEffect(() => {
    const id = setInterval(() => fetchActivity(true), REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchActivity])

  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  return (
    <div className={cn("glass-card p-5 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h3 className="text-base font-semibold tracking-tight">Activité récente</h3>
        </div>
        <button
          onClick={() => fetchActivity(true)}
          disabled={refreshing}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          aria-label="Rafraîchir"
        >
          <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
        </button>
      </div>

      {/* Filtres modules */}
      <div className="flex gap-1 flex-wrap mb-3">
        {MODULE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveModule(f.value)}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
              activeModule === f.value
                ? "border-foreground/30 bg-white/10 text-foreground"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground/70"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-6 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs">Chargement...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6 text-muted-foreground text-xs">
          Aucune activité pour ce filtre
        </div>
      ) : (
        <AnimatedList className="flex-1 space-y-0.5">
          {activities.map((activity) => {
            const config  = ACTION_CONFIG[activity.action] ?? FALLBACK_CONFIG
            const Icon    = config.icon
            const modLabel = MODULE_LABELS[activity.module] ?? activity.module

            return (
              <Tooltip key={activity.id}>
                <TooltipTrigger asChild>
                  <AnimatedListItem className="rounded-xl px-3 py-2 bg-transparent border-0 hover:bg-white/5 transition-colors cursor-default">
                    <div className="flex items-start gap-3">
                      <div className={cn("rounded-lg p-1.5 shrink-0 mt-0.5", config.bg)}>
                        <Icon className={cn("size-3.5", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] px-1.5 py-px rounded bg-white/8 text-muted-foreground font-medium">
                            {modLabel}
                          </span>
                          <span className={cn("text-[10px] font-semibold", config.color)}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm leading-tight truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {activity.userName ?? "Système"} · {getRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </AnimatedListItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs max-w-[260px] space-y-1">
                  <p className="font-semibold text-[10px] uppercase tracking-wider opacity-60">
                    {modLabel} - {activity.module}
                  </p>
                  {activity.ipAddress && (
                    <p className="opacity-50">IP : {activity.ipAddress}</p>
                  )}
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <pre className="text-[10px] opacity-60 whitespace-pre-wrap break-all">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </AnimatedList>
      )}

      {/* Pied de carte */}
      <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/40">
          Mise à jour automatique toutes les 30s
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground group"
              onClick={() => router.push("/superadmin/audit")}
            >
              <span className="text-xs">Voir tous les logs</span>
              <ArrowRight className="size-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Accéder à la page Audit pour l'historique complet
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
