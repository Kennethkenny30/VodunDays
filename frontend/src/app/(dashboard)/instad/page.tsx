"use client"

import { useEffect, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Radio, MapPin, Star, Filter, Download, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import {
  getInstadOverview, getInstadPresencePoints, downloadInstadExport,
  type InstadOverview, type InstadPresencePoint, type InstadFilters,
} from "@/lib/api/instad"
import { FrequentationMap, type FrequentationMapMode } from "./components/FrequentationMap"

const REFRESH_MS = 30_000

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
const CATEGORY_COLORS: Record<string, string> = {
  SITE: "#F56E0F", TOILETTES: "#4488FF", URGENCES: "#FF3333",
  TRANSPORT: "#FFbb00", ASSISTANCE: "#AA44FF", PRA: "#00E5CC", SCENE: "#E91E8C",
}

let regionNames: Intl.DisplayNames | null = null
function countryName(code: string) {
  try {
    regionNames ??= new Intl.DisplayNames(["fr"], { type: "region" })
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

// ─── Petits composants de présentation ──────────────────────────────────────

function KpiCard({
  icon: Icon, label, value, suffix, accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  suffix?: string
  accent: string
}) {
  return (
    <div className="glass-card relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-24 rounded-full opacity-15 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3.5 text-muted-foreground/60" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            {label}
          </p>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, count, total, color }: { label: string; count: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs text-muted-foreground truncate">{label}</span>
        <span className="text-xs font-semibold tabular-nums shrink-0">{count} <span className="text-muted-foreground/50">({pct}%)</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color ?? "var(--vd-gold)" }}
        />
      </div>
    </div>
  )
}

// Barre de filtres du dashboard : période, croisement démographique, export.
// Les options de nationalité sont limitées au top des nationalités déjà
// chargées (pas de liste complète des pays côté front pour l'instant).
function FilterBar({
  filters, onChange, onReset, nationalityOptions, onExport, exporting,
}: {
  filters: InstadFilters
  onChange: (next: InstadFilters) => void
  onReset: () => void
  nationalityOptions: { code: string; label: string }[]
  onExport: () => void
  exporting: boolean
}) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <div className="glass-card p-4 flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mr-1">
        <Filter className="size-3.5" />
        Filtres
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/60">Du</label>
        <Input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
          className="h-9 text-xs w-36"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/60">Au</label>
        <Input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
          className="h-9 text-xs w-36"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/60">Genre</label>
        <Select
          value={filters.gender ?? "ALL"}
          onValueChange={(v) => onChange({ ...filters, gender: v === "ALL" ? undefined : v })}
        >
          <SelectTrigger className="h-9 text-xs w-36"><SelectValue placeholder="Genre" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les genres</SelectItem>
            {Object.entries(GENDER_LABELS).map(([k, l]) => (
              <SelectItem key={k} value={k}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/60">Tranche d&apos;âge</label>
        <Select
          value={filters.ageRange ?? "ALL"}
          onValueChange={(v) => onChange({ ...filters, ageRange: v === "ALL" ? undefined : v })}
        >
          <SelectTrigger className="h-9 text-xs w-40"><SelectValue placeholder="Tranche d'âge" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les tranches</SelectItem>
            {Object.entries(AGE_LABELS).map(([k, l]) => (
              <SelectItem key={k} value={k}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-muted-foreground/60">Nationalité</label>
        <Select
          value={filters.nationality ?? "ALL"}
          onValueChange={(v) => onChange({ ...filters, nationality: v === "ALL" ? undefined : v })}
        >
          <SelectTrigger className="h-9 text-xs w-40"><SelectValue placeholder="Nationalité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les nationalités</SelectItem>
            {nationalityOptions.map((n) => (
              <SelectItem key={n.code} value={n.code}>{n.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5" onClick={onReset}>
            <RotateCcw className="size-3.5" />
            Réinitialiser
          </Button>
        )}
        <Button size="sm" className="h-9 text-xs gap-1.5" onClick={onExport} disabled={exporting}>
          {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
          Exporter en CSV
        </Button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InstadPage() {
  const [loading,    setLoading]    = useState(true)
  const [overview,   setOverview]   = useState<InstadOverview | null>(null)
  const [filters,    setFilters]    = useState<InstadFilters>({})
  const [exporting,  setExporting]  = useState(false)
  const [mapMode,    setMapMode]    = useState<FrequentationMapMode>("density")
  const [siteFilter, setSiteFilter] = useState<string | undefined>(undefined)
  const [points,     setPoints]     = useState<InstadPresencePoint[]>([])
  const [pointsLoading, setPointsLoading] = useState(false)

  // Vue d'ensemble : chargement initial, rafraîchissement périodique, et
  // rechargement immédiat à chaque changement de filtre.
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await getInstadOverview(filters)
        if (active && res.success) setOverview(res.data)
      } catch {
        // non critique - on retentera au prochain cycle
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, REFRESH_MS)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [filters])

  // Points de la carte : "détail" et "chaleur" partagent la même source de
  // données, juste rendus différemment. Recharge au changement de mode, de
  // site sélectionné, ou de filtres démographiques/période.
  useEffect(() => {
    if (mapMode === "density") return
    setPointsLoading(true)
    getInstadPresencePoints(15, siteFilter)
      .then(res => {
        if (res.success) setPoints(res.data)
        else toast.error(res.message || "Impossible de charger le détail des positions")
      })
      .catch(() => toast.error("Erreur réseau"))
      .finally(() => setPointsLoading(false))
  }, [mapMode, siteFilter])

  const handleExport = async () => {
    setExporting(true)
    try {
      await downloadInstadExport(filters)
    } catch {
      toast.error("Export impossible pour le moment")
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
        <Loader2 className="size-5 animate-spin" />
        Chargement des statistiques…
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Impossible de charger les statistiques pour le moment.
      </div>
    )
  }

  const { demographics, satisfaction, presence, sites } = overview
  const genderTotal = demographics.byGender.reduce((s, g) => s + g._count, 0)
  const ageTotal    = demographics.byAgeRange.reduce((s, a) => s + a._count, 0)
  const natTotal    = demographics.topNationalities.reduce((s, n) => s + n._count, 0)
  const nationalityOptions = demographics.topNationalities.map(n => ({
    code: n.nationality, label: countryName(n.nationality),
  }))

  const mapSubtitle =
    mapMode === "density"  ? "Affluence agrégée par site" :
    mapMode === "detail"   ? "Positions individuelles anonymisées - 15 dernières minutes" :
                              "Carte de chaleur des positions anonymisées - 15 dernières minutes"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard INStaD</h1>
        <p className="text-sm text-muted-foreground">
          Statistiques de fréquentation et démographie du festival Vodun Days
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({})}
        nationalityOptions={nationalityOptions}
        onExport={handleExport}
        exporting={exporting}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Festivaliers enregistrés" value={demographics.total} accent="oklch(0.75 0.16 60)" />
        <KpiCard icon={Radio} label="En ligne maintenant" value={presence.onlineNow} accent="oklch(0.75 0.16 145)" />
        <KpiCard icon={MapPin} label="Sites suivis" value={sites.total} accent="oklch(0.75 0.16 250)" />
        <KpiCard
          icon={Star}
          label="Satisfaction moyenne"
          value={satisfaction.totalResponses > 0 ? satisfaction.averageRating : "-"}
          suffix={satisfaction.totalResponses > 0 ? `/5 · ${satisfaction.satisfactionRate}% satisfaits` : "aucune réponse"}
          accent="oklch(0.8 0.15 80)"
        />
      </div>

      {/* Carte de géolocalisation */}
      <section className="glass-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-white/8">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Répartition géographique</h2>
            <p className="text-xs text-muted-foreground">{mapSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {mapMode !== "density" && (
              <Select
                value={siteFilter ?? "ALL"}
                onValueChange={(v) => setSiteFilter(v === "ALL" ? undefined : v)}
              >
                <SelectTrigger className="h-8 text-xs w-40"><SelectValue placeholder="Tous les sites" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les sites</SelectItem>
                  {sites.list.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <ToggleGroup
              type="single"
              value={mapMode}
              onValueChange={(v) => v && setMapMode(v as FrequentationMapMode)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="density">Densité</ToggleGroupItem>
              <ToggleGroupItem value="detail">
                {pointsLoading && mapMode === "detail"
                  ? <Loader2 className="size-3 animate-spin mr-1.5" />
                  : null
                }
                Détail
              </ToggleGroupItem>
              <ToggleGroupItem value="heatmap">
                {pointsLoading && mapMode === "heatmap"
                  ? <Loader2 className="size-3 animate-spin mr-1.5" />
                  : null
                }
                Chaleur
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div style={{ height: 460 }}>
          <FrequentationMap
            mode={mapMode}
            sites={sites.list}
            bySite={presence.bySite}
            points={points}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Démographie */}
        <div className="glass-card p-5 space-y-5">
          <h2 className="text-sm font-semibold tracking-tight">Démographie</h2>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Genre</p>
            {demographics.byGender.map(g => (
              <StatBar key={g.gender} label={GENDER_LABELS[g.gender] ?? g.gender} count={g._count} total={genderTotal} />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Tranche d&apos;âge</p>
            {demographics.byAgeRange.map(a => (
              <StatBar key={a.ageRange} label={AGE_LABELS[a.ageRange] ?? a.ageRange} count={a._count} total={ageTotal} color="oklch(0.75 0.14 250)" />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Top nationalités</p>
            {demographics.topNationalities.length === 0 && (
              <p className="text-xs text-muted-foreground/50">Aucune donnée pour le moment</p>
            )}
            {demographics.topNationalities.map(n => (
              <StatBar key={n.nationality} label={countryName(n.nationality)} count={n._count} total={natTotal} color="oklch(0.75 0.14 25)" />
            ))}
          </div>
        </div>

        {/* Présence par site + satisfaction */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-3">
            <h2 className="text-sm font-semibold tracking-tight">Affluence par site</h2>
            {presence.bySite.length === 0 && presence.unassigned === 0 && (
              <p className="text-xs text-muted-foreground/50">Aucun festivalier en ligne pour le moment</p>
            )}
            {presence.bySite.map(site => (
              <StatBar
                key={site.siteId}
                label={site.name}
                count={site.count}
                total={presence.onlineNow || 1}
                color={site.category ? CATEGORY_COLORS[site.category] : undefined}
              />
            ))}
            {presence.unassigned > 0 && (
              <StatBar label="Hors zone connue" count={presence.unassigned} total={presence.onlineNow || 1} />
            )}
          </div>

          <div className="glass-card p-5 space-y-3">
            <h2 className="text-sm font-semibold tracking-tight">Distribution des notes</h2>
            {satisfaction.totalResponses === 0 ? (
              <p className="text-xs text-muted-foreground/50">Aucune réponse d&apos;enquête pour le moment</p>
            ) : (
              [5, 4, 3, 2, 1].map(rating => (
                <StatBar
                  key={rating}
                  label={`${rating} étoile${rating > 1 ? "s" : ""}`}
                  count={satisfaction.ratingDistribution[String(rating)] ?? 0}
                  total={satisfaction.totalResponses}
                  color={rating >= 4 ? "oklch(0.75 0.16 145)" : rating === 3 ? "oklch(0.8 0.15 80)" : "oklch(0.65 0.2 25)"}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}