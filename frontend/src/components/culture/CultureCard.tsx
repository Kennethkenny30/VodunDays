"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CulturalSite } from "@/lib/types";

interface CultureCardProps {
  site: CulturalSite;
  index: number;
}

export function CultureCard({ site, index }: CultureCardProps) {
  // Référence pour détecter l'entrée dans le viewport au scroll
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,                      // Ne s'anime qu'une seule fois
    margin: "0px 0px -60px 0px",    // Se déclenche 60px avant d'être visible
  });

  return (
    <motion.div
      ref={ref}
      // Animation au scroll - monte depuis le bas avec un léger flou
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 28, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.45,
        delay: index * 0.07,  // Délai progressif entre les cartes
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-[20px]",
        "bg-vd-card-surface border border-vd-border-soft",
        "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        "hover:shadow-[0_8px_32px_rgba(245,110,15,0.15)]",
        "transition-shadow duration-300"
      )}
    >
      {/* Hero image zone */}
      <div className="relative aspect-16/10 overflow-hidden">
        {site.image ? (
          <Image
            src={site.image}
            alt={site.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: site.thematicColor
                ? `linear-gradient(135deg, ${site.thematicColor}, var(--vd-page-bg))`
                : "linear-gradient(135deg, #F56E0F, var(--vd-page-bg))",
            }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-vd-card-surface via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {site.entities.map((entity) => (
            <span
              key={entity}
              className={cn(
                "shrink-0 px-2 py-0.5 rounded-full",
                "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
                "border border-[rgba(245,110,15,0.3)]",
                "text-[10px] font-bold whitespace-nowrap"
              )}
            >
              {entity}
            </span>
          ))}
        </div>

        <h3 className="text-[15px] font-extrabold text-foreground leading-tight">
          {site.name}
        </h3>

        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3">
          {site.description}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/culture/${site.slug}`}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5",
              "px-4 py-1.75 rounded-lg",
              "bg-[#F56E0F] text-white",
              "text-[11px] font-bold",
              "hover:bg-[#E65D00] active:scale-[0.98]",
              "transition-all duration-150"
            )}
          >
            En savoir plus
            <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>

          <Link
            href={`/carte?site=${site.slug}`}
            className={cn(
              "flex items-center justify-center",
              "px-3 py-1.75 rounded-lg",
              "bg-vd-inner-tint border border-vd-border-soft",
              "text-muted-foreground hover:text-foreground hover:bg-foreground/8",
              "active:scale-[0.98] transition-all duration-150"
            )}
          >
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}