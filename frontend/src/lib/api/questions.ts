// API Questions - Vodun Days Dashboard
import { api } from "./client"
import type { Question, QuestionCreatePayload, QuestionType, QuestionKind, Impression, Choice } from "@/lib/types/api"

// Questions

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

export async function reorderQuestions(orderedIds: string[]) {
  return api.patch<null>("/questions/reorder", { ids: orderedIds })
}

// Types de questions

export async function getQuestionTypes() {
  return api.get<QuestionType[]>("/questions-types")
}

export async function createQuestionType(types: string, kind: QuestionKind) {
  return api.post<QuestionType>("/questions-types", { types, kind })
}

export async function updateQuestionType(id: string, types: string, kind: QuestionKind) {
  return api.patch<QuestionType>(`/questions-types/${id}`, { types, kind })
}

export async function deleteQuestionType(id: string) {
  return api.delete<null>(`/questions-types/${id}`)
}

// Impressions

export async function getImpressions() {
  return api.get<Impression[]>("/impressions")
}

export async function createImpression(payload: { name: string; emoji: string }) {
  return api.post<Impression>("/impressions", payload)
}

export async function deleteImpression(id: string) {
  return api.delete<null>(`/impressions/${id}`)
}

// Choix (options QCM)

export async function getChoices(questionId?: string) {
  const query = questionId ? `?questionId=${questionId}` : ""
  return api.get<Choice[]>(`/choices${query}`)
}

export async function createChoice(payload: { wording: string; questionId: string }) {
  return api.post<Choice>("/choices", payload)
}

export async function updateChoice(id: string, payload: { wording: string }) {
  return api.patch<Choice>(`/choices/${id}`, payload)
}

export async function deleteChoice(id: string) {
  return api.delete<null>(`/choices/${id}`)
}

// Liaisons question-impression

type QuestionImpression = { questionId: string; impressionId: string; impression: Impression }

export async function getQuestionsImpressions(questionId?: string) {
  const query = questionId ? `?questionId=${questionId}` : ""
  return api.get<QuestionImpression[]>(`/questions-impressions${query}`)
}

export async function linkImpression(questionId: string, impressionId: string) {
  return api.post<QuestionImpression>("/questions-impressions", { questionId, impressionId })
}

export async function unlinkImpression(questionId: string, impressionId: string) {
  return api.delete<null>(`/questions-impressions/${questionId}/${impressionId}`)
}

// Réponses festivaliers

export async function submitAnswer(payload: {
  response: string
  questionId: string
  uuid?: string
}) {
  return api.post<{ id: string; response: string; questionId: string; uuid: string | null }>("/answers", payload)
}
