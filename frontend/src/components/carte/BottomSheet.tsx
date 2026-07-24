"use client";

import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  useDragControls,
  useReducedMotion,
  animate,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { MARKER_CATEGORIES, type POI } from "@/lib/markers";
import { localize } from "@/lib/i18n/localize";
import { type TravelMode, type RoutePreview, formatDuration, formatDistanceMeters } from "@/lib/routing";
import { X, Navigation, MapPin, ChevronDown, ChevronUp, LocateFixed, ArrowUpDown, Search, Check, Footprints, Bike, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types

interface UserLocation {
  longitude: number;
  latitude: number;
}

export type RoutePoint =
  | { type: "gps"; label: string }
  | { type: "poi"; poi: POI };

// Modes de déplacement proposés dans l'en-tête (icônes Lucide)
const TRAVEL_MODE_ITEMS: { key: TravelMode; Icon: LucideIcon; labelKey: string }[] = [
  { key: "foot", Icon: Footprints, labelKey: "itinerary.modeWalk" },
  { key: "bike", Icon: Bike,       labelKey: "itinerary.modeBike" },
  { key: "car",  Icon: Car,        labelKey: "itinerary.modeCar"  },
];

// Utils

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// Snap points

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

// RoutePointSelector

interface RoutePointSelectorProps {
  label: string;
  dotColor: string;
  value: RoutePoint | null;
  userLocation: UserLocation | null;
  allPois: POI[];
  onChange: (point: RoutePoint) => void;
  /** Si fourni, "Ma position" est toujours proposée : sans position connue, ce handler déclenche la géoloc */
  onSelectGps?: () => void;
  /** Acquisition GPS en cours pour ce champ */
  pending?: boolean;
  /** Dernière demande de géoloc refusée : affiche un état distinct plutôt qu'un retour silencieux au neutre */
  denied?: boolean;
}

// Normalise pour une recherche insensible à la casse et aux accents
function normalizeSearch(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function RoutePointSelector({
  label, dotColor, value, userLocation, allPois, onChange, onSelectGps, pending = false, denied = false,
}: RoutePointSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ left: number; width: number; bottom: number; maxHeight: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const tCarte = useTranslations("carte");

  const displayLabel = pending
    ? tCarte("itinerary.locating")
    : denied
      ? tCarte("itinerary.locationDenied")
      : !value
        ? tCarte("itinerary.choosePoi")
        : value.type === "gps" ? tCarte("itinerary.myPosition") : localize(value.poi, "name", locale);

  const isGps = value?.type === "gps";

  // Accent du champ : rouge en cas de refus, couleur du point sinon
  const accent    = denied ? "#FF4444" : dotColor;
  const accentRgb = hexToRgb(accent);

  const fieldBg = denied
    ? "rgba(255,68,68,0.08)"
    : open
      ? `rgba(${accentRgb}, 0.10)`
      : "var(--vd-filter-bg-inactive)";
  const fieldBorder = denied
    ? "rgba(255,68,68,0.30)"
    : open
      ? `rgba(${accentRgb}, 0.40)`
      : "var(--vd-filter-border-inactive)";

  // Recherche affichée seulement au-delà d'une liste courte
  const showSearch = allPois.length > 6;
  const filteredPois = useMemo(() => {
    if (!query.trim()) return allPois;
    const q = normalizeSearch(query);
    return allPois.filter(poi => normalizeSearch(localize(poi, "name", locale)).includes(q));
  }, [allPois, query, locale]);

  const closeDropdown = useCallback(() => { setOpen(false); setQuery(""); }, []);

  // Positionne le dropdown en fixed au-dessus du champ (hors du conteneur clippant du sheet)
  const updateCoords = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      left: rect.left,
      width: rect.width,
      bottom: window.innerHeight - rect.top + 8,
      maxHeight: Math.min(300, rect.top - 24),
    });
  }, []);

  // Recalcule la position tant que le dropdown est ouvert (scroll du contenu, rotation, resize)
  useEffect(() => {
    if (!open) return;
    const onReposition = () => updateCoords();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, updateCoords]);

  // Ouvre/ferme le dropdown ; la position initiale est calculée avant l'ouverture (évite un setState en effet)
  const toggleOpen = useCallback(() => {
    if (open) { closeDropdown(); return; }
    updateCoords();
    setOpen(true);
  }, [open, closeDropdown, updateCoords]);

  // Fermeture au clic hors du sélecteur (le dropdown est portalisé hors de containerRef)
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, closeDropdown]);

  // Style de survol appliqué en inline (cohérent avec le reste du fichier)
  const hoverOn = (e: { currentTarget: HTMLElement }) => { e.currentTarget.style.background = "var(--vd-inner-tint)"; };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px 11px 38px", borderRadius: 16, background: fieldBg, border: `1px solid ${fieldBorder}`, cursor: "pointer", transition: "background 160ms, border-color 160ms", textAlign: "left" }}
      >
        {/* Pastille indicatrice avec anneau teinté */}
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 0 4px rgba(${accentRgb}, 0.18)`, flexShrink: 0 }} />

        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: accent }}>
            {label}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: denied ? "#FF4444" : value ? "var(--foreground)" : "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayLabel}
          </span>
        </span>

        {/* Indice "position actuelle" quand la valeur est GPS */}
        {isGps && !open && <LocateFixed size={15} style={{ flexShrink: 0, color: "#4488FF" }} />}
        <ChevronDown size={16} style={{ flexShrink: 0, color: denied ? "#FF4444" : "var(--muted-foreground)", transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
      </button>

      {open && coords && createPortal(
        /* Portalisé vers body en fixed : le dropdown n'est plus clippé par l'overflow du sheet */
        <div ref={dropdownRef} style={{ position: "fixed", left: coords.left, width: coords.width, bottom: coords.bottom, maxHeight: coords.maxHeight, background: "var(--vd-dropdown-bg)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid var(--vd-glass-border-color)", borderRadius: 16, zIndex: 70, overflowY: "auto", boxShadow: "0 12px 36px rgba(0,0,0,0.4)", overscrollBehavior: "contain" }}>
          {/* Champ de recherche collant */}
          {showSearch && (
            <div style={{ position: "sticky", top: 0, zIndex: 1, padding: 8, background: "var(--vd-dropdown-bg)", borderBottom: "1px solid var(--vd-glass-border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "var(--vd-filter-bg-inactive)", border: "1px solid var(--vd-filter-border-inactive)" }}>
                <Search size={14} style={{ flexShrink: 0, color: "var(--muted-foreground)" }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={tCarte("itinerary.searchPlaceholder")}
                  style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--foreground)", fontSize: 13 }}
                />
              </div>
            </div>
          )}

          {/* Option "Ma position" mise en avant */}
          {(userLocation || onSelectGps) && (
            <button
              onClick={() => {
                if (userLocation) onChange({ type: "gps", label: tCarte("itinerary.myPosition") });
                else onSelectGps?.();
                closeDropdown();
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(68,136,255,0.14)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isGps ? "rgba(68,136,255,0.10)" : "transparent"; }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: isGps ? "rgba(68,136,255,0.10)" : "transparent", border: "none", borderBottom: "1px solid var(--vd-glass-border-color)", color: "#4488FF", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}
            >
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(68,136,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LocateFixed size={14} />
              </span>
              <span style={{ flex: 1 }}>{tCarte("itinerary.myPosition")}</span>
              {isGps && <Check size={16} style={{ flexShrink: 0 }} />}
            </button>
          )}

          {/* Liste des POI filtrés */}
          {filteredPois.map(poi => {
            const poiCat = MARKER_CATEGORIES[poi.category];
            const selected = value?.type === "poi" && value.poi.id === poi.id;
            return (
              <button
                key={poi.id}
                onClick={() => { onChange({ type: "poi", poi }); closeDropdown(); }}
                onMouseEnter={hoverOn}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = selected ? `rgba(${hexToRgb(poiCat.color)}, 0.10)` : "transparent"; }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: selected ? `rgba(${hexToRgb(poiCat.color)}, 0.10)` : "transparent", border: "none", borderBottom: "1px solid var(--vd-inner-tint)", color: "var(--foreground)", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: poiCat.color, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{localize(poi, "name", locale)}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-foreground)" }}>{poiCat.label}</span>
                </span>
                {selected && <Check size={15} style={{ flexShrink: 0, color: poiCat.color }} />}
              </button>
            );
          })}

          {/* État vide */}
          {filteredPois.length === 0 && (
            <div style={{ padding: "16px 14px", textAlign: "center", color: "var(--muted-foreground)", fontSize: 12 }}>
              {tCarte("itinerary.noResult")}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

// BottomSheet

interface BottomSheetProps {
  site: POI | null;
  userLocation: UserLocation | null;
  onClose: () => void;
  onNavigateFromTo: (from: RoutePoint, to: RoutePoint, mode?: TravelMode) => void;
  allPois: POI[];
  /** Déclenche la demande de géolocalisation (geste utilisateur) */
  onRequestLocation: () => void;
  /** Dernière demande de géolocalisation refusée par l'utilisateur */
  permissionDenied: boolean;
  /** Incrémenté par le parent pour ouvrir directement le panneau itinéraire du site courant */
  openRouteSignal?: number;
  /** Mode de déplacement actif (marche/vélo/voiture) */
  travelMode: TravelMode;
  /** Change le mode de déplacement */
  onSelectMode: (mode: TravelMode) => void;
  /** Métriques d'itinéraire par mode (position -> site), calculées par le parent */
  routePreview: RoutePreview;
}

export function BottomSheet({ site, userLocation, onClose, onNavigateFromTo, allPois, onRequestLocation, permissionDenied, openRouteSignal = 0, travelMode, onSelectMode, routePreview }: BottomSheetProps) {
  const locale = useLocale();
  const tCarte = useTranslations("carte");
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [fromPoint, setFromPoint] = useState<RoutePoint | null>(null);
  const [toPoint,   setToPoint]   = useState<RoutePoint | null>(null);
  const [snapIdx,   setSnapIdx]   = useState(0);
  // Attente d'acquisition GPS pour remplir le champ Départ avec "Ma position"
  const [awaitingGps, setAwaitingGps] = useState(false);
  // Portal vers body : le conteneur carte (zIndex:1) crée un contexte d'empilement
  // qui plafonnait le sheet sous le BottomNav (z-50)
  const [mounted,   setMounted]   = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  // Re-synchronise la position sur le snap courant quand la hauteur change (rotation)
  useEffect(() => {
    y.set(offsets[snapIdx]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsets[0], offsets[1], offsets[2]]);

  const handleOpenRoute = useCallback(() => {
    // Départ = "Ma position" par défaut : si la position est connue, on la place ;
    // sinon on déclenche la géoloc et le champ affiche l'état d'attente puis se remplit.
    if (userLocation) {
      setFromPoint({ type: "gps", label: tCarte("itinerary.myPosition") });
    } else {
      setFromPoint(null);
      setAwaitingGps(true);
      onRequestLocation();
    }
    setToPoint(site ? { type: "poi", poi: site } : null);
    setShowRoutePanel(true);
    snapTo(1);
  }, [userLocation, site, snapTo, tCarte, onRequestLocation]);

  // Ouverture du panneau itinéraire pilotée par le parent (CTA du marqueur sans position connue)
  useEffect(() => {
    if (!site || !openRouteSignal) return;
    handleOpenRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRouteSignal]);

  // Sélection de "Ma position" sans position connue : on demande la géoloc et on remplit à l'arrivée
  const handleSelectMyPosition = useCallback(() => {
    if (userLocation) {
      setFromPoint({ type: "gps", label: tCarte("itinerary.myPosition") });
      return;
    }
    setAwaitingGps(true);
    onRequestLocation();
  }, [userLocation, onRequestLocation, tCarte]);

  useEffect(() => {
    if (awaitingGps && userLocation) {
      setFromPoint({ type: "gps", label: tCarte("itinerary.myPosition") });
      setAwaitingGps(false);
    }
  }, [awaitingGps, userLocation, tCarte]);

  // Refus détecté : on dépend directement de permissionDenied plutôt que d'une transition
  // de gpsLoading, car un refus déjà bloqué par le navigateur fait passer loading true→false
  // de façon quasi-synchrone (batché dans le même rendu React), rendant la transition invisible
  useEffect(() => {
    if (awaitingGps && permissionDenied && !userLocation) setAwaitingGps(false);
  }, [awaitingGps, permissionDenied, userLocation]);

  // Permute départ et arrivée (bouton connecteur du formulaire)
  const handleSwap = useCallback(() => {
    setFromPoint(toPoint);
    setToPoint(fromPoint);
  }, [fromPoint, toPoint]);

  if (!site || !mounted) return null;

  const cat  = MARKER_CATEGORIES[site.category];
  const rgb  = hexToRgb(cat.color);
  // Métriques du mode sélectionné (itinéraire position -> site) pour l'en-tête
  const selectedMetric = routePreview.metrics?.[travelMode] ?? null;
  // Départ et arrivée sont tous deux éditables : on peut choisir sa position actuelle ou un POI.
  const canStart     = fromPoint !== null && toPoint !== null;
  const canSwap      = fromPoint !== null && toPoint !== null;

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

  return createPortal(
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
        role="dialog"
        aria-modal="true"
        aria-label={localize(site, "name", locale)}
        className="fixed left-0 right-0"
        style={{
          bottom: 0,
          height: containerH,
          y,
          zIndex: 60,
          // Fond glass renforcé
          background: `linear-gradient(180deg, rgba(${rgb}, 0.06) 0%, var(--vd-sheet-body) 60px)`,
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          // Bordure catégorie en haut + coins arrondis
          borderTop: `2px solid rgba(${rgb}, 0.55)`,
          borderLeft: "1px solid var(--vd-glass-border-color)",
          borderRight: "1px solid var(--vd-glass-border-color)",
          borderRadius: "24px 24px 0 0",
          // Pas de touchAction:none ici : il bloquerait le scroll tactile du contenu.
          // Le drag ne part que du grabber (dragListener=false), qui garde son touchAction.
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
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "0 20px", marginBottom: 14 }}>
            <div style={{ minWidth: 0 }}>
              {/* Badge catégorie */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `rgba(${rgb}, 0.10)`, border: `1px solid rgba(${rgb}, 0.30)`, borderRadius: 99, padding: "5px 12px 5px 9px", marginBottom: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ color: cat.color, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em" }}>{cat.label}</span>
              </div>

              {/* Nom du site */}
              <h2 style={{ fontSize: 27, fontWeight: 800, color: "var(--foreground)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
                {localize(site, "name", locale)}
              </h2>
            </div>

            {/* Bouton fermer */}
            <button onClick={onClose} aria-label="Fermer" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "var(--vd-inner-tint)", border: "1px solid var(--vd-glass-border-color)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>

          {/* Sélecteur de modes + distance (itinéraire réel position -> site) */}
          {userLocation && (
            <div style={{ padding: "0 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {TRAVEL_MODE_ITEMS.map(({ key, Icon, labelKey }) => {
                  const active = key === travelMode;
                  const metric = routePreview.metrics?.[key] ?? null;
                  const timeLabel = routePreview.loading && !metric
                    ? "..."
                    : metric
                      ? `${routePreview.estimated ? "~" : ""}${formatDuration(metric.duration)}`
                      : "-";
                  return (
                    <button
                      key={key}
                      onClick={() => onSelectMode(key)}
                      aria-label={`${tCarte(labelKey)} - ${timeLabel}`}
                      aria-pressed={active}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 4px", borderRadius: 14, cursor: "pointer", background: active ? `rgba(${rgb}, 0.14)` : "var(--vd-filter-bg-inactive)", border: `1px solid ${active ? `rgba(${rgb}, 0.45)` : "var(--vd-filter-border-inactive)"}`, color: active ? cat.color : "var(--muted-foreground)", transition: "background 160ms, border-color 160ms, color 160ms" }}
                    >
                      <Icon size={17} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{timeLabel}</span>
                    </button>
                  );
                })}
              </div>
              {/* Distance du mode sélectionné (identique entre modes : un seul tracé) */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted-foreground)", background: "var(--vd-filter-bg-inactive)", border: "1px solid var(--vd-filter-border-inactive)", borderRadius: 99, padding: "6px 14px" }}>
                <MapPin size={13} style={{ color: cat.color, flexShrink: 0 }} />
                {selectedMetric ? formatDistanceMeters(selectedMetric.distance) : "..."} - {tCarte("itinerary.fromYou")}
                {routePreview.estimated && ` (${tCarte("itinerary.asCrowFlies")})`}
              </div>
            </div>
          )}

          {/* Séparateur dégradé */}
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, var(--vd-glass-border-color), transparent)", margin: "0 20px 18px" }} />

          <div style={{ padding: "0 20px" }}>
            {/* Description */}
            {(site.description || site.descriptionEn) && (
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", marginBottom: 16, lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: snapIdx === 2 ? 99 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {localize(site, "description", locale)}
              </p>
            )}

            {/* Tags équipements */}
            {site.amenities && site.amenities.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {site.amenities.map(a => (
                  <span key={a.name} style={{ background: "var(--vd-filter-bg-inactive)", color: "var(--muted-foreground)", border: "1px solid var(--vd-filter-border-inactive)", borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 500 }}>
                    {localize(a, "name", locale)}
                  </span>
                ))}
              </div>
            )}

            {/* Panneau itinéraire */}
            {showRoutePanel ? (
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>
                  {tCarte("itinerary.title")}
                </p>

                <RoutePointSelector
                  label={tCarte("itinerary.from")}
                  dotColor="#4488FF"
                  value={fromPoint}
                  userLocation={userLocation}
                  allPois={allPois}
                  onChange={setFromPoint}
                  onSelectGps={handleSelectMyPosition}
                  pending={awaitingGps}
                  denied={permissionDenied && !userLocation}
                />

                {/* Connecteur - permute départ et arrivée, chevauche les deux champs */}
                <div style={{ display: "flex", justifyContent: "center", margin: "-10px 0", position: "relative", zIndex: 20, pointerEvents: "none" }}>
                  <button
                    onClick={handleSwap}
                    disabled={!canSwap}
                    aria-label={tCarte("itinerary.swap")}
                    style={{ pointerEvents: "auto", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vd-sheet-body)", border: "1px solid var(--vd-glass-border-color)", color: "var(--muted-foreground)", cursor: canSwap ? "pointer" : "not-allowed", opacity: canSwap ? 1 : 0.5, boxShadow: "0 4px 14px rgba(0,0,0,0.28)", transition: "transform 160ms ease" }}
                    onMouseEnter={e => { if (canSwap) (e.currentTarget as HTMLButtonElement).style.transform = "rotate(180deg)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
                  >
                    <ArrowUpDown size={16} />
                  </button>
                </div>

                <RoutePointSelector label={tCarte("itinerary.to")} dotColor={cat.color} value={toPoint} userLocation={userLocation} allPois={allPois} onChange={setToPoint} />

                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button onClick={() => setShowRoutePanel(false)} style={{ flex: 1, padding: "13px 0", borderRadius: 99, background: "var(--vd-filter-bg-inactive)", border: "1px solid var(--vd-glass-border-color)", color: "var(--foreground)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {tCarte("itinerary.cancel")}
                  </button>
                  <button
                    disabled={!canStart}
                    onClick={() => { if (fromPoint && toPoint) { onNavigateFromTo(fromPoint, toPoint, travelMode); onClose(); } }}
                    style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 99, background: canStart ? `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)` : "var(--vd-filter-bg-inactive)", border: "none", color: canStart ? "#fff" : "var(--muted-foreground)", fontSize: 14, fontWeight: 800, cursor: canStart ? "pointer" : "not-allowed", transition: "opacity 160ms", boxShadow: canStart ? `0 6px 20px rgba(${rgb}, 0.40)` : "none" }}
                  >
                    <Navigation size={15} />
                    {tCarte("itinerary.start")}
                  </button>
                </div>
              </div>
            ) : (
              /* CTA Itinéraire */
              <button
                onClick={handleOpenRoute}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 20px", borderRadius: 99, cursor: "pointer", border: "none", background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}CC 100%)`, color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: "0.01em", boxShadow: `0 8px 26px rgba(${rgb}, 0.42), inset 0 1px 0 rgba(255,255,255,0.20)`, transition: "filter 150ms ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; }}
              >
                <Navigation size={16} />
                {tCarte("itinerary.cta")}
                {userLocation && (
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.70 }}>
                    - {tCarte("itinerary.fromMyPosition")}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
