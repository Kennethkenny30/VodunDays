"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// En-tête de la page Carte Interactive
export function CartePageHeader() {
  const t = useTranslations("carte");
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
          <p
            className="text-[11px] uppercase"
            style={{
              color: "#878787",
              letterSpacing: "0.1em",
            }}
          >
            {t("header")}
          </p>
        </div>
      </motion.div>
    </header>
  );
}
