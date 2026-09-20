"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LngLatBounds } from "maplibre-gl"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// Alias MapView : le composant s'appelle "Map" dans le registre mapcn, mais
// ce nom masque le constructeur natif `Map` de JS - qu'on utilise plus bas
// pour la jointure sites/présence (`new Map(...)`).
import { Map as MapView, MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map"
import { Users, Radio, Loader2 } from "lucide-react"
import { getPlatformStats } from "@/lib/api/platform"
import { getSites } from "@/lib/api/sites"
import type { PresenceBySite } from "@/lib/api/platform"
import type { Site } from "@/lib/types/api"

const REFRESH_MS = 30_000

// Mêmes couleurs que PresenceCard - à terme, à extraire dans un fichier
// partagé (ex: lib/constants/site-categories.ts) plutôt que dupliqué.
const CATEGORY_COLORS: Record<string, string> = {
  SITE:       "#F56E0F",
  TOILETTES:  "#4488FF",
  URGENCES:   "#FF3333",
  TRANSPORT:  "#FFbb00",
  ASSISTANCE: "#AA44FF",
  PRA:        "#00E5CC",
}

// Centre par défaut si aucun site n'a de coordonnées (même valeur que
// OUIDAH_CENTER dans SitesMapModal - à mutualiser si possible).
const DEFAULT_CENTER: [number, number] = [2.0878, 6.3654]

interface PresenceMapCardProps {
  className?: string
}

// Point d'affluence = entrée de présence enrichie des coordonnées du site
// correspondant (jointure client entre getPlatformStats et getSites, aucun
// des deux endpoints n'exposant les deux à la fois aujourd'hui).
type PresencePoint = PresenceBySite & Pick<Site, "latitude" | "longitude">

function bubbleSize(count: number, maxCount: number) {
  if (maxCount <= 0) return 14
  const ratio = count / maxCount
  return Math.round(14 + Math.sqrt(ratio) * 28)
}

// Cadre automatiquement la caméra sur les points actifs - doit être rendu
// comme enfant de <Map> pour avoir accès à l'instance via useMap().
function FitToPoints({ points }: { points: PresencePoint[] }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!isLoaded || !map) return

    if (points.length === 0) {
      map.easeTo({ center: DEFAULT_CENTER, zoom: 12, duration: 0 })
      return
    }

    if (points.length === 1) {
      map.easeTo({ center: [points[0].longitude, points[0].latitude], zoom: 14, duration: 400 })
      return
    }

    const bounds = points.reduce(
      (acc, p) => acc.extend([p.longitude, p.latitude]),
      new LngLatBounds([points[0].longitude, points[0].latitude], [points[0].longitude, points[0].latitude]),
    )
    map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 400 })
  }, [isLoaded, map, points])

  return null
}

export function PresenceMapCard({ className }: PresenceMapCardProps) {
  const [loading,   setLoading]   = useState(true)
  const [onlineNow, setOnlineNow] = useState(0)
  const [bySite,    setBySite]    = useState<PresenceBySite[]>([])
  const sitesRef = useRef<Site[]>([])
  const [sitesLoaded, setSitesLoaded] = useState(false)

  // Sites - coordonnées quasi statiques, chargées une seule fois.
  useEffect(() => {
    getSites()
      .then((res) => { if (res.success) sitesRef.current = res.data })
      .catch(() => {})
      .finally(() => setSitesLoaded(true))
  }, [])

  // Présence - temps réel, rafraîchie toutes les 30s.
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPlatformStats()
        if (res.success) {
          setOnlineNow(res.data.presence.onlineNow)
          setBySite(res.data.presence.bySite)
        }
      } catch {
        // widget non critique - on retentera au prochain cycle
      } finally {
        setLoading(false)
      }
    }
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  const points = useMemo<PresencePoint[]>(() => {
    if (!sitesLoaded) return []
    const siteById = new Map(sitesRef.current.map((s) => [s.id, s]))
    return bySite
      .map((entry) => {
        const site = siteById.get(entry.siteId)
        if (!site || site.latitude == null || site.longitude == null) return null
        return { ...entry, latitude: site.latitude, longitude: site.longitude }
      })
      .filter((p): p is PresencePoint => p !== null)
  }, [bySite, sitesLoaded])

  const maxCount = Math.max(1, ...points.map((p) => p.count))

  return (
    <div className={cn("glass-card relative overflow-hidden p-0 h-[300px]", className)}>
      {/* Carte en fond, décorative - interactions désactivées pour rester
          une carte de synthèse et non un widget de navigation (cf. SitesMapModal
          pour la carte interactive complète). Le conteneur parent a besoin
          d'une hauteur explicite : <Map> se dimensionne en h-full w-full. */}
      <div className="absolute inset-0">
        <MapView
          center={DEFAULT_CENTER}
          zoom={12}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          pitchWithRotate={false}
          className="[&_.maplibregl-canvas]:cursor-default!"
        >
          <FitToPoints points={points} />
          {points.map((point) => {
            const size = bubbleSize(point.count, maxCount)
            const color = point.category ? CATEGORY_COLORS[point.category] ?? "#888896" : "#888896"
            return (
              <MapMarker key={point.siteId} longitude={point.longitude} latitude={point.latitude}>
                <MarkerContent className="cursor-default">
                  <span
                    className="block rounded-full opacity-80"
                    style={{ width: size, height: size, background: color }}
                  />
                </MarkerContent>
                <MarkerTooltip>
                  {point.name} · {point.count} festivalier{point.count > 1 ? "s" : ""}
                </MarkerTooltip>
              </MapMarker>
            )
          })}
        </MapView>
      </div>

      {/* En-tête métrique, superposé au fond de carte avec dégradé vers
          transparent pour rester lisible sans masquer la carte entière. */}
      <div
        className="absolute top-0 inset-x-0 z-10 p-5 pb-10"
        style={{
          background: "linear-gradient(to bottom, var(--background) 60%, transparent 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2.5 cursor-default min-w-0">
                <span className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-green-400" />
                </span>
                <span className="text-sm font-semibold tracking-tight truncate">
                  Carte de présence
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-[220px]">
              Répartition géographique des festivaliers en ligne, par site
            </TooltipContent>
          </Tooltip>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-green-400 border-green-500/25 bg-green-500/8 shrink-0">
            Live
          </Badge>
        </div>

        <div className="flex items-baseline gap-2">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground/40" />
          ) : (
            <>
              <span className="text-3xl font-bold tabular-nums tracking-tight">{onlineNow}</span>
              <Users className="size-4 text-muted-foreground/50" />
            </>
          )}
        </div>
      </div>

      {/* Pied de carte */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-5 py-2.5 flex items-center gap-1.5">
        <Radio className="size-3 text-muted-foreground/40" />
        <span className="text-[10px] text-muted-foreground/50">
          {points.length} site{points.length > 1 ? "s" : ""} actif{points.length > 1 ? "s" : ""} · Actualisé toutes les {REFRESH_MS / 1000}s
        </span>
      </div>
    </div>
  )
}
