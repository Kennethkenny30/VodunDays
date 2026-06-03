"use client"

// TODO: Connecter au backend — remplacer toutes les mutations locales par des appels API

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconPlus, IconDelete, IconStar } from "@/components/icons"
import { toast } from "sonner"
import type { Quiz, Question, QuestionType, Impression } from "@/lib/types/api"
import { QuestionConfigPanel } from "./question-config-panel"

interface QuizBuilderProps {
  quiz: Quiz
  questionTypes: QuestionType[]
  impressions: Impression[]
  onUpdated: (quiz: Quiz) => void
  onDeleted: (id: string) => void
}

export function QuizBuilder({
  quiz,
  questionTypes,
  impressions,
  onUpdated,
  onDeleted,
}: QuizBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [localTitle, setLocalTitle] = useState(quiz.title)
  const [localActive, setLocalActive] = useState(quiz.active)
  const [isDirty, setIsDirty] = useState(false)

  // Drag & drop
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  useEffect(() => {
    setLocalTitle(quiz.title)
    setLocalActive(quiz.active)
    setSelectedQuestionId(null)
    setQuestions([])
    setIsDirty(false)
  }, [quiz.id, quiz.title, quiz.active])

  useEffect(() => {
    setIsDirty(localTitle !== quiz.title || localActive !== quiz.active)
  }, [localTitle, localActive, quiz.title, quiz.active])

  // TODO: api.patch<Quiz>(`/quiz/${quiz.id}`, { title: localTitle, active: localActive })
  const handleSaveQuiz = () => {
    onUpdated({ ...quiz, title: localTitle, active: localActive })
    setIsDirty(false)
    toast.success("Questionnaire mis à jour")
  }

  // TODO: api.delete(`/quiz/${quiz.id}`)
  const handleDeleteQuiz = () => {
    onDeleted(quiz.id)
    toast.success("Questionnaire supprimé")
  }

  // TODO: api.post<Question>("/questions", { wording, questionTypeId, quizId })
  const handleAddQuestion = () => {
    if (!questionTypes.length) {
      toast.error("Aucun type de question disponible")
      return
    }
    const q: Question = {
      id: `question-mock-${Date.now()}`,
      wording: "Nouvelle question",
      questionTypeId: questionTypes[0].id,
      quizId: quiz.id,
      choices: [],
    }
    setQuestions((prev) => [...prev, q])
    setSelectedQuestionId(q.id)
  }

  const handleQuestionUpdated = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }

  // TODO: api.delete(`/questions/${id}`) dans QuestionConfigPanel
  const handleQuestionDeleted = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    if (selectedQuestionId === id) setSelectedQuestionId(null)
  }

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, index: number, id: string) => {
    dragItem.current = index
    setDraggingId(id)
    e.dataTransfer.effectAllowed = "move"
  }
  const handleDragEnter = (index: number, id: string) => {
    dragOverItem.current = index
    setDragOverId(id)
  }
  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const next = [...questions]
      const [removed] = next.splice(dragItem.current, 1)
      next.splice(dragOverItem.current, 0, removed)
      setQuestions(next)
    }
    dragItem.current = null
    dragOverItem.current = null
    setDraggingId(null)
    setDragOverId(null)
  }

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null
  const typeLabel = (id: string) => questionTypes.find((t) => t.id === id)?.types ?? "—"

  const TYPE_ICONS: Record<string, string> = {
    "type-1": "⭐", "type-2": "◉", "type-3": "☑", "type-4": "✎",
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Barre d'outils ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07] shrink-0">

        {/* Point dirty */}
        {isDirty && (
          <span
            className="size-1.5 rounded-full bg-[var(--vd-gold)] shrink-0 animate-pulse"
            title="Modifications non sauvegardées"
          />
        )}

        {/* Titre */}
        <Input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className={cn(
            "flex-1 h-8 text-[14px] font-semibold bg-transparent border-transparent",
            "placeholder:text-muted-foreground/30",
            "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.04]",
            "hover:border-white/[0.1] transition-all rounded-lg"
          )}
          placeholder="Titre du questionnaire…"
        />

        {/* Toggle actif */}
        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={localActive}
            onCheckedChange={setLocalActive}
            id="quiz-active"
            className="data-[state=checked]:bg-[var(--vd-gold)]"
          />
          <label
            htmlFor="quiz-active"
            className="text-[12px] text-muted-foreground cursor-pointer select-none"
          >
            {localActive ? "Actif" : "Inactif"}
          </label>
        </div>

        {/* Supprimer — avec confirmation */}
        <ConfirmDialog
          title="Supprimer le questionnaire"
          description={`Êtes-vous sûr de vouloir supprimer "${localTitle}" ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          variant="destructive"
          onConfirm={handleDeleteQuiz}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-[12px] text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 h-8 px-3 rounded-lg"
            >
              <IconDelete className="size-3.5 mr-1.5" />
              Supprimer
            </Button>
          }
        />

        {/* Enregistrer */}
        <Button
          size="sm"
          onClick={handleSaveQuiz}
          disabled={!isDirty}
          className={cn(
            "h-8 px-4 text-[12px] font-semibold rounded-lg transition-all",
            isDirty
              ? "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_12px_var(--vd-gold)/20]"
              : "bg-white/[0.06] text-muted-foreground/50 cursor-not-allowed"
          )}
        >
          Enregistrer
        </Button>
      </div>

      {/* ── Corps : liste questions + config ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Colonne questions */}
        <div className="w-[220px] shrink-0 flex flex-col border-r border-white/[0.07]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07]">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
              Questions
            </span>
            <Badge
              variant="secondary"
              className="bg-white/[0.06] text-muted-foreground/50 border-white/[0.08] text-[10px] font-mono h-4 px-1.5"
            >
              {questions.length}
            </Badge>
          </div>

          {/* Liste */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {questions.length === 0 ? (
                <EmptyState
                  icon={IconStar}
                  title="Aucune question"
                  description="Ajoutez votre première question."
                />
              ) : (
                questions.map((q, i) => (
                  <div
                    key={q.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i, q.id)}
                    onDragEnter={() => handleDragEnter(i, q.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border cursor-pointer",
                      "transition-all duration-150 flex items-start gap-2.5 group",
                      selectedQuestionId === q.id
                        ? "bg-white/[0.06] border-[var(--vd-gold)]/30"
                        : "border-transparent hover:bg-white/[0.04]",
                      draggingId === q.id && "opacity-40",
                      dragOverId === q.id && draggingId !== q.id && "border-[var(--vd-gold)]/50 bg-[var(--vd-gold)]/5",
                    )}
                  >
                    {/* Drag handle */}
                    <svg
                      className="size-3 mt-1 text-muted-foreground/20 group-hover:text-muted-foreground/40 shrink-0 cursor-grab"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <circle cx="3.5" cy="3" r="1" />
                      <circle cx="3.5" cy="6" r="1" />
                      <circle cx="3.5" cy="9" r="1" />
                      <circle cx="8.5" cy="3" r="1" />
                      <circle cx="8.5" cy="6" r="1" />
                      <circle cx="8.5" cy="9" r="1" />
                    </svg>

                    {/* Numéro */}
                    <span className={cn(
                      "shrink-0 size-5 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 transition-all",
                      selectedQuestionId === q.id
                        ? "bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] border border-[var(--vd-gold)]/25"
                        : "bg-white/[0.06] text-muted-foreground/50 border border-white/[0.06]"
                    )}>
                      {i + 1}
                    </span>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate leading-snug text-foreground/80 group-hover:text-foreground transition-colors">
                        {q.wording}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40 mt-0.5 flex items-center gap-1">
                        <span>{TYPE_ICONS[q.questionTypeId] ?? "◆"}</span>
                        <span className="truncate">{typeLabel(q.questionTypeId)}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Bouton ajout */}
          <div className="p-3 border-t border-white/[0.07]">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-[11px] border-dashed border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40 rounded-xl transition-all"
              onClick={handleAddQuestion}
            >
              <IconPlus className="size-3.5 mr-1.5" />
              Ajouter une question
            </Button>
          </div>
        </div>

        {/* Panneau de configuration */}
        <div className="flex-1 overflow-hidden">
          {selectedQuestion ? (
            <QuestionConfigPanel
              key={selectedQuestion.id}
              question={selectedQuestion}
              questionTypes={questionTypes}
              impressions={impressions}
              onUpdated={handleQuestionUpdated}
              onDeleted={handleQuestionDeleted}
            />
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-3 text-muted-foreground">
              <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <svg className="size-5 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.3-6.7-2.1 2.1m-8.4 8.4-2.1 2.1m0-12.6 2.1 2.1m8.4 8.4 2.1 2.1" />
                </svg>
              </div>
              <p className="text-[12px]">Sélectionnez une question pour la configurer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}