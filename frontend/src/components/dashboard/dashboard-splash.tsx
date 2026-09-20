"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { cn } from "@/lib/utils"

const SESSION_KEY = "vd_dashboard_splash_shown"
const MIN_DISPLAY_MS = 2400
const MAX_WAIT_MS = 4000 // filet de sécurité si l'image ne charge jamais (404, offline...)

// Overlay de bienvenue affiché une seule fois par session de navigation,
// à l'entrée de n'importe quel dashboard (admin, superadmin, instad).
// Rendu visible par défaut au premier rendu (serveur + client) pour éviter
// un mismatch d'hydratation Next.js - sessionStorage n'existe pas côté serveur.
export function DashboardSplash() {
  const [visible, setVisible] = useState(true)
  const [skipAnimation, setSkipAnimation] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [shouldShow, setShouldShow] = useState(false) // évite d'afficher tant qu'on n'a pas vérifié la session
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY)

    if (alreadyShown) {
      setSkipAnimation(true)
      setVisible(false)
      return
    }

    sessionStorage.setItem(SESSION_KEY, "1")
    setShouldShow(true)
  }, [])

  useEffect(() => {
    if (!shouldShow) return

    // Filet de sécurité : si l'image ne déclenche jamais onLoad/onError
    // (connexion très lente, requête bloquée...), on ferme quand même le splash.
    const maxWaitTimeout = setTimeout(() => setImageLoaded(true), MAX_WAIT_MS)
    return () => clearTimeout(maxWaitTimeout)
  }, [shouldShow])

  useEffect(() => {
    if (!shouldShow || !imageLoaded) return

    // On attend que le logo soit réellement chargé avant de lancer le
    // minimum d'affichage, pour ne jamais fermer le splash avant que le
    // logo ait eu la chance d'apparaître.
    const delay = reducedMotion ? 0 : MIN_DISPLAY_MS
    const timeout = setTimeout(() => setVisible(false), delay)
    return () => clearTimeout(timeout)
  }, [shouldShow, imageLoaded, reducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={false}
          exit={skipAnimation ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
          transition={{ duration: skipAnimation ? 0 : 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-8 print:hidden"
          style={{ background: "var(--vd-deep)" }}
        >
          <HexagonPattern
            hexagons={[[1, 1], [4, 4], [2, 2], [3, 4], [5, 4], [8, 2], [6, 3]]}
            className={cn(
              "absolute inset-0 z-0 pointer-events-none",
              "[mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,white,transparent)]",
              "fill-amber-500/20 stroke-amber-500/20"
            )}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}
            className="relative z-10 text-white"
          >
            {/* Même lockup partout - seule la largeur varie par palier de breakpoint,
                avec un plafond en pixels pour ne pas grossir démesurément sur grand écran. */}
            <img
              src="/brand/kondo-lockup.svg"
              alt="KONDO Technologie"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className="w-[min(80vw,280px)] sm:w-[min(60vw,340px)] md:w-[min(45vw,420px)] lg:w-[min(35vw,480px)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}