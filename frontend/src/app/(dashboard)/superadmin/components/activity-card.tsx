"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Info, CheckCircle, Settings, Activity, ArrowRight, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { getPlatformActivity } from "@/lib/api/platform"
import type { PlatformActivity } from "@/lib/api/platform"

interface ActivityCardProps { className?: string }

// Mapping action backend → config affichage
const actionConfig: Record<string, { icon: typeof Shield; color: string; bg: string; label: string }> = {
  AUTH:     { icon: Shield,        color: "text-blue-400",          bg: "bg-blue-500/10",   label: "Authentification" },
  UPDATE:   { icon: Info,          color: "text-amber-400",         bg: "bg-amber-500/10",  label: "Mise à jour"      },
  CONFIG:   { icon: Settings,      color: "text-muted-foreground",  bg: "bg-white/8",       label: "Configuration"    },
  INCIDENT: { icon: AlertTriangle, color: "text-red-400",           bg: "bg-red-500/10",    label: "Incident"         },
  CREATE:   { icon: CheckCircle,   color: "text-green-400",         bg: "bg-green-500/10",  label: "Création"         },
  DELETE:   { icon: Trash2,        color: "text-red-400",           bg: "bg-red-500/10",    label: "Suppression"      },
}

const fallbackConfig = { icon: Activity, color: "text-muted-foreground", bg: "bg-white/8", label: "Action" }

export function ActivityCard({ className }: ActivityCardProps) {
  const router  = useRouter()
  const [mounted,    setMounted]    = useState(false)
  const [activities, setActivities] = useState<PlatformActivity[]>([])
  const [loading,    setLoading]    = useState(true)

  const fetchActivity = useCallback(async () => {
    try {
      const res = await getPlatformActivity(5)
      if (res.success) setActivities(res.data)
    } catch {
      // silencieux — widget non critique
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchActivity()
  }, [fetchActivity])

  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  return (
    <div className={cn("glass-card p-5 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h3 className="text-base font-semibold tracking-tight">Activité récente</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50 cursor-default">
              5 derniers événements
            </span>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Aperçu des 5 dernières actions — cliquez sur "Voir tous les logs" pour l'historique complet
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-6 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs">Chargement…</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6 text-muted-foreground text-xs">
          Aucune activité récente
        </div>
      ) : (
        <AnimatedList className="flex-1 space-y-1">
          {activities.map((activity) => {
            const config = actionConfig[activity.action] ?? fallbackConfig
            const Icon   = config.icon

            return (
              <Tooltip key={activity.id}>
                <TooltipTrigger asChild>
                  <AnimatedListItem className="rounded-xl px-3 py-2.5 bg-transparent border-0 hover:bg-white/5 transition-colors cursor-default">
                    <div className="flex items-start gap-3">
                      <div className={cn("rounded-lg p-1.5 shrink-0 mt-0.5", config.bg)}>
                        <Icon className={cn("size-3.5", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-tight">{activity.description}</p>
                        <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                          {activity.userName ?? "Système"} · {getRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </AnimatedListItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs max-w-[240px]">
                  <div className="space-y-1">
                    <p className="font-semibold text-[10px] uppercase tracking-wider opacity-60">
                      {config.label} — {activity.module}
                    </p>
                    {activity.ipAddress && (
                      <p className="opacity-50">IP : {activity.ipAddress}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </AnimatedList>
      )}

      {/* Bouton vers la page audit */}
      <div className="mt-4 pt-4 border-t border-white/8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground hover:text-foreground group"
              onClick={() => router.push("/superadmin/audit")}
            >
              <span className="text-xs">Voir tous les logs</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Accéder à la page Audit & logs pour l'historique complet
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
