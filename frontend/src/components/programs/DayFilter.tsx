"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DayFilterProps {
  activeDay: number;
  onDayChange: (day: number) => void;
  totalDays?: number;
}

export function DayFilter({ activeDay, onDayChange, totalDays = 3 }: DayFilterProps) {
  const t = useTranslations("programme");
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation clavier du tablist : flèches (avec boucle), Home/End
  function handleKeyDown(e: React.KeyboardEvent) {
    const idx = days.indexOf(activeDay);
    let next: number | null = null;
    if      (e.key === "ArrowRight") next = (idx + 1) % days.length;
    else if (e.key === "ArrowLeft")  next = (idx - 1 + days.length) % days.length;
    else if (e.key === "Home")       next = 0;
    else if (e.key === "End")        next = days.length - 1;
    if (next === null) return;
    e.preventDefault();
    onDayChange(days[next]);
    btnRefs.current[next]?.focus();
  }

  return (
    <div
      className="flex items-center justify-start px-4 py-3"
      role="tablist"
      aria-label={t("dayFilter")}
      onKeyDown={handleKeyDown}
    >
      {/* Principe morphic : seuls les boutons ont un style, pas le wrapper */}
      <div className="flex items-center overflow-hidden rounded-full">
        {days.map((day, index) => {
          const isActive     = activeDay === day;
          const isFirst      = index === 0;
          const isLast       = index === days.length - 1;
          const prevDay      = index > 0 ? days[index - 1] : null;
          const nextDay      = index < days.length - 1 ? days[index + 1] : null;
          const isPrevActive = prevDay !== null && activeDay === prevDay;
          const isNextActive = nextDay !== null && activeDay === nextDay;

          return (
            <button
              key={day}
              ref={(el) => { btnRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onDayChange(day)}
              style={{
                WebkitTapHighlightColor: "transparent",
                background: "var(--vd-dayfilter-bg)",
                borderColor: "var(--vd-dayfilter-border)",
              }}
              className={cn(
                // Fond glass identique sur tous les boutons (aligné sur ARModeSwitcher)
                "relative flex items-center justify-center min-h-11 p-2 px-5 text-sm",
                "transition-all duration-300 select-none active:scale-[0.96]",
                "backdrop-blur-xl border",

                // Actif : se détache du flux avec mx + rounded + orange
                isActive && cn(
                  "mx-2 rounded-full font-bold",
                  "text-[#F56E0F]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                ),

                // Inactif : coins adaptés selon voisinage (morphic)
                !isActive && cn(
                  "font-semibold text-muted-foreground hover:text-foreground",
                  (isPrevActive || isFirst) ? "rounded-l-full" : "rounded-l-none",
                  (isNextActive || isLast)  ? "rounded-r-full" : "rounded-r-none",
                  // Pas de bordure sur les bords partagés entre segments accolés (évite le trait double)
                  !isFirst && !isPrevActive && "border-l-0",
                  !isLast  && !isNextActive && "border-r-0",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                ),
              )}
            >
              {/* Reflets lumineux du bouton actif */}
              {isActive && (
                <>
                  <span className="absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent rounded-full pointer-events-none" />
                  <span className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-foreground/5 to-transparent rounded-t-full pointer-events-none" />
                  <span className="absolute left-0 inset-y-2 w-px bg-linear-to-b from-foreground/15 via-foreground/5 to-transparent pointer-events-none" />
                </>
              )}

              <span className="relative z-10">{t("dayLabel", { day })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
