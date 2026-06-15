"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { NumberTicker } from "@/components/magicui/number-ticker"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Bell, Clock, AlertTriangle, Send, TrendingUp, Loader2 } from "lucide-react"
import { getNotificationStats } from "@/lib/api/notifications"

interface CacheCardProps {
  className?: string
}

type NotifStats = { total: number; sent: number; pending: number; failed: number }

export function CacheCard({ className }: CacheCardProps) {
  const [loading, setLoading] = useState(true)
  const [stats,   setStats]   = useState<NotifStats | null>(null)

  useEffect(() => {
    getNotificationStats()
      .then((res) => { if (res.success) setStats(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const deliveryRate = stats && stats.total > 0
    ? Math.round((stats.sent / stats.total) * 100)
    : 0

  const rateColor =
    deliveryRate >= 95 ? "text-green-400"
    : deliveryRate >= 80 ? "text-amber-400"
    : "text-red-400"

  const progressColor =
    deliveryRate >= 95 ? "[&>div]:bg-green-500"
    : deliveryRate >= 80 ? "[&>div]:bg-amber-500"
    : "[&>div]:bg-red-500"

  return (
    <div className={cn("glass-card p-5 flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bell className="size-4 text-muted-foreground" />
        <h3 className="text-base font-semibold tracking-tight">Notifications</h3>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-4 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs">Chargement...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Taux de livraison */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-1.5 cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="size-3 text-muted-foreground/60" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                      Taux de livraison
                    </span>
                  </div>
                  <span className={cn("font-mono text-sm font-semibold", rateColor)}>
                    <NumberTicker value={deliveryRate} decimals={0} />%
                  </span>
                </div>
                <Progress
                  value={deliveryRate}
                  className={cn("h-1.5 bg-white/8", progressColor)}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[220px] text-center">
              Proportion des notifications envoyées avec succes sur le total
            </TooltipContent>
          </Tooltip>

          {/* Total envoyées */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/4 hover:bg-white/7 transition-colors cursor-default">
                <div className="flex items-center gap-2">
                  <Send className="size-3.5 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground">Envoyées</span>
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  <NumberTicker value={stats?.sent ?? 0} />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Nombre total de notifications délivrées avec succes
            </TooltipContent>
          </Tooltip>

          {/* En attente */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/4 hover:bg-white/7 transition-colors cursor-default">
                <div className="flex items-center gap-2">
                  <Clock className={cn("size-3.5", (stats?.pending ?? 0) > 0 ? "text-amber-400" : "text-muted-foreground/60")} />
                  <span className="text-xs text-muted-foreground">En attente</span>
                </div>
                <span className={cn("font-mono text-sm font-semibold tabular-nums", (stats?.pending ?? 0) > 0 ? "text-amber-400" : "")}>
                  <NumberTicker value={stats?.pending ?? 0} />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Notifications programmées ou en cours d'envoi
            </TooltipContent>
          </Tooltip>

          {/* Échouées */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/4 hover:bg-white/7 transition-colors cursor-default">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn("size-3.5", (stats?.failed ?? 0) > 0 ? "text-red-400" : "text-muted-foreground/60")} />
                  <span className="text-xs text-muted-foreground">Échouées</span>
                </div>
                <span className={cn("font-mono text-sm font-semibold tabular-nums", (stats?.failed ?? 0) > 0 ? "text-red-400" : "text-green-400")}>
                  <NumberTicker value={stats?.failed ?? 0} />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Notifications dont l'envoi a échoué
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
