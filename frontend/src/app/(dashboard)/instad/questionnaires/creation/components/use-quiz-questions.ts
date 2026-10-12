"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { getChoices, getQuestions, reorderQuestions } from "@/lib/api/questions"
import { kindHasChoices } from "@/lib/question-kinds"
import type { Choice, Question, QuestionType } from "@/lib/types/api"

// État et opérations sur les questions d'un questionnaire : chargement,
// options des QCM (préchargées pour la validation de publication) et
// réordonnancement avec rollback. Les appels de création / suppression /
// mise à jour restent dans les composants, qui appliquent ensuite le résultat
// via les mutateurs locaux ci-dessous.
export function useQuizQuestions(quizId: string, questionTypes: QuestionType[]) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [choicesByQuestion, setChoicesByQuestion] = useState<Record<string, Choice[]>>({})
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [reordering, setReordering] = useState(false)

  const typesRef = useRef(questionTypes)
  typesRef.current = questionTypes

  // Chargement des questions puis préchargement des options des QCM
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoaded(false)
    setQuestions([])
    setChoicesByQuestion({})

    const load = async () => {
      try {
        const res = await getQuestions(quizId)
        if (cancelled) return
        if (!res.success) {
          toast.error("Impossible de charger les questions")
          setLoading(false)
          return
        }
        setQuestions(res.data)
        setLoaded(true)
        setLoading(false)

        const withChoices = res.data.filter((q) => {
          const kind = typesRef.current.find((t) => t.id === q.questionTypeId)?.kind ?? "TEXT"
          return kindHasChoices(kind)
        })
        const results = await Promise.allSettled(withChoices.map((q) => getChoices(q.id)))
        if (cancelled) return
        const next: Record<string, Choice[]> = {}
        results.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value.success) next[withChoices[i].id] = r.value.data
        })
        setChoicesByQuestion((prev) => ({ ...next, ...prev }))
      } catch {
        if (!cancelled) {
          toast.error("Erreur réseau")
          setLoading(false)
        }
      }
    }
    void load()
    return () => { cancelled = true }
  }, [quizId])

  // Charge les options d'une question si elles ne le sont pas encore
  const ensureChoices = useCallback(async (questionId: string): Promise<boolean> => {
    try {
      const res = await getChoices(questionId)
      if (!res.success) {
        toast.error(res.message || "Impossible de charger les options")
        return false
      }
      setChoicesByQuestion((prev) => (prev[questionId] ? prev : { ...prev, [questionId]: res.data }))
      return true
    } catch {
      toast.error("Impossible de charger les options")
      return false
    }
  }, [])

  const updateChoices = useCallback((questionId: string, updater: (prev: Choice[]) => Choice[]) => {
    setChoicesByQuestion((prev) => ({ ...prev, [questionId]: updater(prev[questionId] ?? []) }))
  }, [])

  const appendQuestion = useCallback((question: Question) => {
    setQuestions((prev) => [...prev, question])
  }, [])

  const replaceQuestion = useCallback((updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }, [])

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    setChoicesByQuestion((prev) => {
      if (!(id in prev)) return prev
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  // Persiste un nouvel ordre ; restaure l'ancien en cas d'échec
  const applyOrder = useCallback(async (next: Question[], snapshot: Question[]) => {
    setQuestions(next)
    setReordering(true)
    try {
      const res = await reorderQuestions(next.map((q) => q.id))
      if (!res.success) throw new Error(res.message)
    } catch {
      setQuestions(snapshot)
      toast.error("Erreur lors de la sauvegarde de l'ordre")
    } finally {
      setReordering(false)
    }
  }, [])

  const moveQuestion = useCallback(
    (from: number, to: number) => {
      if (reordering || from === to || from < 0 || to < 0) return
      if (from >= questions.length || to >= questions.length) return
      const next = [...questions]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      void applyOrder(next, questions)
    },
    [applyOrder, questions, reordering]
  )

  return {
    questions,
    choicesByQuestion,
    loading,
    loaded,
    reordering,
    appendQuestion,
    replaceQuestion,
    removeQuestion,
    updateChoices,
    ensureChoices,
    moveQuestion,
  }
}
