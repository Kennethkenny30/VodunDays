"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Camera } from "lucide-react";

type PageMode = "content" | "ar";

interface ARModeSwitcherProps {
  mode: PageMode;
  onChange: (mode: PageMode) => void;
}

const TABS = [
  { id: "content" as const, label: "Contenu", Icon: BookOpen },
  { id: "ar" as const,      label: "Réalité AR", Icon: Camera },
];

export function ARModeSwitcher({ mode, onChange }: ARModeSwitcherProps) {
  const prefersReduced = useReducedMotion();

  // Spring au ressenti iOS - settle ferme, pas de rebond
  const springTransition = prefersReduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 360, damping: 32, mass: 0.8 };

  return (
    <div
      role="tablist"
      aria-label="Mode de la page"
      className="
        relative flex p-1 rounded-full
        backdrop-blur-xl bg-white/[0.08]
        border border-white/[0.15]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_24px_rgba(0,0,0,0.40)]
      "
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = mode === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className="
              relative flex items-center gap-1.5
              px-5 py-2 rounded-full
              text-[12px] font-semibold z-10
              select-none whitespace-nowrap
              transition-colors duration-150
            "
            style={{ color: isActive ? "white" : "rgba(255,255,255,0.50)" }}
          >
            {/* Pill glissant via layoutId - Framer Motion anime le déplacement entre onglets */}
            {isActive && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-[#F56E0F] shadow-[0_2px_12px_rgba(245,110,15,0.50)]"
                transition={springTransition}
              />
            )}
            <Icon className="relative z-10 w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
