"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  MapPin,
  ShieldAlert,
  BookHeart,
  Bell,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

const ACCENT = "#F56E0F";

type Feature = {
  key: "programme" | "carte" | "urgences" | "avis" | "notifications";
  image: string | null;
  Icon: React.ElementType;
};

const FEATURES: Feature[] = [
  { key: "programme",     image: "/images/features/preview-programme.webp",     Icon: CalendarDays },
  { key: "carte",         image: "/images/features/preview-carte.webp",         Icon: MapPin },
  { key: "urgences",      image: "/images/features/preview-urgences.webp",      Icon: ShieldAlert },
  { key: "avis",          image: null,                                          Icon: BookHeart },
  { key: "notifications", image: "/images/features/preview-notifications.webp", Icon: Bell },
];

export function FeatureShowcase({ onFinish }: { onFinish: () => void }) {
  const t = useTranslations("onboarding.showcase");
  const [index, setIndex] = useState(0);

  const feature = FEATURES[index];
  const isLast = index === FEATURES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex((i) => i + 1);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={onFinish}
          aria-label={t("skip")}
          className="w-9 h-9 rounded-full bg-foreground/8 flex items-center justify-center hover:bg-foreground/12 transition-colors"
        >
          <X className="size-4 text-foreground" />
        </button>
      </div>

      <GlassCard>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-center pt-6 mb-1">
          {t("title")}
        </p>
        <p className="text-[13px] text-muted-foreground text-center px-6 mb-5">
          {t("subtitle")}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-6"
          >
            <div className="relative rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              {feature.image ? (
                <img
                  src={feature.image}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-cover object-top"
                />
              ) : (
                <feature.Icon className="size-16" style={{ color: ACCENT }} />
              )}
            </div>
            <h3 className="text-[18px] font-black text-foreground text-center mb-2">
              {t(`features.${feature.key}.title`)}
            </h3>
            <p className="text-[13px] text-muted-foreground text-center leading-relaxed mb-6">
              {t(`features.${feature.key}.description`)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-1.5 pb-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.key}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 20 : 6,
                background: i === index ? ACCENT : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </GlassCard>

      <div className="flex items-center gap-3 mt-4">
        {!isLast && (
          <button
            type="button"
            onClick={onFinish}
            className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-muted-foreground bg-foreground/5 border border-foreground/10 transition-colors hover:bg-foreground/8"
          >
            {t("skip")}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className={cn(
            "flex-1 py-3.5 rounded-xl text-[14px] font-black tracking-wide text-white",
            "transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2",
            "shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
          )}
          style={{ background: ACCENT }}
        >
          {isLast ? t("done") : t("next")}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
