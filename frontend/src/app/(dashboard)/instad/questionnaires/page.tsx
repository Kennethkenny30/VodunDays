"use client"

import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Loader2, CalendarDays, Download, X, Star, ListChecks, MessageSquare,
  Hash, FileQuestion,
} from "lucide-react"
import { toast } from "sonner"
import {
  getInstadQuizzes, getInstadQuizStatistics, downloadInstadQuizExport,
  type InstadQuizSummary, type InstadQuizStatistics, type InstadFilters,
  type InstadRatingStats, type InstadChoiceStats, type InstadTextStats,
} from "@/lib/api/instad"

const GENDER_LABELS: Record<string, string> = {
  MALE: "Homme", FEMALE: "Femme", UNDISCLOSED: "Non précisé",
}
const AGE_LABELS: Record<string, string> = {
  UNDER_18: "Moins de 18 ans",
  FROM_18_TO_24: "18-24 ans",
  FROM_25_TO_34: "25-34 ans",
  FROM_35_TO_44: "35-44 ans",
  FROM_45_TO_54: "45-54 ans",
  FROM_55_AND_ABOVE: "55 ans et +",
}
const KIND_META: Record<string, { icon: typeof Star; label: string }> = {
  RATING:   { icon: Star,          label: "Note" },
  SINGLE:   { icon: ListChecks,    label: "Choix unique" },
  MULTIPLE: { icon: ListChecks,    label: "Choix multiple" },
  TEXT:     { icon: MessageSquare, label: "Texte libre" },
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1 border-white/15 shadow-xl">
      <p className="text-muted-foreground font-medium mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="ml-auto font-semibold tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mb-0.5">{label}</p>
      <p className="text-base font-bold tabular-nums">{value}</p>
    </div>
  )
}

function RatingQuestionCard({ stats }: { stats: InstadRatingStats }) {
  if (stats.count === 0) {
    return <p className="text-xs text-muted-foreground/50 py-4">Aucune réponse pour cette question</p>
  }
  const chartData = (stats.distribution ?? []).map(d => ({ name: `${d.value} ★`, count: d.count }))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <MetricPill label="Réponses" value={stats.count} />
        <MetricPill label="Moyenne" value={stats.mean} />
        <MetricPill label="Médiane" value={stats.median} />
        <MetricPill label="Mode" value={stats.mode} />
        <MetricPill label="Écart-type" value={stats.stdDev} />
        <MetricPill label="Min - Max" value={`${stats.min} - ${stats.max}`} />
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "oklch(0.7 0 0 / 0.6)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <RechartTooltip content={<ChartTip />} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
            <Bar dataKey="count" name="Réponses" fill="var(--vd-gold)" opacity={0.85} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ChoiceQuestionCard({ stats }: { stats: InstadChoiceStats }) {
  if (stats.count === 0) {
    return <p className="text-xs text-muted-foreground/50 py-4">Aucune réponse pour cette question</p>
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{stats.count} réponse{stats.count > 1 ? "s" : ""}</p>
      {stats.distribution.map(d => (
        <div key={d.wording}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs text-muted-foreground truncate">{d.wording}</span>
            <span className="text-xs font-semibold tabular-nums shrink-0">
              {d.count} <span className="text-muted-foreground/50">({d.percentage}%)</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
            <div className="h-full rounded-full bg-[var(--vd-gold)] transition-all duration-500" style={{ width: `${d.percentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TextQuestionCard({ stats }: { stats: InstadTextStats }) {
  if (stats.count === 0) {
    return <p className="text-xs text-muted-foreground/50 py-4">Aucune réponse pour cette question</p>
  }
  const maxWordCount = Math.max(1, ...stats.topWords.map(w => w.count))
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{stats.count} réponse{stats.count > 1 ? "s" : ""}</p>

      {stats.topWords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stats.topWords.map(w => {
            const scale = 0.75 + (w.count / maxWordCount) * 0.6
            return (
              <span
                key={w.word}
                className="rounded-full bg-white/6 border border-white/10 px-2.5 py-1 text-muted-foreground"
                style={{ fontSize: `${scale * 0.7}rem` }}
                title={`${w.count} occurrence${w.count > 1 ? "s" : ""}`}
              >
                {w.word} <span className="text-muted-foreground/40">×{w.count}</span>
              </span>
            )
          })}
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {stats.responses.map((r, i) => (
          <div key={i} className="rounded-lg bg-white/4 border border-white/8 px-3 py-2">
            <p className="text-xs text-foreground/90">{r.response}</p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InstadQuestionnairesPage() {
  const [quizzes, setQuizzes] = useState<InstadQuizSummary[]>([])
  const [quizzesLoading, setQuizzesLoading] = useState(true)
  const [selectedQuizId, setSelectedQuizId] = useState<string>("")
  const [statistics, setStatistics] = useState<InstadQuizStatistics | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [dateRange,   setDateRange]   = useState<DateRange | undefined>(undefined)
  const [gender,      setGender]      = useState<string>("")
  const [ageRange,    setAgeRange]    = useState<string>("")

  const filters: InstadFilters = useMemo(() => ({
    from:     dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to:       dateRange?.to   ? format(dateRange.to,   "yyyy-MM-dd") : undefined,
    gender:   gender || undefined,
    ageRange: ageRange || undefined,
  }), [dateRange, gender, ageRange])

  const hasActiveFilters = Boolean(filters.from || filters.to || filters.gender || filters.ageRange)

  useEffect(() => {
    getInstadQuizzes()
      .then(res => {
        if (res.success) {
          setQuizzes(res.data)
          if (res.data.length > 0) setSelectedQuizId(res.data[0].id)
        }
      })
      .catch(() => toast.error("Impossible de charger la liste des questionnaires"))
      .finally(() => setQuizzesLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedQuizId) return
    setStatsLoading(true)
    getInstadQuizStatistics(selectedQuizId, filters)
      .then(res => {
        if (res.success) setStatistics(res.data)
        else toast.error(res.message || "Impossible de charger les statistiques")
      })
      .catch(() => toast.error("Erreur réseau"))
      .finally(() => setStatsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuizId, filters.from, filters.to, filters.gender, filters.ageRange])

  const handleResetFilters = () => {
    setDateRange(undefined)
    setGender("")
    setAgeRange("")
  }

  const handleExport = async () => {
    if (!selectedQuizId || !statistics) return
    setExporting(true)
    try {
      await downloadInstadQuizExport(selectedQuizId, statistics.title, filters)
    } catch {
      toast.error("Impossible de générer l'export")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Questionnaires soumis</h1>
        <p className="text-sm text-muted-foreground">
          Accès aux réponses des festivaliers et outils statistiques conventionnels (moyenne, médiane, mode, tris à plat)
        </p>
      </div>

      {quizzesLoading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" />
          Chargement des questionnaires…
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">
          <FileQuestion className="size-6 mx-auto mb-2 text-muted-foreground/40" />
          Aucun questionnaire n&apos;a encore été créé.
        </div>
      ) : (
        <>
          {/* Sélecteur de questionnaire + filtres */}
          <div className="glass-card p-3 flex flex-wrap items-center gap-2">
            <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
              <SelectTrigger size="sm" className="w-[240px]"><SelectValue placeholder="Choisir un questionnaire" /></SelectTrigger>
              <SelectContent>
                {quizzes.map(q => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.title} ({q.totalResponses})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="justify-start">
                  <CalendarDays className="size-3.5 mr-1.5 text-muted-foreground/60" />
                  {dateRange?.from
                    ? dateRange.to
                      ? `${format(dateRange.from, "d MMM", { locale: fr })} - ${format(dateRange.to, "d MMM yyyy", { locale: fr })}`
                      : format(dateRange.from, "d MMM yyyy", { locale: fr })
                    : "Période"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} locale={fr} numberOfMonths={2} />
              </PopoverContent>
            </Popover>

            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger size="sm" className="w-[140px]"><SelectValue placeholder="Genre" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Homme</SelectItem>
                <SelectItem value="FEMALE">Femme</SelectItem>
                <SelectItem value="UNDISCLOSED">Non précisé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger size="sm" className="w-[150px]"><SelectValue placeholder="Tranche d'âge" /></SelectTrigger>
              <SelectContent>
                {Object.entries(AGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-muted-foreground">
                <X className="size-3.5 mr-1.5" />
                Réinitialiser
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting || !statistics} className="ml-auto">
              {exporting ? <Loader2 className="size-3.5 mr-1.5 animate-spin" /> : <Download className="size-3.5 mr-1.5" />}
              Exporter les données brutes (CSV)
            </Button>
          </div>

          {/* Questions */}
          {statsLoading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin" />
              Calcul des statistiques…
            </div>
          ) : statistics ? (
            <div className="space-y-4">
              {statistics.questions.length === 0 && (
                <div className="glass-card p-8 text-center text-sm text-muted-foreground">
                  Ce questionnaire ne contient aucune question.
                </div>
              )}
              {statistics.questions.map((q, i) => {
                const meta = KIND_META[q.kind]
                const Icon = meta?.icon ?? Hash
                return (
                  <div key={q.id} className="glass-card p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white/6 p-1.5 shrink-0">
                        <Icon className="size-4 text-[var(--vd-gold)]" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/50">
                          Question {i + 1} · {meta?.label ?? q.typeLabel}
                        </p>
                        <h2 className="text-sm font-semibold tracking-tight">{q.wording}</h2>
                      </div>
                    </div>

                    {q.kind === "RATING" && <RatingQuestionCard stats={q.stats as InstadRatingStats} />}
                    {(q.kind === "SINGLE" || q.kind === "MULTIPLE") && <ChoiceQuestionCard stats={q.stats as InstadChoiceStats} />}
                    {q.kind === "TEXT" && <TextQuestionCard stats={q.stats as InstadTextStats} />}
                  </div>
                )
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
