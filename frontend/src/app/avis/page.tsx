"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { ArrowLeft } from "lucide-react";
import { SatisfactionStep } from "@/components/SatisfactionStep";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ratings {
  global: number;
  organization: number;
  accessibility: number;
  security: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const RATING_STEPS: Array<{ key: keyof Ratings; question: string }> = [
  { key: "global", question: "Satisfaction globale" },
  { key: "organization", question: "Organisation" },
  { key: "accessibility", question: "Accessibilité" },
  { key: "security", question: "Sécurité" },
];

const TOTAL_STEPS = RATING_STEPS.length + 1; // 4 ratings + 1 comment

// ─── Segmented Progress Bar ───────────────────────────────────────────────────
interface ProgressBarProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
}

function SegmentedProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-[4px] w-full">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[3px] rounded-full transition-colors duration-300 ease-in-out"
          style={{
            background: i <= currentStep ? "#F56E0F" : "rgba(255,255,255,0.10)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: "success" | "error";
}

function Toast({ message, type }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
        "px-5 py-3 rounded-xl text-[13px] font-semibold text-white",
        "shadow-lg backdrop-blur-sm max-w-[80vw] text-center",
        type === "success"
          ? "bg-[#1B7A6E]/90 border border-[#2AAA9E]/40"
          : "bg-[#F56E0F]/90 border border-[#F56E0F]/40"
      )}
    >
      {message}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AvisPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0–4 (0–3: ratings, 4: comment)
  const [ratings, setRatings] = useState<Ratings>({
    global: 0,
    organization: 0,
    accessibility: 0,
    security: 0,
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);

  // Show a toast and auto-dismiss after 4s
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleRatingChange = useCallback(
    (key: keyof Ratings, value: number) => {
      setRatings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call — replace with your actual submitSatisfaction() call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      // In production:
      // await submitSatisfaction({
      //   globalRating: ratings.global,
      //   organizationRating: ratings.organization,
      //   accessibilityRating: ratings.accessibility,
      //   securityRating: ratings.security,
      //   comment,
      //   submittedAt: new Date(),
      //   locale: currentLocale,
      // });

      showToast("Merci pour votre retour !", "success");
      setIsSubmitted(true);
    } catch {
      showToast("Erreur lors de l'envoi. Réessayez.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCommentStep = currentStep === RATING_STEPS.length;
  const currentRatingStep = RATING_STEPS[currentStep];

  // ── Submitted state ──
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0E0D12]">
        <ConfirmationScreen />
        <BottomNav />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,110,15,0.08) 0%, transparent 60%), #0E0D12",
      }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-[#0E0D12]/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <Link
              href="/programme"
              className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          )}

          {/* Page title */}
          <div />

          {/* Spacer */}
          <div className="w-10" />
        </div>

        {/* Segmented progress bar */}
        <SegmentedProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </header>

      {/* ── Page heading ── */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#878787] mb-1">
          Satisfaction
        </p>
        <h1 className="text-[22px] font-black text-white leading-tight mb-1">
          Votre Avis
        </h1>
        <p className="text-[13px] text-[#878787]">
          Votre avis améliore les prochaines éditions.
        </p>
      </div>

      {/* ── Step content ── */}
      <main className="px-4 pt-6 pb-36">
        <AnimatePresence mode="wait">
          {/* Rating steps (0–3) */}
          {!isCommentStep && currentRatingStep && (
            <SatisfactionStep
              key={currentStep}
              stepIndex={currentStep}
              totalSteps={RATING_STEPS.length}
              question={currentRatingStep.question}
              ratingKey={currentRatingStep.key}
              value={ratings[currentRatingStep.key]}
              onChange={(val) => handleRatingChange(currentRatingStep.key, val)}
              onNext={handleNext}
            />
          )}

          {/* Comment step (step 4) */}
          {isCommentStep && (
            <motion.div
              key="comment"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full"
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Question */}
                <h3 className="text-[16px] font-black text-white mb-1">
                  Commentaire libre
                </h3>
                <p className="text-[12px] text-[#878787] mb-4">(optionnel)</p>

                {/* Textarea */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Votre message..."
                  rows={4}
                  className={cn(
                    "w-full px-3 py-[10px] rounded-xl resize-none",
                    "bg-black/30 border border-white/10",
                    "text-white text-[13px] placeholder:text-[#878787]",
                    "focus:outline-none focus:border-[#F56E0F]/40",
                    "transition-colors duration-200 box-border"
                  )}
                />

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full mt-5 py-[14px] rounded-xl",
                    "bg-[#F56E0F] text-white",
                    "text-[15px] font-black tracking-wide",
                    "transition-all duration-200 active:scale-[0.98]",
                    "shadow-[0_4px_24px_rgba(245,110,15,0.4)]",
                    "hover:bg-[#D4600C]",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}