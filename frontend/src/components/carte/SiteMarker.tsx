"use client";

import { useEffect, useRef } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
  MarkerPopup,
} from "@/components/ui/map";
import { Landmark, Bath, HeartPulse, Car, Info, Navigation, Zap } from "lucide-react";
import { MARKER_CATEGORIES, type POI, type MarkerCategory } from "@/lib/markers";

// ─── Icônes par catégorie ─────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<
  MarkerCategory,
  React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>
> = {
  sites:      Landmark,
  toilettes:  Bath,
  urgences:   HeartPulse,
  transport:  Car,
  assistance: Info,
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
                ? `radial-gradient(circle at 35% 35%, ${cat.color}FF 0%, ${cat.color}CC 55%, ${cat.color}99 100%)`
                : `radial-gradient(circle at 35% 35%, ${cat.color}EE 0%, ${cat.color}AA 60%, ${cat.color}77 100%)`,
              boxShadow: isSelected
                ? `0 0 0 2.5px rgba(0,0,0,0.55), 0 0 0 4px ${cat.color}55, 0 8px 24px ${cat.color}60, 0 2px 6px rgba(0,0,0,0.6)`
                : `0 0 0 2px rgba(0,0,0,0.45), 0 4px 14px ${cat.color}45, 0 2px 5px rgba(0,0,0,0.4)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: isSelected ? "sm-breathe 2.4s ease-in-out infinite" : "none",
              transition: "box-shadow 250ms ease, background 250ms ease",
            }}
          >
            {/* Reflet spéculaire */}
            <div style={{
              position: "absolute",
              top: "12%",
              left: "18%",
              width: "55%",
              height: "36%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }} />

            <Icon
              size={isSelected ? 18 : 15}
              style={{
                color: "#fff",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
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
            width: 5,
            height: 7,
            borderRadius: "0 0 3px 3px",
            background: `linear-gradient(180deg, ${cat.color} 0%, ${cat.color}55 100%)`,
            animation: isSelected ? "sm-dot 2.4s ease-in-out infinite" : "none",
          }} />
        </div>
      </MarkerContent>

      {/* ── Label (sélection) ── */}
      {isSelected && (
        <MarkerLabel position="bottom">
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            color: "#F0F0F2",
            background: "rgba(18,18,22,0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            padding: "4px 11px",
            borderRadius: 99,
            border: `1px solid ${cat.color}40`,
            whiteSpace: "nowrap",
            maxWidth: 170,
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 10,
            boxShadow: `0 2px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.3)`,
            letterSpacing: "0.01em",
          }}>
            <span style={{ fontSize: 12 }}>{cat.emoji}</span>
            {poi.name}
          </span>
        </MarkerLabel>
      )}

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
              {cat.emoji} {cat.label}
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
              <span style={{ fontSize: 11 }}>{cat.emoji}</span>
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