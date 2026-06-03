import { api } from "./client"

export type SurveyStats = {
  averageRating: number
  totalResponses: number
  satisfactionRate: number
  ratingDistribution: Record<string, number>
  trend: { date: string; count: number; avg: number }[]
}

export type SurveyCommentsResult = {
  comments: {
    id: string
    text: string
    question: string
    quiz: string
    event: string
    uuid: string | null
    createdAt: string
  }[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

export async function getSurveyStats(eventId?: string) {
  const q = eventId ? `?eventId=${eventId}` : ""
  return api.get<SurveyStats>(`/survey/stats${q}`)
}

export async function getSurveyComments(params?: {
  eventId?: string
  page?: number
  limit?: number
}) {
  const q = new URLSearchParams()
  if (params?.eventId) q.set("eventId", params.eventId)
  if (params?.page)    q.set("page",    String(params.page))
  if (params?.limit)   q.set("limit",   String(params.limit))
  const qs = q.toString()
  return api.get<SurveyCommentsResult>(qs ? `/survey/comments?${qs}` : "/survey/comments")
}

export async function exportSurveyCsv(eventId?: string): Promise<void> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  const q = eventId ? `?eventId=${eventId}` : ""
  const res = await fetch(`${API_BASE}/survey/export${q}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erreur lors de l'export")

  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = `survey_export_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
