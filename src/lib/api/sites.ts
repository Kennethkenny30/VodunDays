// API Sites - Vodun Days Dashboard
import { api } from "./client"
import type { Site, SiteCreatePayload } from "@/lib/types/api"

// Récupère la liste des sites
export async function getSites() {
  return api.get<Site[]>("/sites")
}

// Récupère un site par son ID
export async function getSite(id: string) {
  return api.get<Site>(`/sites/${id}`)
}

// Crée un nouveau site
export async function createSite(payload: SiteCreatePayload) {
  return api.post<Site>("/sites", payload)
}

// Met à jour un site
export async function updateSite(id: string, payload: Partial<SiteCreatePayload>) {
  return api.patch<Site>(`/sites/${id}`, payload)
}

// Supprime un site
export async function deleteSite(id: string) {
  return api.delete<null>(`/sites/${id}`)
}
