"use client"

import { useState, useEffect, useCallback } from "react"
import { getPlatformStats } from "@/lib/api/platform"
import { getAuditStats } from "@/lib/api/audit"
import { getNotificationStats } from "@/lib/api/notifications"
import { getAlertStats, getAlerts } from "@/lib/api/urgences"
import { getSurveyStats } from "@/lib/api/survey"
import type { PlatformStats } from "@/lib/api/platform"
import type { SurveyStats } from "@/lib/api/survey"
import type { AuditStats } from "@/lib/api/audit"
import type { NotifStats } from "@/lib/api/notifications"
import type { AlertStats } from "@/lib/api/urgences"
import type { Alert } from "@/lib/types/api"
import { PageTransition } from "@/components/dashboard/page-transition"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Download, RefreshCw, Users, Activity, AlertTriangle,
  TrendingUp, Server, Globe, Info, Database, Bell,
  CheckCircle, Layers, BarChart3, Loader2,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, Tooltip as RechartTooltip,
} from "recharts"

// Mappings

const ALERT_TYPE_LABELS: Record<string, string> = {
  MEDICAL:   "Médical",
  SECURITY:  "Sécurité",
  FIRE:      "Incendie",
  LOST:      "Personne perdue",
  TECHNICAL: "Technique",
  OTHER:     "Autre",
}

const ALERT_TYPE_COLORS: Record<string, string> = {
  MEDICAL:   "#ef4444",
  SECURITY:  "#f97316",
  FIRE:      "#f59e0b",
  LOST:      "#3b82f6",
  TECHNICAL: "#8b5cf6",
  OTHER:     "#6b7280",
}

const MODULE_LABELS: Record<string, string> = {
  auth:              "Auth",
  users:             "Utilisateurs",
  events:            "Evénements",
  sites:             "Sites",
  urgences:          "Urgences",
  quiz:              "Quiz",
  questions:         "Questions",
  "questions-types": "Types Q.",
  notifications:     "Notifications",
  programs:          "Créneaux",
  answers:           "Réponses",
}

const ACTION_LABELS: Record<string, string> = {
  CREATE:   "Création",
  UPDATE:   "Modification",
  DELETE:   "Suppression",
  AUTH:     "Authentification",
  CONFIG:   "Configuration",
  INCIDENT: "Incident",
}

const ACTION_COLORS: Record<string, string> = {
  CREATE:   "#4ade80",
  UPDATE:   "#fbbf24",
  DELETE:   "#f87171",
  AUTH:     "#60a5fa",
  CONFIG:   "#a78bfa",
  INCIDENT: "#f97316",
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function LiveChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/8 px-2 py-0.5">
      <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">Live</span>
    </span>
  )
}

function InfoTip({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="size-3 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default shrink-0" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[240px] text-xs leading-relaxed">{content}</TooltipContent>
    </Tooltip>
  )
}

function ChartTip({ active, payload, label, unitMap }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  unitMap?: Record<string, string>
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1 border-white/15 shadow-xl">
      <p className="text-muted-foreground font-medium mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums">
            {p.value.toLocaleString("fr-FR")}{unitMap?.[p.name] ?? ""}
          </span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, suffix, icon: Icon, tooltip, alert, isLive, loading }: {
  label: string
  value: number | string
  suffix?: string
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
  alert?: boolean
  isLive?: boolean
  loading?: boolean
}) {
  const isAlert = alert && typeof value === "number" && value > 0
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="glass-card p-4 cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-white/6 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Icon className={cn("size-3.5 transition-colors", isAlert ? "text-red-400" : "text-muted-foreground group-hover:text-foreground")} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">{label}</p>
            </div>
            {isLive && <LiveChip />}
          </div>
          {loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground/40 mt-1" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className={cn("text-2xl font-bold tabular-nums", isAlert ? "text-red-400" : "")}>
                {typeof value === "number" ? <NumberTicker value={value} decimals={0} /> : value}
              </span>
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs max-w-[220px]">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function PerformancePage() {
  const [loading,       setLoading]       = useState(true)
  const [refreshing,    setRefreshing]    = useState(false)
  const [lastRefresh,   setLastRefresh]   = useState(new Date())
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [auditStats,    setAuditStats]    = useState<AuditStats | null>(null)
  const [notifStats,    setNotifStats]    = useState<NotifStats | null>(null)
  const [alertStats,    setAlertStats]    = useState<AlertStats | null>(null)
  const [surveyStats,   setSurveyStats]   = useState<SurveyStats | null>(null)
  const [openAlerts,    setOpenAlerts]    = useState<Alert[]>([])

  const fetchAllStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [statsRes, auditRes, notifRes, alertStatsRes, surveyRes, alertsRes] = await Promise.all([
        getPlatformStats(),
        getAuditStats(),
        getNotificationStats(),
        getAlertStats(),
        getSurveyStats(),
        getAlerts({ status: "OPEN", limit: 4 }),
      ])
      if (statsRes.success)      setPlatformStats(statsRes.data)
      if (auditRes.success)      setAuditStats(auditRes.data)
      if (notifRes.success)      setNotifStats(notifRes.data)
      if (alertStatsRes.success) setAlertStats(alertStatsRes.data)
      if (surveyRes.success)     setSurveyStats(surveyRes.data)
      if (alertsRes.success)     setOpenAlerts(alertsRes.data.alerts)
    } catch {
      // erreurs réseau silencieuses
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchAllStats() }, [fetchAllStats])

  const handleRefresh = async () => {
    await fetchAllStats(true)
    setLastRefresh(new Date())
  }

  const handleExportCsv = () => {
    if (!auditStats) return
    const rows = ["Module,Actions", ...auditStats.byModule.map(m => `${m.module},${m.count}`)]
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }))
    a.download = `vodun-days-audit-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  // Données dérivées
  const deliveryRate = notifStats && notifStats.total > 0
    ? Math.round((notifStats.sent / notifStats.total) * 100)
    : 0

  const alertsByType = (alertStats?.byType ?? []).map(t => ({
    name:  ALERT_TYPE_LABELS[t.type] ?? t.type,
    value: t.count,
    color: ALERT_TYPE_COLORS[t.type] ?? "#6b7280",
  }))

  const alertsByStatus = alertStats ? [
    { label: "Ouvertes",  count: alertStats.byStatus.open,        color: "text-red-400",          bg: "bg-red-500/8",   border: "border-red-500/20"   },
    { label: "En cours",  count: alertStats.byStatus.inProgress,  color: "text-amber-400",        bg: "bg-amber-500/8", border: "border-amber-500/20" },
    { label: "Résolues",  count: alertStats.byStatus.resolved,    color: "text-green-400",        bg: "bg-green-500/8", border: "border-green-500/20" },
    { label: "Fermées",   count: alertStats.byStatus.closed,      color: "text-muted-foreground", bg: "bg-white/4",     border: "border-white/10"     },
  ] : []

  const topModules = [...(auditStats?.byModule ?? [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(m => ({ name: MODULE_LABELS[m.module] ?? m.module, count: m.count }))

  const byAction = auditStats?.byAction ?? []

  const operationalMetrics = [
    {
      label:       "Taux de livraison",
      rate:        deliveryRate,
      description: "Notifications envoyées / total créées",
    },
    {
      label:       "Urgences résolues",
      rate:        alertStats && alertStats.total > 0
        ? Math.round(((alertStats.byStatus.resolved + alertStats.byStatus.closed) / alertStats.total) * 100)
        : 0,
      description: "Urgences clôturées / total déclarées",
    },
    {
      label:       "Satisfaction festivaliers",
      rate:        surveyStats ? Math.round(surveyStats.satisfactionRate) : 0,
      description: "Notes 4 ou 5 / total réponses",
    },
    {
      label:       "Activité audit 24h",
      rate:        auditStats && auditStats.total > 0
        ? Math.min(Math.round((auditStats.last24h / auditStats.total) * 100), 100)
        : 0,
      description: "Actions dernières 24h vs total historique",
    },
  ]

  return (
    <TooltipProvider delayDuration={200}>
      <PageTransition>
        <div className="space-y-6 pb-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl font-semibold tracking-tight">Performance & Activité</h1>
                <LiveChip />
              </div>
              <p className="text-sm text-muted-foreground">
                Métriques en temps réel - engagement festivaliers, audit admin & santé plateforme
              </p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                Actualisé à {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline" size="icon"
                    onClick={handleRefresh} disabled={refreshing}
                    className="size-9 bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Actualiser toutes les métriques</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline" size="sm"
                    onClick={handleExportCsv} disabled={!auditStats}
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-xs"
                  >
                    <Download className="size-3.5 mr-1.5" />CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Exporter l'activité admin par module en CSV</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="Connexions 24h"
              value={platformStats?.users.recentLogins ?? 0}
              icon={Users}
              tooltip="Utilisateurs connectés dans les dernières 24 heures"
              isLive loading={loading}
            />
            <KpiCard
              label="Réponses quiz 24h"
              value={platformStats?.engagement.answersLast24h ?? 0}
              icon={Activity}
              tooltip="Réponses soumises par les festivaliers dans les dernières 24 heures"
              loading={loading}
            />
            <KpiCard
              label="Alertes ouvertes"
              value={platformStats?.security.openAlerts ?? 0}
              icon={AlertTriangle}
              tooltip="Urgences actives nécessitant une action (statut OPEN ou IN_PROGRESS)"
              alert loading={loading}
            />
            <KpiCard
              label="Satisfaction"
              value={surveyStats ? `${Math.round(surveyStats.satisfactionRate)}` : "0"}
              suffix="%"
              icon={TrendingUp}
              tooltip="Taux de satisfaction festivaliers - proportion de notes 4 et 5 sur 5"
              loading={loading}
            />
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultValue="public" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10 h-auto p-1 gap-1">
              <TabsTrigger value="public" className="flex items-center gap-2 data-[state=active]:bg-[var(--vd-gold)]/15 data-[state=active]:text-[var(--vd-gold)] rounded-lg px-4 py-2 text-sm">
                <Globe className="size-4" />Face publique
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-[var(--vd-gold)]/15 data-[state=active]:text-[var(--vd-gold)] rounded-lg px-4 py-2 text-sm">
                <Server className="size-4" />Back-office Admin
              </TabsTrigger>
            </TabsList>

            {/* ════ FACE PUBLIQUE ════ */}
            <TabsContent value="public" className="space-y-6">

              {/* Engagement festivaliers */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Engagement festivaliers - 7 derniers jours</h2>
                  <InfoTip content="Réponses quiz soumises par jour sur les 7 derniers jours. Données réelles depuis la base de données." />
                </div>
                {loading ? (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-xs">Chargement...</span>
                  </div>
                ) : !surveyStats?.trend?.length ? (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground/50 text-sm">
                    Aucune donnée d'engagement disponible
                  </div>
                ) : (
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={surveyStats.trend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--vd-gold)" stopOpacity={0.30} />
                            <stop offset="95%" stopColor="var(--vd-gold)" stopOpacity={0}    />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false}
                          interval="preserveStartEnd" tickFormatter={(v: string) => v.slice(5)} />
                        <YAxis tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false} />
                        <RechartTooltip content={<ChartTip />} />
                        <Area type="monotone" dataKey="count" name="Réponses" stroke="var(--vd-gold)" fill="url(#gCount)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[var(--vd-gold)]" />
                    <span className="text-[10px] text-muted-foreground/50">Réponses quiz / jour</span>
                  </div>
                  {platformStats && (
                    <span className="text-[10px] text-muted-foreground/40">
                      Total 7j : {platformStats.engagement.answersLast7d.toLocaleString("fr-FR")} réponses
                    </span>
                  )}
                </div>
              </div>

              {/* Bandeau GA4 */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/6 p-4 flex items-start gap-3">
                <Info className="size-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-300 mb-0.5">Core Web Vitals & trafic - disponibles dans Google Analytics</p>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    Les métriques front-end (LCP, CLS, INP, FCP, TTFB), le trafic visiteurs et la répartition par appareil sont consultables dans votre propriété GA4.
                    L'ID de mesure <span className="font-mono text-blue-300/80">G-4QH93YHX4B</span> est actif sur la plateforme.
                  </p>
                </div>
              </div>

              {/* Activité par module + Urgences par type */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Activité admin par module</h2>
                    <InfoTip content="Nombre total d'actions (CREATE, UPDATE, DELETE) par module depuis le début. Source : logs d'audit." />
                  </div>
                  {loading ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground gap-2">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : !topModules.length ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground/50 text-sm">
                      Aucune activité enregistrée
                    </div>
                  ) : (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topModules} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "oklch(0.7 0 0 / 0.7)" }} tickLine={false} axisLine={false} width={90} />
                          <RechartTooltip content={<ChartTip />} />
                          <Bar dataKey="count" name="Actions" fill="var(--vd-gold)" opacity={0.8} radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Urgences par type</h2>
                    <InfoTip content="Répartition des alertes festivaliers par catégorie depuis le début." />
                  </div>
                  {loading ? (
                    <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : !alertsByType.length || alertStats?.total === 0 ? (
                    <div className="h-[180px] flex items-center justify-center text-muted-foreground/50 text-sm text-center px-4">
                      Aucune urgence enregistrée
                    </div>
                  ) : (
                    <>
                      <div className="h-[130px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={alertsByType} cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                              {alertsByType.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
                            </Pie>
                            <RechartTooltip content={<ChartTip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5 mt-2">
                        {alertsByType.slice(0, 4).map(d => (
                          <div key={d.name} className="flex items-center gap-2">
                            <div className="size-2 rounded-full shrink-0" style={{ background: d.color }} />
                            <span className="text-xs flex-1 truncate">{d.name}</span>
                            <span className="font-semibold tabular-nums text-sm">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Statut urgences + Urgences actives */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Statut des urgences</h2>
                    <InfoTip content="Répartition des alertes festivaliers par statut de traitement." />
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white/4 animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {alertsByStatus.map(s => (
                        <div key={s.label} className={cn("rounded-xl border p-3", s.bg, s.border)}>
                          <p className="text-[10px] text-muted-foreground/60 mb-1">{s.label}</p>
                          <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.count}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-muted-foreground" />
                      <h2 className="text-base font-semibold">Urgences actives</h2>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] border-white/15",
                        openAlerts.length > 0
                          ? "text-red-400 border-red-500/25 bg-red-500/8"
                          : "text-green-400 border-green-500/25 bg-green-500/8"
                      )}
                    >
                      {openAlerts.length} active{openAlerts.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {loading ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map(i => <div key={i} className="h-12 rounded-xl bg-white/4 animate-pulse" />)}
                    </div>
                  ) : !openAlerts.length ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2 text-green-400">
                      <CheckCircle className="size-6" />
                      <span className="text-sm font-medium">Aucune urgence active</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {openAlerts.map(alert => (
                        <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/6 p-3">
                          <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-red-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">
                              {ALERT_TYPE_LABELS[alert.type] ?? alert.type}
                              {alert.status === "IN_PROGRESS" && (
                                <span className="ml-1.5 text-[10px] text-amber-400">En cours</span>
                              )}
                            </p>
                            {alert.description && (
                              <p className="text-[11px] text-muted-foreground/60 truncate mt-0.5">{alert.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ════ BACK-OFFICE ADMIN ════ */}
            <TabsContent value="admin" className="space-y-6">

              {/* KPIs admin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <KpiCard label="Admins actifs"  value={platformStats?.users.active ?? 0}  icon={Users}     tooltip="Comptes admin actifs sur la plateforme" isLive loading={loading} />
                <KpiCard label="Actions 24h"    value={auditStats?.last24h ?? 0}           icon={BarChart3} tooltip="Actions effectuées par les admins dans les dernières 24 heures" loading={loading} />
                <KpiCard label="Total actions"  value={auditStats?.total ?? 0}             icon={Activity}  tooltip="Nombre total d'actions admin enregistrées depuis le lancement" loading={loading} />
              </div>

              {/* Tableau audit par type d'action */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Activité par type d'action</h2>
                  <InfoTip content="Répartition des actions admin par type depuis le début. Source : logs d'audit." />
                </div>
                {loading ? (
                  <div className="h-12 animate-pulse bg-white/4 rounded-xl" />
                ) : !byAction.length ? (
                  <div className="py-6 text-center text-muted-foreground/50 text-sm">Aucune action enregistrée</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["Type", "Libellé", "Nombre"].map(h => (
                            <th key={h} className={cn("pb-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60", h === "Nombre" ? "text-right" : "text-left")}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {byAction.map(row => (
                          <tr key={row.action} className="group border-b border-white/5 hover:bg-white/4 transition-colors">
                            <td className="py-2.5 px-4">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full shrink-0" style={{ background: ACTION_COLORS[row.action] ?? "#6b7280" }} />
                                <span className="font-mono text-sm">{row.action}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-sm text-muted-foreground">{ACTION_LABELS[row.action] ?? row.action}</td>
                            <td className="py-2.5 px-4 text-right font-bold tabular-nums">{row.count.toLocaleString("fr-FR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top modules + Satisfaction dans le temps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Modules les plus utilisés</h2>
                    <InfoTip content="Classement des modules par nombre total d'actions admin enregistrées." />
                  </div>
                  {loading ? (
                    <div className="space-y-2">
                      {[0, 1, 2, 3].map(i => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}
                    </div>
                  ) : !topModules.length ? (
                    <div className="py-6 text-center text-muted-foreground/50 text-sm">Aucune activité</div>
                  ) : (
                    <div className="space-y-2">
                      {topModules.slice(0, 4).map((m, i) => {
                        const max = topModules[0].count
                        return (
                          <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/6 transition-all">
                            <span className="text-[10px] font-mono text-muted-foreground/40 w-4 shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm truncate">{m.name}</span>
                                <span className="font-bold tabular-nums text-sm shrink-0 ml-2">{m.count}</span>
                              </div>
                              <Progress value={(m.count / max) * 100} className="h-1 bg-white/8 [&>div]:bg-[var(--vd-gold)]" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Satisfaction dans le temps</h2>
                    <InfoTip content="Evolution de la note moyenne quotidienne des festivaliers sur 7 jours (de 1 à 5)." />
                  </div>
                  {loading ? (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : !surveyStats?.trend?.length ? (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground/50 text-sm">
                      Aucune donnée disponible
                    </div>
                  ) : (
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={surveyStats.trend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false}
                            interval="preserveStartEnd" tickFormatter={(v: string) => v.slice(5)} />
                          <YAxis tick={{ fontSize: 9, fill: "oklch(0.7 0 0 / 0.5)" }} tickLine={false} axisLine={false} domain={[0, 5]} />
                          <RechartTooltip content={<ChartTip unitMap={{ "Note moy.": "/5" }} />} />
                          <Line type="monotone" dataKey="avg" name="Note moy." stroke="var(--vd-gold)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Métriques opérationnelles */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Métriques opérationnelles</h2>
                  <InfoTip content="Indicateurs clés de fiabilité calculés depuis les données réelles de la plateforme." />
                </div>
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map(i => <div key={i} className="h-24 bg-white/4 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {operationalMetrics.map(m => (
                      <Tooltip key={m.label}>
                        <TooltipTrigger asChild>
                          <div className="text-center p-4 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/7 transition-all cursor-default">
                            <p className={cn("text-3xl font-bold tabular-nums",
                              m.rate >= 80 ? "text-green-400" : m.rate >= 50 ? "text-amber-400" : "text-red-400"
                            )}>
                              {m.rate}%
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1.5 leading-snug">{m.label}</p>
                            <Progress
                              value={m.rate}
                              className={cn("h-1 mt-2 bg-white/8",
                                m.rate >= 80 ? "[&>div]:bg-green-500" : m.rate >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                              )}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">{m.description}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>

              {/* Détail notifications */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Notifications push - détail</h2>
                  <InfoTip content="Bilan complet des notifications envoyées depuis le back-office admin." />
                </div>
                {loading ? (
                  <div className="h-16 bg-white/4 rounded-xl animate-pulse" />
                ) : !notifStats ? (
                  <div className="py-4 text-center text-muted-foreground/50 text-sm">Données indisponibles</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total créées",  value: notifStats.total,   color: "text-foreground" },
                      { label: "Envoyées",       value: notifStats.sent,    color: "text-green-400" },
                      { label: "En attente",     value: notifStats.pending, color: notifStats.pending > 0 ? "text-amber-400" : "text-muted-foreground" },
                      { label: "Échouées",       value: notifStats.failed,  color: notifStats.failed  > 0 ? "text-red-400"   : "text-green-400" },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl bg-white/4 border border-white/6 p-3 text-center">
                        <p className={cn("text-2xl font-bold tabular-nums", s.color)}>
                          {s.value.toLocaleString("fr-FR")}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </TooltipProvider>
  )
}
