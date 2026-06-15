"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  IconBell,
  IconSend,
  IconClock,
  IconCheckCircle,
  IconError,
  IconCalendar,
  IconLoading,
} from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { getSites } from "@/lib/api/sites"
import { api } from "@/lib/api/client"
import type { Notification, NotificationStatus, Site } from "@/lib/types/api"

// FIX 2 & 5 - Badges texte colorés sémantiquement, icône en soutien seulement
const statusConfig: Record<
  NotificationStatus,
  {
    icon: typeof IconCheckCircle
    badgeClass: string
    label: string
  }
> = {
  SENT: {
    icon: IconCheckCircle,
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/20",
    label: "Envoyée",
  },
  PENDING: {
    icon: IconClock,
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    label: "En attente",
  },
  FAILED: {
    icon: IconError,
    badgeClass: "bg-red-500/10 text-red-600 border-red-500/20",
    label: "Échouée",
  },
}

interface NotificationsCenterProps {
  className?: string
}

export function NotificationsCenter({ className }: NotificationsCenterProps) {
  const [mounted, setMounted] = useState(false)

  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState<"ALL" | "SITE">("ALL")
  const [targetSite, setTargetSite] = useState("")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduledTime, setScheduledTime] = useState("")

  const maxTitleLength = 50
  const maxMessageLength = 150

  const loadData = useCallback(async () => {
    setLoading(true)
    const [sitesRes, historyRes] = await Promise.all([
      getSites(),
      api.get<{ notifications: Notification[]; pagination: unknown }>("/notifications"),
    ])

    if (sitesRes.success) setSites(sitesRes.data)
    else toast.error(sitesRes.message)

    if (historyRes.success) setHistory(historyRes.data.notifications)
    else toast.error(historyRes.message)

    setLoading(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [loadData])

  const handleSend = async (scheduled: boolean = false) => {
    if (!title.trim() || !message.trim()) {
      toast.error("Veuillez remplir le titre et le message")
      return
    }
    if (target === "SITE" && !targetSite) {
      toast.error("Veuillez sélectionner un site")
      return
    }
    if (scheduled && !scheduledTime) {
      toast.error("Veuillez sélectionner une date de programmation")
      return
    }

    setSending(true)
    const payload = {
      title,
      message,
      target,
      targetId:    target === "SITE" ? targetSite : undefined,
      scheduledAt: scheduled ? new Date(scheduledTime).toISOString() : undefined,
    }

    const res = await api.post<Notification>("/notifications", payload)

    if (res.success) {
      toast.success(res.message)
      setTitle("")
      setMessage("")
      setTarget("ALL")
      setTargetSite("")
      setScheduledTime("")
      setScheduleOpen(false)
      await loadData()
    } else {
      toast.error(res.message)
    }
    setSending(false)
  }

  const getTargetLabel = (notification: Notification) => {
    if (notification.target === "ALL") return "Tous"
    if (notification.target === "SITE") {
      const site = sites.find((s) => s.id === notification.targetId)
      return site?.name || "Site inconnu"
    }
    return notification.target
  }

  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  return (
    <div className={cn("glass-card p-6", className)} id="notifications">
      <div className="flex items-center gap-3 mb-6">
        <IconBell className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
      </div>

      {/* FIX 1 - Grille 5fr / 4fr en desktop, stack en mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-8 lg:items-start">

        {/* Colonne gauche : Formulaire de composition */}
        <div className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Composer
          </h3>

          {/* Titre */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-title" className="text-sm font-medium">Titre</Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  title.length > maxTitleLength ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {title.length}/{maxTitleLength}
              </span>
            </div>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, maxTitleLength))}
              placeholder="Titre de la notification"
              className="h-10"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-message" className="text-sm font-medium">Message</Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  message.length > maxMessageLength ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {message.length}/{maxMessageLength}
              </span>
            </div>
            <Textarea
              id="notif-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxMessageLength))}
              placeholder="Contenu de la notification"
              rows={3}
            />
          </div>

          {/* Ciblage */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ciblage</Label>
            <div className="space-y-2">
              <Select
                value={target}
                onValueChange={(v) => setTarget(v as "ALL" | "SITE")}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les abonnés</SelectItem>
                  <SelectItem value="SITE">Par site</SelectItem>
                </SelectContent>
              </Select>

              {target === "SITE" && (
                <Select
                  value={targetSite}
                  onValueChange={setTargetSite}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Chargement des sites…" : "Sélectionner un site"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* FIX 3 - Aperçu mis en valeur avec fond distinctif */}
          {(title || message) && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Aperçu
              </Label>
              <div className="rounded-xl border bg-muted/40 p-4 shadow-inner ring-1 ring-border/30">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <IconBell className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate leading-snug">
                      {title || "Titre"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {message || "Message de la notification"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FIX 4 - Hiérarchie boutons renforcée : action principale vs secondaire */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={() => handleSend(false)}
              className="flex-1"
              disabled={sending}
              size="default"
            >
              {sending
                ? <IconLoading className="mr-2 size-4 animate-spin" />
                : <IconSend className="mr-2 size-4" />}
              Envoyer maintenant
            </Button>

            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={sending} className="shrink-0">
                  <IconCalendar className="mr-2 size-4" />
                  Programmer
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <Label>Date et heure d&apos;envoi</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                  <Button
                    onClick={() => handleSend(true)}
                    className="w-full"
                    disabled={sending}
                  >
                    {sending && <IconLoading className="mr-2 size-4 animate-spin" />}
                    Programmer l&apos;envoi
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* FIX 1 & 2 - Colonne droite : séparateur visuel + historique lisible */}
        <div className="space-y-4 lg:border-l lg:border-border/40 lg:pl-8 min-h-0 overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Historique récent
          </h3>

          {loading ? (
            <EmptyState
              icon={IconBell}
              title="Chargement…"
              description="Récupération des notifications en cours."
            />
          ) : history.length === 0 ? (
            <EmptyState
              icon={IconBell}
              title="Aucune notification"
              description="Envoyez votre première notification pour qu'elle apparaisse ici."
            />
          ) : (
            <AnimatedList className="max-h-[420px] overflow-y-auto overflow-x-hidden space-y-2 pr-1">
              {history.slice(0, 10).map((notification) => {
                const config = statusConfig[notification.status]
                const StatusIcon = config.icon

                return (
                  <AnimatedListItem
                    key={notification.id}
                    className="p-3 bg-transparent border border-border/50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      {/* FIX 5 - Icône + badge texte sémantique côte à côte */}
                      <StatusIcon
                        className={cn(
                          "size-3.5 mt-1 shrink-0",
                          notification.status === "SENT" && "text-green-500",
                          notification.status === "PENDING" && "text-amber-500",
                          notification.status === "FAILED" && "text-red-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          {/* Badge statut texte coloré */}
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] shrink-0 font-medium", config.badgeClass)}
                          >
                            {config.label}
                          </Badge>
                          {/* Badge ciblage */}
                          <Badge variant="outline" className="text-[10px] shrink-0 text-muted-foreground">
                            {getTargetLabel(notification)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notification.status === "PENDING" && notification.scheduledAt
                            ? `Programmée ${getRelativeTime(notification.scheduledAt)}`
                            : getRelativeTime(notification.sentAt || notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </AnimatedListItem>
                )
              })}
            </AnimatedList>
          )}
        </div>
      </div>
    </div>
  )
}