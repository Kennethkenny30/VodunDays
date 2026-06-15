"use client"

import { useState, useEffect } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@/components/ui/timeline"
import { StatusPulse } from "@/components/dashboard/status-pulse"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IncidentCenter } from "../components/incident-center"
import { PageTransition } from "@/components/dashboard/page-transition"
import { IconBug, IconWarning } from "@/components/icons"
import { toast } from "sonner"
import { getAuditLogs } from "@/lib/api/audit"
import type { AuditLog } from "@/lib/types/api"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Détermination du statut global basé sur les incidents récents
  const hasRecentIncident = incidents.some((i) => {
    const createdAt = new Date(i.createdAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return hoursDiff < 24
  })
  const platformStatus = hasRecentIncident ? "incident" : "online"

  // Chargement des données
  useEffect(() => {
    setMounted(true)
    const fetchIncidents = async () => {
      try {
        const res = await getAuditLogs({ action: "INCIDENT", limit: 10 })
        if (res.success) {
          setIncidents(res.data.logs)
        } else {
          toast.error(res.message)
        }
      } catch {
        toast.error("Erreur lors du chargement des incidents")
      } finally {
        setLoading(false)
      }
    }
    fetchIncidents()
  }, [])

  // Formatage du temps relatif côté client uniquement
  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  // Formatage du nom utilisateur
  const formatUserName = (log: AuditLog) => {
    if (log.userName) return log.userName
    if (log.userId) return log.userId.slice(0, 8) + "..."
    return "Système"
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Centre d&apos;incidents</h1>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
              <StatusPulse status={platformStatus} />
              <span className="text-sm font-medium">
                {platformStatus === "online" ? "Système opérationnel" : "Incident actif"}
              </span>
            </div>
          </div>
        </div>

        {/* Composant IncidentCenter existant */}
        <IncidentCenter />

        {/* Section historique */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Incidents récents</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <EmptyState
              icon={IconBug}
              title="Aucun incident enregistré"
              description="Aucun incident n'a été signalé sur la plateforme."
            />
          ) : (
            <Timeline>
              {incidents.map((incident) => (
                <TimelineItem key={incident.id}>
                  <TimelineIndicator className="bg-red-600/15 text-red-600 border-red-600/30 border-2">
                    <IconWarning className="size-4" />
                  </TimelineIndicator>
                  <TimelineContent>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <TimelineTitle>{incident.description}</TimelineTitle>
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-500 border-red-500/20">
                            Incident
                          </Badge>
                        </div>
                        <TimelineDescription>
                          par {formatUserName(incident)}
                        </TimelineDescription>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 text-right shrink-0">
                        <TimelineTime>
                          {format(new Date(incident.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                        </TimelineTime>
                        <span className="text-xs text-muted-foreground/70">
                          {getRelativeTime(incident.createdAt)}
                        </span>
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
