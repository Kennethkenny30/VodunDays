"use client";

import { useEffect, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useDragControls,
  useReducedMotion,
  animate,
} from "framer-motion";
import { MARKER_CATEGORIES, type POI } from "@/lib/markers";
import { X, Navigation, MapPin, ChevronDown, ArrowRight, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserLocation {
  longitude: number;
  latitude: number;
}

export type RoutePoint =
  | { type: "gps"; label: "Ma position" }
  | { type: "poi"; poi: POI };

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatDistance(from: UserLocation, to: POI): string {
  const R  = 6_371_000;
  const φ1 = (from.latitude  * Math.PI) / 180;
  const φ2 = (to.latitude    * Math.PI) / 180;
  const Δφ = ((to.latitude  - from.latitude)  * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a  =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const d  = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 1_000
    ? `${Math.round(d)} m`
    : `${(d / 1_000).toFixed(1)} km`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Snap points ─────────────────────────────────────────────────────────────

function useSnapPoints() {
  const [winH, setWinH] = useState(
    typeof window !== "undefined" ? window.innerHeight : 812
  );
  useEffect(() => {
    const handler = () => setWinH(window.innerHeight);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // SNAP_PEEK > hauteur BottomNav (~94px) avec marge pour que le contenu soit visible
  const SNAP_PEEK = 240;
  const SNAP_HALF = Math.round(winH * 0.52);
  const SNAP_FULL = Math.round(winH * 0.90);

  return {
    containerH: SNAP_FULL,
    offsets: [
      SNAP_FULL - SNAP_PEEK, // 0 = peek
      SNAP_FULL - SNAP_HALF, // 1 = half
      0,                     // 2 = full
    ] as [number, number, number],
  };
}

// ─── RoutePointSelector ───────────────────────────────────────────────────────

interface RoutePointSelectorProps {
  label: string;
  dotColor: string;
  value: RoutePoint | null;
  userLocation: UserLocation | null;
  allPois: POI[];
  readOnly?: boolean;
  onChange: (point: RoutePoint) => void;
}

function RoutePointSelector({
  label, dotColor, value, userLocation, allPois, readOnly = false, onChange,
}: RoutePointSelectorProps) {
  const [open, setOpen] = useState(false);
  const displayLabel = !value
    ? "Choisir un point..."
    : value.type === "gps" ? "Ma position" : value.poi.name;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: dotColor, marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
        {label}
      </div>
      <button
        onClick={() => { if (!readOnly) setOpen(o => !o); }}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px", borderRadius: 12, background: readOnly ? "rgba(68,136,255,0.08)" : open ? `rgba(${hexToRgb(dotColor)}, 0.10)` : "rgba(255,255,255,0.04)", border: `1px solid ${readOnly ? "rgba(68,136,255,0.22)" : open ? `rgba(${hexToRgb(dotColor)}, 0.40)` : "rgba(255,255,255,0.08)"}`, color: value ? "#FBFBFB" : "#55556a", fontSize: 13, fontWeight: 600, cursor: readOnly ? "default" : "pointer", transition: "background 160ms, border-color 160ms", textAlign: "left" }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
        {readOnly
          ? <MapPin size={13} style={{ flexShrink: 0, color: "#4488FF", opacity: 0.7 }} />
          : <ChevronDown size={14} style={{ flexShrink: 0, color: "#55556a", transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
        }
      </button>
      {open && !readOnly && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "rgba(20,20,24,0.99)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, zIndex: 200, maxHeight: 220, overflowY: "auto", boxShadow: "0 12px 36px rgba(0,0,0,0.7)" }}>
          {userLocation && (
            <button onClick={() => { onChange({ type: "gps", label: "Ma position" }); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#4488FF", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
              <MapPin size={14} style={{ flexShrink: 0 }} />
              Ma position
            </button>
          )}
          {allPois.map(poi => {
            const cat = MARKER_CATEGORIES[poi.category];
            return (
              <button key={poi.id} onClick={() => { onChange({ type: "poi", poi }); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#FBFBFB", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{poi.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── BottomSheet ──────────────────────────────────────────────────────────────

interface BottomSheetProps {
  site: POI | null;
  userLocation: UserLocation | null;
  onClose: () => void;
  onNavigateFromTo: (from: RoutePoint, to: RoutePoint) => void;
  allPois: POI[];
}

export function BottomSheet({ site, userLocation, onClose, onNavigateFromTo, allPois }: BottomSheetProps) {
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [fromPoint, setFromPoint] = useState<RoutePoint | null>(null);
  const [toPoint,   setToPoint]   = useState<RoutePoint | null>(null);
  const [snapIdx,   setSnapIdx]   = useState(0);

  const { containerH, offsets } = useSnapPoints();
  const prefersReduced = useReducedMotion();
  const y = useMotionValue(offsets[0]);
  const dragControls = useDragControls();

  const spring = prefersReduced
    ? { duration: 0.18, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.85 };

  // Opacité du scrim proportionnelle à l'ouverture du sheet
  const backdropOpacity = useTransform(y, [0, offsets[0]], [0.5, 0]);

  const snapTo = useCallback((idx: number) => {
    setSnapIdx(idx);
    animate(y, offsets[idx], spring);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsets, prefersReduced]);

  // Réinitialise à chaque nouveau site sélectionné
  useEffect(() => {
    if (!site) return;
    setShowRoutePanel(false);
    setFromPoint(null);
    setToPoint(null);
    setSnapIdx(0);
    animate(y, offsets[0], spring);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  // Lock scroll body quand le sheet est visible
  useEffect(() => {
    if (!site) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [site]);

  // Fermeture Escape
  useEffect(() => {
    if (!site) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [site, onClose]);

  const handleOpenRoute = useCallback(() => {
    setFromPoint(userLocation ? { type: "gps", label: "Ma position" } : null);
    setToPoint(site ? { type: "poi", poi: site } : null);
    setShowRoutePanel(true);
    snapTo(1);
  }, [userLocation, site, snapTo]);

  if (!site) return null;

  const cat  = MARKER_CATEGORIES[site.category];
  const rgb  = hexToRgb(cat.color);
  const fromLocked = userLocation !== null;
  const canStart   = fromPoint !== null && toPoint !== null;

  const handleDragEnd = (_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
    const curY = y.get();
    const vel  = info.velocity.y;
    const off  = info.offset.y;

    if (vel > 700 || curY > offsets[0] + 60) { onClose(); return; }

    if (vel < -400 || off < -60) {
      snapTo(Math.min(snapIdx + 1, 2));
    } else if (vel > 300 || off > 60) {
      const next = Math.max(snapIdx - 1, 0);
      if (next === 0 && snapIdx === 0) { onClose(); return; }
      snapTo(next);
    } else {
      const nearest = (offsets as number[]).reduce((best, _, i) =>
        Math.abs(offsets[i] - curY) < Math.abs(offsets[best] - curY) ? i : best, 0
      );
      snapTo(nearest);
    }
  };

  return (
    <>
      {/* Scrim animé - z-index 55 pour être sous le sheet mais au-dessus de la carte */}
      <motion.div
        className="fixed inset-0"
        style={{
          opacity: backdropOpacity,
          background: "rgba(0,0,0,1)",
          zIndex: 55,
          pointerEvents: snapIdx > 0 ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Sheet - z-index 60, au-dessus de la BottomNav (z-50) */}
      <motion.div
        className="fixed left-0 right-0"
        style={{
          bottom: 0,
          height: containerH,
          y,
          zIndex: 60,
          // Fond glass renforcé
          background: `linear-gradient(180deg, rgba(${rgb}, 0.06) 0%, rgba(18,18,22,0.98) 60px)`,
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          // Bordure catégorie en haut + coins arrondis
          borderTop: `2px solid rgba(${rgb}, 0.55)`,
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px 24px 0 0",
          touchAction: "none",
          willChange: "transform",
          boxShadow: `0 -8px 48px rgba(${rgb}, 0.10), 0 -2px 0 rgba(${rgb}, 0.30)`,
        }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: offsets[0] + 60 }}
        dragElastic={{ top: 0, bottom: 0.12 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zone de grab - grabber + indicateur de snap */}
        <div
          className="flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
          style={{ paddingTop: 12, paddingBottom: 8, touchAction: "none" }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div style={{ width: 44, height: 4, borderRadius: 99, background: `rgba(${rgb}, 0.40)` }} />
          {/* Indicateur de snap - chevrons */}
          <div style={{ marginTop: 6, color: `rgba(${rgb}, 0.50)`, display: "flex" }}>
            {snapIdx < 2
              ? <ChevronUp size={16} />
              : <ChevronDown size={16} />
            }
          </div>
        </div>

        {/* Contenu */}
        <div
          style={{
            height: "calc(100% - 56px)",
            overflowY: snapIdx === 2 ? "auto" : "hidden",
            paddingBottom: `max(24px, env(safe-area-inset-bottom, 24px))`,
          }}
        >
          {/* En-tête catégorie + fermer */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0 20px 0", marginBottom: 14 }}>
            <div>
              {/* Badge catégorie */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `rgba(${rgb}, 0.12)`, border: `1px solid rgba(${rgb}, 0.28)`, borderRadius: 99, padding: "4px 12px 4px 8px", marginBottom: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ color: cat.color, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>{cat.label}</span>
              </div>
              {/* Nom du site */}
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#FBFBFB", lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0, paddingRight: 40 }}>
                {site.name}
              </h2>
            </div>

            {/* Bouton fermer */}
            <button onClick={onClose} style={{ flexShrink: 0, marginTop: 2, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#878787", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} />
            </button>
          </div>

          {/* Distance */}
          {userLocation && (
            <div style={{ padding: "0 20px", marginBottom: 14 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#878787", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 99, padding: "4px 12px" }}>
                <MapPin size={11} style={{ color: cat.color, flexShrink: 0 }} />
                {formatDistance(userLocation, site)} - depuis vous
              </div>
            </div>
          )}

          {/* Séparateur */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 20px 16px" }} />

          <div style={{ padding: "0 20px" }}>
            {/* Description */}
            {site.description && (
              <p style={{ fontSize: 14, color: "#a0a0a0", marginBottom: 16, lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: snapIdx === 2 ? 99 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {site.description}
              </p>
            )}

            {/* Tags équipements */}
            {site.amenities && site.amenities.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {site.amenities.map(a => (
                  <span key={a} style={{ background: "rgba(255,255,255,0.06)", color: "#878787", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>
                    {a}
                  </span>
                ))}
              </div>
            )}

            {/* Panneau itinéraire */}
            {showRoutePanel ? (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 14px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#878787", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                  Définir l&apos;itinéraire
                </p>

                <RoutePointSelector label="Départ" dotColor="#4488FF" value={fromPoint} userLocation={userLocation} allPois={allPois} readOnly={fromLocked} onChange={setFromPoint} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0", gap: 4 }}>
                  <div style={{ width: 1, height: 18, background: "repeating-linear-gradient(to bottom, #55556a 0px, #55556a 3px, transparent 3px, transparent 6px)" }} />
                  <ArrowRight size={12} style={{ color: "#55556a" }} />
                </div>

                <RoutePointSelector label="Arrivée" dotColor="#F56E0F" value={toPoint} userLocation={userLocation} allPois={allPois} onChange={setToPoint} />

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => setShowRoutePanel(false)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "#878787", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Annuler
                  </button>
                  <button
                    disabled={!canStart}
                    onClick={() => { if (fromPoint && toPoint) { onNavigateFromTo(fromPoint, toPoint); onClose(); } }}
                    style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 12, background: canStart ? `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)` : "rgba(245,110,15,0.20)", border: "none", color: canStart ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 800, cursor: canStart ? "pointer" : "not-allowed", transition: "opacity 160ms", boxShadow: canStart ? `0 4px 16px rgba(${rgb}, 0.35)` : "none" }}
                  >
                    <Navigation size={14} />
                    Lancer
                  </button>
                </div>
              </div>
            ) : (
              /* CTA Itinéraire */
              <button
                onClick={handleOpenRoute}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 20px", borderRadius: 16, cursor: "pointer", border: "none", background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}CC 100%)`, color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: "0.01em", boxShadow: `0 6px 24px rgba(${rgb}, 0.40), inset 0 1px 0 rgba(255,255,255,0.20)`, transition: "filter 150ms ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; }}
              >
                <Navigation size={16} />
                Itinéraire
                {userLocation && (
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.70 }}>
                    - depuis ma position
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
