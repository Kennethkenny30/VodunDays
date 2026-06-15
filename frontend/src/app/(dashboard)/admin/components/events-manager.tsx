"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { EventCreateModal } from "./EventCreateModal"
import {
  Eye,
  MoreHorizontal,
  Pencil,
  WifiOff,
} from "lucide-react"
import {
  IconCalendar,
  IconDelete,
  IconPlus,
  IconSearch,
  IconSend,
} from "@/components/icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { getEvents, updateEvent, deleteEvent } from "@/lib/api/events"
import { getSites } from "@/lib/api/sites"
import { api } from "@/lib/api/client"
import {
  getOfflineDrafts,
  offlineDraftToEvent,
  offlineDraftToPayload,
  removeOfflineDraft,
  updateOfflineDraft,
} from "@/lib/offline-drafts"
import type {
  Event,
  EventStatus,
  EventType,
  Program,
  Site,
} from "@/lib/types/api"

// ─── Config statuts ───────────────────────────────────────────────────────────

const statusConfig: Record<EventStatus, { label: string; color: string }> = {
  DRAFT:     { label: "Brouillon", color: "bg-muted-foreground/10 text-muted-foreground" },
  PUBLISHED: { label: "Publié",    color: "bg-green-500/10 text-green-500"               },
  CANCELLED: { label: "Annulé",   color: "bg-red-500/10 text-red-500"                   },
  ARCHIVED:  { label: "Archivé",  color: "bg-purple-500/10 text-purple-500"              },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatProgramTime(p: Program) {
  try {
    const start = format(new Date(p.startTime), "dd MMM yyyy, HH:mm", { locale: fr })
    const end   = format(new Date(p.endTime),   "HH:mm",               { locale: fr })
    return `${start} → ${end}`
  } catch { return `${p.startTime} → ${p.endTime}` }
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface EventsManagerProps {
  className?: string
}

export function EventsManager({ className }: EventsManagerProps) {
  const [events,     setEvents]     = useState<Event[]>([])
  const [sites,      setSites]      = useState<Site[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)

  const [modalOpen,     setModalOpen]     = useState(false)
  const [editingEvent,  setEditingEvent]  = useState<Event | null>(null)
  const [previewEvent,  setPreviewEvent]  = useState<Event | null>(null)
  const [searchQuery,   setSearchQuery]   = useState("")
  const [statusFilter,  setStatusFilter]  = useState<EventStatus | "ALL">("ALL")
  const [typeFilter,    setTypeFilter]    = useState<string>("ALL")

  // ── Chargement des données ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsRes, sitesRes, typesRes] = await Promise.allSettled([
        getEvents(),
        getSites(),
        api.get<EventType[]>("/events-types"),
      ])

      let backendEvents: Event[] = []

      if (eventsRes.status === "fulfilled" && eventsRes.value.success) {
        backendEvents = eventsRes.value.data ?? []
      }

      if (sitesRes.status === "fulfilled" && sitesRes.value.success) {
        setSites(sitesRes.value.data ?? [])
      }
      if (typesRes.status === "fulfilled" && typesRes.value.success) {
        setEventTypes(typesRes.value.data ?? [])
      }

      // ── Sync automatique des brouillons offline ──────────────────────────
      const offlineDrafts = getOfflineDrafts()
      const syncedIds: string[] = []

      if (backendEvents.length >= 0 && offlineDrafts.length > 0) {
        // Backend accessible - on tente de synchroniser chaque draft
        await Promise.allSettled(
          offlineDrafts.map(async (draft) => {
            try {
              const res = await (await import("@/lib/api/events")).createEvent(offlineDraftToPayload(draft))
              if (res.success && res.data?.id) {
                // Sync des créneaux si nécessaire
                if (draft.slots.length > 0) {
                  const { createProgram } = await import("@/lib/api/programs")
                  await Promise.allSettled(
                    draft.slots.map((s) =>
                      createProgram({ eventId: res.data.id, startTime: s.startTime, endTime: s.endTime } as import("@/lib/types/api").ProgramCreatePayload)
                    )
                  )
                }
                syncedIds.push(draft.id)
              }
            } catch { /* Draft reste en attente */ }
          })
        )
        // Nettoyer les drafts synchronisés
        syncedIds.forEach(removeOfflineDraft)
        if (syncedIds.length > 0) {
          toast.success(`${syncedIds.length} brouillon${syncedIds.length > 1 ? "s" : ""} synchronisé${syncedIds.length > 1 ? "s" : ""}`)
          // Recharger les events depuis le backend après sync
          const fresh = await getEvents()
          if (fresh.success) backendEvents = fresh.data ?? []
        }
      }

      // ── Fusion : events backend + brouillons encore offline ──────────────
      const remainingDrafts = getOfflineDrafts()
      // On capture sites/eventTypes au moment de la fusion pour reconstruire les objets liés
      setSites((currentSites) => {
        setEventTypes((currentTypes) => {
          const offlineEvents = remainingDrafts.map((d) => offlineDraftToEvent(d, currentSites, currentTypes))
          setEvents([...backendEvents, ...offlineEvents])
          return currentTypes
        })
        return currentSites
      })

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter
    const matchesType   = typeFilter   === "ALL" || event.eventTypeId === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleOpen = (event?: Event) => {
    setEditingEvent(event ?? null)
    setModalOpen(true)
  }

  const handlePublish = async (id: string) => {
    setSaving(true)
    try {
      const res = await updateEvent(id, { status: "PUBLISHED" })
      if (res.success) { toast.success(res.message); await loadData() }
      else toast.error(res.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Brouillon offline - suppression directe dans localStorage
    if (id.startsWith("local-")) {
      removeOfflineDraft(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success("Brouillon supprimé")
      return
    }
    setSaving(true)
    try {
      const res = await deleteEvent(id)
      if (res.success) { toast.success(res.message); await loadData() }
      else toast.error(res.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cn("glass-card p-6", className)} id="events">

      {/* En-tête + filtres */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Événements</h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EventStatus | "ALL")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="DRAFT">Brouillons</SelectItem>
              <SelectItem value="PUBLISHED">Publiés</SelectItem>
              <SelectItem value="CANCELLED">Annulés</SelectItem>
              <SelectItem value="ARCHIVED">Archivés</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Le bouton reste toujours cliquable */}
          <Button
            onClick={() => handleOpen()}
            size="sm"
            className="bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
          >
            <IconPlus className="mr-2 size-4" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Tableau</TabsTrigger>
          <TabsTrigger value="calendar" disabled>Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={IconCalendar}
              title="Aucun événement trouvé"
              description="Créez votre premier événement pour commencer à construire le programme du festival."
              action={{ label: "Créer un événement", onClick: () => handleOpen() }}
            />
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Site</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Créneaux</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="group">
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{event.eventType?.name || "-"}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{event.site?.name || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge className={statusConfig[event.status].color}>
                            {statusConfig[event.status].label}
                          </Badge>
                          {(event as Event & { offlinePending?: boolean }).offlinePending && (
                            <span title="Non synchronisé">
                              <WifiOff className="size-3 text-amber-400" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-sm tabular-nums">
                              {event.programs?.length ?? 0}
                            </span>
                          </TooltipTrigger>
                          {event.programs && event.programs.length > 0 && (
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-1">
                                {event.programs.map((p) => (
                                  <p key={p.id} className="text-xs">{formatProgramTime(p)}</p>
                                ))}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewEvent(event)}>
                              <Eye className="mr-2 size-4" /> Aperçu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpen(event)}>
                              <Pencil className="mr-2 size-4" /> Modifier
                            </DropdownMenuItem>

                            {event.status === "DRAFT" && (
                              <ConfirmDialog
                                title="Publier l'événement"
                                description={`Êtes-vous sûr de vouloir publier "${event.name}" ? Il sera visible par les utilisateurs.`}
                                confirmLabel="Publier"
                                onConfirm={() => handlePublish(event.id)}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <IconSend className="mr-2 size-4" /> Publier
                                  </DropdownMenuItem>
                                }
                              />
                            )}

                            <DropdownMenuSeparator />

                            <ConfirmDialog
                              title="Supprimer l'événement"
                              description={`Êtes-vous sûr de vouloir supprimer "${event.name}" ? Cette action est irréversible.`}
                              confirmLabel="Supprimer"
                              variant="destructive"
                              onConfirm={() => handleDelete(event.id)}
                              trigger={
                                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                                  <IconDelete className="mr-2 size-4" /> Supprimer
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <EmptyState
            icon={IconCalendar}
            title="Vue calendrier"
            description="La vue calendrier sera disponible prochainement."
          />
        </TabsContent>
      </Tabs>

      {/* Modal création + édition */}
      <EventCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingEvent={editingEvent}
        sites={sites}
        eventTypes={eventTypes}
        onEventTypeCreated={(t) => setEventTypes((prev) => [...prev, t])}
        onDone={loadData}
      />

      {/* Sheet aperçu */}
      <EventPreviewSheet
        event={previewEvent}
        onClose={() => setPreviewEvent(null)}
        onEdit={() => { setPreviewEvent(null); handleOpen(previewEvent!) }}
        onPublish={previewEvent ? () => handlePublish(previewEvent.id) : undefined}
        onDelete={previewEvent ? () => { setPreviewEvent(null); handleDelete(previewEvent.id) } : undefined}
      />
    </div>
  )
}

// ─── EventPreviewSheet ────────────────────────────────────────────────────────

interface EventPreviewSheetProps {
  event:      Event | null
  onClose:    () => void
  onEdit:     () => void
  onPublish?: () => void
  onDelete?:  () => void
}

function EventPreviewSheet({ event, onClose, onEdit, onPublish, onDelete }: EventPreviewSheetProps) {
  if (!event) return null
  const cfg        = statusConfig[event.status]
  const isOffline  = (event as Event & { offlinePending?: boolean }).offlinePending === true
  const slotCount  = event.programs?.length ?? 0

  return (
    <Sheet open={!!event} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col bg-[oklch(0.12_0.018_260/0.98)] border-white/[0.08]"
      >
        {/* Image / bandeau */}
        <div className="relative h-[180px] shrink-0 bg-gradient-to-br from-[var(--vd-gold)]/15 to-transparent overflow-hidden">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover opacity-75" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconCalendar className="size-12 text-white/10" />
            </div>
          )}
          {/* Dégradé bas */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(0.12_0.018_260/0.98)] to-transparent" />
          {/* Badge statut */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
              "border border-white/10 bg-black/50 backdrop-blur-sm",
              cfg.color,
            )}>
              <span className={cn("size-1.5 rounded-full shrink-0", {
                "bg-muted-foreground": event.status === "DRAFT",
                "bg-green-500":        event.status === "PUBLISHED",
                "bg-red-500":          event.status === "CANCELLED",
                "bg-purple-500":       event.status === "ARCHIVED",
              })} />
              {cfg.label}
            </span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border border-amber-400/30 bg-amber-400/10 text-amber-400 backdrop-blur-sm">
                <WifiOff className="size-3" /> Hors ligne
              </span>
            )}
          </div>
        </div>

        {/* Corps scrollable */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 space-y-6">

            {/* Titre + header */}
            <SheetHeader className="space-y-1 text-left">
              <SheetTitle className="text-lg font-semibold leading-snug">{event.name}</SheetTitle>
              {event.description && (
                <p className="text-[13px] text-muted-foreground/70 leading-relaxed">{event.description}</p>
              )}
            </SheetHeader>

            <Separator className="bg-white/[0.07]" />

            {/* Métadonnées */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Informations</p>
              <dl className="space-y-2.5">
                {[
                  { label: "Type",    value: event.eventType?.name },
                  { label: "Site",    value: event.site?.name      },
                  { label: "Créneaux", value: slotCount > 0 ? `${slotCount} créneau${slotCount > 1 ? "x" : ""}` : undefined },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-[13px]">
                    <dt className="w-20 shrink-0 text-muted-foreground/50">{label}</dt>
                    <dd className={cn("font-medium", value ? "text-foreground/80" : "text-muted-foreground/25 italic")}>
                      {value ?? "-"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Créneaux */}
            {event.programs && event.programs.length > 0 && (
              <>
                <Separator className="bg-white/[0.07]" />
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Créneaux horaires</p>
                  <div className="space-y-2">
                    {event.programs.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[12px]">
                        <span className="size-5 rounded-md bg-[var(--vd-gold)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--vd-gold)] shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-foreground/70">{formatProgramTime(p)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="flex-none px-6 py-4 border-t border-white/[0.07] flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-9 text-[13px] border-white/12 hover:border-white/20 hover:bg-white/[0.04]"
          >
            <Pencil className="size-3.5 mr-1.5" /> Modifier
          </Button>
          {event.status === "DRAFT" && onPublish && (
            <ConfirmDialog
              title="Publier l'événement"
              description={`Êtes-vous sûr de vouloir publier "${event.name}" ?`}
              confirmLabel="Publier"
              onConfirm={() => { onPublish(); onClose() }}
              trigger={
                <Button size="sm" className="flex-1 h-9 text-[13px] bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90">
                  <IconSend className="size-3.5 mr-1.5" /> Publier
                </Button>
              }
            />
          )}
          {onDelete && (
            <ConfirmDialog
              title="Supprimer l'événement"
              description={`Supprimer "${event.name}" ? Cette action est irréversible.`}
              confirmLabel="Supprimer"
              variant="destructive"
              onConfirm={onDelete}
              trigger={
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10">
                  <IconDelete className="size-4" />
                </Button>
              }
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}