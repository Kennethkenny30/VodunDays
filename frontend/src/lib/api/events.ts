// API Events - Vodun Days Dashboard
import { api } from "./client"
import type { Event, EventCreatePayload, EventStatus } from "@/lib/types/api"

type EventsQueryParams = {
  siteId?: string
  status?: EventStatus
  eventTypeId?: string
}

// Récupère la liste des événements
export async function getEvents(params?: EventsQueryParams) {
  const searchParams = new URLSearchParams()
  if (params?.siteId) searchParams.set("siteId", params.siteId)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.eventTypeId) searchParams.set("eventTypeId", params.eventTypeId)

  const query = searchParams.toString()
  const endpoint = query ? `/events?${query}` : "/events"

  return api.get<Event[]>(endpoint)
}

// Récupère un événement par son ID
export async function getEvent(id: string) {
  return api.get<Event>(`/events/${id}`)
}

// Crée un nouvel événement
export async function createEvent(payload: EventCreatePayload) {
  return api.post<Event>("/events", payload)
}

// Met à jour un événement
export async function updateEvent(id: string, payload: Partial<EventCreatePayload>) {
  return api.patch<Event>(`/events/${id}`, payload)
}

// Supprime un événement
export async function deleteEvent(id: string) {
  return api.delete<null>(`/events/${id}`)
}

// Change le statut d'un événement
export async function updateEventStatus(id: string, status: EventStatus) {
  return api.patch<Event>(`/events/${id}`, { status })
}
