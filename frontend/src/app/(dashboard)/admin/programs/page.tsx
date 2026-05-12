"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageTransition } from "@/components/dashboard/page-transition"
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconClock,
  IconCalendar,
  IconLoading,
} from "@/components/icons"
import { toast } from "sonner"
import { getEvents } from "@/lib/api/events"
import { getPrograms, createProgram, updateProgram, deleteProgram } from "@/lib/api/programs"
import type { Event, Program, ProgramCreatePayload } from "@/lib/types/api"

export default function ProgramsPage() {
  // États principaux
  const [events, setEvents] = useState<Event[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [saving, setSaving] = useState(false)

  // États UI
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState<Partial<ProgramCreatePayload>>({})

  // Chargement initial des événements
  const loadEvents = useCallback(async () => {
    setLoading(true)
    const res = await getEvents()
    if (res.success) {
      setEvents(res.data)
    } else {
      toast.error(res.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Chargement des créneaux pour un événement
  const loadPrograms = async (eventId: string) => {
    setLoadingPrograms(true)
    const res = await getPrograms(eventId)
    if (res.success) {
      setPrograms(res.data)
    } else {
      toast.error(res.message)
    }
    setLoadingPrograms(false)
  }

  // Changement d'événement sélectionné
  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId)
    if (eventId) {
      loadPrograms(eventId)
    } else {
      setPrograms([])
    }
  }

  // Ouvrir le dialog d'ajout
  const handleOpenDialog = () => {
    setFormData({ eventId: selectedEventId })
    setDialogOpen(true)
  }

  // Ouvrir le sheet de modification
  const handleOpenSheet = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      eventId: program.eventId,
      startTime: format(new Date(program.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(program.endTime), "yyyy-MM-dd'T'HH:mm"),
    })
    setSheetOpen(true)
  }

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!formData.eventId || !formData.startTime || !formData.endTime) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return false
    }

    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)

    if (end <= start) {
      toast.error("La date de fin doit être après la date de début")
      return false
    }

    return true
  }

  // Créer un créneau
  const handleCreate = async () => {
    if (!validateForm()) return

    setSaving(true)
    const res = await createProgram({
      eventId: formData.eventId!,
      startTime: new Date(formData.startTime!).toISOString(),
      endTime: new Date(formData.endTime!).toISOString(),
    })

    if (res.success) {
      toast.success(res.message)
      setDialogOpen(false)
      setFormData({})
      if (selectedEventId) {
        await loadPrograms(selectedEventId)
      }
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Modifier un créneau
  const handleUpdate = async () => {
    if (!editingProgram || !validateForm()) return

    setSaving(true)
    const res = await updateProgram(editingProgram.id, {
      startTime: new Date(formData.startTime!).toISOString(),
      endTime: new Date(formData.endTime!).toISOString(),
    })

    if (res.success) {
      toast.success(res.message)
      setSheetOpen(false)
      setEditingProgram(null)
      setFormData({})
      if (selectedEventId) {
        await loadPrograms(selectedEventId)
      }
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Supprimer un créneau
  const handleDelete = async (programId: string) => {
    setSaving(true)
    const res = await deleteProgram(programId)
    if (res.success) {
      toast.success(res.message)
      if (selectedEventId) {
        await loadPrograms(selectedEventId)
      }
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  // Calcul de la durée
  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours === 0) return `${minutes}min`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}min`
  }

  // Formatage des dates
  const formatDateTime = (dateStr: string): string => {
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: fr })
  }

  // Obtenir le nom de l'événement
  const getEventName = (eventId: string): string => {
    const event = events.find((e) => e.id === eventId)
    return event?.name || "Événement inconnu"
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Créneaux horaires</h1>
            <p className="text-muted-foreground">Gérez les créneaux horaires des événements</p>
          </div>
          <Button onClick={handleOpenDialog} disabled={!selectedEventId || loading}>
            <IconPlus className="mr-2 size-4" />
            Ajouter un créneau
          </Button>
        </div>

        {/* Filtre événement */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="event-filter" className="shrink-0">Événement</Label>
            {loading ? (
              <Skeleton className="h-10 flex-1" />
            ) : (
              <Select value={selectedEventId} onValueChange={handleEventChange}>
                <SelectTrigger id="event-filter" className="flex-1 max-w-md">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Table des créneaux */}
        <div className="glass-card p-6">
          {!selectedEventId ? (
            <EmptyState
              icon={IconCalendar}
              title="Sélectionnez un événement"
              description="Choisissez un événement pour voir et gérer ses créneaux horaires."
            />
          ) : loadingPrograms ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : programs.length === 0 ? (
            <EmptyState
              icon={IconClock}
              title="Aucun créneau"
              description="Ajoutez le premier créneau pour cet événement."
              action={{ label: "Ajouter un créneau", onClick: handleOpenDialog }}
            />
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">Événement</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead className="hidden md:table-cell">Durée</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{getEventName(program.eventId)}</Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(program.startTime)}</TableCell>
                      <TableCell>{formatDateTime(program.endTime)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {calculateDuration(program.startTime, program.endTime)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleOpenSheet(program)}
                          >
                            <IconEdit className="size-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <ConfirmDialog
                            title="Supprimer le créneau"
                            description="Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible."
                            confirmLabel="Supprimer"
                            variant="destructive"
                            onConfirm={() => handleDelete(program.id)}
                            trigger={
                              <Button variant="ghost" size="icon" className="size-8">
                                <IconDelete className="size-4 text-destructive" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Dialog d'ajout */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un créneau</DialogTitle>
            <DialogDescription>
              Créez un nouveau créneau horaire pour l&apos;événement sélectionné.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-event">Événement *</Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) => setFormData({ ...formData, eventId: value })}
              >
                <SelectTrigger id="dialog-event">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dialog-start">Début *</Label>
                <Input
                  id="dialog-start"
                  type="datetime-local"
                  value={formData.startTime || ""}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dialog-end">Fin *</Label>
                <Input
                  id="dialog-end"
                  type="datetime-local"
                  value={formData.endTime || ""}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <IconLoading className="mr-2 size-4" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet de modification */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier le créneau</SheetTitle>
            <SheetDescription>
              Modifiez les horaires de ce créneau.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label>Événement</Label>
              <Input value={getEventName(formData.eventId || "")} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sheet-start">Début *</Label>
              <Input
                id="sheet-start"
                type="datetime-local"
                value={formData.startTime || ""}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheet-end">Fin *</Label>
              <Input
                id="sheet-end"
                type="datetime-local"
                value={formData.endTime || ""}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving && <IconLoading className="mr-2 size-4" />}
              Enregistrer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageTransition>
  )
}
