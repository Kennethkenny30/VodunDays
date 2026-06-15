"use client";

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

  return (
    <div
      className="flex items-center justify-start px-4 py-3"
      role="tablist"
      aria-label="Sélection du jour"
    >
      {/*
        Container transparent - aucun fond, aucun border.
        C'est le principe morphic navbar : seuls les boutons ont un style,
        pas le wrapper qui les contient.
      */}
      <div className="flex items-center overflow-hidden rounded-xl">
        {days.map((day, index) => {
          const isActive     = activeDay === day;
          const isFirst      = index === 0;
          const isLast       = index === days.length - 1;
          const prevDay      = index > 0 ? days[index - 1] : null;
          const nextDay      = index < days.length - 1 ? days[index + 1] : null;
          const isPrevActive = prevDay !== null && activeDay === prevDay;
          const isNextActive = nextDay !== null && activeDay === nextDay;

          return (
            /*
              Chaque bouton est une unité liquid glass individuelle.
              Tous partagent le même fond glass (comme bg-[#1a1a1a] dans morphic navbar),
              mais ici c'est rgba(30,30,30,0.55) + backdrop-blur.
              L'actif se détache avec mx + rounded + orange + reflets lumineux.
            */
            <button
              key={day}
              role="tab"
              aria-selected={isActive}
              aria-controls={`day-${day}-content`}
              onClick={() => onDayChange(day)}
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={cn(
                // ── Base : fond glass identique sur tous les boutons ──
                "relative flex items-center justify-center p-2 px-5 text-sm",
                "transition-all duration-300 select-none active:scale-[0.96]",
                // Liquid glass individuel - même rgba/blur que BottomNav
                "bg-[rgba(30,30,30,0.55)] [backdrop-filter:blur(10px)_saturate(180%)]",

                // ── Actif : se détache du flux avec mx + rounded + orange ──
                isActive && cn(
                  "mx-2 rounded-xl font-bold",
                  "text-[#F56E0F]",

                  // Reflet interne haut uniquement
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                ),

                // ── Inactif : coins adaptés selon voisinage (morphic) ──
                !isActive && cn(
                  "font-semibold text-[#878787] hover:text-white",
                  // Coin gauche : ouvert si voisin gauche est actif, arrondi sinon
                  (isPrevActive || isFirst) ? "rounded-l-xl" : "rounded-l-none",
                  // Coin droit : ouvert si voisin droit est actif, arrondi sinon
                  (isNextActive || isLast)  ? "rounded-r-xl" : "rounded-r-none",
                  // Reflet interne subtil sur inactifs
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                ),
              )}
            >
              {/* ── Reflets lumineux sur le bouton actif uniquement ── */}
              {isActive && (
                <>
                  {/* Ligne spéculaire principale en haut */}
                  <span className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full pointer-events-none" />
                  {/* Blob de lumière diffus en haut */}
                  <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/8 to-transparent rounded-t-xl pointer-events-none" />
                  {/* Streak lumineux sur le bord gauche */}
                  <span className="absolute left-0 inset-y-2 w-[1px] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />
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