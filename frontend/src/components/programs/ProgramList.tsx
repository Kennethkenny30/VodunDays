"use client";

import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgramCard, ProgramCardSkeleton } from "./ProgramCard";
import type { Program } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProgramListProps {
  programs: Program[];
  isLoading?: boolean;
  error?: string | null;
  activeDay?: number; // Utilisé comme clé pour l'AnimatePresence
  highlightEventId?: string | null; // Événement ciblé par la recherche (scroll + surbrillance)
}

export function ProgramList({ programs, isLoading = false, error = null, activeDay = 1, highlightEventId = null }: ProgramListProps) {

  // État chargement - 3 skeletons
  if (isLoading) {
    return (
      <div className="space-y-3 px-4 pb-24">
        {[0, 1, 2].map((i) => <ProgramCardSkeleton key={i} />)}
      </div>
    );
  }

  // État erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-vd-skeleton flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Erreur de chargement. Vérifiez votre connexion.
        </p>
        <button
          className={cn(
            "px-6 py-2.5 rounded-xl bg-[#F56E0F] text-[#FBFBFB]",
            "text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          )}
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // État vide
  if (programs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-vd-skeleton flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">Aucun événement pour ce jour.</p>
      </motion.div>
    );
  }

  // Tri chronologique
  const sortedPrograms = [...programs].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    /*
      AnimatePresence + key={activeDay} :
      quand l'utilisateur change de jour, la liste actuelle sort (slide gauche + fade)
      et la nouvelle entre (slide droite + fade). Effet de "page tournée".
    */
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeDay}
        // Entrée : arrive de la droite
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        // Sortie : part vers la gauche
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="space-y-3 px-4 pb-24"
      >
        {sortedPrograms.map((program, index) => (
          <ProgramCard
            key={program.id}
            program={program}
            index={index}
            highlighted={highlightEventId != null && program.eventId === highlightEventId}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}