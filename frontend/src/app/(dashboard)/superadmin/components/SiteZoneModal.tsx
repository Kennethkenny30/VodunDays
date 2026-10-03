"use client";

/**
 * SiteZoneModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal de dessin de la zone géographique (`zoneGeo`, polygone PostGIS) d'un
 * site. Clic sur la carte → ajoute un sommet ; le polygone se ferme et se
 * remplit automatiquement à partir de 3 sommets. Enregistre via
 * PATCH /api/sites/:id/zone (voir lib/api/sites.ts).
 */

import type * as MapLibreGL from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map, MapMarker, MarkerContent, MapControls, useMap, type MapRef,
} from "@/components/ui/map";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check, X, Undo2, Trash2, Loader2, Hexagon, MapPin, Info,
} from "lucide-react";
import { toast } from "sonner";
import type { GeoJSONPolygon, MarkerCategory, Site } from "@/lib/types/api";
import { getSiteZone, updateSiteZone } from "@/lib/api/sites";

// ─── Constantes ────────────────────────────────────────────────────────────────

const DEFAULT_ZOOM = 17;
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const CATEGORY_COLORS: Record<MarkerCategory, string> = {
  SITE:       "#F56E0F",
  TOILETTES:  "#4488FF",
  URGENCES:   "#FF3333",
  TRANSPORT:  "#FFbb00",
  ASSISTANCE: "#AA44FF",
  PRA:        "#00E5CC",
  SCENE:      "#E91E8C",
};

// ─── ZoneClickCapture ────────────────────────────────────────────────────────
// Ajoute un sommet à chaque clic sur la carte

function ZoneClickCapture({
  enabled,
  onAddPoint,
}: {
  enabled: boolean;
  onAddPoint: (lng: number, lat: number) => void;
}) {
  const { map } = useMap();
  useEffect(() => {
    if (!map || !enabled) return;
    const handler = (e: MapLibreGL.MapMouseEvent) => {
      onAddPoint(
        Math.round(e.lngLat.lng * 1e6) / 1e6,
        Math.round(e.lngLat.lat * 1e6) / 1e6,
      );
    };
    map.on("click", handler);
    map.getCanvas().style.cursor = "crosshair";
    return () => {
      map.off("click", handler);
      map.getCanvas().style.cursor = "";
    };
  }, [map, enabled, onAddPoint]);
  return null;
}

// ─── ZoneDrawLayer ───────────────────────────────────────────────────────────
// Rend les sommets, le contour et le remplissage du polygone en cours d'édition

function ZoneDrawLayer({
  points,
  color,
}: {
  points: [number, number][];
  color: string;
}) {
  const { map, isLoaded } = useMap();
  const sourceId = "vd-zone-draw-source";
  const fillLayerId = "vd-zone-draw-fill";
  const lineLayerId = "vd-zone-draw-line";
  const pointsSourceId = "vd-zone-draw-points-source";
  const pointsLayerId = "vd-zone-draw-points";

  // Création des sources/layers au montage
  useEffect(() => {
    if (!isLoaded || !map) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
    });
    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: { "fill-color": color, "fill-opacity": 0.18 },
    });
    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": color, "line-width": 2.5, "line-opacity": 0.9 },
    });

    map.addSource(pointsSourceId, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    map.addLayer({
      id: pointsLayerId,
      type: "circle",
      source: pointsSourceId,
      paint: {
        "circle-radius": 5,
        "circle-color": color,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#0E0E12",
      },
    });

    return () => {
      try {
        if (map.getLayer(pointsLayerId)) map.removeLayer(pointsLayerId);
        if (map.getSource(pointsSourceId)) map.removeSource(pointsSourceId);
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // Mise à jour des géométries quand les points changent
  useEffect(() => {
    if (!isLoaded || !map) return;

    const lineSource = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
    if (lineSource) {
      // Anneau fermé (polygone) dès 3 sommets, simple ligne sinon
      const geometry: GeoJSON.Geometry =
        points.length >= 3
          ? { type: "Polygon", coordinates: [[...points, points[0]]] }
          : { type: "LineString", coordinates: points };
      lineSource.setData({ type: "Feature", properties: {}, geometry });
    }

    const pointsSource = map.getSource(pointsSourceId) as MapLibreGL.GeoJSONSource | undefined;
    if (pointsSource) {
      pointsSource.setData({
        type: "FeatureCollection",
        features: points.map(p => ({
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: p },
        })),
      });
    }
  }, [isLoaded, map, points]);

  return null;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SiteZoneModalProps {
  open:    boolean;
  onClose: () => void;
  site:    Site | null;
  onSaved: (zoneGeo: GeoJSONPolygon | null) => void;
}

// ─── SiteZoneModal ─────────────────────────────────────────────────────────────

export function SiteZoneModal({ open, onClose, site, onSaved }: SiteZoneModalProps) {
  const mapRef = useRef<MapRef>(null);
  const [points,  setPoints]  = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [hadZone, setHadZone] = useState(false);

  const category = (site as (Site & { category?: MarkerCategory }) | null)?.category;
  const color    = category ? CATEGORY_COLORS[category] : "#F5A623";

  // Chargement de la zone existante à l'ouverture
  useEffect(() => {
    if (!open || !site) return;
    setPoints([]);
    setHadZone(false);
    setLoading(true);
    getSiteZone(site.id)
      .then(res => {
        if (res.success && res.data.zoneGeo) {
          const ring = res.data.zoneGeo.coordinates[0] || [];
          // Le dernier point ferme l'anneau sur le premier - on ne le garde pas en édition
          const withoutClosing = ring.length > 1 ? ring.slice(0, -1) : ring;
          setPoints(withoutClosing.map(([lng, lat]) => [lng, lat] as [number, number]));
          setHadZone(true);
        }
      })
      .catch(() => toast.error("Impossible de charger la zone existante"))
      .finally(() => setLoading(false));
  }, [open, site]);

  // Centrage sur le site à l'ouverture
  useEffect(() => {
    if (!open || !site) return;
    const timeout = setTimeout(() => {
      mapRef.current?.flyTo({ center: [site.longitude, site.latitude], zoom: DEFAULT_ZOOM, duration: 700 });
    }, 400);
    return () => clearTimeout(timeout);
  }, [open, site]);

  const handleAddPoint = useCallback((lng: number, lat: number) => {
    setPoints(prev => [...prev, [lng, lat]]);
  }, []);

  const handleUndo    = () => setPoints(prev => prev.slice(0, -1));
  const handleReset   = () => setPoints([]);

  const handleSave = async () => {
    if (!site || points.length < 3) return;
    setSaving(true);
    try {
      const zoneGeo: GeoJSONPolygon = { type: "Polygon", coordinates: [[...points, points[0]]] };
      const res = await updateSiteZone(site.id, zoneGeo);
      if (res.success) {
        toast.success("Zone enregistrée");
        onSaved(res.data.zoneGeo);
        onClose();
      } else {
        toast.error(res.message || "Erreur lors de l'enregistrement de la zone");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const handleClearZone = async () => {
    if (!site) return;
    setSaving(true);
    try {
      const res = await updateSiteZone(site.id, null);
      if (res.success) {
        toast.success("Zone supprimée");
        setPoints([]);
        setHadZone(false);
        onSaved(null);
      } else {
        toast.error(res.message || "Erreur lors de la suppression de la zone");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  if (!site) return null;

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent
        className="p-0 overflow-hidden gap-0"
        style={{
          maxWidth: 700,
          width: "calc(100vw - 32px)",
          background: "oklch(0.11 0.018 260 / 0.99)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: "20px 22px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 16, fontWeight: 700, color: "#F0F0F2", letterSpacing: "-0.01em" }}>
                Zone géographique - {site.name}
              </DialogTitle>
              <DialogDescription style={{ fontSize: 12, color: "#666678", marginTop: 4 }}>
                Cliquez sur la carte pour placer les sommets du polygone, dans l'ordre du contour.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div style={{
            flexShrink: 0,
            background: `${color}20`,
            border: `1px solid ${color}45`,
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 11, fontWeight: 700,
            color,
            whiteSpace: "nowrap",
          }}>
            {points.length} sommet{points.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* ── Carte ── */}
        <div style={{ position: "relative", height: 420 }}>
          {loading && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 400,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(14,14,18,0.7)",
            }}>
              <Loader2 className="size-5 animate-spin" style={{ color: "#F5A623" }} />
            </div>
          )}
          <Map
            ref={mapRef}
            center={[site.longitude, site.latitude]}
            zoom={DEFAULT_ZOOM}
            theme="dark"
            styles={{ dark: MAP_STYLE, light: MAP_STYLE }}
            className="w-full h-full"
          >
            <MapControls position="bottom-right" showZoom showCompass showLocate={false} showFullscreen={false} />
            <ZoneClickCapture enabled={!loading && !saving} onAddPoint={handleAddPoint} />
            <ZoneDrawLayer points={points} color={color} />
            <MapMarker longitude={site.longitude} latitude={site.latitude}>
              <MarkerContent>
                <MapPin size={16} style={{ color, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }} />
              </MarkerContent>
            </MapMarker>
          </Map>

          {/* Indicateur */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 300,
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(14,14,18,0.95)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "8px 16px",
            fontSize: 12, fontWeight: 600, color: "#9090A8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none", whiteSpace: "nowrap",
          }}>
            <Info size={14} style={{ color, flexShrink: 0 }} />
            {points.length < 3
              ? `Encore ${3 - points.length} sommet${3 - points.length > 1 ? "s" : ""} pour former un polygone`
              : "Polygone valide - cliquez pour ajouter d'autres sommets"
            }
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "16px 22px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="ghost" size="sm"
              onClick={handleUndo}
              disabled={points.length === 0 || saving}
              style={{ color: "#888896", fontSize: 13 }}
            >
              <Undo2 size={14} style={{ marginRight: 6 }} />
              Annuler le dernier point
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={handleReset}
              disabled={points.length === 0 || saving}
              style={{ color: "#888896", fontSize: 13 }}
            >
              <Hexagon size={14} style={{ marginRight: 6 }} />
              Réinitialiser
            </Button>
            {hadZone && (
              <Button
                variant="ghost" size="sm"
                onClick={handleClearZone}
                disabled={saving}
                style={{ color: "#FF6B6B", fontSize: 13 }}
              >
                <Trash2 size={14} style={{ marginRight: 6 }} />
                Supprimer la zone
              </Button>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="ghost" size="sm"
              onClick={onClose}
              disabled={saving}
              style={{ color: "#888896", fontSize: 13 }}
            >
              <X size={14} style={{ marginRight: 6 }} />
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={points.length < 3 || saving}
              style={{
                background: points.length >= 3 ? color : "rgba(255,255,255,0.06)",
                color:      points.length >= 3 ? "#0E0E12" : "#666678",
                border:     points.length >= 3 ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontWeight: 700, fontSize: 13, transition: "all 200ms ease",
              }}
            >
              {saving
                ? <Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />
                : <Check size={14} style={{ marginRight: 6 }} />
              }
              Enregistrer la zone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}