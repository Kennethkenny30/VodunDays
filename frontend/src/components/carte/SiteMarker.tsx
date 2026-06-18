"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { Landmark, Toilet, Siren, Bus, LifeBuoy, Navigation, Scan } from "lucide-react";
import { useLocale } from "next-intl";
import { MARKER_CATEGORIES, type POI, type MarkerCategory } from "@/lib/markers";
import { localize } from "@/lib/i18n/localize";

function hexToRgbParts(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

const CATEGORY_ICONS: Record<
  MarkerCategory,
  React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>
> = {
  sites:      Landmark,
  toilettes:  Toilet,
  urgences:   Siren,
  transport:  Bus,
  assistance: LifeBuoy,
  pra:        Scan,
};

const KEYFRAMES = `
  @keyframes sm-ping   { 0%{opacity:.5;transform:scale(1)} 70%{opacity:0;transform:scale(2.2)} 100%{opacity:0} }
  @keyframes sm-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes sm-dot    { 0%,100%{opacity:.9;transform:translateX(-50%) scaleX(1)} 50%{opacity:.5;transform:translateX(-50%) scaleX(.7)} }
  @keyframes sm-tooltip-in { from{opacity:0;transform:translateX(-50%) translateY(4px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

interface SiteMarkerProps {
  poi: POI;
  isSelected: boolean;
  onClick: (poi: POI) => void;
  onNavigate: (poi: POI) => void;
}

// Contenu du tooltip partagé entre hover desktop et tap mobile
function MarkerTooltipContent({
  cat,
  Icon,
  name,
}: {
  cat: { color: string; label: string };
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  name: string;
}) {
  return (
    <div style={{
      background: "rgba(15,15,19,0.98)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      color: "#F0F0F2",
      padding: "10px 14px",
      borderRadius: 14,
      border: `1px solid rgba(${hexToRgbParts(cat.color)}, 0.28)`,
      maxWidth: 200,
      minWidth: 120,
      boxShadow: `0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        marginBottom: 6,
        background: `rgba(${hexToRgbParts(cat.color)}, 0.14)`,
        border: `1px solid rgba(${hexToRgbParts(cat.color)}, 0.28)`,
        borderRadius: 99,
        padding: "2px 8px 2px 6px",
      }}>
        <Icon size={10} style={{ color: cat.color, flexShrink: 0 }} />
        <span style={{
          color: cat.color,
          fontSize: 8.5,
          fontWeight: 800,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}>
          {cat.label}
        </span>
      </div>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.3,
        color: "#F0F0F2",
        letterSpacing: "-0.01em",
      }}>
        {name}
      </div>
    </div>
  );
}

export function SiteMarker({ poi, isSelected, onClick, onNavigate }: SiteMarkerProps) {
  const cat    = MARKER_CATEGORIES[poi.category];
  const Icon   = CATEGORY_ICONS[poi.category];
  const ref    = useRef<HTMLDivElement>(null);
  const locale = useLocale();

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

  // Tooltip mobile : affiché 1 500 ms après un tap
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const mobileTooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => { e.stopPropagation(); onClick(poi); };
    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setShowMobileTooltip(true);
      if (mobileTooltipTimer.current) clearTimeout(mobileTooltipTimer.current);
      mobileTooltipTimer.current = setTimeout(() => setShowMobileTooltip(false), 1500);
      onClick(poi);
    };

    el.addEventListener("click",    handleClick, true);
    el.addEventListener("touchend", handleTouch, { passive: false });
    return () => {
      el.removeEventListener("click",    handleClick, true);
      el.removeEventListener("touchend", handleTouch);
      if (mobileTooltipTimer.current) clearTimeout(mobileTooltipTimer.current);
    };
  }, [poi, onClick]);

  const size = isSelected ? 44 : 36;

  return (
    <MapMarker longitude={poi.longitude} latitude={poi.latitude}>
      <MarkerContent>
        <style>{KEYFRAMES}</style>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Tooltip mobile - absolu au-dessus du marqueur */}
          {showMobileTooltip && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 14px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              pointerEvents: "none",
              animation: "sm-tooltip-in 150ms ease forwards",
            }}>
              <MarkerTooltipContent cat={cat} Icon={Icon} name={poi.name} />
            </div>
          )}

          {/* Marqueur */}
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
            {/* Halo ping (sélection) */}
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

            {/* Corps du marqueur */}
            <div style={{
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
            }}>
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

            {/* Tige / ancre */}
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

          {/* Label - visible selon zoom */}
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

      {/* Tooltip desktop (hover) - neutralise le wrapper par défaut de MarkerTooltip */}
      {!isSelected && (
        <MarkerTooltip className="p-0 bg-transparent shadow-none border-0 rounded-none">
          <MarkerTooltipContent cat={cat} Icon={Icon} name={poi.name} />
        </MarkerTooltip>
      )}

      {/* Popup sélection */}
      {isSelected && (
        <MarkerPopup offset={[0, -52]} closeOnClick={false} closeButton={false}>
          <div style={{
            background: "linear-gradient(150deg, rgba(22,22,27,0.99) 0%, rgba(16,16,20,0.98) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid rgba(${hexToRgbParts(cat.color)}, 0.35)`,
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
              background: `radial-gradient(circle, rgba(${hexToRgbParts(cat.color)}, 0.13) 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* Badge catégorie avec icône */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: `rgba(${hexToRgbParts(cat.color)}, 0.14)`,
              border: `1px solid rgba(${hexToRgbParts(cat.color)}, 0.30)`,
              borderRadius: 99,
              padding: "4px 11px 4px 8px",
              marginBottom: 10,
            }}>
              <Icon size={12} style={{ color: cat.color, flexShrink: 0 }} />
              <span style={{
                color: cat.color,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}>
                {cat.label}
              </span>
            </div>

            {/* Séparateur subtil */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 10 }} />

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

            {/* Description clampée à 3 lignes */}
            {poi.description && (
              <p style={{
                fontSize: 12,
                color: "#888896",
                marginBottom: 12,
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {poi.description}
              </p>
            )}

            {/* Aménités */}
            {poi.amenities && poi.amenities.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {poi.amenities.map((a) => (
                  <span key={a.name} style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#868696",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 99,
                    padding: "2px 9px",
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {localize(a, "name", locale)}
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
                boxShadow: `0 4px 18px rgba(${hexToRgbParts(cat.color)}, 0.35), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.15)`,
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
