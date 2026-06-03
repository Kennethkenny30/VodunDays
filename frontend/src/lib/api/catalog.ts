// API Event Types & Artists - Vodun Days Dashboard
import { api } from "./client"
import type { EventType, Artist } from "@/lib/types/api"

// ─── Event Types ──────────────────────────────────────────────────────────────

export async function getEventTypes() {
  return api.get<EventType[]>("/events-types")
}

export async function createEventType(name: string) {
  return api.post<EventType>("/events-types", { name })
}

export async function updateEventType(id: string, name: string) {
  return api.patch<EventType>(`/events-types/${id}`, { name })
}

export async function deleteEventType(id: string) {
  return api.delete<null>(`/events-types/${id}`)
}

// ─── Artists ──────────────────────────────────────────────────────────────────

export async function getArtists(eventId?: string) {
  const query = eventId ? `?eventId=${eventId}` : ""
  return api.get<Artist[]>(`/artists${query}`)
}

export async function createArtist(payload: { name: string; eventId: string }) {
  return api.post<Artist>("/artists", payload)
}

export async function updateArtist(id: string, payload: Partial<{ name: string; eventId: string }>) {
  return api.patch<Artist>(`/artists/${id}`, payload)
}

export async function deleteArtist(id: string) {
  return api.delete<null>(`/artists/${id}`)
}

// ─── Programs ─────────────────────────────────────────────────────────────────
export { getPrograms, getProgram, createProgram, updateProgram, deleteProgram } from "./programs"
