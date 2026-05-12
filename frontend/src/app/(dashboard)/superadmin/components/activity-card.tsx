"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Info, CheckCircle, Settings, Activity, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface ActivityCardProps {
  className?: string
}

const activitiesData = [
  {
    id: "1",
    type: "auth" as const,
    description: "Connexion admin réussie",
    user: "admin@vodundays.bj",
    minutesAgo: 5,
    detail: "Authentification JWT depuis 192.168.1.42",
  },
  {
    id: "2",
    type: "update" as const,
    description: "Site 'Temple des Pythons' mis à jour",
    user: "superadmin@vodundays.bj",
    minutesAgo: 15,
    detail: "Capacité modifiée : 150 → 200 personnes",
  },
  {
    id: "3",
    type: "config" as const,
    description: "Notifications push réactivées",
    user: "superadmin@vodundays.bj",
    minutesAgo: 30,
    detail: "Module push FCM réactivé après maintenance",
  },
  {
    id: "4",
    type: "warning" as const,
    description: "Tentative de connexion échouée",
    user: "inconnu@test.com",
    minutesAgo: 60,
    detail: "3 tentatives échouées — IP bloquée temporairement",
  },
  {
    id: "5",
    type: "create" as const,
    description: "Nouvel événement créé",
    user: "admin@vodundays.bj",
    minutesAgo: 120,
    detail: "Cérémonie d'ouverture — Temple des Pythons, 10h00",
  },
]

const typeConfig = {
  auth: {
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Authentification",
  },
  update: {
    icon: Info,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "Mise à jour",
  },
  config: {
    icon: Settings,
    color: "text-muted-foreground",
    bg: "bg-white/8",
    label: "Configuration",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "Avertissement",
  },
  create: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/10",
    label: "Création",
  },
}

export function ActivityCard({ className }: ActivityCardProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getRelativeTime = (minutesAgo: number) => {
    if (!mounted) return "..."
    const date = new Date(Date.now() - minutesAgo * 60 * 1000)
    return formatDistanceToNow(date, { addSuffix: true, locale: fr })
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

      {/* Liste animée */}
      <AnimatedList className="flex-1 space-y-1">
        {activitiesData.map((activity) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon

          return (
            <Tooltip key={activity.id}>
              <TooltipTrigger asChild>
                <AnimatedListItem
                  className="rounded-xl px-3 py-2.5 bg-transparent border-0 hover:bg-white/5 transition-colors cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-lg p-1.5 shrink-0 mt-0.5", config.bg)}>
                      <Icon className={cn("size-3.5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-tight">{activity.description}</p>
                      <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                        {activity.user} · {getRelativeTime(activity.minutesAgo)}
                      </p>
                    </div>
                  </div>
                </AnimatedListItem>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs max-w-[240px]">
                <div className="space-y-1">
                  <p className="font-semibold text-[10px] uppercase tracking-wider opacity-60">
                    {config.label}
                  </p>
                  <p>{activity.detail}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </AnimatedList>

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
            Accéder à la page Audit & logs pour l'historique complet des actions
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}