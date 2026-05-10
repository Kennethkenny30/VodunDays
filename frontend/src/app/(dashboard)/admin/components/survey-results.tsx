"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconChart, IconStar, IconDownload, IconComment } from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { api } from "@/lib/api/client"
import type { SurveyStats, SurveyComment } from "@/lib/types/api"

interface SurveyResultsProps {
  className?: string
}

// Résultats de l'enquête de satisfaction - avec API réelle
export function SurveyResults({ className }: SurveyResultsProps) {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [comments, setComments] = useState<SurveyComment[]>([])
  const [loading, setLoading] = useState(true)

  // Chargement des données
  const loadData = useCallback(async () => {
    setLoading(true)
    const [statsRes, commentsRes] = await Promise.all([
      api.get<SurveyStats>("/survey/stats"),
      api.get<SurveyComment[]>("/survey/comments"),
    ])

    if (statsRes.success) setStats(statsRes.data)
    else toast.error(statsRes.message)

    if (commentsRes.success) setComments(commentsRes.data)
    else toast.error(commentsRes.message)

    setLoading(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [loadData])

  // Export CSV
  const handleExport = async () => {
    try {
      const response = await fetch("/api/survey/export")
      if (!response.ok) throw new Error("Erreur lors de l'export")
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "survey-export.csv"
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Export téléchargé")
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }

  // Calcul du total des notes
  const totalRatings = stats
    ? Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)
    : 0

  // Temps relatif côté client uniquement
  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  return (
    <div className={cn("glass-card p-6", className)} id="survey">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconChart className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">Enquête & avis</h2>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
          <IconDownload className="mr-2 size-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          {loading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-1" />
          ) : (
            <div className="flex items-center justify-center gap-1 text-2xl font-semibold">
              <NumberTicker value={stats?.averageRating ?? 0} decimals={1} />
              <span className="text-muted-foreground">/5</span>
            </div>
          )}
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Note moyenne
          </p>
        </div>
        <div className="text-center">
          {loading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-1" />
          ) : (
            <div className="text-2xl font-semibold">
              <NumberTicker value={stats?.totalResponses ?? 0} />
            </div>
          )}
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Réponses
          </p>
        </div>
        <div className="text-center">
          {loading ? (
            <Skeleton className="h-8 w-16 mx-auto mb-1" />
          ) : (
            <div className="flex items-center justify-center text-2xl font-semibold">
              <NumberTicker value={stats?.satisfactionRate ?? 0} />
              <span className="text-muted-foreground">%</span>
            </div>
          )}
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Satisfaction
          </p>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-medium mb-3">Répartition des notes</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : stats ? (
          [5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] ?? 0
            const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <IconStar className="size-3 fill-[var(--vd-gold)] text-[var(--vd-gold)]" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            )
          })
        ) : null}
      </div>

      {/* Commentaires récents */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconComment className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Commentaires récents</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <EmptyState
            icon={IconComment}
            title="Aucun commentaire"
            description="Les commentaires des utilisateurs apparaîtront ici."
          />
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border bg-card/50 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <IconStar
                          key={i}
                          className={cn(
                            "size-3",
                            i < comment.rating
                              ? "fill-[var(--vd-gold)] text-[var(--vd-gold)]"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {getRelativeTime(comment.createdAt)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
