"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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

// Configuration des statuts
const statusConfig: Record<NotificationStatus, { icon: typeof IconCheckCircle; color: string; label: string }> = {
  SENT: { icon: IconCheckCircle, color: "text-green-500", label: "Envoyée" },
  PENDING: { icon: IconClock, color: "text-amber-500", label: "En attente" },
  FAILED: { icon: IconError, color: "text-red-500", label: "Échouée" },
}

interface NotificationsCenterProps {
  className?: string
}

// Centre de notifications - avec API réelle
export function NotificationsCenter({ className }: NotificationsCenterProps) {
  const [mounted, setMounted] = useState(false)
  
  // États
  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Formulaire
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState<"ALL" | "SITE">("ALL")
  const [targetSite, setTargetSite] = useState("")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduledTime, setScheduledTime] = useState("")

  const maxTitleLength = 50
  const maxMessageLength = 150

  // Chargement des données
  const loadData = useCallback(async () => {
    setLoading(true)
    const [sitesRes, historyRes] = await Promise.all([
      getSites(),
      api.get<Notification[]>("/notifications"),
    ])

    if (sitesRes.success) setSites(sitesRes.data)
    else toast.error(sitesRes.message)

    if (historyRes.success) setHistory(historyRes.data)
    else toast.error(historyRes.message)

    setLoading(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [loadData])

  // Envoi de notification
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
      body: message,
      target,
      siteId: target === "SITE" ? targetSite : undefined,
      scheduled_at: scheduled ? new Date(scheduledTime).toISOString() : undefined,
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
      // Recharger l'historique
      await loadData()
    } else {
      toast.error(res.message)
    }
    setSending(false)
  }

  // Label de ciblage
  const getTargetLabel = (notification: Notification) => {
    if (notification.target === "ALL") return "Tous"
    if (notification.target === "SITE") {
      const site = sites.find((s) => s.id === notification.targetId)
      return site?.name || "Site inconnu"
    }
    return notification.target
  }

  // Temps relatif côté client uniquement
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

      <div className="grid grid-cols-1 gap-6">
        {/* Colonne gauche : Composition */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Composer</h3>

          {/* Titre */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-title">Titre</Label>
              <span className={cn(
                "text-xs",
                title.length > maxTitleLength ? "text-destructive" : "text-muted-foreground"
              )}>
                {title.length}/{maxTitleLength}
              </span>
            </div>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, maxTitleLength))}
              placeholder="Titre de la notification"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-message">Message</Label>
              <span className={cn(
                "text-xs",
                message.length > maxMessageLength ? "text-destructive" : "text-muted-foreground"
              )}>
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
            <Label>Ciblage</Label>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Select value={target} onValueChange={(v) => setTarget(v as "ALL" | "SITE")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les abonnés</SelectItem>
                    <SelectItem value="SITE">Par site</SelectItem>
                  </SelectContent>
                </Select>

                {target === "SITE" && (
                  <Select value={targetSite} onValueChange={setTargetSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un site" />
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
              </>
            )}
          </div>

          {/* Prévisualisation */}
          {(title || message) && (
            <div className="space-y-2">
              <Label>Aperçu</Label>
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <IconBell className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{title || "Titre"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {message || "Message de la notification"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={() => handleSend(false)} className="flex-1" disabled={sending}>
              {sending ? <IconLoading className="mr-2 size-4" /> : <IconSend className="mr-2 size-4" />}
              Envoyer
            </Button>

            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={sending}>
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
                  <Button onClick={() => handleSend(true)} className="w-full" disabled={sending}>
                    {sending ? <IconLoading className="mr-2 size-4" /> : null}
                    Programmer l&apos;envoi
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Historique */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Historique récent</h3>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={IconBell}
              title="Aucune notification"
              description="Envoyez votre première notification pour qu'elle apparaisse ici."
            />
          ) : (
            <AnimatedList className="max-h-[300px] overflow-y-auto">
              {history.slice(0, 10).map((notification) => {
                const config = statusConfig[notification.status]
                const StatusIcon = config.icon

                return (
                  <AnimatedListItem key={notification.id} className="p-3 bg-transparent border border-border/50">
                    <div className="flex items-start gap-3">
                      <StatusIcon className={cn("size-4 mt-0.5 shrink-0", config.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {getTargetLabel(notification)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.status === "PENDING" && notification.scheduledAt
                            ? `Programmée pour ${getRelativeTime(notification.scheduledAt)}`
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
