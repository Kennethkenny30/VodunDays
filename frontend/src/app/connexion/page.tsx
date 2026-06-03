"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { GlassLoginCard } from "./components/glass-login-card"

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
  </svg>
)

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
  </svg>
)

type DemoAccount = {
  role:     string
  email:    string
  password: string
  color:    string
}

// Affiché uniquement en développement (NODE_ENV=development ou NEXT_PUBLIC_SHOW_DEMO=true)
const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "Super Admin", email: "superadmin@vodundays.bj", password: "demo1234", color: "oklch(0.82 0.14 85)"  },
  { role: "Admin",       email: "admin@vodundays.bj",      password: "demo1234", color: "oklch(0.60 0.09 55)"  },
]

const SHOW_DEMO =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_SHOW_DEMO === "true"

function DemoCredentials() {
  const handleCopy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="w-full max-w-md mt-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Accès démo</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DEMO_ACCOUNTS.map((account) => (
          <div key={account.role} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
            <div
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: `${account.color}20`, color: account.color, border: `1px solid ${account.color}40` }}
            >
              {account.role}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Email</p>
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-white/70 truncate font-mono">{account.email}</p>
                <button type="button" onClick={() => handleCopy(account.email)} className="shrink-0 text-white/30 hover:text-white/70 transition-colors" title="Copier">
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Mot de passe</p>
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-white/70 font-mono">{account.password}</p>
                <button type="button" onClick={() => handleCopy(account.password)} className="shrink-0 text-white/30 hover:text-white/70 transition-colors" title="Copier">
                  <CopyIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ConnexionPage() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden"
      style={{ background: "var(--vd-deep)" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-border transition-colors"
        >
          <ArrowLeftIcon />
          <span>Accueil</span>
        </Link>
      </motion.div>

      <HexagonPattern
        hexagons={[[1,1],[4,4],[2,2],[3,4],[5,4],[8,2],[6,3],[8,5],[10,10]]}
        className={cn(
          "[mask-image:radial-gradient(420px_circle_at_center,white,transparent)]",
          "inset-0 skew-y-6",
          "fill-amber-500/40 stroke-amber-500/40"
        )}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassLoginCard />
      </motion.div>

      {/* Bloc démo visible uniquement en développement */}
      {SHOW_DEMO && (
        <div className="relative z-10">
          <DemoCredentials />
        </div>
      )}
    </main>
  )
}
