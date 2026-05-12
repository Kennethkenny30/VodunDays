"use client";

/**
 * SitesMapModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal de visualisation cartographique pour le dashboard admin.
 * Utilisable dans deux contextes :
 *   1. Visualisation d'un site existant (mode "view")  → affiche un marqueur
 *   2. Sélection de coordonnées dans le formulaire (mode "pick") → permet de
 *      cliquer sur la carte pour définir lat/lng, et confirme la sélection.
 *
 * MapCN components: Map, MapMarker, MarkerContent, MarkerLabel, MapControls
 */

import { useCallback, useRef, useState, useEffect } from "react";
import { Map, MapMarker, MarkerContent, MarkerLabel, MapControls, type MapRef } from "@/components/ui/map";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Check, X, Crosshair, Layers } from "lucide-react";
import { useMap } from "@/components/ui/map";
import type { Site } from "@/lib/types/api";

// ─── Constants ─────────────────────────────────────────────────────────────────

const OUIDAH_CENTER: [number, number] = [2.0878, 6.3654];
const DEFAULT_ZOOM = 15;
const MAPTILER_KEY = "rF42xkuvfnAvkNeWRop5";

const MAP_STYLES = {
  plan:      "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
} as const;

// ─── Keyframes ─────────────────────────────────────────────────────────────────

const KF = `
  @keyframes smm-ping { 0%{opacity:.6;transform:scale(1)} 60%{opacity:0;transform:scale(2.4)} 100%{opacity:0} }
  @keyframes smm-pop  { 0%{opacity:0;transform:scale(.6)} 60%{opacity:1;transform:scale(1.08)} 100%{transform:scale(1)} }
`;

// ─── Sub: Click handler inside Map context ─────────────────────────────────────

function MapClickCapture({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lng: number, lat: number) => void;
}) {
  const { map } = useMap();
  useEffect(() => {
    if (!map || !enabled) return;
    const handler = (e: maplibregl.MapMouseEvent) => {
      onPick(
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
  }, [map, enabled, onPick]);
  return null;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SitesMapModalProps {
  open: boolean;
  onClose: () => void;

  /** Mode "view" : affiche un site existant (lecture seule). */
  site?: Site | null;

  /** Mode "pick" : permet de sélectionner des coordonnées. */
  mode?: "view" | "pick";

  /** Coordonnées pré-remplies en mode pick (latitude du formulaire). */
  initialLat?: number;
  initialLng?: number;

  /** Callback en mode pick — retourne les coordonnées confirmées. */
  onPick?: (lat: number, lng: number) => void;
}

// ─── Marqueur admin (gold) ─────────────────────────────────────────────────────

function AdminMarker({
  longitude,
  latitude,
  label,
  isPicking,
}: {
  longitude: number;
  latitude: number;
  label?: string;
  isPicking?: boolean;
}) {
  const COLOR = isPicking ? "#4A9EFF" : "#F5A623";

  return (
    <MapMarker longitude={longitude} latitude={latitude}>
      <MarkerContent>
        <style>{KF}</style>
        <div style={{ position: "relative", width: 0, height: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Ping */}
          <div style={{
            position: "absolute",
            width: 48, height: 48,
            borderRadius: "50%",
            border: `1.5px solid ${COLOR}`,
            opacity: 0,
            animation: "smm-ping 2s ease-out infinite",
          }} />
          {/* Corps */}
          <div style={{
            position: "absolute",
            width: 40, height: 40,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${COLOR}FF 0%, ${COLOR}BB 55%, ${COLOR}88 100%)`,
            boxShadow: `0 0 0 2.5px rgba(0,0,0,0.6), 0 0 0 5px ${COLOR}40, 0 8px 28px ${COLOR}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "smm-pop 0.35s cubic-bezier(.34,1.56,.64,1) both",
          }}>
            {/* Reflet */}
            <div style={{
              position: "absolute", top: "12%", left: "18%",
              width: "54%", height: "34%", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }} />
            <MapPin size={18} style={{ color: "#fff", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))", position: "relative", zIndex: 1 }} />
          </div>
          {/* Tige */}
          <div style={{
            position: "absolute", bottom: -25, left: "50%", transform: "translateX(-50%)",
            width: 4, height: 10, borderRadius: "0 0 3px 3px",
            background: `linear-gradient(180deg, ${COLOR} 0%, ${COLOR}44 100%)`,
          }} />
        </div>
      </MarkerContent>
      {label && (
        <MarkerLabel position="bottom">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, fontWeight: 700, color: "#F0F0F2",
            background: "rgba(14,14,18,0.95)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            padding: "4px 11px", borderRadius: 99,
            border: `1px solid ${COLOR}45`,
            whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis",
            marginTop: 14,
            boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>
            📍 {label}
          </span>
        </MarkerLabel>
      )}
    </MapMarker>
  );
}

// ─── Modal principal ───────────────────────────────────────────────────────────

export function SitesMapModal({
  open,
  onClose,
  site,
  mode = "view",
  initialLat,
  initialLng,
  onPick,
}: SitesMapModalProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapMode, setMapMode] = useState<"plan" | "satellite">("plan");
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  const isPick = mode === "pick";

  // Coordonnées affichées : site existant ou point sélectionné / initial
  const displayLng = picked?.lng ?? site?.longitude ?? initialLng ?? OUIDAH_CENTER[0];
  const displayLat = picked?.lat ?? site?.latitude  ?? initialLat ?? OUIDAH_CENTER[1];
  const hasCoords  = !!(picked || site || (initialLat && initialLng));

  // Reset à l'ouverture
  useEffect(() => {
    if (open) {
      setPicked(
        initialLat && initialLng
          ? { lat: initialLat, lng: initialLng }
          : null,
      );
    }
  }, [open, initialLat, initialLng]);

  // Fly to site au chargement
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      if (mapRef.current && hasCoords) {
        mapRef.current.flyTo({
          center: [displayLng, displayLat],
          zoom: 16,
          duration: 800,
        });
      }
    }, 400);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePick = useCallback((lng: number, lat: number) => {
    setPicked({ lat, lng });
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 17, duration: 600 });
  }, []);

  const handleConfirm = () => {
    if (picked && onPick) {
      onPick(picked.lat, picked.lng);
    }
    onClose();
  };

  const center: [number, number] = hasCoords
    ? [displayLng, displayLat]
    : OUIDAH_CENTER;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
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
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 16, fontWeight: 700, color: "#F0F0F2", letterSpacing: "-0.01em" }}>
                {isPick ? "Sélectionner une position" : `📍 ${site?.name ?? "Carte du site"}`}
              </DialogTitle>
              <DialogDescription style={{ fontSize: 12, color: "#666678", marginTop: 4 }}>
                {isPick
                  ? "Cliquez sur la carte pour définir les coordonnées GPS du site"
                  : `Ouidah · ${displayLat.toFixed(6)}, ${displayLng.toFixed(6)}`}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Infopuce coordonnées (mode pick) */}
          {isPick && picked && (
            <div style={{
              flexShrink: 0,
              background: "rgba(74,158,255,0.12)",
              border: "1px solid rgba(74,158,255,0.28)",
              borderRadius: 10,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 700,
              color: "#4A9EFF",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}>
              {picked.lat.toFixed(6)}, {picked.lng.toFixed(6)}
            </div>
          )}
        </div>

        {/* ── Carte ── */}
        <div style={{ position: "relative", height: 380 }}>
          <Map
            ref={mapRef}
            center={center}
            zoom={DEFAULT_ZOOM}
            theme="dark"
            styles={{ dark: MAP_STYLES[mapMode], light: MAP_STYLES[mapMode] }}
            className="w-full h-full"
          >
            <MapControls position="bottom-right" showZoom showCompass showLocate={false} showFullscreen={false} />
            {/* En mode pick : chaque clic repositionne le marqueur */}
            <MapClickCapture enabled={isPick} onPick={handlePick} />

            {hasCoords && (
              <AdminMarker
                longitude={displayLng}
                latitude={displayLat}
                label={isPick ? (picked ? "Position sélectionnée — cliquez pour déplacer" : undefined) : site?.name}
                isPicking={isPick}
              />
            )}
          </Map>

          {/* Bouton bascule satellite */}
          <button
            onClick={() => setMapMode((m) => (m === "plan" ? "satellite" : "plan"))}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: 12,
              background: mapMode === "satellite"
                ? "rgba(245,166,35,0.15)"
                : "rgba(14,14,18,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: mapMode === "satellite"
                ? "1px solid rgba(245,166,35,0.45)"
                : "1px solid rgba(255,255,255,0.12)",
              color: mapMode === "satellite" ? "#F5A623" : "#BBBBC8",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              transition: "all 200ms ease",
            }}
          >
            <Layers size={13} />
            {mapMode === "plan" ? "Satellite" : "Plan"}
          </button>

          {/* Indicateur mode pick */}
          {isPick && (
            <div style={{
              position: "absolute",
              bottom: 60,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(14,14,18,0.95)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: picked
                ? "1px solid rgba(74,158,255,0.25)"
                : "1px solid rgba(74,158,255,0.35)",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              color: picked ? "#666678" : "#9090A8",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              transition: "all 250ms ease",
            }}>
              <Crosshair size={14} style={{ color: "#4A9EFF", flexShrink: 0 }} />
              {picked
                ? "Cliquez à nouveau pour repositionner le marqueur"
                : "Cliquez sur la carte pour placer le marqueur"}
            </div>
          )}

          {/* Overlay coords en mode view */}
          {!isPick && site && (
            <div style={{
              position: "absolute",
              bottom: 60,
              left: 12,
              zIndex: 300,
              background: "rgba(14,14,18,0.94)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 11,
              color: "#888896",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontWeight: 700, color: "#F0F0F2", fontSize: 12, marginBottom: 4 }}>
                {site.name}
              </div>
              <div style={{ fontFamily: "monospace", color: "#4A9EFF", fontSize: 11 }}>
                {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
              </div>
              {site.type && (
                <div style={{ marginTop: 4, color: "#666678", fontSize: 10 }}>
                  {site.type.replace("_", " ")}
                  {site.capacity ? ` · ${site.capacity.toLocaleString("fr-FR")} pers.` : ""}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "16px 22px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          {/* Lien Google Maps */}
          {hasCoords && (
            <a
              href={`https://www.google.com/maps?q=${displayLat},${displayLng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#888896",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5A623")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888896")}
            >
              <Navigation size={13} />
              Ouvrir dans Google Maps
            </a>
          )}

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              style={{ color: "#888896", fontSize: 13 }}
            >
              <X size={14} style={{ marginRight: 6 }} />
              {isPick ? "Annuler" : "Fermer"}
            </Button>

            {isPick && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!picked}
                style={{
                  background: picked ? "#F5A623" : "rgba(255,255,255,0.06)",
                  color: picked ? "#0E0E12" : "#666678",
                  border: picked ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 200ms ease",
                }}
              >
                <Check size={14} style={{ marginRight: 6 }} />
                Confirmer la position
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}