"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { StatusPulse } from "@/components/dashboard/status-pulse"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Wifi, Timer, Users, Bell, Loader2 } from "lucide-react"
import { getPlatformStats, getPlatformHealth } from "@/lib/api/platform"
import { getNotificationStats } from "@/lib/api/notifications"
import type { PlatformStats } from "@/lib/api/platform"

interface StatusCardProps {
  className?: string
}

type PlatformStatus = "online" | "degraded" | "incident"
type NotifStats = { total: number; sent: number; pending: number; failed: number }

function MetricItem({
  label,
  value,
  suffix,
  tooltip,
  icon: Icon,
  loading,
}: {
  label: string
  value: React.ReactNode
  suffix?: string
  tooltip: string
  icon: React.ComponentType<{ className?: string }>
  loading?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group cursor-default rounded-xl border border-white/6 bg-white/4 p-3 transition-all hover:border-white/12 hover:bg-white/8 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-2 min-w-0">
            <Icon className="size-3 text-muted-foreground/60 shrink-0" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 truncate">
              {label}
            </p>
          </div>
          <div className="flex items-baseline gap-1 min-w-0">
            {loading ? (
              <Loader2 className="size-3.5 animate-spin text-muted-foreground/40" />
            ) : (
              <>
                <span className="text-base font-semibold tabular-nums truncate leading-tight">
                  {value}
                </span>
                {suffix && (
                  <span className="text-[11px] text-muted-foreground shrink-0">{suffix}</span>
                )}
              </>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs max-w-[200px] text-center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export function StatusCard({ className }: StatusCardProps) {
  const [loading,   setLoading]   = useState(true)
  const [status,    setStatus]    = useState<PlatformStatus>("online")
  const [dbStatus,  setDbStatus]  = useState<"ok" | "error">("ok")
  const [stats,     setStats]     = useState<PlatformStats | null>(null)
  const [notifStats, setNotifStats] = useState<NotifStats | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [healthRes, statsRes, notifRes] = await Promise.all([
          getPlatformHealth(),
          getPlatformStats(),
          getNotificationStats(),
        ])
        if (healthRes.success) {
          setStatus(healthRes.data.status === "healthy" ? "online" : "degraded")
          setDbStatus(healthRes.data.checks.database === "ok" ? "ok" : "error")
        }
        if (statsRes.success)  setStats(statsRes.data)
        if (notifRes.success)  setNotifStats(notifRes.data)
      } catch {
        // non critique
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const statusConfig = {
    online: {
      label: "Plateforme opérationnelle",
      accent: "oklch(0.7 0.15 145)",
      badgeClass: "text-green-400 border-green-500/25 bg-green-500/8",
      badgeLabel: "Live",
    },
    degraded: {
      label: "Mode dégradé actif",
      accent: "oklch(0.8 0.15 80)",
      badgeClass: "text-amber-400 border-amber-500/25 bg-amber-500/8",
      badgeLabel: "Dégradé",
    },
    incident: {
      label: "Incident en cours",
      accent: "oklch(0.65 0.2 25)",
      badgeClass: "text-red-400 border-red-500/25 bg-red-500/8",
      badgeLabel: "Incident",
    },
  }

  const config = statusConfig[status]

  const uptimeLabel = stats
    ? `${stats.uptime.days}j ${stats.uptime.hours}h`
    : "-"

  const dbLabel = dbStatus === "ok"
    ? <span className="text-green-400 text-sm font-semibold">OK</span>
    : <span className="text-red-400 text-sm font-semibold">Erreur</span>

  return (
    <div className={cn("glass-card relative overflow-hidden p-6", className)}>
      {/* Ligne accent en haut */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
      />
      {/* Glow ambiant */}
      <div
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-32 rounded-full opacity-15 blur-2xl"
        style={{ background: config.accent }}
      />

      <div className="relative z-10 space-y-5">
        {/* En-tête statut */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2.5 cursor-default w-fit max-w-full min-w-0">
              <StatusPulse status={status} />
              <span className="text-sm font-semibold tracking-tight truncate">
                {config.label}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-wider font-semibold shrink-0",
                  config.badgeClass
                )}
              >
                {config.badgeLabel}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Statut global de la plateforme en temps réel
          </TooltipContent>
        </Tooltip>

        {/* Grille métriques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <MetricItem
            label="Uptime"
            icon={Timer}
            value={uptimeLabel}
            tooltip="Durée depuis le dernier démarrage du serveur"
            loading={loading}
          />
          <MetricItem
            label="Base"
            icon={Wifi}
            value={dbLabel}
            tooltip="Connexion à la base de données PostgreSQL"
            loading={loading}
          />
          <MetricItem
            label="Connexions 24h"
            icon={Users}
            value={stats?.users.recentLogins ?? 0}
            tooltip="Utilisateurs connectés dans les dernières 24 heures"
            loading={loading}
          />
          <MetricItem
            label="Notifs envoyées"
            icon={Bell}
            value={notifStats?.sent ?? 0}
            tooltip="Notifications push envoyées depuis le début"
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
