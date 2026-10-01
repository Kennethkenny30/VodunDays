"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useSidebarStore } from "@/lib/stores/sidebar-store"
import { useSession } from "@/hooks/useSession"
import {
  IconDashboard,
  IconMapPin,
  IconUsers,
  IconBug,
  IconCalendar,
  IconBell,
  IconChart,
  IconShield,
  IconClock,
  IconStar,
  IconPlus,
} from "@/components/icons"
import { LogOut, ShieldAlert } from "lucide-react"
import { useState } from "react"
import type { UserRole } from "@/lib/types/api"

// ─── Navigation config ────────────────────────────────────────────────────────

const superAdminNav = [
  {
    group: "Vue d'ensemble",
    items: [
      { label: "Dashboard", icon: IconDashboard, href: "/superadmin" },
    ],
  },
  {
    group: "Plateforme",
    items: [
      { label: "Sites & géographie", icon: IconMapPin,  href: "/superadmin/sites" },
      { label: "Gestion des rôles",  icon: IconUsers,   href: "/superadmin/roles" },
      { label: "Performance",        icon: IconChart,   href: "/superadmin/performance" },
    ],
  },
  {
    group: "Sécurité",
    items: [
      { label: "Audit & logs", icon: IconShield, href: "/superadmin/audit" },
      { label: "Incidents",    icon: IconBug,    href: "/superadmin/incidents" },
    ],
  },
]

const adminNav = [
  {
    group: "Vue d'ensemble",
    items: [
      { label: "Dashboard", icon: IconDashboard, href: "/admin" },
    ],
  },
  {
    group: "Programme",
    items: [
      { label: "Événements", icon: IconCalendar, href: "/admin/events" },
      { label: "Créneaux",   icon: IconClock,    href: "/admin/programs" },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Notifications",  icon: IconBell,  href: "/admin/notifications" },
      { label: "Enquête & avis", icon: IconChart, href: "/admin/survey" },
    ],
  },
  {
    group: "Sécurité",
    items: [
      { label: "Urgences", icon: ShieldAlert, href: "/admin/urgences" },
    ],
  },
]

const instadNav = [
  {
    group: "Vue d'ensemble",
    items: [
      { label: "Dashboard", icon: IconDashboard, href: "/instad" },
    ],
  },
  {
    group: "Enquêtes",
    items: [
      { label: "Questionnaires", icon: IconStar, href: "/instad/questionnaires" },
      { label: "Création de questionnaires", icon: IconPlus, href: "/instad/questionnaires/creation" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Liens racine ou parents d'un autre lien du menu : correspondance exacte,
// sinon ils resteraient actifs sur leurs sous-pages (ex. /instad/questionnaires
// sur /instad/questionnaires/creation).
const EXACT_MATCH_HREFS = [
  "/superadmin",
  "/admin",
  "/instad",
  "/instad/questionnaires",
]

function isActiveLink(href: string, pathname: string) {
  if (EXACT_MATCH_HREFS.includes(href)) {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(href + "/")
}

// ─── RailIcon ─────────────────────────────────────────────────────────────────
// Icône du rail avec son flyout : au survol, une carte se "déroule" depuis le
// haut (scaleY 0 → 1, transform-origin: top) reliée par un petit connecteur —
// même logique visuelle que le flyout "Activity / Trafic / Statistic" de la
// référence, appliquée ici à une étiquette unique par icône.

interface RailIconProps {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  active?: boolean
  danger?: boolean
  onClick?: () => void
}

function RailIcon({ label, icon: Icon, href, active, danger, onClick }: RailIconProps) {
  const [open, setOpen] = useState(false)

  const buttonClass = cn(
    "flex size-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200",
    active
      ? "bg-[var(--vd-gold)] text-background"
      : danger
      ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      : "text-muted-foreground hover:bg-white/8 hover:text-foreground"
  )

  const button = href ? (
    <Link href={href} className={buttonClass}>
      <Icon className="size-[19px]" />
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={buttonClass} aria-label={label}>
      <Icon className="size-[19px]" />
    </button>
  )

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {button}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1, transition: { duration: 0.32, ease: [0.65, 0, 0.35, 1] } }}
            exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.15, ease: "easeIn" } }}
            style={{ transformOrigin: "top" }}
            className="pointer-events-none absolute left-full top-0 z-50 ml-3"
          >
            <div className="relative">
              {/* connecteur */}
              <span className="absolute -left-3 top-1/2 h-px w-3 -translate-y-1/2 bg-white/15" />
              <div
                className={cn(
                  "whitespace-nowrap rounded-xl border border-white/10 bg-[oklch(0.15_0.02_260/0.98)] px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-xl",
                  danger ? "text-destructive" : active ? "text-[var(--vd-gold)]" : "text-foreground"
                )}
              >
                {label}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── IconRail (desktop) ───────────────────────────────────────────────────────

interface IconRailProps {
  role: UserRole
  onLogout: () => void
}

function IconRail({ role, onLogout }: IconRailProps) {
  const pathname = usePathname()
  const navConfig = role === "SUPER_ADMIN" ? superAdminNav : role === "INSTAD" ? instadNav : adminNav
  const homeHref  = role === "SUPER_ADMIN" ? "/superadmin" : role === "INSTAD" ? "/instad" : "/admin"
  const roleShort = role === "SUPER_ADMIN" ? "SUPER" : role === "INSTAD" ? "INSTAD" : "ADMIN"

  return (
    <aside
      className={cn(
        "hidden md:flex w-[76px] shrink-0 flex-col items-center gap-1 py-5",
        "relative z-40",
        "rounded-2xl md:rounded-3xl shadow-[0_25px_70px_-20px_rgba(0,0,0,0.65)]",
        "bg-[oklch(0.13_0.02_260/0.95)] backdrop-blur-xl"
      )}
    >
      {/* Statut */}
      <div className="mb-4 flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
        <span className="size-1.5 rounded-full bg-white/15" />
        <span className="size-1.5 rounded-full bg-white/15" />
      </div>

      {/* Logo */}
      <Link href={homeHref} className="mb-1.5 shrink-0">
        <Image
          src="/images/logo.png"
          alt="Vodun Days"
          width={40}
          height={40}
          className="rounded-full ring-1 ring-white/10 transition-transform hover:scale-105"
        />
      </Link>
      <span className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
        {roleShort}
      </span>

      {/* Navigation */}
      <nav className="flex w-full flex-1 flex-col items-center gap-1.5 px-2">
        {navConfig.map((section, idx) => (
          <div key={section.group} className="flex w-full flex-col items-center gap-1.5">
            {idx > 0 && <div className="my-1.5 h-px w-6 bg-white/8" />}
            {section.items.map((item) => (
              <RailIcon
                key={item.href}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={isActiveLink(item.href, pathname)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="mt-2 flex flex-col items-center gap-2 border-t border-white/8 pt-3">
        <RailIcon label="Déconnexion" icon={LogOut} onClick={onLogout} danger />
      </div>
    </aside>
  )
}

// ─── MobileNavList (Sheet mobile — nav complète avec labels) ─────────────────

function MobileNavList({ role, onLogout }: { role: UserRole; onLogout: () => void }) {
  const pathname = usePathname()
  const navConfig = role === "SUPER_ADMIN" ? superAdminNav : role === "INSTAD" ? instadNav : adminNav
  const homeHref  = role === "SUPER_ADMIN" ? "/superadmin" : role === "INSTAD" ? "/instad" : "/admin"
  const roleLabel = role === "SUPER_ADMIN" ? "Super Admin" : role === "INSTAD" ? "INStaD" : "Admin Culture"

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[64px] items-center gap-3 border-b border-white/8 px-4">
        <Link href={homeHref} className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Vodun Days"
            width={36}
            height={36}
            className="rounded-full ring-1 ring-white/10"
          />
        </Link>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">Vodun Days</p>
          <p className="truncate text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 py-3">
        {navConfig.map((section, idx) => (
          <div key={section.group} className={cn(idx > 0 && "mt-3")}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActiveLink(item.href, pathname)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-[var(--vd-gold)]/12 text-[var(--vd-gold)]"
                        : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("size-[18px] shrink-0", active ? "text-[var(--vd-gold)]" : "text-muted-foreground")} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/8 p-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-[18px] shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

// ─── DashboardSidebar (export principal) ─────────────────────────────────────

export function DashboardSidebar() {
  const { isOpen, close } = useSidebarStore()
  const { user, loading, logout } = useSession()

  // Placeholder invisible pendant le chargement - évite le flash ADMIN sur un compte SUPER_ADMIN
  if (loading) {
    return (
      <div className="hidden md:flex w-[76px] shrink-0 border-r border-white/8 bg-[oklch(0.13_0.02_260/0.95)]" />
    )
  }

  // Rôle lu depuis la session - jamais depuis le pathname
  const role: UserRole =
    user?.role === "SUPER_ADMIN" ? "SUPER_ADMIN" :
    user?.role === "INSTAD"      ? "INSTAD"      : "ADMIN"

  return (
    <>
      {/* ── Desktop : rail fixe en icônes + flyout au survol ── */}
      <IconRail role={role} onLogout={logout} />

      {/* ── Mobile sidebar (Sheet, labels complets) ── */}
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent
          side="left"
          className="w-64 p-0 border-r border-white/8 bg-[oklch(0.13_0.02_260/0.95)]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de navigation</SheetTitle>
          </SheetHeader>
          <MobileNavList role={role} onLogout={logout} />
        </SheetContent>
      </Sheet>
    </>
  )
}
