"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getOrCreateFestivalierUuid } from "@/lib/festivalier";
import { getFestivalierProfile } from "@/lib/api/onboarding";
import { ConfigWizard } from "./ConfigWizard";
import { FeatureShowcase } from "./FeatureShowcase";
import { ThanksScreen } from "./ThanksScreen";

// Marqueur local rapide : evite l'appel reseau et le flash du popup a
// chaque ouverture pour un festivalier deja onboarde sur cet appareil.
const DONE_KEY = "vd_onboarding_done";

type Phase = "checking" | "config" | "showcase" | "thanks" | "done";

export function OnboardingFlow() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (localStorage.getItem(DONE_KEY) === "1") {
        if (!cancelled) setPhase("done");
        return;
      }

      const id = getOrCreateFestivalierUuid();
      if (!cancelled) setUuid(id);

      try {
        const res = await getFestivalierProfile(id);
        if (res.success && res.data?.onboardingCompletedAt) {
          localStorage.setItem(DONE_KEY, "1");
          if (!cancelled) setPhase("done");
          return;
        }
      } catch {
        // Pas de profil ou erreur reseau : on lance le flow d'onboarding.
      }

      if (!cancelled) setPhase("config");
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  // Empeche le scroll de la page derriere le popup pendant l'onboarding.
  useEffect(() => {
    const active = phase !== "checking" && phase !== "done";
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "checking" || phase === "done" || !uuid) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      >
        {phase === "config" && (
          <ConfigWizard uuid={uuid} onComplete={() => setPhase("showcase")} />
        )}
        {phase === "showcase" && (
          <FeatureShowcase onFinish={() => setPhase("thanks")} />
        )}
        {phase === "thanks" && (
          <ThanksScreen
            onDone={() => {
              localStorage.setItem(DONE_KEY, "1");
              setPhase("done");
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
