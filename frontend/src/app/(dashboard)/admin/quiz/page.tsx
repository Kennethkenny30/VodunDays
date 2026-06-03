"use client"

import { useState, useEffect, useCallback } from "react"
import { QuizList } from "./components/quiz-list"
import { QuizBuilder } from "./components/quiz-builder"
import { PageTransition } from "@/components/dashboard/page-transition"
import type { Quiz, QuestionType, Impression } from "@/lib/types/api"
import { getQuizzes } from "@/lib/api/quiz"
import { getQuestionTypes, getImpressions } from "@/lib/api/questions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function QuizPage() {
  const [quizzes, setQuizzes]               = useState<Quiz[]>([])
  const [questionTypes, setQuestionTypes]   = useState<QuestionType[]>([])
  const [impressions, setImpressions]       = useState<Impression[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [loading, setLoading]               = useState(true)

  // ─── Chargement initial ────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [quizRes, typesRes, impressionsRes] = await Promise.all([
        getQuizzes(),
        getQuestionTypes(),
        getImpressions(),
      ])
      if (quizRes.success)       setQuizzes(quizRes.data)
      else toast.error("Impossible de charger les questionnaires")

      if (typesRes.success)      setQuestionTypes(typesRes.data)
      else toast.error("Impossible de charger les types de questions")

      if (impressionsRes.success) setImpressions(impressionsRes.data)
      else toast.error("Impossible de charger les impressions")
    } catch {
      toast.error("Erreur réseau lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleQuizCreated = (quiz: Quiz) => {
    setQuizzes((prev) => [quiz, ...prev])
    setSelectedQuizId(quiz.id)
  }

  const handleQuizUpdated = (updated: Quiz) => {
    setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }

  const handleQuizDeleted = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
    if (selectedQuizId === id) setSelectedQuizId(null)
  }

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) ?? null

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Questionnaires</h1>
          <p className="text-muted-foreground">Créez et configurez les questionnaires du festival</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          Chargement…
        </div>
      ) : (
        <div
          className="glass-card overflow-hidden flex"
          style={{ height: "calc(100vh - 180px)", minHeight: 520 }}
        >
          <QuizList
            quizzes={quizzes}
            loading={false}
            selectedQuizId={selectedQuizId}
            onSelect={setSelectedQuizId}
            onCreated={handleQuizCreated}
          />

          <div className="flex-1 overflow-hidden border-l border-white/[0.07]">
            {selectedQuiz ? (
              <QuizBuilder
                key={selectedQuiz.id}
                quiz={selectedQuiz}
                questionTypes={questionTypes}
                impressions={impressions}
                onUpdated={handleQuizUpdated}
                onDeleted={handleQuizDeleted}
              />
            ) : (
              <div className="flex h-full items-center justify-center flex-col gap-3 text-muted-foreground">
                <div className="size-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <svg className="size-6 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h4M12 16h4M8 12h.01M8 16h.01" />
                  </svg>
                </div>
                <p className="text-[13px]">Sélectionnez ou créez un questionnaire</p>
              </div>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  )
}
