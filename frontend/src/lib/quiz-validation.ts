import type { Choice, Question, QuestionKind } from "@/lib/types/api"
import { DEFAULT_QUESTION_WORDING, kindHasChoices } from "@/lib/question-kinds"

// Nombre minimal d'options pour une question à choix (unique ou multiple)
export const MIN_CHOICES = 2

export type QuizIssue = {
  id: string
  message: string
  // Question concernée (absente pour les problèmes globaux)
  questionId?: string
}

// Retourne les points bloquant l'activation d'un questionnaire.
// Les options d'une question dont le chargement a échoué (clé absente de
// choicesByQuestion) ne sont pas évaluées, pour éviter les faux positifs.
export function getQuizIssues(
  questions: Question[],
  kindOf: (question: Question) => QuestionKind,
  choicesByQuestion: Record<string, Choice[] | undefined>
): QuizIssue[] {
  if (questions.length === 0) {
    return [{ id: "no-questions", message: "Ajoutez au moins une question." }]
  }

  const issues: QuizIssue[] = []

  questions.forEach((q, i) => {
    const n = i + 1
    const wording = q.wording.trim()

    if (!wording) {
      issues.push({ id: `${q.id}:empty`, questionId: q.id, message: `Question ${n} : le libellé est vide.` })
    } else if (wording === DEFAULT_QUESTION_WORDING) {
      issues.push({
        id: `${q.id}:default`,
        questionId: q.id,
        message: `Question ${n} : le libellé par défaut doit être personnalisé.`,
      })
    }

    if (kindHasChoices(kindOf(q))) {
      const choices = choicesByQuestion[q.id]
      if (choices && choices.length < MIN_CHOICES) {
        issues.push({
          id: `${q.id}:choices`,
          questionId: q.id,
          message: `Question ${n} : ajoutez au moins ${MIN_CHOICES} options.`,
        })
      }
    }
  })

  return issues
}
