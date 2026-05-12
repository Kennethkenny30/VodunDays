"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  IconPlus,
  IconMore,
  IconEdit,
  IconDelete,
  IconCalendar,
  IconSearch,
  IconSend,
  IconClose,
  IconLoading,
} from "@/components/icons"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/api/events"
import { getSites } from "@/lib/api/sites"
import { getPrograms, createProgram, deleteProgram } from "@/lib/api/programs"
import { api } from "@/lib/api/client"
import type { Event, EventStatus, EventCreatePayload, Program, Site, EventType, ProgramCreatePayload } from "@/lib/types/api"

// Configuration des statuts
const statusConfig: Record<EventStatus, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-muted-foreground/10 text-muted-foreground" },
  PUBLISHED: { label: "Publié", color: "bg-green-500/10 text-green-500" },
  CANCELLED: { label: "Annulé", color: "bg-red-500/10 text-red-500" },
  ARCHIVED: { label: "Archivé", color: "bg-purple-500/10 text-purple-500" },
}

interface EventsManagerProps {
  className?: string
}

// Gestionnaire des événements avec API réelle
export function EventsManager({ className }: EventsManagerProps) {
  // États principaux
  const [events, setEvents] = useState<Event[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // États UI
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [formData, setFormData] = useState<Partial<EventCreatePayload>>({})

  // États créneaux dans le sheet
  const [eventPrograms, setEventPrograms] = useState<Program[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [newProgram, setNewProgram] = useState<Partial<ProgramCreatePayload>>({})

  // Chargement initial des données
  const loadData = useCallback(async () => {
    setLoading(true)
    const [eventsRes, sitesRes, typesRes] = await Promise.all([
      getEvents(),
      getSites(),
      api.get<EventType[]>("/event-types"),
    ])

    if (eventsRes.success) setEvents(eventsRes.data)
    else toast.error(eventsRes.message)

    if (sitesRes.success) setSites(sitesRes.data)
    else toast.error(sitesRes.message)

    if (typesRes.success) setEventTypes(typesRes.data)
    else toast.error(typesRes.message)

    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Chargement des créneaux pour un événement
  const loadEventPrograms = async (eventId: string) => {
    setLoadingPrograms(true)
    const res = await getPrograms(eventId)
    if (res.success) {
      setEventPrograms(res.data)
    } else {
      toast.error(res.message)
    }
    setLoadingPrograms(false)
  }

  // Filtrage côté client
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter
    const matchesType = typeFilter === "ALL" || event.eventTypeId === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Ouvrir le sheet
  const handleOpenSheet = async (event?: Event) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        name: event.name,
        description: event.description || "",
        status: event.status,
        siteId: event.siteId,
        eventTypeId: event.eventTypeId,
      })
      await loadEventPrograms(event.id)
    } else {
      setEditingEvent(null)
      setFormData({ status: "DRAFT" })
      setEventPrograms([])
    }
    setNewProgram({})
    setSheetOpen(true)
  }

  // Ajouter un créneau
  const handleAddProgram = async () => {
    if (!editingEvent?.id || !newProgram.startTime || !newProgram.endTime) {
      toast.error("Veuillez remplir les dates de début et fin")
      return
    }

    setSaving(true)
    const res = await createProgram({
      eventId: editingEvent.id,
      startTime: new Date(newProgram.startTime).toISOString(),
      endTime: new Date(newProgram.endTime).toISOString(),
    })

    if (res.success) {
      toast.success(res.message)
      setEventPrograms([...eventPrograms, res.data])
      setNewProgram({})
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Supprimer un créneau
  const handleDeleteProgram = async (programId: string) => {
    setSaving(true)
    const res = await deleteProgram(programId)
    if (res.success) {
      toast.success(res.message)
      setEventPrograms(eventPrograms.filter((p) => p.id !== programId))
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Sauvegarder événement
  const handleSave = async (publish: boolean = false) => {
    if (!formData.name || !formData.siteId || !formData.eventTypeId) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const status = publish ? "PUBLISHED" : formData.status || "DRAFT"
    const payload: EventCreatePayload = {
      name: formData.name,
      description: formData.description,
      status: status as EventStatus,
      siteId: formData.siteId,
      eventTypeId: formData.eventTypeId,
    }

    setSaving(true)
    if (editingEvent) {
      const res = await updateEvent(editingEvent.id, payload)
      if (res.success) {
        toast.success(res.message)
        await loadData()
        setSheetOpen(false)
      } else {
        toast.error(res.message)
      }
    } else {
      const res = await createEvent(payload)
      if (res.success) {
        toast.success(res.message)
        await loadData()
        setSheetOpen(false)
      } else {
        toast.error(res.message)
      }
    }
    setSaving(false)
  }

  // Publier événement
  const handlePublish = async (id: string) => {
    setSaving(true)
    const res = await updateEvent(id, { status: "PUBLISHED" })
    if (res.success) {
      toast.success(res.message)
      await loadData()
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Supprimer événement
  const handleDelete = async (id: string) => {
    setSaving(true)
    const res = await deleteEvent(id)
    if (res.success) {
      toast.success(res.message)
      await loadData()
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Formatage des créneaux
  const formatProgramTime = (program: Program) => {
    const start = format(new Date(program.startTime), "dd/MM HH:mm", { locale: fr })
    const end = format(new Date(program.endTime), "HH:mm", { locale: fr })
    return `${start} - ${end}`
  }

  return (
    <div className={cn("glass-card p-6", className)} id="events">
      {/* En-tête avec filtres */}
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
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => handleOpenSheet()} size="sm" disabled={loading}>
            <IconPlus className="mr-2 size-4" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Tabs pour la vue */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Tableau</TabsTrigger>
          <TabsTrigger value="calendar" disabled>
            Calendrier
          </TabsTrigger>
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
              action={{ label: "Créer un événement", onClick: () => handleOpenSheet() }}
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
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{event.eventType?.name || "-"}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{event.site?.name || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[event.status].color}>
                          {statusConfig[event.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{event.programs?.length ?? 0}</span>
                          </TooltipTrigger>
                          {event.programs && event.programs.length > 0 && (
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-1">
                                {event.programs.map((p) => (
                                  <p key={p.id} className="text-xs">
                                    {formatProgramTime(p)}
                                  </p>
                                ))}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <IconMore className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenSheet(event)}>
                              <IconEdit className="mr-2 size-4" />
                              Modifier
                            </DropdownMenuItem>
                            {event.status === "DRAFT" && (
                              <ConfirmDialog
                                title="Publier l'événement"
                                description={`Êtes-vous sûr de vouloir publier "${event.name}" ? Il sera visible par les utilisateurs.`}
                                confirmLabel="Publier"
                                onConfirm={() => handlePublish(event.id)}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <IconSend className="mr-2 size-4" />
                                    Publier
                                  </DropdownMenuItem>
                                }
                              />
                            )}
                            <ConfirmDialog
                              title="Supprimer l'événement"
                              description={`Êtes-vous sûr de vouloir supprimer "${event.name}" ? Cette action est irréversible.`}
                              confirmLabel="Supprimer"
                              variant="destructive"
                              onConfirm={() => handleDelete(event.id)}
                              trigger={
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <IconDelete className="mr-2 size-4" />
                                  Supprimer
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

      {/* Sheet de création/édition */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingEvent ? "Modifier l'événement" : "Nouvel événement"}</SheetTitle>
            <SheetDescription>
              {editingEvent
                ? "Modifiez les informations de l'événement"
                : "Créez un nouvel événement pour le festival"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Section Informations */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informations</h3>

              <div className="space-y-2">
                <Label htmlFor="event-name">Nom de l&apos;événement *</Label>
                <Input
                  id="event-name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom de l'événement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Type *</Label>
                  <Select
                    value={formData.eventTypeId}
                    onValueChange={(value) => setFormData({ ...formData, eventTypeId: value })}
                  >
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-site">Site *</Label>
                  <Select
                    value={formData.siteId}
                    onValueChange={(value) => setFormData({ ...formData, siteId: value })}
                  >
                    <SelectTrigger id="event-site">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as EventStatus })}
                >
                  <SelectTrigger id="event-status">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="PUBLISHED">Publié</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                    <SelectItem value="ARCHIVED">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section Créneaux (uniquement en édition) */}
            {editingEvent && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Créneaux horaires</h3>

                  {loadingPrograms ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      {/* Liste des créneaux existants */}
                      {eventPrograms.length > 0 && (
                        <div className="space-y-2">
                          {eventPrograms.map((program) => (
                            <div
                              key={program.id}
                              className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
                            >
                              <span className="text-sm">{formatProgramTime(program)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => handleDeleteProgram(program.id)}
                                disabled={saving}
                              >
                                <IconClose className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulaire ajout créneau */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Début</Label>
                          <Input
                            type="datetime-local"
                            value={newProgram.startTime || ""}
                            onChange={(e) => setNewProgram({ ...newProgram, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Fin</Label>
                          <Input
                            type="datetime-local"
                            value={newProgram.endTime || ""}
                            onChange={(e) => setNewProgram({ ...newProgram, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddProgram}
                        disabled={saving || !newProgram.startTime || !newProgram.endTime}
                        className="w-full"
                      >
                        <IconPlus className="mr-2 size-4" />
                        Ajouter un créneau
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => handleSave(false)} disabled={saving}>
              {saving && <IconLoading className="mr-2 size-4" />}
              Enregistrer
            </Button>
            {formData.status === "DRAFT" && (
              <Button onClick={() => handleSave(true)} disabled={saving} variant="secondary">
                {saving && <IconLoading className="mr-2 size-4" />}
                Publier
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
