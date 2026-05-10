"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * En-tête de la page Carte Interactive
 * Affiche le logo Vodun Days et le titre de la section
 */
export function CartePageHeader() {
  return (
    <header className="relative z-10 px-4 pt-6 pb-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        {/* Logo Vodun Days */}
        <div className="relative w-12 h-12 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Vodun Days Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div>
          {/* Sous-titre */}
          <p
            className="text-[11px] uppercase mb-1"
            style={{
              color: "#878787",
              letterSpacing: "0.1em",
            }}
          >
            Navigation
          </p>
          {/* Titre principal */}
          <h1
            className="text-[22px] font-black"
            style={{
              color: "#FBFBFB",
              letterSpacing: "-0.02em",
            }}
          >
            Carte Interactive
          </h1>
        </div>
      </motion.div>
    </header>
  );
}
