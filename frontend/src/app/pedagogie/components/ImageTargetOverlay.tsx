"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Contenu culturel associe a chaque cible - a valider/enrichir par l'equipe
// contenu avant mise en production, ceci est un texte de demarrage
export const TARGET_CONTENT: Record<string, { title: string; description: string }> = {
  lissa: {
    title: "Lissa",
    description:
      "Divinite du ciel et du soleil dans le pantheon vodun fon, souvent associee a Mawu. Lissa incarne la force, la chaleur et le principe masculin createur, en complementarite avec la lune et la nuit.",
  },
  aziza: {
    title: "Aziza",
    description:
      "Esprits de la foret vivant dans les grands arbres, notamment le fromager. Les Aziza sont reputes avoir enseigne aux hommes l'usage du feu et les secrets de la medecine par les plantes.",
  },
};

export interface ScreenRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageTargetOverlayProps {
  targetName: string | null;
  rect: ScreenRect | null;
}

// Duree de l'animation de contour, en secondes - le texte demarre apres ce delai
const BORDER_DURATION = 1.1;
const WORD_STAGGER = 0.055;

export function ImageTargetOverlay({ targetName, rect }: ImageTargetOverlayProps) {
  const prefersReduced = useReducedMotion();
  const content = targetName ? TARGET_CONTENT[targetName] : null;

  if (!rect || !content) return null;

  const words = content.description.split(" ");
  const borderDuration = prefersReduced ? 0 : BORDER_DURATION;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      {/* Contour flouté qui trace progressivement le pourtour de la cible */}
      <svg
        className="absolute inset-0 overflow-visible"
        width={rect.width}
        height={rect.height}
      >
        <defs>
          <filter id="contour-blur" x="-50%" y="-50%" width="200%" height="200%">
            <motion.feGaussianBlur
              initial={{ stdDeviation: 6 }}
              animate={{ stdDeviation: 0 }}
              transition={{
                duration: prefersReduced ? 0 : 0.5,
                delay: borderDuration * 0.7,
                ease: "easeOut",
              }}
            />
          </filter>
        </defs>
        <motion.rect
          x={2}
          y={2}
          width={Math.max(rect.width - 4, 0)}
          height={Math.max(rect.height - 4, 0)}
          rx={10}
          fill="none"
          stroke="#F56E0F"
          strokeWidth={3}
          filter="url(#contour-blur)"
          initial={{ pathLength: 0, opacity: 0.9 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: borderDuration, ease: "easeInOut" }}
        />
      </svg>

      {/* Texte descriptif - apparait mot par mot une fois le contour trace */}
      <AnimatePresence>
        <motion.div
          className="absolute left-0 right-0 top-full mt-3 px-4 py-3 rounded-2xl backdrop-blur-md bg-black/55 border border-white/15"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: borderDuration * 0.6 }}
        >
          <motion.p
            className="text-[13px] font-semibold text-[#F56E0F] mb-1 tracking-wide"
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, delay: borderDuration * 0.65 }}
          >
            {content.title}
          </motion.p>

          <p className="text-[13px] text-white/90 leading-relaxed">
            {words.map((word, i) => (
              <motion.span
                key={`${targetName}-${i}`}
                className="inline-block mr-[0.28em]"
                initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.28,
                  delay: prefersReduced ? 0 : borderDuration * 0.75 + i * WORD_STAGGER,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
