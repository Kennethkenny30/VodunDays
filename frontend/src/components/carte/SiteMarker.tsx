"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
// Scan ajouté pour la catégorie PRA
import { Landmark, Toilet, Siren, Bus, LifeBuoy, Navigation, Scan } from "lucide-react";
import { MARKER_CATEGORIES, type POI, type MarkerCategory } from "@/lib/markers";

// ─── Utilitaire couleur ────────────────────────────────────────────────────────

function hexToRgbParts(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Icônes par catégorie ─────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<
  MarkerCategory,
  React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>
> = {
  sites:      Landmark,   // Site culturel / lieu emblématique
  toilettes:  Toilet,     // Sanitaires
  urgences:   Siren,      // Urgences / secours
  transport:  Bus,        // Transport / navette
  assistance: LifeBuoy,   // Point d'assistance / info
  pra:        Scan,       // Point de Réalité Augmentée
};

// ─── Keyframes injectées une seule fois ───────────────────────────────────────

const KEYFRAMES = `
  @keyframes sm-ping   { 0%{opacity:.5;transform:scale(1)} 70%{opacity:0;transform:scale(2.2)} 100%{opacity:0} }
  @keyframes sm-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes sm-dot    { 0%,100%{opacity:.9;transform:translateX(-50%) scaleX(1)} 50%{opacity:.5;transform:translateX(-50%) scaleX(.7)} }
`;

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SiteMarkerProps {
  poi: POI;
  isSelected: boolean;
  onClick: (poi: POI) => void;
  onNavigate: (poi: POI) => void;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function SiteMarker({ poi, isSelected, onClick, onNavigate }: SiteMarkerProps) {
  const cat  = MARKER_CATEGORIES[poi.category];
  const Icon = CATEGORY_ICONS[poi.category];
  const ref  = useRef<HTMLDivElement>(null);

  // Zoom courant — le label disparaît sous le seuil LABEL_MIN_ZOOM
  const LABEL_MIN_ZOOM = 14;
  const { map } = useMap();
  const [zoom, setZoom] = useState(() => map?.getZoom() ?? 15);
  useEffect(() => {
    if (!map) return;
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoom", onZoom);
    return () => { map.off("zoom", onZoom); };
  }, [map]);
  const showLabel = isSelected || zoom >= LABEL_MIN_ZOOM;

  // Gestion click natif (capture + touch) pour bypass MapLibre mobile
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => { e.stopPropagation(); onClick(poi); };
    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClick(poi);
    };

    el.addEventListener("click",    handleClick, true);
    el.addEventListener("touchend", handleTouch, { passive: false });
    return () => {
      el.removeEventListener("click",    handleClick, true);
      el.removeEventListener("touchend", handleTouch);
    };
  }, [poi, onClick]);

  const size = isSelected ? 44 : 36;

  return (
    <MapMarker longitude={poi.longitude} latitude={poi.latitude}>
      <MarkerContent>
        <style>{KEYFRAMES}</style>

        {/* Wrapper global : marqueur + label empilés verticalement */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* ── Marqueur ── */}
          <div
            ref={ref}
            style={{
              position: "relative",
              width: size,
              height: size,
              cursor: "pointer",
              transition: "width 200ms ease, height 200ms ease",
            }}
          >
            {/* ── Halo ping (sélection) ── */}
            {isSelected && (
              <>
                <div style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `1.5px solid ${cat.color}`,
                  opacity: 0,
                  animation: "sm-ping 1.8s ease-out infinite",
                }} />
                <div style={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: "50%",
                  border: `1px solid ${cat.color}60`,
                  opacity: 0,
                  animation: "sm-ping 1.8s ease-out 0.6s infinite",
                }} />
              </>
            )}

            {/* ── Corps du marqueur ── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: isSelected
                  ? `rgba(${hexToRgbParts(cat.color)}, 0.18)`
                  : `rgba(${hexToRgbParts(cat.color)}, 0.12)`,
                border: isSelected
                  ? `1.5px solid rgba(${hexToRgbParts(cat.color)}, 0.80)`
                  : `1.5px solid rgba(${hexToRgbParts(cat.color)}, 0.55)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected
                  ? `0 0 0 3px rgba(${hexToRgbParts(cat.color)}, 0.15), 0 4px 16px rgba(0,0,0,0.5)`
                  : `0 2px 8px rgba(0,0,0,0.4)`,
                animation: isSelected ? "sm-breathe 2.4s ease-in-out infinite" : "none",
                transition: "box-shadow 250ms ease, background 250ms ease, border-color 250ms ease",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              <Icon
                size={isSelected ? 18 : 15}
                style={{
                  color: cat.color,
                  position: "relative",
                  zIndex: 1,
                  transition: "font-size 200ms ease",
                }}
              />
            </div>

            {/* ── Tige / ancre ── */}
            <div style={{
              position: "absolute",
              bottom: -7,
              left: "50%",
              transform: "translateX(-50%)",
              width: 3,
              height: 7,
              borderRadius: "0 0 3px 3px",
              background: `rgba(${hexToRgbParts(cat.color)}, 0.6)`,
              animation: isSelected ? "sm-dot 2.4s ease-in-out infinite" : "none",
            }} />
          </div>

          {/* ── Label — visible selon zoom, toujours sélectionné ── */}
          <div style={{
            marginTop: 10,
            pointerEvents: "none",
            opacity: showLabel ? 1 : 0,
            transform: showLabel ? "scale(1)" : "scale(0.8)",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isSelected ? 5 : 4,
              fontSize: isSelected ? 11 : 10,
              fontWeight: isSelected ? 700 : 600,
              color: isSelected ? "#F0F0F2" : "#C8C8D8",
              background: isSelected
                ? "rgba(18,18,22,0.94)"
                : "rgba(18,18,22,0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              padding: isSelected ? "4px 11px" : "3px 8px",
              borderRadius: 99,
              border: isSelected
                ? `1px solid ${cat.color}40`
                : "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxShadow: isSelected
                ? "0 2px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 1px 6px rgba(0,0,0,0.35)",
              letterSpacing: "0.01em",
              transition: "all 200ms ease",
            }}>
                            {poi.name}
            </span>
          </div>

        </div>
      </MarkerContent>

      {/* ── Tooltip (au repos) ── */}
      {!isSelected && (
        <MarkerTooltip>
          <div style={{
            background: "rgba(18,18,22,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: "#F0F0F2",
            padding: "7px 13px",
            borderRadius: 11,
            fontSize: 12,
            fontWeight: 700,
            border: `1px solid ${cat.color}30`,
            maxWidth: 170,
            boxShadow: `0 6px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            <div style={{
              color: cat.color,
              fontSize: 9,
              marginBottom: 3,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}>
              {cat.label}
            </div>
            {poi.name}
          </div>
        </MarkerTooltip>
      )}

      {/* ── Popup (sélection) ── */}
      {isSelected && (
        <MarkerPopup offset={[0, -52]} closeOnClick={false} closeButton={false}>
          <div style={{
            background: "linear-gradient(150deg, rgba(22,22,27,0.99) 0%, rgba(16,16,20,0.98) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid ${cat.color}35`,
            borderRadius: 20,
            padding: "18px 20px",
            minWidth: 230,
            maxWidth: 290,
            color: "#F0F0F2",
            boxShadow: `0 12px 48px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)`,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Accent lumineux coin haut-droit */}
            <div style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${cat.color}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* Badge catégorie */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: `${cat.color}18`,
              border: `1px solid ${cat.color}30`,
              borderRadius: 99,
              padding: "3px 10px",
              marginBottom: 12,
            }}>
                            <span style={{
                color: cat.color,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}>
                {cat.label}
              </span>
            </div>

            {/* Nom */}
            <div style={{
              fontSize: 15,
              fontWeight: 800,
              marginBottom: poi.description ? 7 : 12,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}>
              {poi.name}
            </div>

            {/* Description */}
            {poi.description && (
              <p style={{
                fontSize: 12,
                color: "#888896",
                marginBottom: 12,
                lineHeight: 1.6,
              }}>
                {poi.description}
              </p>
            )}

            {/* Aménités */}
            {poi.amenities && poi.amenities.length > 0 && (
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginBottom: 14,
              }}>
                {poi.amenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#868696",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 99,
                      padding: "2px 9px",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}

            {/* CTA navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(poi); }}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}D0 100%)`,
                color: "#fff",
                border: "none",
                borderRadius: 13,
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                letterSpacing: "0.01em",
                boxShadow: `0 4px 18px ${cat.color}55, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.15)`,
                transition: "filter 150ms ease, transform 150ms ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; }}
            >
              <Navigation size={13} />
              Itinéraire
            </button>
          </div>
        </MarkerPopup>
      )}
    </MapMarker>
  );
}