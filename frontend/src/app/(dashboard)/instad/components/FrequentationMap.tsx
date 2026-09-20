"use client"

import { useMemo } from "react"
import {
  Map as MapGL, MapMarker, MarkerContent, MapControls, MapClusterLayer, MapHeatmap,
} from "@/components/ui/map"
import type {
  InstadPresenceBySite, InstadPresencePoint, InstadSite,
} from "@/lib/api/instad"
import type { FeatureCollection, Point } from "geojson"

const OUIDAH_CENTER: [number, number] = [2.0878, 6.3654]
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

const CATEGORY_COLORS: Record<string, string> = {
  SITE:       "#F56E0F",
  TOILETTES:  "#4488FF",
  URGENCES:   "#FF3333",
  TRANSPORT:  "#FFbb00",
  ASSISTANCE: "#AA44FF",
  PRA:        "#00E5CC",
  SCENE:      "#E91E8C",
}

// Palette de chaleur cohérente avec l'identité KONDO (ambre → rouge profond)
const HEATMAP_COLORS = [
  { at: 0.2, color: "rgba(245,166,35,0.30)" },
  { at: 0.4, color: "rgba(245,110,15,0.45)" },
  { at: 0.6, color: "rgba(255,51,51,0.55)" },
  { at: 0.8, color: "rgba(200,20,20,0.65)" },
  { at: 1,   color: "rgba(120,0,10,0.75)" },
]

export type FrequentationMapMode = "density" | "detail" | "heatmap"

interface FrequentationMapProps {
  mode:   FrequentationMapMode
  sites:  InstadSite[]
  bySite: InstadPresenceBySite[]
  points: InstadPresencePoint[]
}

export function FrequentationMap({ mode, sites, bySite, points }: FrequentationMapProps) {
  const countBySiteId = useMemo(
    () => new Map(bySite.map(s => [s.siteId, s.count])),
    [bySite],
  )
  const maxCount = Math.max(1, ...bySite.map(s => s.count))

  // Réutilisé par "detail" (clusters) et "heatmap" (densité) - mêmes
  // positions anonymisées. Aucune propriété de poids : chaque position
  // compte pour une unité, la chaleur reflète la densité brute, pas une
  // magnitude individuelle.
  const pointsGeoJson = useMemo<FeatureCollection<Point>>(() => ({
    type: "FeatureCollection",
    features: points.map(p => ({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
    })),
  }), [points])

  return (
    <MapGL
      center={OUIDAH_CENTER}
      zoom={13}
      theme="dark"
      styles={{ dark: MAP_STYLE, light: MAP_STYLE }}
      className="w-full h-full"
    >
      <MapControls position="bottom-right" showZoom showCompass showLocate={false} showFullscreen={false} />

      {mode === "density" && sites.map(site => {
        const count = countBySiteId.get(site.id) ?? 0
        const ratio = count / maxCount
        const size  = 14 + ratio * 26
        const color = CATEGORY_COLORS[site.category] ?? "#F5A623"
        return (
          <MapMarker key={site.id} longitude={site.longitude} latitude={site.latitude}>
            <MarkerContent>
              <div
                className="flex items-center justify-center rounded-full font-bold text-white/90"
                style={{
                  width: size,
                  height: size,
                  fontSize: 10,
                  background: `${color}${count > 0 ? "cc" : "55"}`,
                  border: `2px solid ${color}`,
                  boxShadow: count > 0 ? `0 0 16px ${color}88` : "none",
                }}
              >
                {count > 0 ? count : ""}
              </div>
            </MarkerContent>
          </MapMarker>
        )
      })}

      {mode === "detail" && (
        <MapClusterLayer
          data={pointsGeoJson}
          pointColor="#00E5CC"
          clusterColors={["#00E5CC", "#F5A623", "#FF3333"]}
          clusterThresholds={[20, 100]}
        />
      )}

      {mode === "heatmap" && (
        <MapHeatmap
          data={pointsGeoJson}
          radius={[
            { zoom: 12, value: 18 },
            { zoom: 16, value: 40 },
          ]}
          intensity={0.45}
          colors={HEATMAP_COLORS}
        />
      )}
    </MapGL>
  )
}