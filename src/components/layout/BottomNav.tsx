"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar, BookOpenText, Map, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "programme",  icon: Calendar,     href: "/programme"           },
  { id: "culture",    icon: BookOpenText, href: "/pedagogie"  },
  { id: "carte",      icon: Map,          href: "/carte"      },
  { id: "avis",       icon: Star,         href: "/avis"       },
  { id: "parametres", icon: Settings,     href: "/parametres" },
];

// Détermine l'onglet actif à partir du pathname courant
function getActiveTab(pathname: string): string {
  if (pathname === "/programme")           return "programme";
  if (pathname === "/pedagogie")  return "culture";
  if (pathname === "/carte")      return "carte";
  if (pathname === "/avis")       return "avis";
  if (pathname === "/parametres") return "parametres";
  return "programme";
}

export function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const active   = getActiveTab(pathname);

  return (
    <nav
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "rounded-full",
        // Bordure gradient oblique — même technique que le reste de l'UI
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_100%)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        "p-px",
        // Masqué sur desktop
        "lg:hidden"
      )}
    >
      <div
        className={cn(
          "rounded-full",
          // Fond liquid glass — même rgba/blur que DayFilter et Dynamic Island
          "bg-[rgba(30,30,30,0.55)]",
          "backdrop-blur-[10px] backdrop-saturate-180",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
          "px-3 py-2.5",
        )}
      >
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = active === item.id;

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
                  // Fond subtil sur l'onglet actif
                  isActive && "bg-white/15"
                )}
              >
                {/* Point indicateur animé sous l'icône active */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white/60"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}

                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}