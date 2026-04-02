"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Heart } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Program, ProgramType } from "@/lib/types";
import { cn } from "@/lib/utils";

// Styles des badges par type de programme
const programTypeBadgeStyles: Record<ProgramType, { bg: string; text: string; border: string }> = {
  RITUAL:     { bg: "rgba(245, 110, 15, 0.30)", text: "#F56E0F",  border: "rgba(245, 110, 15, 0.40)" },
  ANIMATION:  { bg: "rgba(245, 110, 15, 0.22)", text: "#FFA060",  border: "rgba(245, 110, 15, 0.32)" },
  CONCERT:    { bg: "rgba(245, 110, 15, 0.16)", text: "#FFC090",  border: "rgba(245, 110, 15, 0.26)" },
  EXHIBITION: { bg: "rgba(245, 110, 15, 0.10)", text: "#FFD0A0",  border: "rgba(245, 110, 15, 0.20)" },
  CONFERENCE: { bg: "rgba(245, 110, 15, 0.07)", text: "#FFE0C0",  border: "rgba(245, 110, 15, 0.15)" },
};

const programTypeLabels: Record<ProgramType, string> = {
  RITUAL:     "RITUEL",
  ANIMATION:  "ANIMATION",
  CONCERT:    "CONCERT",
  EXHIBITION: "EXPOSITION",
  CONFERENCE: "CONFÉRENCE",
};

interface ProgramCardProps {
  program: Program;
  index?: number;
}

export function ProgramCard({ program, index = 0 }: ProgramCardProps) {
  const [isFavorite, setIsFavorite] = useState(program.isFavorite || false);
  const badgeStyle = programTypeBadgeStyles[program.type];

  // Référence pour détecter l'entrée dans le viewport au scroll
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    once: true,       // Ne s'anime qu'une fois
    margin: "0px 0px -60px 0px", // Se déclenche 60px avant d'être visible
  });

  return (
    <motion.article
      ref={ref}
      // Animation au scroll — monte depuis le bas avec un léger flou
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 28, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.45,
        delay: index * 0.07, // Délai progressif entre les cartes
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative rounded-[20px] overflow-hidden",
        "bg-[#1B1B1E]",
        "border border-white/8",
        "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
        "backdrop-blur-md",
        "cursor-pointer",
      )}
    >
      {/* Conteneur image */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={program.image}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />

        {/* Badge En Direct */}
        {program.isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.3 }}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#F56E0F] text-[#FBFBFB] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_2px_12px_rgba(245,110,15,0.5)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBFBFB] animate-pulse" />
            En Direct
          </motion.div>
        )}

        {/* Badge note — en haut à droite */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1">
          <svg className="w-3 h-3 text-[#F56E0F]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[11px] font-bold text-white">{program.rating}</span>
        </div>

        {/* Dégradé bas pour la transition vers le contenu */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1E] via-transparent to-transparent" />
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        {/* Ligne haute — badge type + horaire */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
            style={{
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              border: `1px solid ${badgeStyle.border}`,
            }}
          >
            {programTypeLabels[program.type]}
          </span>
          <span className="text-[13px] font-bold text-[#F56E0F]">
            {program.startTime} – {program.endTime}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-[16px] font-extrabold text-[#FBFBFB] leading-tight mb-1">
          {program.title}
        </h3>

        {/* Lieu */}
        <p className="flex items-center gap-1.5 text-[12px] text-[#878787] mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {program.location}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg",
              "flex items-center justify-center gap-2",
              "text-[11px] font-bold",
              "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
              "border border-[rgba(245,110,15,0.30)]",
              "transition-all duration-150 active:scale-[0.97]",
              "hover:bg-[rgba(245,110,15,0.25)]"
            )}
          >
            Voir sur la carte
          </button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "py-1.5 px-3 rounded-lg",
              "flex items-center justify-center",
              "bg-[rgba(255,255,255,0.06)]",
              "border border-white/10",
              "transition-all duration-150"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all duration-300",
                isFavorite ? "fill-[#F56E0F] text-[#F56E0F] scale-110" : "text-[#878787]"
              )}
            />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// Skeleton de chargement
export function ProgramCardSkeleton() {
  return (
    <div className={cn("relative rounded-[20px] overflow-hidden", "bg-[#1B1B1E]", "border border-white/8")}>
      <div className="aspect-16/10 bg-[#262626] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full bg-[#262626] animate-pulse" />
          <div className="h-4 w-20 rounded bg-[#262626] animate-pulse" />
        </div>
        <div className="h-5 w-3/4 rounded bg-[#262626] animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-[#262626] animate-pulse" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 rounded-lg bg-[#262626] animate-pulse" />
          <div className="w-10 h-8 rounded-lg bg-[#262626] animate-pulse" />
        </div>
      </div>
    </div>
  );
}