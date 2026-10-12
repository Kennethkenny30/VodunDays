import type { Choice, Question, QuestionKind, Quiz } from "@/lib/types/api"
import { kindHasChoices } from "@/lib/question-kinds"

// Langue d'édition du créateur de questionnaires
export type Lang = "fr" | "en"

export function hasText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim())
}

// Compare deux textes en traitant null / undefined comme une chaîne vide
export function sameText(a: string | null | undefined, b: string | null | undefined): boolean {
  return (a ?? "").trim() === (b ?? "").trim()
}

export type EnCompleteness = {
  done: number
  total: number
  // Questions dont le libellé ou au moins une option n'est pas traduit
  missingQuestionIds: Set<string>
}

// Compte les éléments traduisibles du questionnaire et ceux déjà traduits en EN :
// titre, description (si elle existe en FR), libellé de chaque question et
// options des questions à choix dont le chargement a abouti.
export function getEnCompleteness(
  quiz: Quiz,
  questions: Question[],
  kindOf: (question: Question) => QuestionKind,
  choicesByQuestion: Record<string, Choice[] | undefined>
): EnCompleteness {
  let done = 0
  let total = 0
  const missingQuestionIds = new Set<string>()
  const count = (translated: boolean) => {
    total += 1
    if (translated) done += 1
  }

  count(hasText(quiz.titleEn))
  if (hasText(quiz.description)) count(hasText(quiz.descriptionEn))

  for (const q of questions) {
    let complete = hasText(q.wordingEn)
    count(complete)
    if (kindHasChoices(kindOf(q))) {
      for (const choice of choicesByQuestion[q.id] ?? []) {
        const translated = hasText(choice.wordingEn)
        count(translated)
        if (!translated) complete = false
      }
    }
    if (!complete) missingQuestionIds.add(q.id)
  }

  return { done, total, missingQuestionIds }
}
