import { api } from "./client"

export type PresenceBySite = {
  siteId:   string
  name:     string
  category: string | null
  count:    number
}

export type PlatformStats = {
  uptime: { days: number; hours: number; minutes: number; ms: number }
  users:  { total: number; active: number; recentLogins: number }
  content: { sites: number; events: number; publishedEvents: number; quiz: number; activeQuiz: number }
  engagement: { totalAnswers: number; answersLast24h: number; answersLast7d: number }
  security:   { openAlerts: number; totalAlerts: number; alertsLast24h: number; auditLast24h: number }
  presence:   { windowMinutes: number; onlineNow: number; unassigned: number; bySite: PresenceBySite[] }
}

export type PlatformActivity = {
  id: string; action: string; module: string
  description: string; userName: string | null
  ipAddress: string | null; createdAt: string
  metadata: Record<string, unknown> | null
}

export type ActivityFilters = {
  limit?: number
  module?: string
  action?: string
}

type HealthCheck = {
  status: "healthy" | "degraded"
  checks: Record<string, string>
  timestamp: string
  uptime: number
}

export type PlatformSettingFamily = "modules" | "incidents"

export type PlatformSetting = {
  key:           string
  family:        PlatformSettingFamily
  enabled:       boolean
  updatedAt:     string | null
  updatedByName: string | null
}

export async function getPlatformStats() {
  return api.get<PlatformStats>("/platform/stats")
}

export async function getPlatformActivity(filters?: ActivityFilters) {
  const params = new URLSearchParams()
  if (filters?.limit)  params.set("limit",  String(filters.limit))
  if (filters?.module) params.set("module", filters.module)
  if (filters?.action) params.set("action", filters.action)
  const q = params.size ? `?${params.toString()}` : ""
  return api.get<PlatformActivity[]>(`/platform/activity${q}`)
}

export async function getPlatformHealth() {
  return api.get<HealthCheck>("/platform/health")
}

export async function getPlatformSettings() {
  return api.get<PlatformSetting[]>("/platform/settings")
}

// NB : je n'ai pas ./client.ts, donc pas de confirmation que `api.patch`
// existe. Si ton client n'expose que get/post/put/delete, remplace par la
// méthode équivalente (ex: api.put) - la route backend reste un PATCH.
export async function updatePlatformSetting(key: string, enabled: boolean) {
  return api.patch<PlatformSetting>(`/platform/settings/${key}`, { enabled })
}