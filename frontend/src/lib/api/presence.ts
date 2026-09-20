// API Présence - Vodun Days (statistiques de fréquentation, Phase 2)
import { api } from "./client"

export type PresencePingPayload = {
  uuid: string
  latitude: number
  longitude: number
}

export type PresencePingResult = {
  siteId: string | null
}

export type OnlineNowStats = {
  windowMinutes: number
  total: number
  unassigned: number
  bySite: Record<string, number>
}

// Envoie un ping de présence (position GPS courante du festivalier) - public
export async function sendPresencePing(payload: PresencePingPayload) {
  return api.post<PresencePingResult>("/presence", payload)
}

// Festivaliers en ligne maintenant + répartition par site (ADMIN/SUPER_ADMIN)
export async function getOnlineNow() {
  return api.get<OnlineNowStats>("/presence/online")
}
