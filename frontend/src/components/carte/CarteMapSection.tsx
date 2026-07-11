"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type React from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
  MapRoute,
  MapPopup,
  useMap,
  type MapRef,
} from "@/components/ui/map";
import {
  X, Layers, Mountain, LocateFixed, Clock, Route as RouteIcon, MapPin,
  Utensils, Coffee, Wine, Sandwich, ShoppingBag, ShoppingCart,
  Hospital, Pill, Stethoscope, BedDouble, GraduationCap, Banknote,
  Fuel, Camera, Church,
} from "lucide-react";
// POI_DATA supprimé - toutes les données viennent de la BDD via loadPOIs()
import { loadPOIs, type POI } from "@/lib/markers";
import { SiteMarker } from "./SiteMarker";
import { BottomSheet, type RoutePoint } from "./BottomSheet";
import { useGeolocation } from "@/hooks/useGeolocation";

// Constantes

const OUIDAH_CENTER: [number, number] = [2.0851, 6.3599];
const DEFAULT_ZOOM  = 15;
const MAPTILER_KEY  = "rF42xkuvfnAvkNeWRop5";

const MAP_STYLES_DARK = {
  plan:      "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
} as const;

const MAP_STYLES_LIGHT = {
  plan:      "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
} as const;

type MapMode = keyof typeof MAP_STYLES_DARK;

// Types OSM

interface OsmPoi {
  id:   number;
  lat:  number;
  lon:  number;
  tags: Record<string, string>;
  kind: OsmKind;
}

type OsmKind =
  | "restaurant" | "cafe" | "bar" | "fast_food"
  | "shop"       | "supermarket"
  | "hospital"   | "pharmacy" | "clinic"
  | "hotel"      | "school"   | "bank" | "fuel"
  | "attraction" | "place_of_worship"
  | "other";

const OSM_KIND_META: Record<OsmKind, { color: string; label: string }> = {
  restaurant:      { color: "#FF8C42", label: "Restaurant"    },
  cafe:            { color: "#C8A97E", label: "Café"          },
  bar:             { color: "#E8B86D", label: "Bar"           },
  fast_food:       { color: "#FFB347", label: "Fast-food"     },
  shop:            { color: "#9B8FFF", label: "Commerce"      },
  supermarket:     { color: "#7EC8A0", label: "Supermarché"   },
  hospital:        { color: "#FF6B6B", label: "Hôpital"       },
  pharmacy:        { color: "#4EC9B0", label: "Pharmacie"     },
  clinic:          { color: "#FF9999", label: "Clinique"      },
  hotel:           { color: "#A8D8EA", label: "Hôtel"         },
  school:          { color: "#87CEEB", label: "École"         },
  bank:            { color: "#98FB98", label: "Banque"        },
  fuel:            { color: "#FFD700", label: "Carburant"     },
  attraction:      { color: "#DDA0DD", label: "Attraction"    },
  place_of_worship:{ color: "#F0E68C", label: "Lieu de culte" },
  other:           { color: "#888896", label: "Lieu"          },
};

const OSM_KIND_ICONS: Record<OsmKind, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  restaurant:       Utensils,
  cafe:             Coffee,
  bar:              Wine,
  fast_food:        Sandwich,
  shop:             ShoppingBag,
  supermarket:      ShoppingCart,
  hospital:         Hospital,
  pharmacy:         Pill,
  clinic:           Stethoscope,
  hotel:            BedDouble,
  school:           GraduationCap,
  bank:             Banknote,
  fuel:             Fuel,
  attraction:       Camera,
  place_of_worship: Church,
  other:            MapPin,
};

function classifyOsmTags(tags: Record<string, string>): OsmKind {
  const am = tags.amenity;
  const sh = tags.shop;
  const to = tags.tourism;
  const re = tags.religion !== undefined || tags.amenity === "place_of_worship";
  if (am === "restaurant")          return "restaurant";
  if (am === "cafe")                return "cafe";
  if (am === "bar" || am === "pub") return "bar";
  if (am === "fast_food")           return "fast_food";
  if (am === "hospital")            return "hospital";
  if (am === "pharmacy")            return "pharmacy";
  if (am === "clinic" || am === "doctors") return "clinic";
  if (am === "school" || am === "university" || am === "college") return "school";
  if (am === "bank")                return "bank";
  if (am === "fuel")                return "fuel";
  if (am === "place_of_worship" || re) return "place_of_worship";
  if (sh === "supermarket" || sh === "convenience") return "supermarket";
  if (sh !== undefined)             return "shop";
  if (to === "hotel" || to === "guest_house" || to === "hostel") return "hotel";
  if (to === "attraction" || to === "museum" || to === "artwork") return "attraction";
  return "other";
}

async function fetchOsmPois(
  south: number, west: number, north: number, east: number,
): Promise<OsmPoi[]> {
  const query = `
    [out:json][timeout:15][maxsize:1000000];
    (
      node["amenity"~"restaurant|cafe|bar|pub|fast_food|hospital|pharmacy|clinic|doctors|school|university|college|bank|fuel|place_of_worship"](${south},${west},${north},${east});
      node["shop"~"supermarket|convenience|clothes|electronics|bakery|butcher|hardware|furniture|books|gifts|jewelry|mall"](${south},${west},${north},${east});
      node["tourism"~"hotel|guest_house|hostel|attraction|museum|artwork"](${south},${west},${north},${east});
    );
    out body 500;
  `.trim();
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body:   "data=" + encodeURIComponent(query),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!res.ok) throw new Error("Overpass error");
  const json = await res.json();
  return (json.elements as Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>)
    .filter(el => el.lat !== undefined)
    .map(el => ({
      id:   el.id,
      lat:  el.lat,
      lon:  el.lon,
      tags: el.tags ?? {},
      kind: classifyOsmTags(el.tags ?? {}),
    }));
}

const ROUTE_COLOR_ACTIVE = "#4A9EFF";
const ROUTE_COLOR_ALT    = "#8899AA";

interface RouteAlternative {
  coordinates: [number, number][];
  duration:    number;
  distance:    number;
}

function formatDuration(s: number): string {
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r} min`;
}

function formatDistance(m: number): string {
  return m < 1_000 ? `${Math.round(m)} m` : `${(m / 1_000).toFixed(1)} km`;
}

function generateSyntheticAlt(
  primary: RouteAlternative,
  fromCoords: [number, number],
  toCoords: [number, number],
): RouteAlternative {
  const midLng = (fromCoords[0] + toCoords[0]) / 2;
  const midLat = (fromCoords[1] + toCoords[1]) / 2;
  const dLng = toCoords[1] - fromCoords[1];
  const dLat = toCoords[0] - fromCoords[0];
  const len   = Math.sqrt(dLng * dLng + dLat * dLat) || 1;
  const offset = 0.0015;
  const altCoords: [number, number][] = [
    fromCoords,
    [midLng + (dLng / len) * offset, midLat - (dLat / len) * offset],
    toCoords,
  ];
  return {
    coordinates: altCoords,
    duration:    primary.duration * 1.15,
    distance:    primary.distance * 1.12,
  };
}

// Sous-composants

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  const { map } = useMap();
  useEffect(() => {
    if (!map) return;
    map.on("click", onMapClick);
    return () => { map.off("click", onMapClick); };
  }, [map, onMapClick]);
  return null;
}

function TerrainHandler({ enabled }: { enabled: boolean }) {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!map || !isLoaded) return;
    const SRC = "terrain-dem";
    if (enabled) {
      if (!map.getSource(SRC)) {
        map.addSource(SRC, {
          type: "raster-dem",
          url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${MAPTILER_KEY}`,
          tileSize: 256,
        });
      }
      map.setTerrain({ source: SRC, exaggeration: 1.5 });
      map.easeTo({ pitch: 45, duration: 600 });
    } else {
      map.setTerrain(null);
      map.easeTo({ pitch: 0, duration: 600 });
    }
  }, [map, isLoaded, enabled]);
  return null;
}


const LABEL_SOURCE_ID = "vd-labels-src";
const LABEL_STYLE_URL = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`;
let cachedLabelStyle: Record<string, unknown> | null = null;
async function getLabelStyle(): Promise<Record<string, unknown>> {
  if (cachedLabelStyle) return cachedLabelStyle;
  const res = await fetch(LABEL_STYLE_URL);
  if (!res.ok) throw new Error("label style fetch failed");
  cachedLabelStyle = await res.json();
  return cachedLabelStyle as Record<string, unknown>;
}

function LabelOverlayHandler({ enabled, light = false }: { enabled: boolean; light?: boolean }) {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!map || !isLoaded) return;
    const m = map;
    const injectedSources: string[] = [];
    const injectedLayers:  string[] = [];
    let cancelled = false;
    const onImageMissing = () => {};
    m.on("styleimagemissing", onImageMissing);
    async function inject() {
      try {
        const style = await getLabelStyle();
        if (cancelled || !enabled) return;
        const sources = (style.sources as Record<string, unknown>) ?? {};
        for (const [srcId, srcDef] of Object.entries(sources)) {
          const def = srcDef as Record<string, unknown>;
          if (def.type !== "vector") continue;
          const mappedId = `${LABEL_SOURCE_ID}-${srcId}`;
          if (!m.getSource(mappedId)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            m.addSource(mappedId, def as any);
            injectedSources.push(mappedId);
          }
        }
        const layers = (style.layers as Array<Record<string, unknown>>) ?? [];
        for (const layer of layers) {
          if (layer.type !== "symbol") continue;
          const layout = (layer.layout as Record<string, unknown>) ?? {};
          const iconImage = layout["icon-image"];
          const hasIcon = iconImage !== undefined && iconImage !== "" && iconImage !== null && !(Array.isArray(iconImage) && iconImage.length === 0);
          if (hasIcon) continue;
          if (!layout["text-field"]) continue;
          const newId = `vd-lbl-${layer.id as string}`;
          if (m.getLayer(newId)) continue;
          const remapped: Record<string, unknown> = { ...layer, id: newId };
          if (layer.source) {
            remapped.source = `${LABEL_SOURCE_ID}-${layer.source as string}`;
            if (!m.getSource(remapped.source as string)) continue;
          }
          const cleanLayout = { ...layout };
          delete cleanLayout["icon-image"];
          remapped.layout = cleanLayout;
          const paint = { ...(layer.paint as Record<string, unknown> ?? {}) };
          // Couleurs selon le style de carte actif (sinon labels clairs illisibles sur fond clair)
          paint["text-color"]      = light ? "#2B2B33" : "#E8E8F0";
          paint["text-halo-color"] = light ? "#FFFFFF" : "#151419";
          paint["text-halo-width"] = 1.5;
          remapped.paint = paint;
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            m.addLayer(remapped as any);
            injectedLayers.push(newId);
          } catch {}
        }
      } catch {}
    }
    function cleanup() {
      m.off("styleimagemissing", onImageMissing);
      for (const id of injectedLayers)  { try { m.removeLayer(id);  } catch {} }
      for (const id of injectedSources) { try { m.removeSource(id); } catch {} }
      injectedLayers.length  = 0;
      injectedSources.length = 0;
    }
    if (enabled) inject();
    return () => { cancelled = true; cleanup(); };
  }, [map, isLoaded, enabled, light]);
  return null;
}

function useOsmPois(enabled: boolean): { pois: OsmPoi[]; loading: boolean } {
  const { map, isLoaded } = useMap();
  const [pois, setPois]       = useState<OsmPoi[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bbox du dernier fetch réussi : évite de re-solliciter Overpass quand la vue reste incluse dedans
  const lastFetchRef = useRef<{ s: number; w: number; n: number; e: number; z: number } | null>(null);
  const fetchForCurrentView = useCallback(async () => {
    if (!map || !enabled) return;
    const bounds = map.getBounds();
    const zoom   = map.getZoom();
    if (zoom < 13) { setPois([]); lastFetchRef.current = null; return; }
    const s = bounds.getSouth(), w = bounds.getWest(), n = bounds.getNorth(), e = bounds.getEast();
    const z = Math.round(zoom);
    const last = lastFetchRef.current;
    if (last && last.z === z && s >= last.s && w >= last.w && n <= last.n && e <= last.e) return;
    setLoading(true);
    try {
      const data = await fetchOsmPois(s, w, n, e);
      setPois(data);
      lastFetchRef.current = { s, w, n, e, z };
    } catch {} finally { setLoading(false); }
  }, [map, enabled]);
  useEffect(() => {
    if (!map || !isLoaded || !enabled) { setPois([]); return; }
    fetchForCurrentView();
    const onMoveEnd = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(fetchForCurrentView, 1200);
    };
    map.on("moveend", onMoveEnd);
    return () => { map.off("moveend", onMoveEnd); if (timerRef.current) clearTimeout(timerRef.current); };
  }, [map, isLoaded, enabled, fetchForCurrentView]);
  return { pois, loading };
}

function hexToRgbTriple(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function OsmPoiMarker({ poi }: { poi: OsmPoi }) {
  const meta  = OSM_KIND_META[poi.kind];
  const Icon  = OSM_KIND_ICONS[poi.kind];
  const name  = poi.tags.name || poi.tags["name:fr"] || poi.tags["name:en"] || meta.label;
  const [hovered, setHovered] = useState(false);

  // Tooltip mobile : affiché 1 500 ms après un tap
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const mobileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = markerRef.current;
    if (!el) return;
    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
      setShowMobileTooltip(true);
      if (mobileTimer.current) clearTimeout(mobileTimer.current);
      mobileTimer.current = setTimeout(() => setShowMobileTooltip(false), 1500);
    };
    // Bloque aussi le click synthétique : sinon il atteint la carte et ferme le BottomSheet
    const handleClick = (e: MouseEvent) => { e.stopPropagation(); };
    el.addEventListener("touchend", handleTouch, { passive: true });
    el.addEventListener("click", handleClick, true);
    return () => {
      el.removeEventListener("touchend", handleTouch);
      el.removeEventListener("click", handleClick, true);
      if (mobileTimer.current) clearTimeout(mobileTimer.current);
    };
  }, []);

  // Contenu du tooltip (desktop + mobile)
  const tooltipContent = (
    <div style={{ background: "rgba(15,15,19,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", color: "#F0F0F2", padding: "10px 14px", borderRadius: 14, border: `1px solid rgba(${hexToRgbTriple(meta.color)}, 0.28)`, maxWidth: 200, minWidth: 120, boxShadow: "0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 6, background: `rgba(${hexToRgbTriple(meta.color)}, 0.14)`, border: `1px solid rgba(${hexToRgbTriple(meta.color)}, 0.28)`, borderRadius: 99, padding: "2px 8px 2px 6px" }}>
        <Icon size={10} style={{ color: meta.color, flexShrink: 0 }} />
        <span style={{ color: meta.color, fontSize: 8.5, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>{meta.label}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: "#F0F0F2", letterSpacing: "-0.01em" }}>{name}</div>
      {poi.tags.opening_hours && <div style={{ color: "#55556a", fontSize: 10, marginTop: 4 }}>{poi.tags.opening_hours}</div>}
    </div>
  );

  return (
    <MapMarker longitude={poi.lon} latitude={poi.lat}>
      <MarkerContent>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Tooltip mobile au-dessus du marqueur */}
          {showMobileTooltip && (
            <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", zIndex: 9999, pointerEvents: "none" }}>
              {tooltipContent}
            </div>
          )}
          <div
            ref={markerRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: 24, height: 24, borderRadius: "50%", background: `rgba(${hexToRgbTriple(meta.color)}, 0.15)`, border: `1.5px solid rgba(${hexToRgbTriple(meta.color)}, 0.55)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 150ms ease, background 150ms ease", transform: hovered ? "scale(1.25)" : "scale(1)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            <Icon size={11} style={{ color: meta.color }} />
          </div>
        </div>
      </MarkerContent>
      <MarkerTooltip className="p-0 bg-transparent shadow-none border-0 rounded-none">
        {tooltipContent}
      </MarkerTooltip>
    </MapMarker>
  );
}

function OsmPoiLayer({ enabled }: { enabled: boolean }) {
  const { pois } = useOsmPois(enabled);
  return <>{enabled && pois.map(poi => <OsmPoiMarker key={`osm-${poi.id}`} poi={poi} />)}</>;
}

function UserLocationMarker({ longitude, latitude, accuracy }: { longitude: number; latitude: number; accuracy?: number }) {
  // Conversion mètres → pixels selon zoom et latitude (le rayon de précision est en mètres)
  const { map } = useMap();
  const [zoom, setZoom] = useState(() => map?.getZoom() ?? DEFAULT_ZOOM);
  useEffect(() => {
    if (!map) return;
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoom", onZoom);
    return () => { map.off("zoom", onZoom); };
  }, [map]);
  const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  const accuracyPx = accuracy !== undefined ? Math.min((accuracy / metersPerPixel) * 2, 600) : 0;

  return (
    <MapMarker longitude={longitude} latitude={latitude}>
      <MarkerContent>
        <style>{`@keyframes _uLocSpin{to{transform:rotate(360deg)}} @keyframes _uLocPulse{0%,100%{opacity:.18;transform:scale(1)} 50%{opacity:.06;transform:scale(1.5)}} @keyframes _uLocBeat{0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.12;transform:scale(1.9)}}`}</style>
        <div style={{ position: "relative", width: 0, height: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {accuracy !== undefined && accuracy < 300 && accuracyPx > 48 && <div style={{ position: "absolute", width: accuracyPx, height: accuracyPx, borderRadius: "50%", background: "rgba(68,136,255,0.07)", border: "1px solid rgba(68,136,255,0.18)", transform: "translate(-50%,-50%)", top: 0, left: 0, pointerEvents: "none" }} />}
          <div style={{ position: "absolute", width: 44, height: 44, borderRadius: "50%", background: "rgba(68,136,255,0.14)", animation: "_uLocBeat 2.4s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "rgba(68,136,255,0.20)", animation: "_uLocPulse 1.6s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "conic-gradient(from 0deg, #4488FF, #a0c4ff, #ffffff, #4488FF)", padding: 2, animation: "_uLocSpin 4s linear infinite", boxShadow: "0 0 0 2px rgba(27,27,30,0.8), 0 4px 12px rgba(68,136,255,0.5)" }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1B1B1E" }} /></div>
          <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#4488FF", border: "1.5px solid #ffffff", boxShadow: "0 2px 8px rgba(68,136,255,0.7)", zIndex: 1 }} />
        </div>
      </MarkerContent>
      <MarkerLabel><span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4488FF", background: "rgba(27,27,30,0.90)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(68,136,255,0.30)", whiteSpace: "nowrap", marginTop: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>Ma position</span></MarkerLabel>
      <MarkerTooltip className="p-0 bg-transparent shadow-none border-0 rounded-none">
        <div style={{ background: "rgba(15,15,19,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", color: "#F0F0F2", padding: "10px 14px", borderRadius: 14, border: "1px solid rgba(68,136,255,0.28)", minWidth: 140, boxShadow: "0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 6, background: "rgba(68,136,255,0.14)", border: "1px solid rgba(68,136,255,0.28)", borderRadius: 99, padding: "2px 8px 2px 6px" }}>
            <LocateFixed size={10} style={{ color: "#4488FF", flexShrink: 0 }} />
            <span style={{ color: "#4488FF", fontSize: 8.5, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>Position GPS</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F2" }}>
            Votre position
            {accuracy !== undefined && (
              <span style={{ color: "#55556a", marginLeft: 6, fontSize: 11, fontWeight: 500 }}>±{Math.round(accuracy)} m</span>
            )}
          </div>
        </div>
      </MarkerTooltip>
    </MapMarker>
  );
}

function OsmLoadingIndicator({ mapRef }: { mapRef: React.RefObject<MapRef | null> }) {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onStart = () => { if (timerRef.current) clearTimeout(timerRef.current); setLoading(true); };
    const onEnd   = () => { timerRef.current = setTimeout(() => setLoading(false), 900); };
    map.on("movestart", onStart);
    map.on("idle",      onEnd);
    return () => { map.off("movestart", onStart); map.off("idle", onEnd); };
  }, [mapRef]);
  if (!loading) return null;
  return (
    /* Sous la rangée de boutons mode (haut-droite) : ne chevauche plus les contrôles de zoom */
    <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 200px)", right: 12, zIndex: 200, display: "flex", alignItems: "center", gap: 6, background: "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 99, padding: "5px 11px", boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(245,110,15,0.3)", borderTopColor: "#F56E0F", animation: "_uLocSpin 0.9s linear infinite" }} />
      <span style={{ fontSize: 10, fontWeight: 600, color: "#878787" }}>Chargement des lieux…</span>
    </div>
  );
}

function GpsStatusBadge({ loading, permissionDenied, onRequestAgain }: { loading: boolean; permissionDenied: boolean; onRequestAgain: () => void }) {
  if (!loading && !permissionDenied) return null;
  return (
    <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 52px)", left: "50%", transform: "translateX(-50%)", zIndex: 300, display: "flex", alignItems: "center", gap: 8, background: "rgba(27,27,30,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: permissionDenied ? "1px solid rgba(255,68,68,0.35)" : "1px solid rgba(68,136,255,0.30)", borderRadius: 99, padding: "6px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
      {loading ? (<><div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(68,136,255,0.3)", borderTopColor: "#4488FF", animation: "_uLocSpin 0.8s linear infinite", flexShrink: 0 }} /><span style={{ fontSize: 11, fontWeight: 600, color: "#878787", whiteSpace: "nowrap" }}>Recherche de votre position…</span></>) : (<><LocateFixed size={12} style={{ color: "#FF4444", flexShrink: 0 }} /><span style={{ fontSize: 11, fontWeight: 600, color: "#FF4444", whiteSpace: "nowrap" }}>Position refusée</span><button onClick={onRequestAgain} style={{ fontSize: 11, fontWeight: 700, color: "#FBFBFB", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "2px 8px", cursor: "pointer", marginLeft: 2 }}>Réessayer</button></>)}
    </div>
  );
}

function RouteAlternativesPanel({ routes, selectedIndex, onSelect, onClose, routeError }: { routes: RouteAlternative[]; selectedIndex: number; onSelect: (i: number) => void; onClose: () => void; routeError: string | null }) {
  // Affiché aussi sans routes quand il y a une erreur, pour la rendre visible et permettre de sortir
  if (routes.length === 0 && !routeError) return null;
  const routeColor = (i: number, active: boolean) => active ? ROUTE_COLOR_ACTIVE : ROUTE_COLOR_ALT;
  return (
    <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 148px)", left: 12, zIndex: 250, display: "flex", flexDirection: "column", gap: 6 }}>
      {routeError && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 12, background: "rgba(255,80,80,0.10)", border: "1px solid rgba(255,80,80,0.30)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", fontSize: 11, fontWeight: 600, color: "#ff8080", boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          <X size={12} style={{ flexShrink: 0 }} />
          {routeError}
        </div>
      )}
      {routes.map((route, i) => {
        const isActive  = i === selectedIndex;
        const isFastest = i === 0;
        const color     = routeColor(i, isActive);
        return (
          <button key={i} onClick={() => onSelect(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, cursor: "pointer", background: isActive ? "rgba(74,158,255,0.12)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1px solid ${isActive ? "rgba(74,158,255,0.45)" : "rgba(255,255,255,0.10)"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 180ms ease", minWidth: 200 }}>
            <div style={{ width: 3, height: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} style={{ color: isActive ? ROUTE_COLOR_ACTIVE : "#878787", flexShrink: 0 }} /><span style={{ fontSize: 13, fontWeight: 800, color: isActive ? "#FBFBFB" : "#a0a0a0" }}>{formatDuration(route.duration)}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><RouteIcon size={11} style={{ color: "#55556a", flexShrink: 0 }} /><span style={{ fontSize: 11, color: "#55556a" }}>{formatDistance(route.distance)}</span></div>
            {isFastest && <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#22c55e", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 99, padding: "1px 7px" }}>+ rapide</span>}
          </button>
        );
      })}
      <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 14px", borderRadius: 12, cursor: "pointer", background: "rgba(27,27,30,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.12)", color: "#878787", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
        <X size={13} />Fin de navigation
      </button>
    </div>
  );
}

// Hook : deep-link depuis URL
/**
 * Lit les query params à l'ouverture de la page et retourne la cible de focal.
 *
 * Deux modes :
 *   ?siteId=<uuid>              → on cherche le POI dans la liste chargée (BDD)
 *   ?lat=<n>&lng=<n>&name=<s>  → focal sur coordonnées brutes (fallback)
 */
type FocalTarget =
  | { mode: "siteId"; siteId: string }
  | { mode: "coords"; lat: number; lng: number; name: string }
  | null;

function useMapFocalTarget(): FocalTarget {
  const params = useSearchParams();
  const siteId = params.get("siteId");
  const lat    = params.get("lat");
  const lng    = params.get("lng");
  const name   = params.get("name");

  if (siteId) return { mode: "siteId", siteId };
  if (lat && lng) return { mode: "coords", lat: parseFloat(lat), lng: parseFloat(lng), name: name ?? "Site" };
  return null;
}

// CarteMapSection

interface CarteMapSectionProps {
  activeFilters: Set<string>;
}

export function CarteMapSection({ activeFilters }: CarteMapSectionProps) {
  const mapRef = useRef<MapRef>(null);
  const { resolvedTheme } = useTheme();
  const MAP_STYLES = resolvedTheme === "light" ? MAP_STYLES_LIGHT : MAP_STYLES_DARK;

  const [pois,             setPois]             = useState<POI[]>([]);
  const [selectedSite,     setSelectedSite]     = useState<POI | null>(null);
  const [routeAlts,        setRouteAlts]        = useState<RouteAlternative[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [routeActive,      setRouteActive]      = useState(false);
  const [routeError,       setRouteError]       = useState<string | null>(null);
  const [infoPopup,        setInfoPopup]        = useState<{ lng: number; lat: number; text: string } | null>(null);
  const [mapMode,          setMapMode]          = useState<MapMode>("plan");
  const [terrain3D,        setTerrain3D]        = useState(false);
  const [osmEnabled,       setOsmEnabled]       = useState(true);
  // Incrémenté pour ouvrir le panneau itinéraire du BottomSheet (CTA marqueur sans position connue)
  const [routeSignal,      setRouteSignal]      = useState(0);

  // Annule la requête OSRM en cours quand une nouvelle navigation démarre
  const osrmAbortRef = useRef<AbortController | null>(null);

  // Pas de prompt géoloc au chargement : la permission est demandée au premier geste (bouton locate)
  const { location: userLocation, loading: gpsLoading, permissionDenied, requestLocation } = useGeolocation({ auto: false });
  const focalTarget = useMapFocalTarget();
  const tCarte = useTranslations("carte");

  // Chargement des POI depuis la BDD (toutes catégories)
  // Fallback sur [] - plus de POI_DATA statique

  useEffect(() => {
    loadPOIs().then(setPois).catch(() => setPois([]));
  }, []);

  // Centrage GPS initial

  const hasCenteredRef = useRef(false);
  useEffect(() => {
    if (userLocation && !hasCenteredRef.current && !focalTarget) {
      hasCenteredRef.current = true;
      mapRef.current?.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 17, duration: 1200 });
    }
  }, [userLocation, focalTarget]);

  // Deep-link : focal automatique quand la carte ET les POI sont prêts
  //
  // On attend que `pois` soit chargé ET que la carte soit montée.
  // La carte est disponible dès que mapRef.current est non-null, ce qui arrive
  // un peu après le premier render. On réessaie via un léger délai si la carte
  // n'est pas encore prête (cas rare : navigation rapide).

  const focalAppliedRef = useRef(false);

  useEffect(() => {
    if (!focalTarget || focalAppliedRef.current || pois.length === 0) return;

    function applyFocal() {
      if (!focalTarget) return;

      if (focalTarget.mode === "siteId") {
        // Cherche dans les POI chargés depuis la BDD (toutes catégories)
        const poi = pois.find(p => p.id === focalTarget.siteId);
        if (poi) {
          setSelectedSite(poi);
          mapRef.current?.flyTo({ center: [poi.longitude, poi.latitude], zoom: 17, duration: 1000 });
          focalAppliedRef.current = true;
          return;
        }
        console.warn(`[CarteMapSection] siteId=${focalTarget.siteId} non trouvé dans les POI chargés`);
      }

      if (focalTarget.mode === "coords") {
        // Focal sur coordonnées brutes - crée un POI éphémère pour la sélection visuelle
        const ephemeral: POI = {
          id:          `focal-${Date.now()}`,
          name:        focalTarget.name,
          longitude:   focalTarget.lng,
          latitude:    focalTarget.lat,
          category:    "sites",
        };
        setSelectedSite(ephemeral);
        mapRef.current?.flyTo({ center: [focalTarget.lng, focalTarget.lat], zoom: 17, duration: 1000 });
        focalAppliedRef.current = true;
      }
    }

    // Si la carte n'est pas encore prête on retente après 400 ms
    if (!mapRef.current) {
      const timer = setTimeout(applyFocal, 400);
      return () => clearTimeout(timer);
    }
    applyFocal();
  }, [focalTarget, pois]);

  // Handlers

  const handleMapClick = useCallback(() => {
    setSelectedSite(null);
    setInfoPopup(null);
  }, []);

  const toggleMapMode = useCallback(() => setMapMode(p => p === "plan" ? "satellite" : "plan"), []);
  const toggleTerrain = useCallback(() => setTerrain3D(p => !p), []);
  const toggleOsm     = useCallback(() => setOsmEnabled(p => !p), []);

  const resolveCoords = useCallback((point: RoutePoint): [number, number] | null => {
    if (point.type === "gps") return userLocation ? [userLocation.longitude, userLocation.latitude] : null;
    return [point.poi.longitude, point.poi.latitude];
  }, [userLocation]);

  const handleNavigateFromTo = useCallback(async (from: RoutePoint, to: RoutePoint) => {
    const fromCoords = resolveCoords(from);
    const toCoords   = resolveCoords(to);
    if (!fromCoords || !toCoords) {
      // Erreur visible plutôt qu'un échec silencieux (ex : point GPS sans position acquise)
      setRouteAlts([]);
      setRouteActive(true);
      setRouteError("Position introuvable - activez la localisation");
      return;
    }

    // Annule toute requête OSRM précédente encore en vol (évite les race conditions)
    osrmAbortRef.current?.abort();
    const controller = new AbortController();
    osrmAbortRef.current = controller;

    setSelectedSite(null);
    setRouteActive(true);
    setSelectedRouteIdx(0);
    setRouteError(null);

    const fallback: RouteAlternative = { coordinates: [fromCoords, toCoords], duration: 0, distance: 0 };
    setRouteAlts([fallback, generateSyntheticAlt(fallback, fromCoords, toCoords)]);

    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?overview=full&geometries=geojson&alternatives=true`;
      const res  = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
      const data = await res.json();
      if (data.routes?.length > 0) {
        const osrmAlts: RouteAlternative[] = data.routes.map((r: { geometry: { coordinates: [number, number][] }; duration: number; distance: number }) => ({
          coordinates: r.geometry.coordinates,
          // Le serveur OSRM public ignore le profil foot (durées voiture) :
          // on estime la marche à ~4,9 km/h à partir de la distance
          duration:    r.distance / 1.35,
          distance:    r.distance,
        }));
        if (osrmAlts.length === 1) osrmAlts.push(generateSyntheticAlt(osrmAlts[0], fromCoords, toCoords));
        setRouteAlts(osrmAlts);
      } else {
        console.warn("[OSRM] Aucun itinéraire retourné:", data);
        setRouteError("Aucun itinéraire trouvé");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[OSRM] Erreur de routage:", err);
      setRouteError("Itinéraire non disponible - vérifiez votre connexion");
    }

    const map = mapRef.current;
    if (!map) return;
    const [lng1, lat1] = fromCoords;
    const [lng2, lat2] = toCoords;
    const dLng = Math.abs(lng2 - lng1);
    const dLat = Math.abs(lat2 - lat1);
    const span  = Math.max(dLng, dLat);
    if (span < 0.005) {
      map.flyTo({ center: [(lng1 + lng2) / 2, (lat1 + lat2) / 2], zoom: Math.max(map.getZoom(), 16), duration: 900 });
    } else {
      // Padding réduit sur mobile : la réserve gauche de 230px (panneau routes desktop)
      // écraserait le tracé sur un petit écran
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      map.fitBounds(
        [[Math.min(lng1, lng2), Math.min(lat1, lat2)], [Math.max(lng1, lng2), Math.max(lat1, lat2)]],
        {
          padding: isMobile
            ? { top: 160, bottom: 220, left: 40, right: 40 }
            : { top: 140, bottom: 160, left: 230, right: 60 },
          duration: 900,
          maxZoom: 17,
        },
      );
    }
  }, [resolveCoords]);

  const handleEndNavigation = useCallback(() => {
    osrmAbortRef.current?.abort();
    setRouteAlts([]);
    setRouteActive(false);
    setSelectedRouteIdx(0);
    setRouteError(null);
    mapRef.current?.flyTo({ center: OUIDAH_CENTER, zoom: DEFAULT_ZOOM, duration: 800 });
  }, []);

  const handleLocate = useCallback(() => {
    if (userLocation) {
      mapRef.current?.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 17, duration: 1200 });
    } else {
      requestLocation();
    }
  }, [userLocation, requestLocation]);

  // POI filtrés depuis la BDD (toutes catégories)
  const filteredPOIs = pois.filter(
    poi => activeFilters.has(poi.category) || activeFilters.has("all")
  );

  // Render

  return (
    <div className="relative h-full">
      <Map
        ref={mapRef}
        center={OUIDAH_CENTER}
        zoom={DEFAULT_ZOOM}
        theme="dark"
        styles={{ dark: MAP_STYLES[mapMode], light: MAP_STYLES[mapMode] }}
        className="w-full h-full"
      >
        <MapControls position="bottom-right" showZoom showCompass showLocate showFullscreen={false} onLocate={handleLocate} />
        <MapClickHandler onMapClick={handleMapClick} />
        <TerrainHandler enabled={terrain3D} />

        <LabelOverlayHandler enabled={mapMode === "plan"} light={resolvedTheme === "light"} />
        <OsmPoiLayer enabled={osmEnabled} />

        {userLocation && (
          <UserLocationMarker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            accuracy={userLocation.accuracy}
          />
        )}

        {/* POI 100% depuis la BDD - toutes catégories */}
        {filteredPOIs.map(poi => (
          <SiteMarker
            key={poi.id}
            poi={poi}
            isSelected={selectedSite?.id === poi.id}
            onClick={clickedPoi => {
              setSelectedSite(prev => prev?.id === clickedPoi.id ? null : clickedPoi);
              mapRef.current?.flyTo({ center: [clickedPoi.longitude, clickedPoi.latitude], zoom: 17, duration: 800 });
            }}
            onNavigate={poi => {
              if (userLocation) {
                handleNavigateFromTo({ type: "gps", label: "Ma position" }, { type: "poi", poi });
              } else {
                // Pas de position connue : on ouvre le panneau itinéraire du sheet
                // pour que l'utilisateur choisisse ou déclenche son point de départ
                setSelectedSite(poi);
                setRouteSignal(s => s + 1);
              }
            }}
          />
        ))}

        {routeAlts
          .map((alt, i) => ({ alt, i }))
          .sort((a, b) => a.i === selectedRouteIdx ? 1 : b.i === selectedRouteIdx ? -1 : 0)
          .map(({ alt, i }) => {
            const isSelected = i === selectedRouteIdx;
            return (
              <MapRoute
                key={i}
                coordinates={alt.coordinates}
                color={isSelected ? ROUTE_COLOR_ACTIVE : ROUTE_COLOR_ALT}
                width={isSelected ? 5 : 3}
                opacity={isSelected ? 0.92 : 0.50}
                dashArray={isSelected ? undefined : [6, 5]}
                onClick={() => setSelectedRouteIdx(i)}
              />
            );
          })
        }

        {infoPopup && (
          <MapPopup longitude={infoPopup.lng} latitude={infoPopup.lat} onClose={() => setInfoPopup(null)}>
            <div style={{ background: "#1B1B1E", color: "#FBFBFB", padding: "8px 12px", borderRadius: 8, fontSize: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              {infoPopup.text}
            </div>
          </MapPopup>
        )}
      </Map>

      <GpsStatusBadge loading={gpsLoading} permissionDenied={permissionDenied} onRequestAgain={requestLocation} />

      {osmEnabled && <OsmLoadingIndicator mapRef={mapRef} />}

      {routeActive && (
        <RouteAlternativesPanel
          routes={routeAlts}
          selectedIndex={selectedRouteIdx}
          onSelect={setSelectedRouteIdx}
          onClose={handleEndNavigation}
          routeError={routeError}
        />
      )}

      {/* Boutons mode carte - sous l'overlay header, décalés du safe-area (PWA iOS) */}
      <div className="absolute right-3 flex gap-2" style={{ top: "calc(env(safe-area-inset-top, 0px) + 148px)", zIndex: 200 }}>
        <button onClick={toggleMapMode} aria-pressed={mapMode === "satellite"} className="flex items-center gap-1.5 px-3 rounded-xl cursor-pointer" style={{ minHeight: 44, background: mapMode === "satellite" ? "rgba(245,110,15,0.15)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: mapMode === "satellite" ? "1px solid rgba(245,110,15,0.5)" : "1px solid rgba(255,255,255,0.12)", color: mapMode === "satellite" ? "#F56E0F" : "#FBFBFB", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 200ms ease" }}>
          <Layers className="w-3.5 h-3.5" />{mapMode === "plan" ? "Satellite" : "Plan"}
        </button>
        <button onClick={toggleTerrain} aria-pressed={terrain3D} className="flex items-center gap-1.5 px-3 rounded-xl cursor-pointer" style={{ minHeight: 44, background: terrain3D ? "rgba(245,110,15,0.15)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: terrain3D ? "1px solid rgba(245,110,15,0.5)" : "1px solid rgba(255,255,255,0.12)", color: terrain3D ? "#F56E0F" : "#FBFBFB", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 200ms ease" }}>
          <Mountain className="w-3.5 h-3.5" />3D
        </button>
        <button onClick={toggleOsm} aria-pressed={osmEnabled} className="flex items-center gap-1.5 px-3 rounded-xl cursor-pointer" style={{ minHeight: 44, background: osmEnabled ? "rgba(245,110,15,0.15)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: osmEnabled ? "1px solid rgba(245,110,15,0.5)" : "1px solid rgba(255,255,255,0.12)", color: osmEnabled ? "#F56E0F" : "#FBFBFB", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 200ms ease" }}>
          <MapPin className="w-3.5 h-3.5" />Lieux
        </button>
      </div>

      {/* État vide : aucune catégorie de filtre sélectionnée */}
      {activeFilters.size === 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-[12px] font-medium"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)", zIndex: 150, background: "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", color: "#C8C8D8", boxShadow: "0 2px 12px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}
        >
          {tCarte("noFilter")}
        </div>
      )}

      {/* allPois passé au BottomSheet pour alimenter le sélecteur de destination */}
      <BottomSheet
        site={selectedSite}
        userLocation={userLocation}
        onClose={() => setSelectedSite(null)}
        onNavigateFromTo={handleNavigateFromTo}
        allPois={pois}
        onRequestLocation={requestLocation}
        gpsLoading={gpsLoading}
        permissionDenied={permissionDenied}
        openRouteSignal={routeSignal}
      />
    </div>
  );
}