"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconChart, IconStar, IconDownload, IconComment } from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { getSurveyStats, getSurveyComments, exportSurveyCsv } from "@/lib/api/survey"
import type { SurveyStats, SurveyCommentsResult } from "@/lib/api/survey"

type Comment = SurveyCommentsResult["comments"][number]

interface SurveyResultsProps {
  className?: string
}

// Résultats de l'enquête de satisfaction - widget embarqué dans le dashboard admin
export function SurveyResults({ className }: SurveyResultsProps) {
  const [stats, setStats]       = useState<SurveyStats | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)

  // Chargement initial - setState uniquement après await pour éviter le lint set-state-in-effect
  useEffect(() => {
    let active = true
    const run = async () => {
      const [statsRes, commentsRes] = await Promise.all([
        getSurveyStats(),
        getSurveyComments({ limit: 20 }),
      ])
      if (!active) return
      if (statsRes.success)    setStats(statsRes.data)
      else toast.error(statsRes.message)
      if (commentsRes.success) setComments(commentsRes.data.comments)
      else toast.error(commentsRes.message)
      setLoading(false)
    }
    run()
    return () => { active = false }
  }, [])

  const handleExport = async () => {
    try {
      await exportSurveyCsv()
      toast.success("Export téléchargé")
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }

  const totalRatings = stats
    ? (Object.values(stats.ratingDistribution) as number[]).reduce((a, b) => a + b, 0)
    : 0

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
          <div className="flex items-center justify-center gap-1 text-2xl font-semibold">
            {loading ? (
              <span className="text-muted-foreground/40">-</span>
            ) : (
              <>
                <NumberTicker value={stats?.averageRating ?? 0} decimals={1} />
                <span className="text-muted-foreground">/5</span>
              </>
            )}
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Note moyenne
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold">
            {loading ? (
              <span className="text-muted-foreground/40">-</span>
            ) : (
              <NumberTicker value={stats?.totalResponses ?? 0} />
            )}
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Réponses
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-2xl font-semibold">
            {loading ? (
              <span className="text-muted-foreground/40">-</span>
            ) : (
              <>
                <NumberTicker value={stats?.satisfactionRate ?? 0} />
                <span className="text-muted-foreground">%</span>
              </>
            )}
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
            Satisfaction
          </p>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-medium mb-3">Répartition des notes</h3>
        {loading ? (
          <EmptyState
            icon={IconChart}
            title="Chargement des notes..."
            description="Récupération de la répartition en cours."
          />
        ) : stats ? (
          [5, 4, 3, 2, 1].map((rating) => {
            const count = (stats.ratingDistribution as Record<number, number>)[rating] ?? 0
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
          {!loading && comments.length > 0 && (
            <Badge variant="secondary">{comments.length}</Badge>
          )}
        </div>

        {loading ? (
          <EmptyState
            icon={IconComment}
            title="Chargement des commentaires..."
            description="Récupération des avis en cours."
          />
        ) : comments.length === 0 ? (
          <EmptyState
            icon={IconComment}
            title="Aucun commentaire"
            description="Les commentaires des utilisateurs apparaîtront ici."
          />
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {comments.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border bg-card/50 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        {comment.event} - {comment.quiz}
                      </p>
                      <p className="text-xs text-muted-foreground/70 italic">
                        {comment.question}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0"
                      suppressHydrationWarning
                    >
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{comment.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
