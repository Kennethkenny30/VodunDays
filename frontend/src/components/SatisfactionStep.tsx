"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StarRating } from "./StarRating";

interface SatisfactionStepProps {
  stepIndex: number;       // 0-based
  totalSteps: number;      // 4 (rating steps, excluding comment step)
  question: string;
  ratingKey: string;
  value: number;
  onChange: (rating: number) => void;
  onNext: () => void;
}

export function SatisfactionStep({
  stepIndex,
  totalSteps,
  question,
  value,
  onChange,
  onNext,
}: SatisfactionStepProps) {
  const canProceed = value > 0;

  return (
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      {/* Glass card */}
      <div
        className="rounded-2xl p-5 border backdrop-blur-md"
        style={{
          background: "var(--vd-glass-grad-start)",
          borderColor: "var(--vd-border-soft)",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-center mb-2">
          Question {stepIndex + 1} / {totalSteps}
        </p>

        <h3 className="text-[18px] font-black text-foreground text-center mb-6 leading-snug">
          {question}
        </h3>

        <StarRating value={value} onChange={onChange} />

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "w-full mt-6 py-3.5 rounded-xl",
            "text-[14px] font-black tracking-wide",
            "transition-all duration-200 active:scale-[0.98]",
            canProceed
              ? "bg-[#F56E0F] text-white shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
              : "bg-vd-inner-tint text-muted-foreground cursor-not-allowed"
          )}
        >
          Suivant →
        </button>
      </div>
    </motion.div>
  );
}
