"use client";

import { useEffect, useCallback, useState } from "react";
// POI_DATA supprimé — la liste des POI vient de la prop allPois (chargée depuis la BDD)
import { MARKER_CATEGORIES, type POI } from "@/lib/markers";
import { X, Navigation, MapPin, ChevronDown, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserLocation {
  longitude: number;
  latitude: number;
}

/** Point de route : position GPS live ou POI connu */
export type RoutePoint =
  | { type: "gps"; label: "Ma position" }
  | { type: "poi"; poi: POI };

// ─── Utils ────────────────────────────────────────────────────────────────────

/** Formule Haversine — retourne une distance lisible */
function formatDistance(from: UserLocation, to: POI): string {
  const R  = 6_371_000; // rayon terrestre en mètres
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

// ─── RoutePointSelector ───────────────────────────────────────────────────────

interface RoutePointSelectorProps {
  label: string;
  dotColor: string;
  value: RoutePoint | null;
  userLocation: UserLocation | null;
  // allPois remplace POI_DATA — liste dynamique chargée depuis la BDD
  allPois: POI[];
  /** Si true le sélecteur est en lecture seule (point A quand GPS disponible) */
  readOnly?: boolean;
  onChange: (point: RoutePoint) => void;
}

function RoutePointSelector({
  label,
  dotColor,
  value,
  userLocation,
  allPois,
  readOnly = false,
  onChange,
}: RoutePointSelectorProps) {
  const [open, setOpen] = useState(false);

  const displayLabel = !value
    ? "Choisir un point…"
    : value.type === "gps"
    ? "Ma position"
    : `${value.poi.name}`;

  const handleToggle = useCallback(() => {
    if (!readOnly) setOpen(o => !o);
  }, [readOnly]);

  return (
    <div style={{ position: "relative" }}>
      {/* Étiquette */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: dotColor,
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: dotColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {label}
      </div>

      {/* Déclencheur */}
      <button
        onClick={handleToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "9px 12px",
          borderRadius: 10,
          background: readOnly
            ? "rgba(68,136,255,0.08)"
            : open
            ? `${dotColor}18`
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${
            readOnly
              ? "rgba(68,136,255,0.25)"
              : open
              ? `${dotColor}50`
              : "rgba(255,255,255,0.09)"
          }`,
          color: value ? "#FBFBFB" : "#55556a",
          fontSize: 12,
          fontWeight: 600,
          cursor: readOnly ? "default" : "pointer",
          transition: "background 160ms, border-color 160ms",
          textAlign: "left",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayLabel}
        </span>

        {/* Icône verrou si readonly, chevron sinon */}
        {readOnly ? (
          <MapPin size={12} style={{ flexShrink: 0, color: "#4488FF", opacity: 0.7 }} />
        ) : (
          <ChevronDown
            size={13}
            style={{
              flexShrink: 0,
              color: "#55556a",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 160ms ease",
            }}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && !readOnly && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "rgba(22,22,26,0.99)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12,
            zIndex: 200,
            maxHeight: 220,
            overflowY: "auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {/* Option GPS */}
          {userLocation && (
            <button
              onClick={() => {
                onChange({ type: "gps", label: "Ma position" });
                setOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "10px 13px",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                color: "#4488FF",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <MapPin size={13} style={{ flexShrink: 0 }} />
              Ma position
            </button>
          )}

          {/* Liste des POI depuis la BDD (allPois) — plus de POI_DATA hardcodé */}
          {allPois.map(poi => {
            const cat = MARKER_CATEGORIES[poi.category];
            return (
              <button
                key={poi.id}
                onClick={() => {
                  onChange({ type: "poi", poi });
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 13px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  color: "#FBFBFB",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: cat.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {poi.name}
                </span>
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
  // Nouvelle prop — POI chargés depuis la BDD, passés par CarteMapSection
  allPois: POI[];
}

export function BottomSheet({
  site,
  userLocation,
  onClose,
  onNavigateFromTo,
  allPois,
}: BottomSheetProps) {
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [fromPoint, setFromPoint] = useState<RoutePoint | null>(null);
  const [toPoint,   setToPoint]   = useState<RoutePoint | null>(null);

  // ── Réinitialise le panneau à chaque nouveau site sélectionné ────────────
  useEffect(() => {
    setShowRoutePanel(false);
    setFromPoint(null);
    setToPoint(null);
  }, [site?.id]);

  // ── Ouvre le panneau en pré-remplissant A = GPS (si dispo) et B = site ──
  const handleOpenRoute = useCallback(() => {
    setFromPoint(
      userLocation ? { type: "gps", label: "Ma position" } : null
    );
    setToPoint(site ? { type: "poi", poi: site } : null);
    setShowRoutePanel(true);
  }, [userLocation, site]);

  // ── Fermeture via Escape ─────────────────────────────────────────────────
  useEffect(() => {
    if (!site) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [site, onClose]);

  if (!site) return null;

  const category = MARKER_CATEGORIES[site.category];

  /**
   * Le point A est verrouillé en lecture seule quand la géolocalisation
   * est disponible : l'utilisateur part forcément de sa position.
   * Il peut quand même changer l'arrivée (point B).
   */
  const fromLocked = userLocation !== null;
  const canStart   = fromPoint !== null && toPoint !== null;

  return (
    <>
      {/* Overlay – ferme au clic extérieur */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panneau */}
      <div
        className="fixed left-0 right-0 z-50"
        onClick={e => e.stopPropagation()}
        style={{
          bottom: 70,
          background: "rgba(27,27,30,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${category.color}40`,
          borderRadius: "20px 20px 0 0",
          padding: "20px 16px",
          maxHeight: "60vh",
          overflowY: "auto",
          transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 flex items-center justify-center cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#878787",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: 28,
            height: 28,
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge catégorie */}
        <div
          className="text-[10px] font-extrabold uppercase mb-1.5"
          style={{ color: category.color, letterSpacing: "0.12em" }}
        >
                    {category.label}
        </div>

        {/* Nom du site */}
        <div
          className="text-[18px] font-extrabold mb-1"
          style={{ color: "#FBFBFB" }}
        >
          {site.name}
        </div>

        {/* Distance */}
        {userLocation && (
          <div className="text-[12px] mb-3" style={{ color: "#878787" }}>
            {formatDistance(userLocation, site)} · depuis votre position
          </div>
        )}

        {/* Description */}
        {site.description && (
          <p
            className="text-[13px] mb-3 leading-relaxed"
            style={{ color: "#a0a0a0" }}
          >
            {site.description}
          </p>
        )}

        {/* Tags équipements */}
        {site.amenities && site.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {site.amenities.map(amenity => (
              <span
                key={amenity}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#878787",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* ── Panneau itinéraire A→B ── */}
        {showRoutePanel ? (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "14px 12px",
              marginBottom: 4,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#878787",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              Définir l'itinéraire
            </p>

            {/* Point A — verrouillé si GPS disponible */}
            <RoutePointSelector
              label="Départ"
              dotColor="#4488FF"
              value={fromPoint}
              userLocation={userLocation}
              allPois={allPois}
              readOnly={fromLocked}
              onChange={setFromPoint}
            />

            {/* Connecteur visuel */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "8px 0",
                gap: 4,
              }}
            >
              {/* Ligne pointillée */}
              <div
                style={{
                  width: 1,
                  height: 16,
                  background:
                    "repeating-linear-gradient(to bottom, #55556a 0px, #55556a 3px, transparent 3px, transparent 6px)",
                }}
              />
              <ArrowRight size={12} style={{ color: "#55556a" }} />
            </div>

            {/* Point B */}
            <RoutePointSelector
              label="Arrivée"
              dotColor="#F56E0F"
              value={toPoint}
              userLocation={userLocation}
              allPois={allPois}
              onChange={setToPoint}
            />

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                onClick={() => setShowRoutePanel(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#878787",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>

              <button
                disabled={!canStart}
                onClick={() => {
                  if (fromPoint && toPoint) {
                    onNavigateFromTo(fromPoint, toPoint);
                    onClose();
                  }
                }}
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: canStart
                    ? "#F56E0F"
                    : "rgba(245,110,15,0.25)",
                  border: "none",
                  color: canStart
                    ? "#FBFBFB"
                    : "rgba(255,255,255,0.3)",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: canStart ? "pointer" : "not-allowed",
                  transition: "background 160ms, color 160ms",
                }}
              >
                <Navigation size={14} />
                Lancer
              </button>
            </div>
          </div>
        ) : (
          /* ── CTA principal ── */
          <button
            onClick={handleOpenRoute}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl cursor-pointer font-extrabold text-[14px]"
            style={{
              background: "#F56E0F",
              color: "#FBFBFB",
              border: "none",
            }}
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
            {/* Indication discrète si GPS dispo */}
            {userLocation && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  opacity: 0.65,
                  marginLeft: 2,
                }}
              >
                · depuis ma position
              </span>
            )}
          </button>
        )}
      </div>
    </>
  );
}