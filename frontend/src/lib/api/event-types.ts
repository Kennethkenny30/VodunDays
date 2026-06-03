// API Event Types - Vodun Days Dashboard
import { api } from "./client"
import type { EventType } from "@/lib/types/api"

// Récupère la liste de tous les types d'événement
export async function getEventTypes() {
  return api.get<EventType[]>("/events-types")
}

// Récupère un type d'événement par son ID
export async function getEventType(id: string) {
  return api.get<EventType>(`/events-types/${id}`)
}

// Crée un nouveau type d'événement (SUPER_ADMIN uniquement)
export async function createEventType(name: string) {
  return api.post<EventType>("/events-types", { name })
}

// Met à jour un type d'événement (SUPER_ADMIN uniquement)
export async function updateEventType(id: string, name: string) {
  return api.patch<EventType>(`/events-types/${id}`, { name })
}

// Supprime un type d'événement (SUPER_ADMIN uniquement)
export async function deleteEventType(id: string) {
  return api.delete<null>(`/events-types/${id}`)
}