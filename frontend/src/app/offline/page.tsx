"use client";

import Image from "next/image";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main
      className="flex min-h-svh flex-col items-center justify-center gap-8 px-4"
      style={{ backgroundColor: "#F56E0F" }}
    >
      {/* Même traitement que l'écran de transition, dont cette page est le repli. */}
      <Image
        src="/images/vodundays_logo2.png"
        alt="Vodun Days"
        width={169}
        height={118}
        priority
        className="w-36 h-auto"
      />

      <div className="flex flex-col items-center gap-3 text-center text-white">
        <WifiOff size={32} strokeWidth={1.5} />
        <h1 className="text-2xl font-semibold">Hors ligne</h1>
        <p className="text-white/80 text-sm max-w-xs">
          Vérifie ta connexion et réessaie pour accéder au festival.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="rounded-full border border-white/40 px-6 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
      >
        Réessayer
      </button>
    </main>
  );
}
