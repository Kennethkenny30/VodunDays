"use client";

import { Landmark, Toilet, Siren, Bus, LifeBuoy, Scan, LayoutGrid } from "lucide-react";
import type React from "react";

// ─── Config ───────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = [
  { value: "all",        label: "Tous",       color: "#F56E0F", Icon: LayoutGrid },
  { value: "sites",      label: "Sites",      color: "#F56E0F", Icon: Landmark   },
  { value: "toilettes",  label: "Toilettes",  color: "#4488FF", Icon: Toilet     },
  { value: "urgences",   label: "Urgences",   color: "#FF4444", Icon: Siren      },
  { value: "transport",  label: "Transport",  color: "#FFbb00", Icon: Bus        },
  { value: "assistance", label: "Assistance", color: "#AA44FF", Icon: LifeBuoy   },
  { value: "pra",        label: "AR",         color: "#00E5CC", Icon: Scan       },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CarteFilterBarProps {
  activeFilters: Set<string>;
  onFiltersChange: (filters: Set<string>) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CarteFilterBar({ activeFilters, onFiltersChange }: CarteFilterBarProps) {
  const handleFilterClick = (value: string) => {
    const next = new Set(activeFilters);
    const individual = FILTER_OPTIONS.filter(f => f.value !== "all").map(f => f.value);

    if (value === "all") {
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
        next.delete("all");
      } else {
        next.add(value);
        if (individual.every(f => next.has(f))) next.add("all");
      }
    }

    onFiltersChange(next);
  };

  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {FILTER_OPTIONS.map(({ value, label, color, Icon }) => {
        const isActive = value === "all"
          ? activeFilters.has("all")
          : activeFilters.has(value);

        const rgb = hexToRgb(color);

        return (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className="shrink-0 cursor-pointer"
            style={{
              // Liquid glass pill
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: isActive ? "0 14px 0 10px" : "0 14px",
              height: 34,
              borderRadius: 99,
              fontSize: 11.5,
              fontWeight: 600,
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              transition: "all 200ms cubic-bezier(0.34,1.2,0.64,1)",
              // Glass effect
              background: isActive
                ? `rgba(${rgb}, 0.13)`
                : "rgba(255,255,255,0.04)",
              border: isActive
                ? `1px solid rgba(${rgb}, 0.38)`
                : "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              color: isActive ? color : "rgba(255,255,255,0.38)",
              // Subtle inner highlight (glass top edge)
              boxShadow: isActive
                ? `0 0 0 0.5px rgba(${rgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(${rgb}, 0.10)`
                : "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 4px rgba(0,0,0,0.2)",
              transform: isActive ? "scale(1.02)" : "scale(1)",
            }}
          >
            {/* Icon — only shown when active, for clean minimal look */}
            {isActive && (
              <Icon
                size={12}
                style={{
                  flexShrink: 0,
                  color: color,
                  opacity: 0.9,
                  transition: "opacity 200ms",
                }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}