// API Programs (créneaux horaires) - Vodun Days Dashboard
import { api } from "./client"
import type { Program, ProgramCreatePayload } from "@/lib/types/api"

// Récupère les créneaux d'un événement
export async function getPrograms(eventId: string) {
  return api.get<Program[]>(`/programs?eventId=${eventId}`)
}

// Crée un nouveau créneau
export async function createProgram(payload: ProgramCreatePayload) {
  return api.post<Program>("/programs", payload)
}

// Met à jour un créneau
export async function updateProgram(id: string, payload: Partial<ProgramCreatePayload>) {
  return api.patch<Program>(`/programs/${id}`, payload)
}

// Supprime un créneau
export async function deleteProgram(id: string) {
  return api.delete<null>(`/programs/${id}`)
}
