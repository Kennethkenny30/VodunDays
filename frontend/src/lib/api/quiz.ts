// API Quiz - Vodun Days Dashboard
import { api } from "./client"
import type { Quiz, QuizCreatePayload } from "@/lib/types/api"

type QuizQueryParams = {
  eventId?: string
  active?: boolean
}

export async function getQuizzes(params?: QuizQueryParams) {
  const searchParams = new URLSearchParams()
  if (params?.eventId) searchParams.set("eventId", params.eventId)
  if (params?.active !== undefined) searchParams.set("active", String(params.active))
  const query = searchParams.toString()
  return api.get<Quiz[]>(query ? `/quiz?${query}` : "/quiz")
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
