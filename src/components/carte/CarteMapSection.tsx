"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
import { X, Layers, Mountain, LocateFixed, Clock, Route as RouteIcon } from "lucide-react";
import { POI_DATA, MARKER_CATEGORIES, type POI } from "@/lib/markers";
import { SiteMarker } from "./SiteMarker";
import { BottomSheet, type RoutePoint } from "./BottomSheet";
import { useGeolocation } from "@/hooks/useGeolocation";

// ─── Constantes ───────────────────────────────────────────────────────────────

const OUIDAH_CENTER: [number, number] = [2.0851, 6.3599];
const DEFAULT_ZOOM  = 15;
const MAPTILER_KEY  = "rF42xkuvfnAvkNeWRop5";

const MAP_STYLES = {
  plan:      "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
} as const;

type MapMode = keyof typeof MAP_STYLES;

/**
 * Couleurs des trajets — distinctes du orange satellite et du fond sombre.
 * Route sélectionnée : bleu vif  #4A9EFF
 * Route alternative  : gris clair #8899AA (tiretée)
 */
const ROUTE_COLOR_ACTIVE = "#4A9EFF";
const ROUTE_COLOR_ALT    = "#8899AA";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteAlternative {
  coordinates: [number, number][];
  duration:    number; // secondes
  distance:    number; // mètres
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(s: number): string {
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r} min`;
}

function formatDistance(m: number): string {
  return m < 1_000 ? `${Math.round(m)} m` : `${(m / 1_000).toFixed(1)} km`;
}

/**
 * Génère un second trajet alternatif synthétique lorsque OSRM n'en retourne qu'un.
 * On décale les waypoints intermédiaires latéralement (~150 m) pour simuler
 * une variante plausible sans appel réseau supplémentaire.
 */
function generateSyntheticAlt(
  primary: RouteAlternative,
  fromCoords: [number, number],
  toCoords: [number, number],
): RouteAlternative {
  // Coordonnée médiane décalée perpendiculairement
  const midLng = (fromCoords[0] + toCoords[0]) / 2;
  const midLat = (fromCoords[1] + toCoords[1]) / 2;
  // Décalage ~0.0015° ≈ 150 m
  const dLng = toCoords[1] - fromCoords[1]; // perpendiculaire inversée
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
    duration:    primary.duration * 1.15,  // +15 % de temps
    distance:    primary.distance * 1.12,  // +12 % de distance
  };
}

// ─── Sous-composants carte ────────────────────────────────────────────────────

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

function ZoomAwareLegend() {
  const { map } = useMap();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  useEffect(() => {
    if (!map) return;
    const h = () => setZoom(map.getZoom());
    map.on("zoom", h);
    return () => { map.off("zoom", h); };
  }, [map]);
  if (zoom >= 14) return null;
  return (
    <div style={{ position: "absolute", bottom: 90, left: 16, zIndex: 100, background: "rgba(27,27,30,0.92)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px" }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#878787", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Catégories</p>
      {Object.entries(MARKER_CATEGORIES).map(([key, cat]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#a0a0a0" }}>{cat.emoji} {cat.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── UserLocationMarker ───────────────────────────────────────────────────────

function UserLocationMarker({ longitude, latitude, accuracy }: {
  longitude: number; latitude: number; accuracy?: number;
}) {
  return (
    <MapMarker longitude={longitude} latitude={latitude}>
      <MarkerContent>
        <style>{`
          @keyframes _uLocSpin  { to { transform: rotate(360deg); } }
          @keyframes _uLocPulse { 0%,100%{opacity:.18;transform:scale(1)} 50%{opacity:.06;transform:scale(1.5)} }
          @keyframes _uLocBeat  { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.12;transform:scale(1.9)} }
        `}</style>
        <div style={{ position: "relative", width: 0, height: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {accuracy !== undefined && accuracy < 300 && (
            <div style={{ position: "absolute", width: accuracy * 2, height: accuracy * 2, borderRadius: "50%", background: "rgba(68,136,255,0.07)", border: "1px solid rgba(68,136,255,0.18)", transform: "translate(-50%,-50%)", top: 0, left: 0, pointerEvents: "none" }} />
          )}
          <div style={{ position: "absolute", width: 44, height: 44, borderRadius: "50%", background: "rgba(68,136,255,0.14)", animation: "_uLocBeat 2.4s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "rgba(68,136,255,0.20)", animation: "_uLocPulse 1.6s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "conic-gradient(from 0deg, #4488FF, #a0c4ff, #ffffff, #4488FF)", padding: 2, animation: "_uLocSpin 4s linear infinite", boxShadow: "0 0 0 2px rgba(27,27,30,0.8), 0 4px 12px rgba(68,136,255,0.5)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1B1B1E" }} />
          </div>
          <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#4488FF", border: "1.5px solid #ffffff", boxShadow: "0 2px 8px rgba(68,136,255,0.7)", zIndex: 1 }} />
        </div>
      </MarkerContent>
      <MarkerLabel>
        <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#4488FF", background: "rgba(27,27,30,0.90)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(68,136,255,0.30)", whiteSpace: "nowrap", marginTop: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
          📍 Ma position
        </span>
      </MarkerLabel>
      <MarkerTooltip>
        <div style={{ background: "rgba(27,27,30,0.97)", backdropFilter: "blur(16px)", color: "#FBFBFB", padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(68,136,255,0.25)" }}>
          Votre position actuelle
          {accuracy !== undefined && (
            <span style={{ color: "#878787", marginLeft: 6, fontSize: 10 }}>±{Math.round(accuracy)} m</span>
          )}
        </div>
      </MarkerTooltip>
    </MapMarker>
  );
}

// ─── GpsStatusBadge ───────────────────────────────────────────────────────────

function GpsStatusBadge({ loading, permissionDenied, onRequestAgain }: {
  loading: boolean; permissionDenied: boolean; onRequestAgain: () => void;
}) {
  if (!loading && !permissionDenied) return null;
  return (
    <div style={{ position: "absolute", top: 52, left: "50%", transform: "translateX(-50%)", zIndex: 300, display: "flex", alignItems: "center", gap: 8, background: "rgba(27,27,30,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: permissionDenied ? "1px solid rgba(255,68,68,0.35)" : "1px solid rgba(68,136,255,0.30)", borderRadius: 99, padding: "6px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
      {loading ? (
        <>
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(68,136,255,0.3)", borderTopColor: "#4488FF", animation: "_uLocSpin 0.8s linear infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#878787", whiteSpace: "nowrap" }}>Recherche de votre position…</span>
        </>
      ) : (
        <>
          <LocateFixed size={12} style={{ color: "#FF4444", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#FF4444", whiteSpace: "nowrap" }}>Position refusée</span>
          <button onClick={onRequestAgain} style={{ fontSize: 11, fontWeight: 700, color: "#FBFBFB", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "2px 8px", cursor: "pointer", marginLeft: 2 }}>
            Réessayer
          </button>
        </>
      )}
    </div>
  );
}

// ─── RouteAlternativesPanel ───────────────────────────────────────────────────

function RouteAlternativesPanel({ routes, selectedIndex, onSelect, onClose }: {
  routes: RouteAlternative[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  if (routes.length === 0) return null;

  // Indicateur couleur par index
  const routeColor = (i: number, active: boolean) =>
    active ? ROUTE_COLOR_ACTIVE : ROUTE_COLOR_ALT;

  return (
    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 250, display: "flex", flexDirection: "column", gap: 6 }}>
      {routes.map((route, i) => {
        const isActive  = i === selectedIndex;
        const isFastest = i === 0;
        const color     = routeColor(i, isActive);
        return (
          <button key={i} onClick={() => onSelect(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, cursor: "pointer", background: isActive ? "rgba(74,158,255,0.12)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1px solid ${isActive ? "rgba(74,158,255,0.45)" : "rgba(255,255,255,0.10)"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 180ms ease", minWidth: 200 }}>
            {/* Indicateur couleur */}
            <div style={{ width: 3, height: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
            {/* Durée */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={12} style={{ color: isActive ? ROUTE_COLOR_ACTIVE : "#878787", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: isActive ? "#FBFBFB" : "#a0a0a0" }}>
                {formatDuration(route.duration)}
              </span>
            </div>
            {/* Distance */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <RouteIcon size={11} style={{ color: "#55556a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#55556a" }}>{formatDistance(route.distance)}</span>
            </div>
            {/* Badge */}
            {isFastest && (
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#22c55e", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 99, padding: "1px 7px" }}>
                + rapide
              </span>
            )}
          </button>
        );
      })}
      {/* Fin de navigation */}
      <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 14px", borderRadius: 12, cursor: "pointer", background: "rgba(27,27,30,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.12)", color: "#878787", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
        <X size={13} />
        Fin de navigation
      </button>
    </div>
  );
}

// ─── CarteMapSection ──────────────────────────────────────────────────────────

interface CarteMapSectionProps {
  activeFilters: Set<string>;
}

export function CarteMapSection({ activeFilters }: CarteMapSectionProps) {
  const mapRef = useRef<MapRef>(null);

  const [selectedSite,     setSelectedSite]     = useState<POI | null>(null);
  const [routeAlts,        setRouteAlts]        = useState<RouteAlternative[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [routeActive,      setRouteActive]      = useState(false);
  const [infoPopup,        setInfoPopup]        = useState<{ lng: number; lat: number; text: string } | null>(null);
  const [mapMode,          setMapMode]          = useState<MapMode>("plan");
  const [terrain3D,        setTerrain3D]        = useState(false);

  const { location: userLocation, loading: gpsLoading, permissionDenied, requestLocation } = useGeolocation();

  // Centre la carte à la première acquisition GPS — sans dézoom
  const hasCenteredRef = useRef(false);
  useEffect(() => {
    if (userLocation && !hasCenteredRef.current) {
      hasCenteredRef.current = true;
      mapRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 17,
        duration: 1200,
      });
    }
  }, [userLocation]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleMapClick = useCallback(() => {
    setSelectedSite(null);
    setInfoPopup(null);
  }, []);

  const toggleMapMode = useCallback(() => setMapMode(p => p === "plan" ? "satellite" : "plan"), []);
  const toggleTerrain = useCallback(() => setTerrain3D(p => !p), []);

  const resolveCoords = useCallback((point: RoutePoint): [number, number] | null => {
    if (point.type === "gps") return userLocation
      ? [userLocation.longitude, userLocation.latitude] : null;
    return [point.poi.longitude, point.poi.latitude];
  }, [userLocation]);

  const handleNavigateFromTo = useCallback(async (from: RoutePoint, to: RoutePoint) => {
    const fromCoords = resolveCoords(from);
    const toCoords   = resolveCoords(to);
    if (!fromCoords || !toCoords) return;

    setSelectedSite(null);
    setRouteActive(true);
    setSelectedRouteIdx(0);

    // Fallback immédiat — ligne droite, remplacée dès qu'OSRM répond
    const fallback: RouteAlternative = {
      coordinates: [fromCoords, toCoords],
      duration: 0,
      distance: 0,
    };
    setRouteAlts([fallback, generateSyntheticAlt(fallback, fromCoords, toCoords)]);

    try {
      const url =
        `https://router.project-osrm.org/route/v1/foot/` +
        `${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}` +
        `?overview=full&geometries=geojson&alternatives=true`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.routes?.length > 0) {
        const osrmAlts: RouteAlternative[] = data.routes.map((r: {
          geometry: { coordinates: [number, number][] };
          duration: number;
          distance: number;
        }) => ({
          coordinates: r.geometry.coordinates,
          duration:    r.duration,
          distance:    r.distance,
        }));

        // Garantit toujours 2 trajets : si OSRM n'en retourne qu'un, on génère le second
        if (osrmAlts.length === 1) {
          osrmAlts.push(generateSyntheticAlt(osrmAlts[0], fromCoords, toCoords));
        }

        setRouteAlts(osrmAlts);
      }
    } catch {
      // OSRM indisponible — fallback synthétique conservé
    }

    // ── fitBounds sécurisé ────────────────────────────────────────────────
    // On calcule le zoom manuellement pour ne pas dézommer si les points
    // sont déjà proches, et on ajoute un padding raisonnable.
    const map = mapRef.current;
    if (!map) return;

    const [lng1, lat1] = fromCoords;
    const [lng2, lat2] = toCoords;

    // Distance angulaire approximative entre les deux points
    const dLng = Math.abs(lng2 - lng1);
    const dLat = Math.abs(lat2 - lat1);
    const span  = Math.max(dLng, dLat);

    // Si les deux points sont très proches (< ~500 m ≈ 0.005°), on garde
    // le zoom actuel et on centre simplement entre les deux.
    if (span < 0.005) {
      map.flyTo({
        center: [(lng1 + lng2) / 2, (lat1 + lat2) / 2],
        zoom: Math.max(map.getZoom(), 16),
        duration: 900,
      });
    } else {
      map.fitBounds(
        [[Math.min(lng1, lng2), Math.min(lat1, lat2)], [Math.max(lng1, lng2), Math.max(lat1, lat2)]],
        { padding: { top: 80, bottom: 160, left: 230, right: 60 }, duration: 900, maxZoom: 17 },
      );
    }
  }, [resolveCoords]);

  const handleEndNavigation = useCallback(() => {
    setRouteAlts([]);
    setRouteActive(false);
    setSelectedRouteIdx(0);
    mapRef.current?.flyTo({ center: OUIDAH_CENTER, zoom: DEFAULT_ZOOM, duration: 800 });
  }, []);

  const handleLocate = useCallback(() => {
    if (userLocation) {
      mapRef.current?.flyTo({ center: [userLocation.longitude, userLocation.latitude], zoom: 17, duration: 1200 });
    } else {
      requestLocation();
    }
  }, [userLocation, requestLocation]);

  const filteredPOIs = POI_DATA.filter(
    poi => activeFilters.has(poi.category) || activeFilters.has("all")
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative" style={{ height: "calc(100vh - 180px)" }}>

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
        <ZoomAwareLegend />

        {/* Voyant position */}
        {userLocation && (
          <UserLocationMarker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            accuracy={userLocation.accuracy}
          />
        )}

        {/* POI */}
        {filteredPOIs.map(poi => (
          <SiteMarker
            key={poi.id}
            poi={poi}
            isSelected={selectedSite?.id === poi.id}
            onClick={clickedPoi => {
              setSelectedSite(prev => prev?.id === clickedPoi.id ? null : clickedPoi);
              mapRef.current?.flyTo({ center: [clickedPoi.longitude, clickedPoi.latitude], zoom: 17, duration: 800 });
            }}
            onNavigate={poi => handleNavigateFromTo(
              userLocation ? { type: "gps", label: "Ma position" } : { type: "poi", poi },
              { type: "poi", poi }
            )}
          />
        ))}

        {/*
         * Tracés des routes — pattern MapCN :
         * alternatives rendues en dessous, sélectionnée au-dessus.
         * Couleurs : bleu vif (active) / gris clair tiret (alternative).
         */}
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

      {/* Badge GPS */}
      <GpsStatusBadge loading={gpsLoading} permissionDenied={permissionDenied} onRequestAgain={requestLocation} />

      {/* Panel alternatives */}
      {routeActive && (
        <RouteAlternativesPanel
          routes={routeAlts}
          selectedIndex={selectedRouteIdx}
          onSelect={setSelectedRouteIdx}
          onClose={handleEndNavigation}
        />
      )}

      {/* Boutons vue — coin haut droit */}
      <div className="absolute top-3 right-3 flex gap-2" style={{ zIndex: 200 }}>
        <button onClick={toggleMapMode} className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer" style={{ background: mapMode === "satellite" ? "rgba(245,110,15,0.15)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: mapMode === "satellite" ? "1px solid rgba(245,110,15,0.5)" : "1px solid rgba(255,255,255,0.12)", color: mapMode === "satellite" ? "#F56E0F" : "#FBFBFB", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 200ms ease" }}>
          <Layers className="w-3.5 h-3.5" />
          {mapMode === "plan" ? "Satellite" : "Plan"}
        </button>
        <button onClick={toggleTerrain} className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer" style={{ background: terrain3D ? "rgba(245,110,15,0.15)" : "rgba(27,27,30,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: terrain3D ? "1px solid rgba(245,110,15,0.5)" : "1px solid rgba(255,255,255,0.12)", color: terrain3D ? "#F56E0F" : "#FBFBFB", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "all 200ms ease" }}>
          <Mountain className="w-3.5 h-3.5" />
          3D
        </button>
      </div>

      {/* BottomSheet */}
      <BottomSheet
        site={selectedSite}
        userLocation={userLocation}
        onClose={() => setSelectedSite(null)}
        onNavigateFromTo={handleNavigateFromTo}
      />
    </div>
  );
}