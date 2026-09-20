// API INStaD - Vodun Days Dashboard
import { api, getApiBase } from "./client"

export type InstadDemographics = {
  total: number
  byGender: { gender: string; _count: number }[]
  byAgeRange: { ageRange: string; _count: number }[]
  byEdition: { edition: string; _count: number }[]
  byLanguage: { language: string; _count: number }[]
  topNationalities: { nationality: string; _count: number }[]
}

export type InstadSatisfaction = {
  averageRating: number
  totalResponses: number
  satisfactionRate: number
  ratingDistribution: Record<string, number>
  trend: { date: string; count: number; avg: number }[]
}

export type InstadPresenceBySite = {
  siteId: string
  name: string
  category: string | null
  count: number
}

export type InstadSite = {
  id: string
  name: string
  category: string
  latitude: number
  longitude: number
  capacity: number
}

export type InstadOverview = {
  demographics: InstadDemographics
  satisfaction: InstadSatisfaction
  presence: {
    windowMinutes: number
    onlineNow: number
    unassigned: number
    bySite: InstadPresenceBySite[]
  }
  sites: {
    total: number
    list: InstadSite[]
  }
}

export type InstadPresencePoint = {
  latitude: number
  longitude: number
  siteId: string | null
  createdAt: string
}

// Filtres communs au dashboard : période (dates ISO "YYYY-MM-DD") et
// croisement démographique. Le site ne filtre pas l'aperçu (déjà réparti par
// site) mais restreint la vue "détail" de la carte et l'export.
export type InstadFilters = {
  from?:        string
  to?:          string
  gender?:      string
  ageRange?:    string
  nationality?: string
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

// Vue d'ensemble agrégée (démographie, présence, satisfaction, sites)
export async function getInstadOverview(filters: InstadFilters = {}) {
  return api.get<InstadOverview>(`/instad/overview${buildQuery(filters)}`)
}

// Points de présence anonymisés, pour la vue "détail" de la carte
export async function getInstadPresencePoints(minutes = 15, siteId?: string) {
  return api.get<InstadPresencePoint[]>(
    `/instad/presence/points${buildQuery({ minutes: String(minutes), siteId })}`
  )
}

// Télécharge le rapport CSV (résumé, démographie, affluence, satisfaction)
// avec les mêmes filtres que le dashboard - déclenche le téléchargement
// directement dans le navigateur.
export async function downloadInstadExport(filters: InstadFilters = {}): Promise<void> {
  await downloadCsv(
    `${getApiBase()}/instad/export${buildQuery(filters)}`,
    `instad_vodundays_${new Date().toISOString().slice(0, 10)}.csv`
  )
}

// ─── Questionnaires soumis - accès et outils statistiques conventionnels ────

export type InstadQuizSummary = {
  id: string
  title: string
  scope: string
  active: boolean
  eventTitle: string | null
  questionCount: number
  totalResponses: number
}

export type InstadRatingStats = {
  count: number
  mean?: number
  median?: number
  mode?: number
  stdDev?: number
  min?: number
  max?: number
  distribution?: { value: number; count: number }[]
}

export type InstadChoiceStats = {
  count: number
  distribution: { wording: string; count: number; percentage: number }[]
}

export type InstadTextStats = {
  count: number
  topWords: { word: string; count: number }[]
  responses: { response: string; createdAt: string }[]
}

export type InstadQuestionStats = {
  id: string
  wording: string
  kind: "RATING" | "SINGLE" | "MULTIPLE" | "TEXT"
  typeLabel: string
  totalResponses: number
  stats: InstadRatingStats | InstadChoiceStats | InstadTextStats
}

export type InstadQuizStatistics = {
  id: string
  title: string
  scope: string
  eventTitle: string | null
  questions: InstadQuestionStats[]
}

// Liste des questionnaires disponibles (pour le sélecteur)
export async function getInstadQuizzes() {
  return api.get<InstadQuizSummary[]>("/instad/quizzes")
}

// Statistiques descriptives conventionnelles d'un questionnaire, question
// par question (moyenne/médiane/mode pour les notes, tris à plat pour les
// choix, fréquence des mots pour le texte libre)
export async function getInstadQuizStatistics(quizId: string, filters: InstadFilters = {}) {
  return api.get<InstadQuizStatistics>(`/instad/quizzes/${quizId}/stats${buildQuery(filters)}`)
}

// Télécharge les micro-données brutes d'un questionnaire (une ligne par
// réponse, enrichie des attributs démographiques anonymes du répondant) -
// pour un traitement dans un outil statistique externe (R, SPSS, Excel...).
export async function downloadInstadQuizExport(quizId: string, quizTitle: string, filters: InstadFilters = {}): Promise<void> {
  const safeName = quizTitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").slice(0, 40)
  await downloadCsv(
    `${getApiBase()}/instad/quizzes/${quizId}/export${buildQuery(filters)}`,
    `instad_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`
  )
}

async function downloadCsv(url: string, filename: string): Promise<void> {
  const response = await fetch(url, { credentials: "include" })
  if (!response.ok) {
    throw new Error("Export impossible")
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
