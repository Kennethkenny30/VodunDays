"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, BookOpenText, Map, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getQuizzes } from "@/lib/api/quiz";

interface NavItem {
  id: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "programme",  icon: Calendar,     href: "/programme" },
  { id: "culture",    icon: BookOpenText, href: "/pedagogie" },
  { id: "carte",      icon: Map,          href: "/carte"     },
  { id: "avis",       icon: Star,         href: "/avis"      },
  { id: "parametres", icon: Settings,     href: "/parametres"},
];

// Détermine l'onglet actif à partir du pathname courant
function getActiveTab(pathname: string): string {
  if (pathname === "/programme")           return "programme";
  if (pathname === "/pedagogie"
   || pathname.startsWith("/culture"))     return "culture";
  if (pathname === "/carte")               return "carte";
  if (pathname === "/avis")                return "avis";
  if (pathname === "/parametres")          return "parametres";
  return "programme";
}

// Clé localStorage partagée avec avis/page.tsx
const submittedKey = (quizId: string) => `vd_submitted_${quizId}`;

// Vérifie si un questionnaire actif n'a pas encore été soumis par cet utilisateur
async function checkHasPendingQuiz(): Promise<boolean> {
  try {
    const res = await getQuizzes({ active: true });
    if (!res.success || res.data.length === 0) return false;
    return res.data.some((q) => !localStorage.getItem(submittedKey(q.id)));
  } catch {
    return false;
  }
}

export function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const active   = getActiveTab(pathname);
  const [hasPendingQuiz, setHasPendingQuiz] = useState(false);

  // Re-vérification à chaque navigation pour refléter une soumission récente
  useEffect(() => {
    checkHasPendingQuiz().then(setHasPendingQuiz);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50",
        "rounded-full",
        "shadow-[0_8px_24px_rgba(0,0,0,0.40)]",
        "p-px",
        "touch-callout-none",
        "lg:hidden"
      )}
      style={{
        bottom: "max(24px, calc(env(safe-area-inset-bottom, 0px) + 12px))",
        background: "var(--vd-nav-border-grad)",
      }}
    >
      <div
        className={cn(
          "rounded-full",
          "backdrop-blur-xl border border-white/[0.15]",
          "px-3 py-2.5",
        )}
        style={{
          background: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.id;
            const showBadge = item.id === "avis" && hasPendingQuiz && !isActive;

            return (
              <motion.button
                key={item.id}
                onClick={() => router.push(item.href)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                aria-label={item.id}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full",
                  "transition-all duration-200 ease-out",
                )}
                style={isActive ? { background: "var(--vd-nav-active-bg)" } : undefined}
              >
                {/* Point indicateur sous l'icône active */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1.5 w-1 h-1 rounded-full bg-foreground/50"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}

                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/40 hover:text-foreground/70"
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />

                {/* Badge questionnaire en attente */}
                {showBadge && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18 }}
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F56E0F]"
                    style={{ boxShadow: "0 0 6px 2px rgba(245,110,15,0.55)" }}
                  >
                    {/* Anneau pulsant */}
                    <motion.span
                      animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-[#F56E0F]"
                    />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}