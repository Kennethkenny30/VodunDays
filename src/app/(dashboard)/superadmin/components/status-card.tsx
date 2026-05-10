"use client"

import { cn } from "@/lib/utils"
import { StatusPulse } from "@/components/dashboard/status-pulse"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Wifi, Timer, Radio, Bell } from "lucide-react"

interface StatusCardProps {
  className?: string
}

function MetricItem({
  label,
  value,
  suffix,
  tooltip,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  suffix?: string
  tooltip: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* min-w-0 + overflow-hidden empêchent le débordement dans la grille */}
        <div className="group cursor-default rounded-xl border border-white/6 bg-white/4 p-3 transition-all hover:border-white/12 hover:bg-white/8 min-w-0 overflow-hidden">
          {/* Label avec icône — truncate si trop long */}
          <div className="flex items-center gap-1.5 mb-2 min-w-0">
            <Icon className="size-3 text-muted-foreground/60 shrink-0" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 truncate">
              {label}
            </p>
          </div>
          {/* Valeur — flex avec min-w-0 pour éviter tout débordement */}
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-base font-semibold tabular-nums truncate leading-tight">
              {value}
            </span>
            {suffix && (
              <span className="text-[11px] text-muted-foreground shrink-0">{suffix}</span>
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
  const status = "online" as const
  const uptime = 99.8
  const wsConnections = 1247
  const fcmSubscribers = 8934

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

  return (
    <div className={cn("glass-card relative overflow-hidden p-6", className)}>
      {/* Ligne accent en haut */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)`,
        }}
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

        {/* Grille métriques — 2 cols sur mobile, 4 sur sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <MetricItem
            label="Uptime"
            icon={Timer}
            value={<NumberTicker value={uptime} decimals={1} />}
            suffix="%"
            tooltip="Disponibilité de la plateforme sur les 30 derniers jours"
          />
          <MetricItem
            label="Redis"
            icon={Wifi}
            value={
              <span className="text-green-400 text-sm font-semibold">OK</span>
            }
            tooltip="Connexion au cache Redis — utilisé pour les sessions et les données temps réel"
          />
          <MetricItem
            label="WebSocket"
            icon={Radio}
            value={<NumberTicker value={wsConnections} />}
            suffix=" cx"
            tooltip="Connexions WebSocket actives — utilisateurs connectés en temps réel"
          />
          <MetricItem
            label="Push FCM"
            icon={Bell}
            value={<NumberTicker value={fcmSubscribers} />}
            suffix=" ab."
            tooltip="Abonnés aux notifications push via Firebase Cloud Messaging"
          />
        </div>
      </div>
    </div>
  )
}