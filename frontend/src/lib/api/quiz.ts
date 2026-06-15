// API Quiz - Vodun Days Dashboard
import { api } from "./client"
import type { Quiz, QuizCreatePayload, QuizScope } from "@/lib/types/api"

type QuizQueryParams = {
  eventId?: string
  active?: boolean
  scope?: QuizScope
}

export async function getQuizzes(params?: QuizQueryParams) {
  const searchParams = new URLSearchParams()
  if (params?.eventId)              searchParams.set("eventId", params.eventId)
  if (params?.active !== undefined) searchParams.set("active", String(params.active))
  if (params?.scope)                searchParams.set("scope", params.scope)
  const query = searchParams.toString()
  return api.get<Quiz[]>(query ? `/quiz?${query}` : "/quiz")
}

// Endpoint dedie aux festivaliers : retourne uniquement les quiz actifs applicables
export async function getPublicQuizzes(eventId?: string) {
  const query = eventId ? `?eventId=${encodeURIComponent(eventId)}` : ""
  return api.get<Quiz[]>(`/quiz/public${query}`)
}

export async function getQuiz(id: string) {
  return api.get<Quiz>(`/quiz/${id}`)
}

export async function createQuiz(payload: QuizCreatePayload) {
  return api.post<Quiz>("/quiz", payload)
}

export async function updateQuiz(id: string, payload: Partial<QuizCreatePayload>) {
  return api.patch<Quiz>(`/quiz/${id}`, payload)
}

export async function deleteQuiz(id: string) {
  return api.delete<null>(`/quiz/${id}`)
}

export async function toggleQuizActive(id: string, active: boolean) {
  return api.patch<Quiz>(`/quiz/${id}`, { active })
}
