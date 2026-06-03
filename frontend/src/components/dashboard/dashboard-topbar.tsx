"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/lib/stores/sidebar-store"
import { useSession } from "@/hooks/useSession"
import { getDisplayName, getInitials } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  IconMenu,
  IconSearch,
  IconBell,
  IconMoon,
  IconSun,
  IconLogout,
  IconUser,
  IconChevronRight,
  IconSwitch,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@/components/icons"

// Fil d'Ariane - génère les segments depuis le pathname
function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Labels lisibles pour les segments
  const labels: Record<string, string> = {
    superadmin:    "Super Admin",
    admin:         "Admin Culture",
    config:        "Configuration",
    sites:         "Sites",
    roles:         "Rôles",
    users:         "Utilisateurs",
    audit:         "Audit & Logs",
    incidents:     "Incidents",
    urgences:      "Urgences",
    events:        "Événements",
    programs:      "Créneaux",
    notifications: "Notifications",
    survey:        "Enquête & Avis",
    quiz:          "Questionnaires",
    performance:   "Performance",
    artists:       "Artistes",
  }

  return (
    <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
      {segments.map((segment, idx) => (
        <span key={segment} className="flex items-center gap-1">
          {idx > 0 && <IconChevronRight className="size-3" />}
          <Link
            href={`/${segments.slice(0, idx + 1).join("/")}`}
            className={cn(
              "hover:text-foreground transition-colors",
              idx === segments.length - 1 && "text-foreground font-medium"
            )}
          >
            {labels[segment] || segment}
          </Link>
        </span>
      ))}
    </nav>
  )
}

// Barre supérieure du dashboard
export function DashboardTopBar() {
  const { toggle } = useSidebarStore()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [commandOpen, setCommandOpen] = useState(false)
  const { user, logout } = useSession()

  // Raccourci clavier pour la recherche
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setCommandOpen(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const isSuperAdmin = pathname.startsWith("/superadmin")

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Bouton hamburger mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggle}
        aria-label="Ouvrir le menu"
      >
        <IconMenu className="size-5" />
      </Button>

      {/* Fil d'Ariane */}
      <Breadcrumbs />

      {/* Actions à droite */}
      <div className="ml-auto flex items-center gap-2">
        {/* Recherche globale */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-muted-foreground"
          onClick={() => setCommandOpen(true)}
        >
          <IconSearch className="size-4" />
          <span className="hidden lg:inline">Rechercher...</span>
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>

        {/* Recherche mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Rechercher"
        >
          <IconSearch className="size-5" />
        </Button>

        {/* Notifications */}
        <NotificationsBell />

        {/* Menu utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName(user)}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconUser className="mr-2 size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <IconSun className="mr-2 size-4" />
              ) : (
                <IconMoon className="mr-2 size-4" />
              )}
              Changer de thème
            </DropdownMenuItem>
            {isSuperAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <IconSwitch className="mr-2 size-4" />
                  Basculer vers Admin Culture
                </Link>
              </DropdownMenuItem>
            )}
            {!isSuperAdmin && user?.role === "SUPER_ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/superadmin">
                  <IconSwitch className="mr-2 size-4" />
                  Basculer vers Super Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <IconLogout className="mr-2 size-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de recherche globale */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Rechercher un événement, un site, un utilisateur..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Événements">
            <CommandItem>
              <IconCalendar className="mr-2 size-4" />
              Cérémonie d&apos;ouverture
            </CommandItem>
            <CommandItem>
              <IconCalendar className="mr-2 size-4" />
              Procession traditionnelle
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sites">
            <CommandItem>
              <IconMapPin className="mr-2 size-4" />
              Temple des Pythons
            </CommandItem>
            <CommandItem>
              <IconMapPin className="mr-2 size-4" />
              Place Chacha
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Utilisateurs">
            <CommandItem>
              <IconUsers className="mr-2 size-4" />
              Admin Culture
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}

// ─── Cloche de notifications avec badge en temps réel ────────────────────────

function NotificationsBell() {
  const [pending, setPending]           = useState(0)
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; createdAt: string }[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    async function fetchPending() {
      try {
        const { api } = await import("@/lib/api/client")
        const res = await api.get<{ notifications: { id: string; title: string; message: string; status: string; createdAt: string }[]; pagination: unknown }>("/notifications?limit=5&status=PENDING")
        if (mounted && res.success) {
          const list = res.data.notifications ?? []
          setPending(list.length)
          setNotifications(list.map((n) => ({ id: n.id, title: n.title, message: n.message, createdAt: n.createdAt })))
        }
      } catch { /* silencieux */ }
    }
    fetchPending()
    const timer = setInterval(fetchPending, 60_000) // refresh toutes les 60s
    return () => { mounted = false; clearInterval(timer) }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <IconBell className="size-5" />
          {pending > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {pending > 9 ? "9+" : pending}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <p className="text-sm font-medium">
            {pending > 0 ? `${pending} notification${pending > 1 ? "s" : ""} en attente` : "Notifications"}
          </p>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Aucune notification en attente</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
                  <div className="size-2 mt-1.5 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {pending > 0 && (
            <Link href="/admin/notifications" onClick={() => setOpen(false)} className="block text-xs text-center text-primary hover:underline">
              Voir toutes les notifications →
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
