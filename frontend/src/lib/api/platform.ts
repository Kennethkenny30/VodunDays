import { api } from "./client"

export type PlatformStats = {
  uptime: { days: number; hours: number; minutes: number; ms: number }
  users:  { total: number; active: number; recentLogins: number }
  content: { sites: number; events: number; publishedEvents: number; quiz: number; activeQuiz: number }
  engagement: { totalAnswers: number; answersLast24h: number; answersLast7d: number }
  security:   { openAlerts: number; totalAlerts: number; alertsLast24h: number; auditLast24h: number }
}

export type PlatformActivity = {
  id: string; action: string; module: string
  description: string; userName: string | null
  ipAddress: string | null; createdAt: string
}

type HealthCheck = {
  status: "healthy" | "degraded"
  checks: Record<string, string>
  timestamp: string
  uptime: number
}

export async function getPlatformStats() {
  return api.get<PlatformStats>("/platform/stats")
}

export async function getPlatformActivity(limit?: number) {
  const q = limit ? `?limit=${limit}` : ""
  return api.get<PlatformActivity[]>(`/platform/activity${q}`)
}

export async function getPlatformHealth() {
  return api.get<HealthCheck>("/platform/health")
}
