"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
} from "@/components/icons"
import { ChevronLeft, ChevronRight, LogOut, ShieldAlert } from "lucide-react"
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
      { label: "Questionnaires", icon: IconStar,  href: "/admin/quiz" },
    ],
  },
  {
    group: "Sécurité",
    items: [
      { label: "Urgences", icon: ShieldAlert, href: "/admin/urgences" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActiveLink(href: string, pathname: string) {
  if (href === "/superadmin" || href === "/admin") {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(href + "/")
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  isActive: boolean
  collapsed: boolean
}

function NavItem({ label, icon: Icon, href, isActive, collapsed }: NavItemProps) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[var(--vd-gold)]/12 text-[var(--vd-gold)]"
          : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
      )}
    >
      {/* Indicateur actif */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--vd-gold)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          isActive ? "text-[var(--vd-gold)]" : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
}

// ─── SidebarContent ───────────────────────────────────────────────────────────

interface SidebarContentProps {
  role: UserRole
  collapsed: boolean
  onToggle?: () => void
  showToggle?: boolean
  onLogout: () => void
}

function SidebarContent({ role, collapsed, onToggle, showToggle = false, onLogout }: SidebarContentProps) {
  const pathname = usePathname()
  const navConfig = role === "SUPER_ADMIN" ? superAdminNav : adminNav
  const homeHref = role === "SUPER_ADMIN" ? "/superadmin" : "/admin"

  return (
    <div className="flex h-full flex-col">

      {/* ── Header ── */}
      <div className={cn(
        "flex items-center border-b border-white/8 transition-all duration-300",
        collapsed ? "h-[64px] justify-center px-3" : "h-[64px] gap-3 px-4"
      )}>
        <Link href={homeHref} className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Vodun Days"
            width={36}
            height={36}
            className="rounded-full ring-1 ring-white/10 transition-transform hover:scale-105"
          />
        </Link>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                Vodun Days
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {role === "SUPER_ADMIN" ? "Super Admin" : "Admin Culture"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton collapse desktop */}
        {showToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "size-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground",
              collapsed && "ml-0"
            )}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 py-3">
        {navConfig.map((section, idx) => (
          <div key={section.group} className={cn(idx > 0 && "mt-3")}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60"
                >
                  {section.group}
                </motion.p>
              )}
            </AnimatePresence>

            {collapsed && idx > 0 && (
              <div className="my-2 mx-3">
                <Separator className="bg-white/8" />
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  isActive={isActiveLink(item.href, pathname)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-white/8 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onLogout}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive",
                collapsed && "justify-center"
              )}
            >
              <LogOut className="size-[18px] shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Déconnexion
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={8} className="text-xs">
              Déconnexion
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  )
}

// ─── DashboardSidebar (export principal) ─────────────────────────────────────

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebarStore()
  const [collapsed, setCollapsed] = useState(false)
  const { user, loading, logout } = useSession()

  // Placeholder invisible pendant le chargement - évite le flash ADMIN sur un compte SUPER_ADMIN
  if (loading) {
    return (
      <div
        className="hidden md:flex shrink-0 border-r border-white/8 bg-[oklch(0.13_0.02_260/0.95)]"
        style={{ width: collapsed ? 64 : 240 }}
      />
    )
  }

  // Rôle lu depuis la session - jamais depuis le pathname
  const role: UserRole = user?.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN"

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-white/8",
          "bg-[oklch(0.13_0.02_260/0.95)] backdrop-blur-xl"
        )}
        style={{ overflow: "visible" }}
      >
        <SidebarContent
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          showToggle
          onLogout={logout}
        />
      </motion.aside>

      {/* ── Mobile sidebar (Sheet) ── */}
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent
          side="left"
          className="w-64 p-0 border-r border-white/8 bg-[oklch(0.13_0.02_260/0.95)]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent role={role} collapsed={false} onLogout={logout} />
        </SheetContent>
      </Sheet>
    </>
  )
}