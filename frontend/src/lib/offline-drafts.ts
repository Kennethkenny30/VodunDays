/**
 * offline-drafts.ts
 * Persistance localStorage des événements créés hors ligne.
 * Clé unique : "vd_offline_drafts"
 */

import type { EventCreatePayload } from "@/lib/types/api"

export const OFFLINE_DRAFTS_KEY = "vd_offline_drafts"

export interface OfflineDraft {
  /** ID local préfixé "local-" — jamais envoyé au backend tel quel */
  id:          string
  /** Toujours DRAFT tant qu'il n'est pas synchronisé */
  status:      "DRAFT"
  /** true = cet enregistrement n'existe pas encore côté backend */
  offlinePending: true
  createdAt:   string   // ISO string
  name:        string
  description?: string
  siteId:      string
  eventTypeId: string
  imageUrl?:   string
  slots: Array<{ id: string; startTime: string; endTime: string }>
}

// ── Lecture ────────────────────────────────────────────────────────────────────

export function getOfflineDrafts(): OfflineDraft[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(OFFLINE_DRAFTS_KEY)
    return raw ? (JSON.parse(raw) as OfflineDraft[]) : []
  } catch {
    return []
  }
}

// ── Écriture ───────────────────────────────────────────────────────────────────

export function saveOfflineDraft(draft: OfflineDraft): void {
  if (typeof window === "undefined") return
  const drafts = getOfflineDrafts()
  const idx = drafts.findIndex((d) => d.id === draft.id)
  if (idx >= 0) drafts[idx] = draft
  else drafts.push(draft)
  localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(drafts))
}

// ── Suppression ────────────────────────────────────────────────────────────────

export function removeOfflineDraft(id: string): void {
  if (typeof window === "undefined") return
  const drafts = getOfflineDrafts().filter((d) => d.id !== id)
  localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(drafts))
}

// ── Conversion → Event (shape compatible avec le type API) ─────────────────────
// sites et eventTypes sont passés depuis EventsManager pour reconstruire les objets liés
// (nécessaire pour afficher type et site dans le tableau sans appel API)

export function offlineDraftToEvent(
  d: OfflineDraft,
  sites: import("@/lib/types/api").Site[]         = [],
  eventTypes: import("@/lib/types/api").EventType[] = [],
): import("@/lib/types/api").Event {
  const site      = sites.find((s) => s.id === d.siteId)
  const eventType = eventTypes.find((t) => t.id === d.eventTypeId)
  return {
    id:             d.id,
    name:           d.name,
    description:    d.description,
    status:         "DRAFT",
    siteId:         d.siteId,
    eventTypeId:    d.eventTypeId,
    imageUrl:       d.imageUrl,
    offlinePending: true,
    site,
    eventType,
    programs: d.slots.map((s) => ({
      id:        s.id,
      eventId:   d.id,
      startTime: s.startTime,
      endTime:   s.endTime,
    })),
  } as import("@/lib/types/api").Event
}

// ── Mise à jour partielle ──────────────────────────────────────────────────────

export function updateOfflineDraft(id: string, patch: Partial<Omit<OfflineDraft, "id" | "offlinePending">>): void {
  if (typeof window === "undefined") return
  const drafts = getOfflineDrafts()
  const idx = drafts.findIndex((d) => d.id === id)
  if (idx < 0) return
  drafts[idx] = { ...drafts[idx], ...patch }
  localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(drafts))
}

// ── Payload pour createEvent ───────────────────────────────────────────────────

export function offlineDraftToPayload(d: OfflineDraft): EventCreatePayload {
  return {
    name:        d.name,
    description: d.description,
    status:      "DRAFT",
    siteId:      d.siteId,
    eventTypeId: d.eventTypeId,
    ...(d.imageUrl ? { imageUrl: d.imageUrl } : {}),
  }
}