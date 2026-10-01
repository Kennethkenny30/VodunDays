"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DayFilterProps {
  activeDay: number;
  onDayChange: (day: number) => void;
  totalDays?: number;
}

// Nombre de boutons entierement visibles a la fois dans le conteneur scrollable.
const VISIBLE_COUNT = 3;

export function DayFilter({ activeDay, onDayChange, totalDays = 3 }: DayFilterProps) {
  const t = useTranslations("programme");
  const allDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  // Ne focus le bouton apres changement de jour que si ce changement vient
  // du clavier - pas au montage, pas sur un clic souris (deja focus par le navigateur).
  const pendingKeyboardFocus = useRef(false);
  // Largeur exacte (en px) de VISIBLE_COUNT boutons, recalculee dynamiquement -
  // necessaire car le bouton actif est plus large (marges de detachement),
  // donc une largeur fixe en CSS couperait parfois le 3e bouton a moitie.
  const [containerWidth, setContainerWidth] = useState<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function recompute() {
      const windowSize = Math.min(VISIBLE_COUNT, totalDays);
      let windowStart = activeDay - 1;
      windowStart = Math.max(1, windowStart);
      windowStart = Math.min(windowStart, totalDays - windowSize + 1);
      const visible = Array.from({ length: windowSize }, (_, i) => windowStart + i);

      let total = 0;
      for (const day of visible) {
        const el = btnRefs.current[day];
        if (!el) return;
        const style = getComputedStyle(el);
        total += el.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }
      setContainerWidth(total);
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    Array.from(container.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  }, [activeDay, totalDays]);

  // Tous les jours sont rendus dans un conteneur overflow-x-auto de largeur
  // fixe (~3 boutons) : on scrolle jusqu'au bouton actif au lieu de swap
  // une sous-liste, ce qui permet un vrai defilement fluide + swipe tactile.
  useEffect(() => {
    btnRefs.current[activeDay]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    if (pendingKeyboardFocus.current) {
      btnRefs.current[activeDay]?.focus();
      pendingKeyboardFocus.current = false;
    }
  }, [activeDay]);

  // Navigation clavier : parcourt tous les jours du festival (pas seulement
  // ceux actuellement visibles) - la fenetre suit automatiquement au rendu suivant.
  function handleKeyDown(e: React.KeyboardEvent) {
    const idx = allDays.indexOf(activeDay);
    let next: number | null = null;
    if      (e.key === "ArrowRight") next = (idx + 1) % allDays.length;
    else if (e.key === "ArrowLeft")  next = (idx - 1 + allDays.length) % allDays.length;
    else if (e.key === "Home")       next = 0;
    else if (e.key === "End")        next = allDays.length - 1;
    if (next === null) return;
    e.preventDefault();
    pendingKeyboardFocus.current = true;
    onDayChange(allDays[next]);
  }

  return (
    <div
      className="flex items-center justify-start px-4 py-3"
      role="tablist"
      aria-label={t("dayFilter")}
      onKeyDown={handleKeyDown}
    >
      {/* Principe morphic : seuls les boutons ont un style, pas le wrapper.
          Largeur fixe (~3 boutons) + overflow-x-auto : le composant garde
          sa taille compacte, le defilement se fait par scroll (snap) au lieu
          d'un swap de sous-liste - scrollbar masquee pour garder le look. */}
      <div
        ref={containerRef}
        style={containerWidth ? { width: containerWidth } : undefined}
        className={cn(
          "flex items-center overflow-x-auto rounded-full",
          "snap-x snap-mandatory scroll-smooth",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        )}
      >
        {allDays.map((day, index) => {
          const isActive     = activeDay === day;
          const isFirst      = index === 0;
          const isLast       = index === allDays.length - 1;
          const prevDay      = index > 0 ? allDays[index - 1] : null;
          const nextDay      = index < allDays.length - 1 ? allDays[index + 1] : null;
          const isPrevActive = prevDay !== null && activeDay === prevDay;
          const isNextActive = nextDay !== null && activeDay === nextDay;

          return (
            <button
              key={day}
              ref={(el) => { btnRefs.current[day] = el; }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onDayChange(day)}
              style={{
                WebkitTapHighlightColor: "transparent",
                background: "var(--vd-dayfilter-bg)",
              }}
              className={cn(
                "relative flex items-center justify-center min-h-11 p-2 px-5 text-sm",
                "transition-all duration-300 select-none active:scale-[0.96]",
                "backdrop-blur-xl border-none shrink-0 snap-center",

                // Actif : se detache du flux avec mx + rounded + orange
                isActive && cn(
                  "mx-2 rounded-full font-bold",
                  "text-[#F56E0F]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
                ),

                // Inactif : coins adaptes selon voisinage (morphic)
                !isActive && cn(
                  "font-semibold text-muted-foreground hover:text-foreground",
                  (isPrevActive || isFirst) ? "rounded-l-full" : "rounded-l-none",
                  (isNextActive || isLast)  ? "rounded-r-full" : "rounded-r-none",
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