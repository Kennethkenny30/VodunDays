"use client";

import { cn } from "@/lib/utils";

// Meme recette que WeatherWidget (carte meteo etendue) et BottomNav :
// une fine bordure degradee (--vd-nav-border-grad) autour d'une surface
// floutee bg-white/[0.08]. Volontairement distinct du glass plus leger
// utilise sur /avis.
export function GlassCard({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-px rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.40)]",
        className
      )}
      style={{ background: "var(--vd-nav-border-grad)" }}
    >
      <div
        className={cn(
          "rounded-[27px] overflow-hidden backdrop-blur-xl border border-white/[0.15]",
          innerClassName
        )}
        style={{
          background: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
