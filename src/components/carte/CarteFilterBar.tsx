"use client";

// Couleurs alignées avec MARKER_CATEGORIES dans markers.ts
const FILTER_OPTIONS = [
  { value: "all",        label: "Tous",       color: "#F56E0F" },
  { value: "sites",      label: "Sites",      color: "#F56E0F" },
  { value: "toilettes",  label: "Toilettes",  color: "#4488FF" },
  { value: "urgences",   label: "Urgences",   color: "#FF4444" },
  { value: "transport",  label: "Transport",  color: "#FFbb00" },
  { value: "assistance", label: "Assistance", color: "#AA44FF" },
] as const;

interface CarteFilterBarProps {
  activeFilters: Set<string>;
  onFiltersChange: (filters: Set<string>) => void;
}

// Convertit #RRGGBB en "R, G, B" pour usage dans rgba()
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export function CarteFilterBar({ activeFilters, onFiltersChange }: CarteFilterBarProps) {
  const handleFilterClick = (value: string) => {
    const next = new Set(activeFilters);
    const individual = FILTER_OPTIONS.filter(f => f.value !== "all").map(f => f.value);

    if (value === "all") {
      // Tout activer ou tout désactiver
      const allActive = individual.every(f => activeFilters.has(f));
      if (allActive) {
        individual.forEach(f => next.delete(f));
        next.delete("all");
      } else {
        individual.forEach(f => next.add(f));
        next.add("all");
      }
    } else {
      if (next.has(value)) {
        next.delete(value);
        next.delete("all"); // "Tous" se désactive si un filtre est retiré
      } else {
        next.add(value);
        if (individual.every(f => next.has(f))) next.add("all");
      }
    }

    onFiltersChange(next);
  };

  return (
    <div
      className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {FILTER_OPTIONS.map((filter) => {
        const isActive = filter.value === "all"
          ? activeFilters.has("all")
          : activeFilters.has(filter.value);

        const rgb = hexToRgb(filter.color);

        return (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className="shrink-0 cursor-pointer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 12px",
              height: 32,
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              transition: "border-color 160ms ease, background 160ms ease, color 160ms ease",
              background: isActive ? `rgba(${rgb}, 0.09)` : "transparent",
              border: isActive
                ? `1px solid rgba(${rgb}, 0.35)`
                : "1px solid rgba(255,255,255,0.08)",
              color: isActive ? filter.color : "#55556a",
            }}
          >
            {/* Dot coloré — opacité réduite à l'état inactif */}
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                flexShrink: 0,
                background: isActive ? filter.color : "#55556a",
                opacity: isActive ? 1 : 0.35,
                transition: "opacity 160ms ease, background 160ms ease",
              }}
            />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}