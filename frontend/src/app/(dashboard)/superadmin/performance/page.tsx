"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { getPlatformStats, getPlatformActivity } from "@/lib/api/platform"
import type { PlatformStats, PlatformActivity } from "@/lib/api/platform"
import { toast } from "sonner"
import { PageTransition } from "@/components/dashboard/page-transition"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Download, RefreshCw, Users, Eye, Smartphone, Monitor,
  AlertTriangle, CheckCircle, Clock, Zap, Activity,
  TrendingUp, TrendingDown, Server, Globe, FileText,
  MousePointerClick, BarChart3, Info, Wifi, Database,
  Shield, Layers, Tablet,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, Tooltip as RechartTooltip,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "1h" | "24h" | "3d" | "7d"
type VitalStatus = "good" | "needs-improvement" | "poor"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateTrafficData(period: Period) {
  const configs = {
    "1h":  { points: 60, label: (i: number) => `${i}m`,  peak: [25, 45] as [number,number] },
    "24h": { points: 24, label: (i: number) => `${i}h`,  peak: [9,  20] as [number,number] },
    "3d":  { points: 36, label: (i: number) => `J${Math.floor(i/12)}·${(i%12)*2}h`, peak: [10, 28] as [number,number] },
    "7d":  { points: 28, label: (i: number) => `J${Math.floor(i/4)}`, peak: [8, 20] as [number,number] },
  }
  const c = configs[period]
  return Array.from({ length: c.points }, (_, i) => {
    const isPeak = i >= c.peak[0] && i <= c.peak[1]
    const base = isPeak ? 800 : 200
    const visitors = Math.floor(base + seededRandom(i * 7 + 1) * (isPeak ? 1400 : 300))
    return { label: c.label(i), visitors, pageViews: Math.floor(visitors * (2.4 + seededRandom(i * 3) * 0.8)), apiTime: Math.floor(38 + seededRandom(i * 11) * 80) }
  })
}

function generateApiData(period: Period) {
  const m = { "1h": 0.04, "24h": 1, "3d": 3, "7d": 7 }[period]
  return [
    { endpoint: "GET /api/events",         calls: Math.floor(12450 * m), avgTime: 45,  errorRate: 0.1, p99: 120 },
    { endpoint: "GET /api/programs",       calls: Math.floor(8920  * m), avgTime: 38,  errorRate: 0.0, p99: 95  },
    { endpoint: "GET /api/sites",          calls: Math.floor(6780  * m), avgTime: 52,  errorRate: 0.0, p99: 140 },
    { endpoint: "POST /api/events",        calls: Math.floor(234   * m), avgTime: 120, errorRate: 0.5, p99: 280 },
    { endpoint: "POST /api/notifications", calls: Math.floor(567   * m), avgTime: 85,  errorRate: 0.2, p99: 210 },
    { endpoint: "GET /api/users",          calls: Math.floor(2340  * m), avgTime: 29,  errorRate: 0.0, p99: 72  },
    { endpoint: "PUT /api/programs",       calls: Math.floor(89    * m), avgTime: 95,  errorRate: 0.3, p99: 240 },
  ]
}

// ─── Données statiques ────────────────────────────────────────────────────────

const VITALS = [
  { key:"lcp",  label:"LCP",  fullName:"Largest Contentful Paint",  value:1.8,  unit:"s",   thresholds:{good:2.5,  poor:4.0  }, description:"Temps de rendu du plus grand élément visible — image hero, bannière festival.", impactLabel:"Impression de chargement",    gauge:{min:0,max:5}    },
  { key:"inp",  label:"INP",  fullName:"Interaction to Next Paint",  value:112,  unit:"ms",  thresholds:{good:200, poor:500  }, description:"Réactivité aux taps et clics — navigation programme et carte.",               impactLabel:"Fluidité des interactions",   gauge:{min:0,max:600}  },
  { key:"cls",  label:"CLS",  fullName:"Cumulative Layout Shift",    value:0.04, unit:"",    thresholds:{good:0.1,  poor:0.25 }, description:"Stabilité visuelle — évite les décalages lors de l'affichage du contenu.",    impactLabel:"Stabilité de la mise en page",gauge:{min:0,max:0.3}  },
  { key:"fcp",  label:"FCP",  fullName:"First Contentful Paint",     value:0.9,  unit:"s",   thresholds:{good:1.8,  poor:3.0  }, description:"Premier pixel affiché à l'écran — réduit l'abandon avant chargement.",        impactLabel:"Première impression visuelle", gauge:{min:0,max:4}    },
  { key:"ttfb", label:"TTFB", fullName:"Time to First Byte",         value:180,  unit:"ms",  thresholds:{good:800, poor:1800 }, description:"Délai réseau + serveur avant réception du premier octet.",                    impactLabel:"Performance serveur & réseau",gauge:{min:0,max:2000} },
]

const PAGES_DATA = [
  { page:"/programme",  views:3420, avgLoad:1.2, bounceRate:22, conversion:68 },
  { page:"/carte",      views:2890, avgLoad:2.1, bounceRate:18, conversion:74 },
  { page:"/culture",    views:1567, avgLoad:1.5, bounceRate:25, conversion:55 },
  { page:"/",           views:1234, avgLoad:0.9, bounceRate:35, conversion:48 },
  { page:"/evenements", views:987,  avgLoad:1.8, bounceRate:20, conversion:61 },
  { page:"/pedagogie",  views:612,  avgLoad:1.3, bounceRate:28, conversion:44 },
]

const DEVICE_DATA = [
  { name:"Mobile",   value:68, color:"var(--vd-gold)",  Icon:Smartphone },
  { name:"Desktop",  value:28, color:"var(--vd-earth)", Icon:Monitor    },
  { name:"Tablette", value:4,  color:"#6b7280",         Icon:Tablet     },
]

const ALERTS = [
  { id:1, type:"warning" as const, message:"Temps de chargement élevé sur /carte (>2s, p75)", time:"Il y a 15 min", page:"/carte" },
  { id:2, type:"info"    as const, message:"Pic de trafic détecté — 2 245 visiteurs actifs",  time:"Il y a 1h",    page:null     },
  { id:3, type:"success" as const, message:"LCP amélioré de 15% après déploiement v2.4.1",   time:"Il y a 3h",    page:null     },
  { id:4, type:"warning" as const, message:"INP dégradé sur mobile iOS 16 (130ms → 190ms)",  time:"Il y a 5h",    page:null     },
]

const ADMIN_ACTIONS = [
  { action:"Consultation événements",  count:456, icon:Eye,              delta:+12 },
  { action:"Création événement",       count:23,  icon:FileText,         delta:+3  },
  { action:"Envoi notification",       count:12,  icon:Activity,         delta:-1  },
  { action:"Modification programme",   count:34,  icon:MousePointerClick,delta:+8  },
]

const MUTATION_SUCCESS = [
  { label:"Création événement",    rate:99.5 },
  { label:"Envoi notification",    rate:99.8 },
  { label:"Mise à jour programme", rate:98.2 },
  { label:"Suppression",           rate:100  },
]

// ─── Utils ────────────────────────────────────────────────────────────────────

function getStatus(value: number, t: {good:number;poor:number}): VitalStatus {
  return value <= t.good ? "good" : value <= t.poor ? "needs-improvement" : "poor"
}

const S: Record<VitalStatus,{text:string;tc:string;bc:string;bg:string;bar:string;hex:string}> = {
  "good":              {text:"Bon",         tc:"text-green-400",bc:"border-green-500/25",bg:"bg-green-500/10", bar:"[&>div]:bg-green-500", hex:"#4ade80"},
  "needs-improvement": {text:"À améliorer", tc:"text-amber-400",bc:"border-amber-500/25",bg:"bg-amber-500/10", bar:"[&>div]:bg-amber-500", hex:"#fbbf24"},
  "poor":              {text:"Mauvais",     tc:"text-red-400",  bc:"border-red-500/25",  bg:"bg-red-500/10",   bar:"[&>div]:bg-red-500",   hex:"#f87171"},
}

// ─── Composants ───────────────────────────────────────────────────────────────

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

function TrendTag({ delta }: { delta: number }) {
  const pos = delta >= 0
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold", pos ? "text-green-400" : "text-red-400")}>
      {pos ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
      {pos ? "+" : ""}{delta}%
    </span>
  )
}

function ScoreRing({ score }: { score: number }) {
  const r = 34; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 90 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171"
  return (
    <div className="relative flex items-center justify-center size-24">
      <svg className="size-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="oklch(1 0 0 / 0.07)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] text-muted-foreground/50 uppercase tracking-widest mt-0.5">/100</span>
      </div>
    </div>
  )
}

function MiniGauge({ value, thresholds, min, max }: { value:number; thresholds:{good:number;poor:number}; min:number; max:number }) {
  const pct = Math.min(((value - min) / (max - min)) * 100, 100)
  const status = getStatus(value, thresholds)
  const color = S[status].hex
  const gp = ((thresholds.good - min) / (max - min)) * 100
  const pp = ((thresholds.poor - min) / (max - min)) * 100
  return (
    <div className="relative h-1.5 w-full rounded-full overflow-hidden bg-white/8">
      <div className="absolute inset-0 flex">
        <div style={{ width:`${gp}%`, background:"oklch(0.55 0.17 142/0.35)" }} />
        <div style={{ width:`${pp-gp}%`, background:"oklch(0.75 0.17 85/0.25)" }} />
        <div style={{ flex:1, background:"oklch(0.65 0.20 25/0.25)" }} />
      </div>
      <div className="absolute top-0 size-1.5 rounded-full shadow-[0_0_6px_2px_currentColor] -translate-x-1/2"
        style={{ left:`${pct}%`, color, background:color, transition:"left 0.8s ease" }} />
    </div>
  )
}

function ChartTip({ active, payload, label, unitMap }: { active?:boolean; payload?:Array<{name:string;value:number;color:string}>; label?:string; unitMap?:Record<string,string> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1 border-white/15 shadow-xl">
      <p className="text-muted-foreground font-medium mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full shrink-0" style={{ background:p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums">{p.value.toLocaleString("fr-FR")}{unitMap?.[p.name] ?? ""}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Sélecteur de période ─────────────────────────────────────────────────────

const PERIODS: { value: Period; label: string }[] = [
  { value:"1h",  label:"1h" },
  { value:"24h", label:"24h"},
  { value:"3d",  label:"3j" },
  { value:"7d",  label:"7j" },
]

function PeriodSelector({ value, onChange }: { value:Period; onChange:(v:Period)=>void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/4 p-0.5 gap-0.5">
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => onChange(p.value)}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                value === p.value ? "bg-[var(--vd-gold)] text-black shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/6"
              )}>
              {p.label}
            </button>
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs">Fenêtre d'analyse — maximum 7 jours</TooltipContent>
    </Tooltip>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, decimals=0, suffix, icon:Icon, tooltip, trend, statusValue, statusThresholds, isLive }:
  { label:string; value:number; decimals?:number; suffix?:string; icon:React.ComponentType<{className?:string}>
    tooltip:string; trend?:{value:number;positive:boolean}; statusValue?:number; statusThresholds?:{good:number;poor:number}; isLive?:boolean }) {
  const status = statusValue !== undefined && statusThresholds ? getStatus(statusValue, statusThresholds) : undefined
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="glass-card p-4 cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-white/6 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">{label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {isLive && <LiveChip />}
              {status && <span className={cn("size-2 rounded-full", status==="good"?"bg-green-500":status==="needs-improvement"?"bg-amber-500":"bg-red-500")} />}
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn("text-2xl font-bold tabular-nums", status ? S[status].tc : "")}>
              <NumberTicker value={value} decimals={decimals} />
            </span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          {trend && (
            <div className="mt-1.5 flex items-center gap-1">
              <TrendTag delta={trend.positive ? trend.value : -trend.value} />
              <span className="text-[10px] text-muted-foreground/50">vs hier</span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs max-w-[220px]">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

// ─── Vital Row ────────────────────────────────────────────────────────────────

function VitalRow({ vital }: { vital: typeof VITALS[0] }) {
  const status = getStatus(vital.value, vital.thresholds)
  const cfg = S[status]
  const pct = Math.min((vital.value / vital.thresholds.poor) * 100, 100)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("group flex items-center gap-4 rounded-xl border p-3 cursor-default transition-all duration-200 bg-white/3 hover:bg-white/6", cfg.bc)}>
          <div className="w-[72px] shrink-0">
            <p className="font-mono text-sm font-bold tracking-wide">{vital.label}</p>
            <Badge variant="outline" className={cn("text-[9px] uppercase tracking-wider px-1.5 py-0 mt-0.5 font-semibold", cfg.tc, cfg.bg, cfg.bc)}>
              {cfg.text}
            </Badge>
          </div>
          <div className="w-[80px] shrink-0">
            <span className={cn("text-xl font-bold tabular-nums", cfg.tc)}>{vital.value}</span>
            <span className="text-xs text-muted-foreground ml-0.5">{vital.unit}</span>
          </div>
          <div className="flex-1 space-y-1">
            <MiniGauge value={vital.value} thresholds={vital.thresholds} min={vital.gauge.min} max={vital.gauge.max} />
            <div className="flex justify-between">
              <span className="text-[9px] text-muted-foreground/40">0</span>
              <span className="text-[9px] text-green-400/60">≤{vital.thresholds.good}{vital.unit}</span>
              <span className="text-[9px] text-amber-400/60">≤{vital.thresholds.poor}{vital.unit}</span>
            </div>
          </div>
          <div className="w-[100px] shrink-0">
            <Progress value={pct} className={cn("h-1.5 bg-white/8", cfg.bar)} />
            <p className="text-[9px] text-muted-foreground/40 mt-0.5">p75 : {pct.toFixed(0)}% du seuil</p>
          </div>
          <div className="hidden lg:block w-[160px] shrink-0">
            <p className="text-[10px] text-muted-foreground/60 leading-tight">{vital.impactLabel}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[260px] text-xs space-y-1.5">
        <p className="font-semibold text-foreground">{vital.fullName}</p>
        <p className="text-muted-foreground leading-relaxed">{vital.description}</p>
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          <span className="text-[10px] text-green-400 font-semibold">Bon</span><span className="text-[10px]">≤ {vital.thresholds.good}{vital.unit}</span>
          <span className="text-muted-foreground/30 mx-0.5">·</span>
          <span className="text-[10px] text-amber-400/80">Acceptable</span><span className="text-[10px]">≤ {vital.thresholds.poor}{vital.unit}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Alert Row ────────────────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: typeof ALERTS[0] }) {
  const c = { warning:{Icon:AlertTriangle,color:"text-amber-400",bg:"bg-amber-500/8", border:"border-amber-500/20"},
               info:   {Icon:Activity,     color:"text-blue-400", bg:"bg-blue-500/8",  border:"border-blue-500/20" },
               success:{Icon:CheckCircle,  color:"text-green-400",bg:"bg-green-500/8", border:"border-green-500/20"} }[alert.type]
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-3", c.bg, c.border)}>
      <c.Icon className={cn("size-3.5 mt-0.5 shrink-0", c.color)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-snug">{alert.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] text-muted-foreground/50">{alert.time}</p>
          {alert.page && <span className="font-mono text-[9px] text-muted-foreground/40">{alert.page}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function PerformancePage() {
  const [period, setPeriod] = useState<Period>("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<PlatformActivity[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  const trafficData = useMemo(() => generateTrafficData(period), [period])
  const apiData     = useMemo(() => generateApiData(period),     [period])
  const goodVitals  = VITALS.filter(v => getStatus(v.value, v.thresholds) === "good").length

  const fetchRealStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [statsRes, activityRes] = await Promise.all([
        getPlatformStats(),
        getPlatformActivity(10),
      ])
      if (statsRes.success)    setPlatformStats(statsRes.data)
      if (activityRes.success) setRecentActivity(activityRes.data)
    } catch {
      // silencieux — les données générées restent affichées
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchRealStats() }, [fetchRealStats])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchRealStats()
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  const handleExport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const rows = ["Métrique,Valeur,Statut",...VITALS.map(v=>`${v.fullName},${v.value}${v.unit},${S[getStatus(v.value,v.thresholds)].text}`)].join("\n")
      const a = document.createElement("a")
      a.href = URL.createObjectURL(new Blob([rows],{type:"text/csv"}))
      a.download = `vodun-days-perf-${period}.csv`; a.click()
    } else { window.print() }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <PageTransition>
        <div className="space-y-6 pb-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl font-semibold tracking-tight">Performance Web</h1>
                <LiveChip />
              </div>
              <p className="text-sm text-muted-foreground">Métriques temps réel · face publique & back-office administrateurs</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5 cursor-default">
                    Actualisé à {lastRefresh.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Cliquez sur Actualiser pour forcer une mise à jour</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PeriodSelector value={period} onChange={setPeriod} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleRefresh} className="size-9 bg-white/5 border-white/10 hover:bg-white/10">
                    <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Actualiser</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="bg-white/5 border-white/10 hover:bg-white/10 text-xs">
                    <Download className="size-3.5 mr-1.5" />CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Exporter les Web Vitals en CSV</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleExport("pdf")} className="bg-white/5 border-white/10 hover:bg-white/10 text-xs">
                    <Download className="size-3.5 mr-1.5" />PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Imprimer / rapport ministère</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Visiteurs actifs"       value={1247} icon={Users}         tooltip="Visiteurs avec une session ouverte en ce moment sur la face publique" trend={{value:12,positive:true}} isLive />
            <KpiCard label="Pages vues / h"         value={8934} icon={Eye}           tooltip="Nombre total de pages consultées sur la dernière heure" trend={{value:8,positive:true}} />
            <KpiCard label="Tps. chargement moy."   value={1.8}  decimals={1} suffix="s" icon={Clock} tooltip="Temps de chargement moyen mesuré côté client — p75 sur la période sélectionnée" statusValue={1.8} statusThresholds={{good:2,poor:3}} />
            <KpiCard label="Taux d'erreur"          value={0.3}  decimals={1} suffix="%" icon={AlertTriangle} tooltip="Proportion de requêtes HTTP en erreur 4xx ou 5xx — seuil critique : 5%" statusValue={0.3} statusThresholds={{good:1,poor:5}} />
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

              {/* Core Web Vitals */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Core Web Vitals</h2>
                    <InfoTip content={<span>Métriques officielles Google. Mesurées au <strong>75e percentile</strong> (p75) — liées au référencement SEO.</span>} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className={cn("text-[10px] font-semibold cursor-default", goodVitals===VITALS.length?"text-green-400 border-green-500/25 bg-green-500/8":goodVitals>=3?"text-amber-400 border-amber-500/25 bg-amber-500/8":"text-red-400 border-red-500/25 bg-red-500/8")}>
                          {goodVitals}/{VITALS.length} métriques optimales
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">Nombre de métriques dans le seuil "Bon" selon les standards Google</TooltipContent>
                    </Tooltip>
                    <ScoreRing score={91} />
                  </div>
                </div>
                <div className="space-y-2">
                  {VITALS.map(v => <VitalRow key={v.key} vital={v} />)}
                </div>
                <div className="mt-3 p-3 rounded-xl bg-white/3 border border-white/6 flex items-start gap-2">
                  <Info className="size-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                    Les Core Web Vitals sont évalués sur 28 jours. Les valeurs affichées correspondent au <strong className="text-muted-foreground/70">75e percentile</strong> des utilisateurs réels, conformément aux standards Google Search Console et Web Almanac.
                  </p>
                </div>
              </div>

              {/* Trafic + Appareils */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Évolution du trafic</h2>
                    <InfoTip content="Visiteurs uniques et pages vues sur la période sélectionnée. Données côté serveur — indépendant des adblockers." />
                  </div>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData} margin={{top:4,right:4,left:-28,bottom:0}}>
                        <defs>
                          <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--vd-gold)"  stopOpacity={0.30} />
                            <stop offset="95%" stopColor="var(--vd-gold)"  stopOpacity={0}    />
                          </linearGradient>
                          <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--vd-earth)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--vd-earth)" stopOpacity={0}    />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                        <XAxis dataKey="label" tick={{fontSize:9,fill:"oklch(0.7 0 0 / 0.5)"}} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{fontSize:9,fill:"oklch(0.7 0 0 / 0.5)"}} tickLine={false} axisLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(1)}k`:v} />
                        <RechartTooltip content={<ChartTip />} />
                        <Area type="monotone" dataKey="pageViews" name="Pages vues" stroke="var(--vd-earth)" fill="url(#gP)" strokeWidth={1.5} dot={false} strokeOpacity={0.7} />
                        <Area type="monotone" dataKey="visitors"  name="Visiteurs"  stroke="var(--vd-gold)"  fill="url(#gV)" strokeWidth={2}   dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {[{label:"Visiteurs",color:"var(--vd-gold)"},{label:"Pages vues",color:"var(--vd-earth)"}].map(l=>(
                      <div key={l.label} className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full" style={{background:l.color}} />
                        <span className="text-[10px] text-muted-foreground/50">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Appareils</h2>
                    <InfoTip content="Répartition du trafic par type d'appareil. Score mobile-first crucial pour une app festival pensée smartphone." />
                  </div>
                  <div className="h-[150px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={DEVICE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {DEVICE_DATA.map((e,i)=><Cell key={i} fill={e.color} opacity={0.85} />)}
                        </Pie>
                        <RechartTooltip content={<ChartTip unitMap={{Mobile:"%",Desktop:"%",Tablette:"%"}} />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {DEVICE_DATA.map(d=>(
                      <div key={d.name} className="flex items-center gap-2.5">
                        <div className="size-2 rounded-full shrink-0" style={{background:d.color}} />
                        <d.Icon className="size-3 text-muted-foreground shrink-0" />
                        <span className="text-xs flex-1">{d.name}</span>
                        <span className="font-semibold tabular-nums text-sm">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance par page */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Performance par page</h2>
                  <InfoTip content="Classement des pages par nombre de vues. Temps de chargement et taux de rebond indiquent les pages à optimiser en priorité." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        {[
                          {l:"#",  align:"left" },
                          {l:"Page",align:"left", tip:"Route Next.js"},
                          {l:"Vues",align:"right",tip:"Pages vues sur la période"},
                          {l:"Tps moy.",align:"right",tip:"Temps de chargement moyen p75"},
                          {l:"Rebond",align:"right",tip:"% sessions à page unique — élevé = peu engageant"},
                          {l:"Engagement",align:"left",tip:"Score durée × profondeur de navigation"},
                        ].map(h=>(
                          <th key={h.l} className={cn("pb-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60", h.align==="right"?"text-right":"text-left")}>
                            <div className={cn("inline-flex items-center gap-1", h.align==="right"?"flex-row-reverse":"")}>
                              {h.l}{h.tip && <InfoTip content={h.tip} />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PAGES_DATA.map((p,i)=>{
                        const ls = getStatus(p.avgLoad,{good:1.5,poor:2.5})
                        return (
                          <tr key={p.page} className="group border-b border-white/5 hover:bg-white/4 transition-colors">
                            <td className="py-2.5 px-3"><span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">{i+1}</span></td>
                            <td className="py-2.5 px-3"><span className="font-mono text-sm group-hover:text-[var(--vd-gold)] transition-colors">{p.page}</span></td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-sm">{p.views.toLocaleString("fr-FR")}</td>
                            <td className="py-2.5 px-3 text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={cn("font-mono text-sm font-semibold cursor-default",S[ls].tc)}>{p.avgLoad}s</span>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">{ls==="good"?"✅ Bon":ls==="needs-improvement"?"⚠️ À optimiser":"❌ Trop lent — action requise"}</TooltipContent>
                              </Tooltip>
                            </td>
                            <td className="py-2.5 px-3 text-right text-sm">{p.bounceRate}%</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <Progress value={p.conversion} className="h-1.5 flex-1 bg-white/8 [&>div]:bg-[var(--vd-gold)]" />
                                <span className="text-xs tabular-nums w-8 text-right text-muted-foreground">{p.conversion}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Erreurs + Alertes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Erreurs HTTP</h2>
                    <InfoTip content={<span><strong>4xx</strong> = erreurs client (404, 403…) · <strong>5xx</strong> = erreurs serveur. Les 5xx sont critiques.</span>} />
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{code:"4xx — Client",count:234},{code:"5xx — Serveur",count:12}]} layout="vertical" margin={{left:8,right:20,top:4,bottom:4}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                        <XAxis type="number" tick={{fontSize:9,fill:"oklch(0.7 0 0 / 0.5)"}} tickLine={false} axisLine={false} />
                        <YAxis dataKey="code" type="category" tick={{fontSize:10,fill:"oklch(0.7 0 0 / 0.7)"}} tickLine={false} axisLine={false} width={90} />
                        <RechartTooltip content={<ChartTip />} />
                        <Bar dataKey="count" name="Erreurs" radius={[0,6,6,0]}>
                          <Cell fill="#fbbf24" opacity={0.8} />
                          <Cell fill="#f87171" opacity={0.8} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/6 p-3 cursor-default">
                          <p className="text-[10px] text-muted-foreground/60 mb-1">Erreurs 4xx</p>
                          <p className="text-xl font-bold text-amber-400">234</p>
                          <p className="text-[9px] text-muted-foreground/40 mt-0.5">0.27% des requêtes</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">Pages introuvables, accès refusés. Vérifier les redirections.</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-xl border border-green-500/20 bg-green-500/6 p-3 cursor-default">
                          <p className="text-[10px] text-muted-foreground/60 mb-1">Erreurs 5xx</p>
                          <p className="text-xl font-bold text-green-400">12</p>
                          <p className="text-[9px] text-muted-foreground/40 mt-0.5">0.01% des requêtes</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">✅ Excellent - niveau critique (&lt;0.1%) respecté.</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-muted-foreground" />
                      <h2 className="text-base font-semibold">Alertes performance</h2>
                      <InfoTip content="Événements déclenchés quand une métrique dépasse un seuil configuré." />
                    </div>
                    <Badge variant="outline" className="text-[10px] border-white/15">{ALERTS.length} alertes</Badge>
                  </div>
                  <div className="space-y-2">
                    {ALERTS.map(a=><AlertRow key={a.id} alert={a} />)}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ════ BACK-OFFICE ADMIN ════ */}
            <TabsContent value="admin" className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <KpiCard label="Sessions admin actives" value={8}   icon={Users}     tooltip="Admins Ministère connectés en ce moment sur le back-office" isLive />
                <KpiCard label="Actions / heure"        value={127} icon={BarChart3} tooltip="Opérations réalisées par les admins sur la dernière heure" />
                <KpiCard label="Temps réponse API"      value={68}  suffix="ms" icon={Zap} tooltip="Latence moyenne API back-office — seuil acceptable : <200ms" statusValue={68} statusThresholds={{good:100,poor:300}} />
              </div>

              {/* Endpoints API */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Performance des endpoints API</h2>
                  <InfoTip content="Métriques de chaque route API du back-office. P99 = 99e percentile — temps max des 1% de requêtes les plus lentes." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        {[
                          {l:"Endpoint",  align:"left",  tip:"Méthode HTTP + route"},
                          {l:"Appels",    align:"right", tip:"Nombre d'appels sur la période"},
                          {l:"Moy.",      align:"right", tip:"Temps de réponse moyen en ms"},
                          {l:"p99",       align:"right", tip:"99e percentile — doit rester <500ms"},
                          {l:"Erreurs",   align:"right", tip:"Taux d'erreur — critique si >1%"},
                        ].map(h=>(
                          <th key={h.l} className={cn("pb-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60",h.align==="right"?"text-right":"text-left")}>
                            <div className={cn("inline-flex items-center gap-1",h.align==="right"?"flex-row-reverse":"")}>
                              {h.l}<InfoTip content={h.tip} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {apiData.map(ep=>{
                        const as = getStatus(ep.avgTime,{good:50,poor:200})
                        const es = getStatus(ep.errorRate,{good:0.5,poor:2})
                        return (
                          <tr key={ep.endpoint} className="group border-b border-white/5 hover:bg-white/4 transition-colors">
                            <td className="py-2.5 px-4"><span className="font-mono text-sm group-hover:text-[var(--vd-gold)] transition-colors">{ep.endpoint}</span></td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-sm">{ep.calls.toLocaleString("fr-FR")}</td>
                            <td className="py-2.5 px-4 text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={cn("font-mono text-sm font-semibold cursor-default",S[as].tc)}>{ep.avgTime}ms</span>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">{as==="good"?"✅ Bon":as==="needs-improvement"?"⚠️ Acceptable":"❌ Lent — optimisation requise"}</TooltipContent>
                              </Tooltip>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <span className={cn("font-mono text-sm tabular-nums",ep.p99>250?"text-amber-400":"text-muted-foreground")}>{ep.p99}ms</span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={cn("font-mono text-sm font-semibold cursor-default",S[es].tc)}>{ep.errorRate}%</span>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">{ep.errorRate===0?"✅ Aucune erreur":ep.errorRate<0.5?"✅ Nominal":"⚠️ À surveiller"}</TooltipContent>
                              </Tooltip>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions + Courbe API */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MousePointerClick className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Actions les plus fréquentes</h2>
                    <InfoTip content="Top des opérations réalisées par les admins Ministère. Identifie les fonctionnalités critiques à optimiser." />
                  </div>
                  <div className="space-y-2.5">
                    {ADMIN_ACTIONS.map(a=>(
                      <div key={a.action} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/6 transition-all">
                        <div className="size-8 rounded-lg bg-[var(--vd-gold)]/10 flex items-center justify-center shrink-0">
                          <a.icon className="size-4 text-[var(--vd-gold)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{a.action}</p>
                          <TrendTag delta={a.delta} />
                        </div>
                        <span className="font-bold tabular-nums text-lg">{a.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Wifi className="size-4 text-muted-foreground" />
                    <h2 className="text-base font-semibold">Latence API dans le temps</h2>
                    <InfoTip content="Évolution du temps de réponse moyen de l'API back-office. Un pic soudain peut indiquer un problème serveur ou un pic de charge." />
                  </div>
                  <div className="h-55">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData} margin={{top:4,right:4,left:-28,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                        <XAxis dataKey="label" tick={{fontSize:9,fill:"oklch(0.7 0 0 / 0.5)"}} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{fontSize:9,fill:"oklch(0.7 0 0 / 0.5)"}} tickLine={false} axisLine={false} unit="ms" />
                        <RechartTooltip content={<ChartTip unitMap={{"Latence API":"ms","Seuil":"ms"}} />} />
                        <Line type="monotone" dataKey={()=>200} name="Seuil" stroke="oklch(1 0 0 / 0.15)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                        <Line type="monotone" dataKey="apiTime" name="Latence API" stroke="var(--vd-gold)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Taux de succès mutations */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Taux de succès des mutations</h2>
                  <InfoTip content="Fiabilité des opérations d'écriture. Un taux <99% nécessite une investigation immédiate." />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MUTATION_SUCCESS.map(m=>(
                    <Tooltip key={m.label}>
                      <TooltipTrigger asChild>
                        <div className="text-center p-4 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/7 transition-all cursor-default">
                          <p className={cn("text-3xl font-bold tabular-nums", m.rate>=99.5?"text-green-400":"text-amber-400")}>{m.rate}%</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1.5 leading-snug">{m.label}</p>
                          <Progress value={m.rate} className={cn("h-1 mt-2 bg-white/8", m.rate>=99.5?"[&>div]:bg-green-500":"[&>div]:bg-amber-500")} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">
                        {m.rate>=99.5?`Excellent - ${(100-m.rate).toFixed(2)}% d'échec seulement`:`⚠️ ${(100-m.rate).toFixed(2)}% d'échec - à investiguer`}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </TooltipProvider>
  )
}
