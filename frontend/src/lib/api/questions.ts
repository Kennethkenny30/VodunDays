// API Questions - Vodun Days Dashboard
import { api } from "./client"
import type { Question, QuestionCreatePayload, QuestionType, Impression } from "@/lib/types/api"

// ─── Questions ────────────────────────────────────────────────────────────────

export async function getQuestions(quizId?: string) {
  const query = quizId ? `?quizId=${quizId}` : ""
  return api.get<Question[]>(`/questions${query}`)
}

export async function getQuestion(id: string) {
  return api.get<Question>(`/questions/${id}`)
}

export async function createQuestion(payload: QuestionCreatePayload) {
  return api.post<Question>("/questions", payload)
}

export async function updateQuestion(id: string, payload: Partial<QuestionCreatePayload>) {
  return api.patch<Question>(`/questions/${id}`, payload)
}

export async function deleteQuestion(id: string) {
  return api.delete<null>(`/questions/${id}`)
}

// ─── Types de questions ───────────────────────────────────────────────────────

export async function getQuestionTypes() {
  return api.get<QuestionType[]>("/questions-types")
}

export async function createQuestionType(types: string) {
  return api.post<QuestionType>("/questions-types", { types })
}

export async function deleteQuestionType(id: string) {
  return api.delete<null>(`/questions-types/${id}`)
}

// ─── Impressions ──────────────────────────────────────────────────────────────

export async function getImpressions() {
  return api.get<Impression[]>("/impressions")
}

export async function createImpression(payload: { name: string; emoji: string }) {
  return api.post<Impression>("/impressions", payload)
}

export async function deleteImpression(id: string) {
  return api.delete<null>(`/impressions/${id}`)
}

// ─── Choix (réponses possibles) ───────────────────────────────────────────────

export async function getChoices(questionId?: string) {
  const query = questionId ? `?questionId=${questionId}` : ""
  return api.get<{ id: string; wording: string; questionId: string }[]>(`/choices${query}`)
}

export async function createChoice(payload: { wording: string; questionId: string }) {
  return api.post<{ id: string; wording: string; questionId: string }>("/choices", payload)
}

export async function deleteChoice(id: string) {
  return api.delete<null>(`/choices/${id}`)
}
