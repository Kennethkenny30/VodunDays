"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CalendarClock, ArrowRight, RefreshCw } from "lucide-react";

interface WaitingScreenProps {
  quizTitle?: string;
  onCheck?: () => void;
}

export function WaitingScreen({ quizTitle, onCheck }: WaitingScreenProps) {
  const [checking, setChecking] = useState(false);

  // Polling automatique toutes les 90s pour détecter un nouveau questionnaire
  useEffect(() => {
    if (!onCheck) return;
    const interval = setInterval(() => {
      onCheck();
    }, 90_000);
    return () => clearInterval(interval);
  }, [onCheck]);

  function handleCheck() {
    if (!onCheck || checking) return;
    setChecking(true);
    // Délai visuel minimal pour que le spinner soit perçu
    setTimeout(() => {
      onCheck();
      setChecking(false);
    }, 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center min-h-[65vh] px-6 py-16 text-center"
    >
      {/* Icone animee */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, type: "spring", stiffness: 200, damping: 16 }}
        className="relative mb-8"
      >
        {/* Halo de chaleur */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(245,110,15,0.20) 0%, transparent 70%)",
            transform: "scale(2.6)",
          }}
        />

        {/* Cercle principal */}
        <div
          className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(245,110,15,0.18) 0%, rgba(245,110,15,0.06) 100%)",
            border: "1.5px solid rgba(245,110,15,0.30)",
            boxShadow: "0 8px 32px rgba(245,110,15,0.15)",
          }}
        >
          <CalendarClock className="w-10 h-10 text-[#F56E0F]" strokeWidth={1.4} />
        </div>

        {/* Anneau pulsant - indique l'attente active */}
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-[#F56E0F]/30"
          style={{ zIndex: 0 }}
        />
      </motion.div>

      {/* Titre */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-[24px] font-black text-foreground mb-3 leading-tight"
      >
        Merci pour votre participation
      </motion.h2>

      {/* Sous-titre */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-[14px] text-muted-foreground leading-relaxed max-w-xs mb-2"
      >
        {quizTitle
          ? `Vous avez deja repondu au questionnaire « ${quizTitle} ».`
          : "Vous avez deja repondu a ce questionnaire."
        }
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-[13px] text-muted-foreground/70 leading-relaxed max-w-xs mb-10"
      >
        Un nouveau questionnaire apparaitra ici lorsqu'il sera disponible.
      </motion.p>

      {/* Boutons d'action */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        {/* Verifier maintenant */}
        {onCheck && (
          <button
            onClick={handleCheck}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #F56E0F 0%, #D4600C 100%)",
              boxShadow: "0 4px 24px rgba(245,110,15,0.35)",
            }}
          >
            <AnimatePresence mode="wait">
              {checking ? (
                <motion.span
                  key="spin"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2} />
                  Verification...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={2} />
                  Verifier un nouveau questionnaire
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* Retour programme */}
        <Link
          href="/programme"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-foreground/60 border border-foreground/10 hover:border-foreground/20 hover:text-foreground/80 transition-all duration-150 active:scale-[0.98]"
        >
          Voir le programme
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
