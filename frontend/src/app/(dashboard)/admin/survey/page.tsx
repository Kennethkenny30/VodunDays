"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageTransition } from "@/components/dashboard/page-transition"
import { IconChart, IconStar, IconDownload, IconComment } from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { getSurveyStats, getSurveyComments, exportSurveyCsv } from "@/lib/api/survey"
import type { SurveyStats, SurveyCommentsResult } from "@/lib/api/survey"

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats]     = useState<SurveyStats | null>(null)
  const [comments, setComments] = useState<SurveyCommentsResult["comments"]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [statsRes, commentsRes] = await Promise.all([
      getSurveyStats(),
      getSurveyComments({ limit: 50 }),
    ])

    if (statsRes.success)    setStats(statsRes.data)
    else toast.error(statsRes.message)

    if (commentsRes.success) setComments(commentsRes.data.comments)
    else toast.error(commentsRes.message)

    setLoading(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [loadData])

  const handleExport = async () => {
    try {
      await exportSurveyCsv()
      toast.success("Export téléchargé")
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }

  const totalRatings = stats
    ? Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)
    : 0

  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Enquête & avis</h1>
            <p className="text-muted-foreground">Résultats et commentaires des festivaliers</p>
          </div>
          <Button variant="outline" onClick={handleExport} disabled={loading}>
            <IconDownload className="mr-2 size-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-semibold">
              {loading ? (
                <span className="text-muted-foreground/40">-</span>
              ) : (
                <>
                  <NumberTicker value={stats?.averageRating ?? 0} decimals={1} />
                  <span className="text-muted-foreground text-lg">/5</span>
                </>
              )}
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-2">
              Note moyenne
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-semibold">
              {loading ? (
                <span className="text-muted-foreground/40">-</span>
              ) : (
                <NumberTicker value={stats?.totalResponses ?? 0} />
              )}
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-2">
              Total réponses
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center text-3xl font-semibold">
              {loading ? (
                <span className="text-muted-foreground/40">-</span>
              ) : (
                <>
                  <NumberTicker value={stats?.satisfactionRate ?? 0} />
                  <span className="text-muted-foreground text-lg">%</span>
                </>
              )}
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-2">
              Satisfaction
            </p>
          </div>
        </div>

        {/* Distribution des notes */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Répartition des notes</h2>
          {loading ? (
            <EmptyState icon={IconChart} title="Chargement…" description="Récupération de la répartition." />
          ) : stats ? (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count      = stats.ratingDistribution[rating] ?? 0
                const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16 shrink-0">
                      <span className="text-sm font-medium">{rating}</span>
                      <IconStar className="size-4 fill-[var(--vd-gold)] text-[var(--vd-gold)]" />
                    </div>
                    <Progress value={percentage} className="flex-1 h-3" />
                    <div className="w-24 text-right shrink-0">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>

        {/* Commentaires */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconComment className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">Commentaires récents</h2>
            {!loading && comments.length > 0 && (
              <Badge variant="secondary">{comments.length}</Badge>
            )}
          </div>
          {loading ? (
            <EmptyState icon={IconComment} title="Chargement…" description="Récupération des avis." />
          ) : comments.length === 0 ? (
            <EmptyState
              icon={IconComment}
              title="Aucun commentaire"
              description="Les commentaires des festivaliers apparaîtront ici une fois les questionnaires complétés."
            />
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border bg-card/50 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground font-medium">{comment.event} - {comment.quiz}</p>
                        <p className="text-xs text-muted-foreground/70 italic">{comment.question}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {getRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
