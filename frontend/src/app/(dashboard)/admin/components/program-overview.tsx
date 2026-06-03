"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { IconCalendar, IconClock, IconArrowRight } from "@/components/icons"
import { EmptyState } from "@/components/dashboard/empty-state"
import { toast } from "sonner"
import { getEvents } from "@/lib/api/events"
import type { Event } from "@/lib/types/api"

interface ProgramOverviewProps {
  className?: string
}

// Vue d'ensemble du programme - chargement dynamique via API
export function ProgramOverview({ className }: ProgramOverviewProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Chargement des événements au mount
  useEffect(() => {
    async function loadEvents() {
      setLoading(true)
      const res = await getEvents()
      if (res.success) {
        setEvents(res.data ?? [])
      } else {
        toast.error(res.message)
      }
      setLoading(false)
    }
    loadEvents()
  }, [])

  // Calcul des compteurs par statut
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length
  const draftCount = events.filter((e) => e.status === "DRAFT").length
  const cancelledCount = events.filter((e) => e.status === "CANCELLED").length
  const archivedCount = events.filter((e) => e.status === "ARCHIVED").length
  const total = events.length

  // 3 prochains événements publiés
  const upcomingEvents = events
    .filter((e) => e.status === "PUBLISHED")
    .slice(0, 3)

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Carte 1 - Événements publiés */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Événements publiés
          </span>
          <IconCalendar className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {loading ? (
            <EmptyState
              icon={IconCalendar}
              title="Chargement des événements…"
              description="Récupération des événements publiés."
            />
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">
                  <NumberTicker value={publishedCount} />
                </span>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  / {total} total
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Prochains événements
                </p>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun événement publié</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between py-1.5 text-sm"
                    >
                      <span className="truncate flex-1">{event.name}</span>
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        {event.site?.name || "Site inconnu"}
                      </Badge>
                    </div>
                  ))
                )}
                <Link
                  href="/admin/programs"
                  className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                >
                  Voir les créneaux
                  <IconArrowRight className="ml-1 size-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Carte 2 - Statut du programme */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Statut du programme
          </span>
          <IconClock className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {loading ? (
            <EmptyState
              icon={IconClock}
              title="Chargement des statuts…"
              description="Calcul de la répartition du programme."
            />
          ) : (
            <>
              <StatusRow label="Brouillons" count={draftCount} total={total} color="bg-muted-foreground" />
              <StatusRow label="Publiés" count={publishedCount} total={total} color="bg-green-500" />
              <StatusRow label="Annulés" count={cancelledCount} total={total} color="bg-red-500" />
              <StatusRow label="Archivés" count={archivedCount} total={total} color="bg-purple-500" />
            </>
          )}
        </div>
      </div>

      {/* Carte 3 - Total et actions rapides */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Total événements
          </span>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-4xl font-semibold text-muted-foreground/40">—</p>
          ) : (
            <>
              <p className="text-4xl font-semibold">
                <NumberTicker value={total} />
              </p>
              <p className="text-sm text-muted-foreground">
                événements dans le système
              </p>
              <Link
                href="/admin#events"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Gérer les événements
                <IconArrowRight className="ml-1 size-3" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Barre de progression par statut
function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">
          <NumberTicker value={count} />
        </span>
      </div>
      <Progress value={percentage} className={cn("h-1.5", `[&>div]:${color}`)} />
    </div>
  )
}