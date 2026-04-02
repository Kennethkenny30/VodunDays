"use client";

import { useEffect, useRef } from "react";
import {
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
  MarkerPopup,
} from "@/components/ui/map";
import { Landmark, Bath, HeartPulse, Car, Info, Navigation } from "lucide-react";
import { MARKER_CATEGORIES, type POI, type MarkerCategory } from "@/lib/markers";

const CATEGORY_ICONS: Record<MarkerCategory, React.ComponentType<{ className?: string; size?: number }>> = {
  sites:      Landmark,
  toilettes:  Bath,
  urgences:   HeartPulse,
  transport:  Car,
  assistance: Info,
};

interface SiteMarkerProps {
  poi: POI;
  isSelected: boolean;
  onClick: (poi: POI) => void;
  onNavigate: (poi: POI) => void;
}

export function SiteMarker({ poi, isSelected, onClick, onNavigate }: SiteMarkerProps) {
  const cat  = MARKER_CATEGORIES[poi.category];
  const Icon = CATEGORY_ICONS[poi.category];
  const ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Phase de capture → on intercepte avant MapLibre (desktop + mobile)
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      onClick(poi);
    };

    // touchend natif → bypass du blocage MapLibre sur mobile
    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
      e.preventDefault(); // empêche le click synthétique qui suit
      onClick(poi);
    };

    el.addEventListener("click", handleClick, true);          // capture
    el.addEventListener("touchend", handleTouch, { passive: false });

    return () => {
      el.removeEventListener("click", handleClick, true);
      el.removeEventListener("touchend", handleTouch);
    };
  }, [poi, onClick]);

  return (
    <MapMarker
      longitude={poi.longitude}
      latitude={poi.latitude}
      // Plus de onClick ici — géré en natif ci-dessus
    >
      <MarkerContent>
        <div ref={ref} style={{ position: "relative", width: 40, height: 40, cursor: "pointer" }}>

          {isSelected && (
            <div style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              background: `radial-gradient(circle, ${cat.color}30 0%, transparent 70%)`,
              animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
            }} />
          )}

          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${cat.color}, ${cat.color}88, ${cat.color})`,
            padding: 2,
            boxShadow: isSelected
              ? `0 0 0 3px ${cat.color}50, 0 6px 24px ${cat.color}60, 0 2px 8px rgba(0,0,0,0.5)`
              : `0 4px 16px ${cat.color}40, 0 2px 6px rgba(0,0,0,0.4)`,
            transition: "box-shadow 250ms ease",
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              background: isSelected
                ? `linear-gradient(135deg, ${cat.color}DD 0%, ${cat.color}99 50%, ${cat.color}BB 100%)`
                : `linear-gradient(135deg, ${cat.color}CC 0%, ${cat.color}77 50%, ${cat.color}AA 100%)`,
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 2, left: "15%",
                width: "70%", height: "38%", borderRadius: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
              }} />
              <Icon size={16} style={{
                color: "#fff",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                position: "relative", zIndex: 1,
              }} />
            </div>
          </div>

          <div style={{
            position: "absolute", bottom: -5, left: "50%",
            transform: "translateX(-50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: cat.color, boxShadow: `0 2px 6px ${cat.color}80`,
          }} />
        </div>
      </MarkerContent>

      {isSelected && (
        <MarkerLabel position="bottom">
          <span style={{
            display: "block", fontSize: 11, fontWeight: 800, color: "#FBFBFB",
            background: "linear-gradient(135deg, rgba(27,27,30,0.96) 0%, rgba(35,35,40,0.92) 100%)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            padding: "3px 10px", borderRadius: 20,
            border: `1px solid ${cat.color}50`,
            whiteSpace: "nowrap", maxWidth: 160,
            overflow: "hidden", textOverflow: "ellipsis",
            marginTop: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>
            {cat.emoji} {poi.name}
          </span>
        </MarkerLabel>
      )}

      {!isSelected && (
        <MarkerTooltip>
          <div style={{
            background: "linear-gradient(135deg, rgba(27,27,30,0.97) 0%, rgba(38,38,44,0.95) 100%)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            color: "#FBFBFB", padding: "6px 12px", borderRadius: 10,
            fontSize: 12, fontWeight: 700,
            border: `1px solid ${cat.color}35`, maxWidth: 160,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            <div style={{ color: cat.color, fontSize: 10, marginBottom: 2, fontWeight: 800, letterSpacing: "0.06em" }}>
              {cat.emoji} {cat.label}
            </div>
            {poi.name}
          </div>
        </MarkerTooltip>
      )}

      {isSelected && (
        <MarkerPopup offset={[0, -48]} closeOnClick={false} closeButton={false}>
          <div style={{
            background: "linear-gradient(160deg, rgba(28,28,32,0.98) 0%, rgba(22,22,26,0.97) 100%)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${cat.color}40`, borderRadius: 18,
            padding: "16px 18px", minWidth: 220, maxWidth: 280, color: "#FBFBFB",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20,
              width: 80, height: 80, borderRadius: "50%",
              background: `radial-gradient(circle, ${cat.color}25 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}10)`,
              border: `1px solid ${cat.color}35`,
              borderRadius: 99, padding: "2px 9px", marginBottom: 10,
            }}>
              <span style={{ fontSize: 11 }}>{cat.emoji}</span>
              <span style={{ color: cat.color, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {cat.label}
              </span>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>
              {poi.name}
            </div>

            {poi.description && (
              <p style={{ fontSize: 12, color: "#a0a0a0", marginBottom: 10, lineHeight: 1.55 }}>
                {poi.description}
              </p>
            )}

            {poi.amenities && poi.amenities.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {poi.amenities.map(a => (
                  <span key={a} style={{
                    background: "rgba(255,255,255,0.06)", color: "#9a9a9a",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 600,
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={e => { e.stopPropagation(); onNavigate(poi); }}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}CC 100%)`,
                color: "#fff", border: "none", borderRadius: 12,
                padding: "10px 14px", fontSize: 13, fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 7,
                boxShadow: `0 4px 16px ${cat.color}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              <Navigation size={14} />
              Itinéraire
            </button>
          </div>
        </MarkerPopup>
      )}
    </MapMarker>
  );
}