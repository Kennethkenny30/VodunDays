"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { ShieldAlert, Clock, Activity, CheckCircle2 } from "lucide-react"
import type { AlertRequest } from "./emergency-mock"

interface EmergencyStatsBarProps {
  alerts: AlertRequest[]
  loading: boolean
  className?: string
}

export function EmergencyStatsBar({ alerts, loading, className }: EmergencyStatsBarProps) {
  const stats = useMemo(() => {
    const active   = alerts.filter((a) => a.status !== "RESOLU")
    const pending  = alerts.filter((a) => a.status === "EN_ATTENTE")
    const inProgress = alerts.filter((a) => a.status === "EN_COURS")
    const resolved = alerts.filter((a) => a.status === "RESOLU")

    // Temps moyen de résolution en minutes (pour les alertes résolues)
    const resolvedWithTime = resolved.filter((a) => a.createdAt && a.updatedAt)
    const avgResolutionMin = resolvedWithTime.length > 0
      ? Math.round(
          resolvedWithTime.reduce((acc, a) => {
            return acc + (new Date(a.updatedAt).getTime() - new Date(a.createdAt).getTime()) / 60000
          }, 0) / resolvedWithTime.length
        )
      : 0

    return { active: active.length, pending: pending.length, inProgress: inProgress.length, resolved: resolved.length, avgResolutionMin }
  }, [alerts])

  const tiles = [
    {
      label:   "Alertes actives",
      value:   stats.active,
      suffix:  "",
      icon:    ShieldAlert,
      color:   "text-red-400",
      bg:      "bg-red-500/10",
      border:  "border-red-500/20",
      urgent:  stats.active > 0,
    },
    {
      label:   "En attente",
      value:   stats.pending,
      suffix:  "",
      icon:    Clock,
      color:   "text-amber-400",
      bg:      "bg-amber-500/10",
      border:  "border-amber-500/20",
      urgent:  false,
    },
    {
      label:   "En cours",
      value:   stats.inProgress,
      suffix:  "",
      icon:    Activity,
      color:   "text-orange-400",
      bg:      "bg-orange-500/10",
      border:  "border-orange-500/20",
      urgent:  false,
    },
    {
      label:   "Résolues aujourd'hui",
      value:   stats.resolved,
      suffix:  "",
      icon:    CheckCircle2,
      color:   "text-green-400",
      bg:      "bg-green-500/10",
      border:  "border-green-500/20",
      urgent:  false,
    },
  ]

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
      {tiles.map(({ label, value, icon: Icon, color, bg, border, urgent }) => (
        <div
          key={label}
          className={cn(
            "glass-card p-4 flex items-center gap-3",
            urgent && value > 0 && "ring-1 ring-red-500/30",
          )}
        >
          <div className={cn("rounded-xl p-2.5 shrink-0 border", bg, border)}>
            <Icon className={cn("size-4", color)} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className={cn("text-2xl font-semibold tabular-nums leading-none", color)}>
              {loading ? (
                <span className="text-muted-foreground/30">-</span>
              ) : (
                <NumberTicker value={value} />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
