// API Sites - Vodun Days Dashboard
import { api } from "./client"
import type { GeoJSONPolygon, Site, SiteCreatePayload } from "@/lib/types/api"

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

// Récupère la zone géographique (polygone) d'un site
export async function getSiteZone(id: string) {
  return api.get<{ zoneGeo: GeoJSONPolygon | null }>(`/sites/${id}/zone`)
}

// Dessine/modifie la zone géographique d'un site - null pour l'effacer
export async function updateSiteZone(id: string, zoneGeo: GeoJSONPolygon | null) {
  return api.patch<{ zoneGeo: GeoJSONPolygon | null }>(`/sites/${id}/zone`, { zoneGeo })
}
