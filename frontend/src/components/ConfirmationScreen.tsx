"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function ConfirmationScreen() {
  const t = useTranslations("avis");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-16 text-center"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.6,
          type: "spring",
          stiffness: 180,
          damping: 14,
        }}
        className="relative mb-8"
      >
        {/* Glow ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,110,15,0.25) 0%, transparent 70%)",
            transform: "scale(2.2)",
          }}
        />

        {/* SVG checkmark - self-drawing */}
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Background circle */}
          <circle cx="48" cy="48" r="48" fill="rgba(245,110,15,0.15)" />
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="#F56E0F"
            strokeWidth="2"
            fill="none"
            style={{
              strokeDasharray: "276",
              strokeDashoffset: "276",
              animation: "draw-circle 0.6s ease forwards 0.2s",
            }}
          />
          {/* Check */}
          <polyline
            points="28,50 42,64 70,36"
            stroke="#F56E0F"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: "60",
              strokeDashoffset: "60",
              animation: "draw-check 0.4s ease forwards 0.6s",
            }}
          />
        </svg>

        <style jsx>{`
          @keyframes draw-circle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes draw-check {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="text-[28px] font-black text-white mb-3"
      >
        {t("confirmation.title")}
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.4 }}
        className="text-[14px] text-[#878787] leading-relaxed max-w-xs mb-10"
      >
        {t("confirmation.subtitle")}
      </motion.p>

      {/* Return link */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F56E0F] text-white text-[14px] font-bold hover:bg-[#D4600C] transition-colors duration-150 shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
        >
          {t("confirmation.backToProgramme")}
        </Link>
      </motion.div>
    </motion.div>
  );
}
