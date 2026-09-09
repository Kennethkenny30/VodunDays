"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PartyPopper } from "lucide-react";

const ACCENT = "#F56E0F";

export function ThanksScreen({ onDone }: { onDone: () => void }) {
  const t = useTranslations("onboarding.thanks");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center text-center max-w-sm mx-auto px-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 180, damping: 14 }}
        className="relative mb-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(245,110,15,0.25) 0%, transparent 70%)",
            transform: "scale(2.2)",
          }}
        />
        <div
          className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(245,110,15,0.15)" }}
        >
          <PartyPopper className="size-11" style={{ color: ACCENT }} />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-[28px] font-black text-foreground mb-3"
      >
        {t("title")}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="text-[14px] text-muted-foreground leading-relaxed mb-10"
      >
        {t("subtitle")}
      </motion.p>

      <motion.button
        type="button"
        onClick={onDone}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-[14px] font-bold transition-colors duration-150 shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
        style={{ background: ACCENT }}
      >
        {t("cta")}
      </motion.button>
    </motion.div>
  );
}
