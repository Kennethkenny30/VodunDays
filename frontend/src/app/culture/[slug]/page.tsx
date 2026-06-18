"use client";

import { use, Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { culturalSites, type CulturalSiteExtended } from "@/lib/culture-sites"


interface PageProps {
  params: Promise<{ slug: string }>;
}

function CultureDetailContent({ slug }: { slug: string }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const site = culturalSites.find((s) => s.slug === slug);

  if (!site) {
    return (
      <div className="min-h-screen bg-vd-page-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Site non trouvé</h1>
          <Link href="/pedagogie" className="text-[#F56E0F] text-sm">
            Retour aux contenus pédagogiques
          </Link>
        </div>
      </div>
    );
  }

  const fullDescription = (site as CulturalSiteExtended).fullDescription || site.description;

  return (
    <div className="min-h-screen bg-vd-page-bg relative">
      {/* Full-screen hero image - inspired by f2.jpg design */}
      <div className="fixed inset-0 z-0">
        {site.image ? (
          <Image
            src={site.image}
            alt={site.name}
            fill
            className="object-cover"
            priority
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
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-vd-page-bg" />
      </div>

      {/* Back button - floating */}
      <Link
        href="/pedagogie"
        className={cn(
          "fixed top-4 left-4 z-50",
          "flex items-center gap-1.5 px-3 py-2 rounded-full",
          "bg-black/40 backdrop-blur-md",
          "text-white text-[13px] font-medium",
          "hover:bg-black/60 transition-colors",
          "border border-white/10"
        )}
        style={{ marginTop: "max(0px, env(safe-area-inset-top))" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      {/* Bottom sheet card - inspired by f2.jpg design */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end">
        {/* Spacer to push card down */}
        <div className="flex-1 min-h-[35vh]" />
        
        {/* Card container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn(
            "rounded-t-[32px] overflow-hidden",
            "bg-vd-card-surface/95 backdrop-blur-xl",
            "border-t border-vd-border-soft",
            "shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Handle indicator */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-foreground/20" />
          </div>

          {/* Entity tag - like the "Мастер спорта" badge */}
          <div className="px-5 pb-2">
            <div className="flex flex-wrap gap-2">
              {site.entities.map((entity) => (
                <span
                  key={entity}
                  className={cn(
                    "px-3 py-1 rounded-full",
                    "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
                    "border border-[rgba(245,110,15,0.3)]",
                    "text-[11px] font-bold"
                  )}
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>

          {/* Site name - large bold title like in f2.jpg */}
          <div className="px-5 pt-2 pb-4">
            <h1 className="text-[28px] font-black text-foreground leading-tight tracking-tight">
              {site.name}
            </h1>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-vd-border-soft" />

          {/* Content section */}
          <div className="px-5 py-5">
            <h2 className="text-[13px] uppercase tracking-wider text-muted-foreground mb-3">
              A propos
            </h2>
            
            {/* Description with expand/collapse - short preview by default */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!showFullContent ? (
                  <motion.div
                    key="short"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[14px] text-foreground/75 leading-relaxed">
                      {site.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[14px] text-foreground/75 leading-relaxed whitespace-pre-line">
                      {fullDescription}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle button */}
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className={cn(
                  "mt-4 flex items-center gap-1.5",
                  "text-[#F56E0F] text-[13px] font-semibold",
                  "hover:text-[#ff8533] transition-colors"
                )}
              >
                {showFullContent ? (
                  <>
                    Voir moins
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lire la suite
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pb-28" />
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export default function CultureDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-vd-page-bg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F56E0F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CultureDetailContent slug={slug} />
    </Suspense>
  );
}
