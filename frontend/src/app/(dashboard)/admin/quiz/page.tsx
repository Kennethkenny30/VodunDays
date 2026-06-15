"use client"

import { useState, useEffect, useCallback } from "react"
import { QuizList } from "./components/quiz-list"
import { QuizBuilder } from "./components/quiz-builder"
import { QuestionTypesManager } from "./components/question-types-manager"
import { PageTransition } from "@/components/dashboard/page-transition"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Quiz, QuestionType, Impression, Event } from "@/lib/types/api"
import { getQuizzes } from "@/lib/api/quiz"
import { getQuestionTypes, getImpressions } from "@/lib/api/questions"
import { getEvents } from "@/lib/api/events"
import { toast } from "sonner"
import { Loader2, ClipboardList, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function QuizPage() {
  const [quizzes, setQuizzes]             = useState<Quiz[]>([])
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])
  const [impressions, setImpressions]     = useState<Impression[]>([])
  const [events, setEvents]               = useState<Event[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [loading, setLoading]             = useState(true)
  const [showTypesSheet, setShowTypesSheet] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [quizRes, typesRes, impressionsRes, eventsRes] = await Promise.all([
        getQuizzes(),
        getQuestionTypes(),
        getImpressions(),
        getEvents(),
      ])
      if (quizRes.success)        setQuizzes(quizRes.data)
      else toast.error("Impossible de charger les questionnaires")

      if (typesRes.success)       setQuestionTypes(typesRes.data)
      else toast.error("Impossible de charger les types de questions")

      if (impressionsRes.success) setImpressions(impressionsRes.data)
      else toast.error("Impossible de charger les impressions")

      if (eventsRes.success)      setEvents(eventsRes.data)
      else toast.error("Impossible de charger les evenements")
    } catch {
      toast.error("Erreur reseau lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

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

  // Met a jour le compteur de questions dans la liste sans refetch global
  const handleQuestionsChanged = (quizId: string, count: number) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, questions: Array.from({ length: count }) as Quiz["questions"] }
          : q
      )
    )
  }

  const handleTypesChanged = (types: QuestionType[]) => {
    setQuestionTypes(types)
  }

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) ?? null
  const hasNoTypes   = questionTypes.length === 0

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Questionnaires</h1>
          <p className="text-muted-foreground">Creez et configurez les questionnaires du festival</p>
        </div>

        {/* Bouton d'acces au gestionnaire de types - ouvre une Sheet */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTypesSheet(true)}
          className={cn(
            "h-9 px-3 text-[12px] rounded-xl border transition-all gap-2",
            hasNoTypes
              ? "border-red-500/40 text-red-400 hover:bg-red-500/10 animate-pulse"
              : "border-white/[0.12] text-muted-foreground hover:border-white/25 hover:text-foreground"
          )}
        >
          <Settings className="size-3.5" />
          <span>Types de question</span>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] h-4 px-1.5 font-mono border ml-0.5",
              hasNoTypes
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-white/[0.06] border-white/[0.12] text-muted-foreground/60"
            )}
          >
            {hasNoTypes ? "!" : questionTypes.length}
          </Badge>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          Chargement...
        </div>
      ) : (
        <div
          className="glass-card overflow-hidden flex"
          style={{ height: "calc(100vh - 180px)", minHeight: 520 }}
        >
          {/* Liste des quiz (panneau gauche) */}
          <QuizList
            quizzes={quizzes}
            events={events}
            loading={false}
            selectedQuizId={selectedQuizId}
            onSelect={setSelectedQuizId}
            onCreated={handleQuizCreated}
          />

          {/* Editeur de quiz (panneau principal) */}
          <div className="flex-1 overflow-hidden border-l border-white/[0.07]">
            {selectedQuiz ? (
              <QuizBuilder
                key={selectedQuiz.id}
                quiz={selectedQuiz}
                questionTypes={questionTypes}
                impressions={impressions}
                onUpdated={handleQuizUpdated}
                onDeleted={handleQuizDeleted}
                onQuestionsChanged={(count) => handleQuestionsChanged(selectedQuiz.id, count)}
              />
            ) : (
              // Etat vide : aucun quiz selectionne
              <div className="flex h-full items-center justify-center flex-col gap-3 text-muted-foreground">
                <div className="size-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <ClipboardList className="size-6 opacity-30" />
                </div>
                <p className="text-[13px]">Selectionnez ou creez un questionnaire</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sheet du gestionnaire de types de questions */}
      <Sheet open={showTypesSheet} onOpenChange={setShowTypesSheet}>
        <SheetContent
          className="w-[620px] sm:max-w-[620px] p-0 border-l border-white/[0.08]"
          style={{ background: "oklch(0.14 0.02 260)" }}
        >
          <SheetHeader className="px-6 py-4 border-b border-white/[0.07]">
            <SheetTitle className="text-[15px] font-semibold flex items-center gap-2">
              <Settings className="size-4 text-[var(--vd-gold)]" />
              Types de questions
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-73px)]">
            <QuestionTypesManager onTypesChanged={handleTypesChanged} />
          </div>
        </SheetContent>
      </Sheet>
    </PageTransition>
  )
}
