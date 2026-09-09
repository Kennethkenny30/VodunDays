// API Onboarding - profil festivalier anonyme (popup premiere ouverture)
import { api } from "./client"
import type { Festivalier, FestivalierPayload } from "@/lib/types/api"

// Renvoie null si aucun profil n'existe encore pour cet uuid (premiere visite)
export async function getFestivalierProfile(uuid: string) {
  return api.get<Festivalier | null>(`/onboarding/${uuid}`)
}

export async function completeOnboarding(uuid: string, payload: FestivalierPayload) {
  return api.post<Festivalier>(`/onboarding/${uuid}`, payload)
}
