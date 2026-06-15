"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { IconPlus, IconDelete, IconStar } from "@/components/icons"
import {
  Star, AlignLeft, CheckSquare, Circle, Zap, AlertCircle,
  GripVertical, ChevronRight, Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { updateQuiz, deleteQuiz } from "@/lib/api/quiz"
import { getQuestions, createQuestion, deleteQuestion, reorderQuestions } from "@/lib/api/questions"
import { QUIZ_TEMPLATES } from "@/lib/quiz-templates"
import type { QuizTemplateQuestion } from "@/lib/quiz-templates"
import type { Quiz, Question, QuestionType, Impression, QuizScope, QuestionKind } from "@/lib/types/api"
import { QuestionConfigPanel } from "./question-config-panel"

interface QuizBuilderProps {
  quiz: Quiz
  questionTypes: QuestionType[]
  impressions: Impression[]
  onUpdated: (quiz: Quiz) => void
  onDeleted: (id: string) => void
  onQuestionsChanged?: (count: number) => void
}

function kindIcon(kind: QuestionKind) {
  switch (kind) {
    case "RATING":   return Star
    case "SINGLE":   return Circle
    case "MULTIPLE": return CheckSquare
    default:         return AlignLeft
  }
}

function kindDescription(kind: QuestionKind): string {
  switch (kind) {
    case "RATING":   return "Notation 1-5 etoiles"
    case "SINGLE":   return "Une seule reponse"
    case "MULTIPLE": return "Plusieurs reponses"
    default:         return "Reponse libre"
  }
}

const KIND_COLORS: Record<QuestionKind, string> = {
  RATING:   "bg-amber-500/10 border-amber-500/25 text-amber-400",
  SINGLE:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
  MULTIPLE: "bg-purple-500/10 border-purple-500/25 text-purple-400",
  TEXT:     "bg-slate-500/10 border-slate-500/25 text-slate-400",
}

const SCOPE_CHIP: Record<string, string> = {
  FESTIVAL: "Festival", ALL_EVENTS: "Tous evt.", ALL_SITES: "Tous sites", EVENT: "Evenement",
}

export function QuizBuilder({
  quiz,
  questionTypes,
  impressions,
  onUpdated,
  onDeleted,
  onQuestionsChanged,
}: QuizBuilderProps) {
  const [questions, setQuestions]               = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [localTitle, setLocalTitle]             = useState(quiz.title)
  const [localDescription, setLocalDescription] = useState(quiz.description ?? "")
  const [localActive, setLocalActive]           = useState(quiz.active)
  const [isDirty, setIsDirty]                   = useState(false)
  const [saving, setSaving]                     = useState(false)
  const [showTypePicker, setShowTypePicker]     = useState(false)
  const [applyingTemplate, setApplyingTemplate] = useState(false)
  const [confirmTemplate, setConfirmTemplate]   = useState(false)

  // Drag & drop
  const dragItem     = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedQuestionId(null)
    setShowTypePicker(false)
    setIsDirty(false)

    const load = async () => {
      setLoadingQuestions(true)
      try {
        const res = await getQuestions(quiz.id)
        if (res.success) setQuestions(res.data)
        else toast.error("Impossible de charger les questions")
      } catch {
        toast.error("Erreur reseau")
      } finally {
        setLoadingQuestions(false)
      }
    }
    load()
  }, [quiz.id])

  useEffect(() => {
    setLocalTitle(quiz.title)
    setLocalDescription(quiz.description ?? "")
    setLocalActive(quiz.active)
  }, [quiz.title, quiz.description, quiz.active])

  useEffect(() => {
    setIsDirty(
      localTitle !== quiz.title ||
      localActive !== quiz.active ||
      (localDescription ?? "") !== (quiz.description ?? "")
    )
  }, [localTitle, localDescription, localActive, quiz.title, quiz.description, quiz.active])

  const handleSaveQuiz = async () => {
    if (!localTitle.trim()) { toast.error("Le titre ne peut pas etre vide"); return }
    setSaving(true)
    try {
      const res = await updateQuiz(quiz.id, {
        title: localTitle,
        active: localActive,
        description: localDescription || undefined,
      })
      if (!res.success) { toast.error(res.message || "Erreur lors de la sauvegarde"); return }
      onUpdated(res.data)
      setIsDirty(false)
      toast.success("Questionnaire mis a jour")
    } catch {
      toast.error("Erreur reseau")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuiz = async () => {
    try {
      const res = await deleteQuiz(quiz.id)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return }
      onDeleted(quiz.id)
      toast.success("Questionnaire supprime")
    } catch {
      toast.error("Erreur reseau")
    }
  }

  const handleAddQuestionWithType = async (questionTypeId: string) => {
    setShowTypePicker(false)
    try {
      const res = await createQuestion({
        wording: "Nouvelle question",
        questionTypeId,
        quizId: quiz.id,
      })
      if (!res.success) { toast.error(res.message || "Erreur lors de l'ajout"); return }
      setQuestions((prev) => {
        const next = [...prev, res.data]
        onQuestionsChanged?.(next.length)
        return next
      })
      setSelectedQuestionId(res.data.id)
    } catch {
      toast.error("Erreur reseau")
    }
  }

  const handleQuestionUpdated = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }

  const handleQuestionDeleted = async (id: string) => {
    try {
      const res = await deleteQuestion(id)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return }
      setQuestions((prev) => {
        const next = prev.filter((q) => q.id !== id)
        onQuestionsChanged?.(next.length)
        return next
      })
      if (selectedQuestionId === id) setSelectedQuestionId(null)
    } catch {
      toast.error("Erreur reseau")
    }
  }

  // Application du template - demande confirmation si des questions existent deja
  const handleApplyTemplateRequest = () => {
    if (questions.length > 0) {
      setConfirmTemplate(true)
    } else {
      handleApplyTemplate()
    }
  }

  const handleApplyTemplate = async () => {
    const scope = (quiz.scope as QuizScope) ?? "FESTIVAL"
    const template = QUIZ_TEMPLATES[scope]
    if (!template || !questionTypes.length) return

    setApplyingTemplate(true)
    const created: Question[] = []
    try {
      for (const tq of template.questions) {
        const matchedType = questionTypes.find((t) => t.kind === tq.kind) ?? questionTypes[0]
        const res = await createQuestion({
          wording: tq.wording,
          questionTypeId: matchedType.id,
          quizId: quiz.id,
        })
        if (res.success) created.push(res.data)
      }
      setQuestions(created)
      onQuestionsChanged?.(created.length)
      if (created.length > 0) setSelectedQuestionId(created[0].id)
      toast.success(`${created.length} questions ajoutees`)
    } catch {
      toast.error("Erreur lors de l'application du template")
    } finally {
      setApplyingTemplate(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number, id: string) => {
    dragItem.current = index
    setDraggingId(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnter = (index: number, id: string) => {
    dragOverItem.current = index
    setDragOverId(id)
  }

  // Reordonnancement avec persistance + rollback en cas d'erreur
  const handleDragEnd = async () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const snapshot = [...questions]
      const next = [...questions]
      const [removed] = next.splice(dragItem.current, 1)
      next.splice(dragOverItem.current, 0, removed)
      setQuestions(next)

      try {
        const res = await reorderQuestions(next.map((q) => q.id))
        if (!res.success) throw new Error(res.message)
      } catch {
        setQuestions(snapshot)
        toast.error("Erreur lors de la sauvegarde de l'ordre")
      }
    }
    dragItem.current = null
    dragOverItem.current = null
    setDraggingId(null)
    setDragOverId(null)
  }

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null
  const typeForQuestion  = (id: string) => questionTypes.find((t) => t.id === id)
  const scopeLabel       = SCOPE_CHIP[quiz.scope] ?? quiz.scope
  const hasTypes         = questionTypes.length > 0
  const template         = QUIZ_TEMPLATES[(quiz.scope as QuizScope) ?? "FESTIVAL"]

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Barre d'outils du quiz */}
      <div className="flex flex-col px-5 py-3 border-b border-white/[0.07] shrink-0 gap-2">
        <div className="flex items-center gap-3">
          {isDirty && (
            <span
              className="size-1.5 rounded-full bg-[var(--vd-gold)] shrink-0 animate-pulse"
              title="Modifications non sauvegardees"
            />
          )}

          <Input
            value={localTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalTitle(e.target.value)}
            className={cn(
              "flex-1 h-8 text-[14px] font-semibold bg-transparent border-transparent",
              "placeholder:text-muted-foreground/30",
              "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.04]",
              "hover:border-white/[0.1] transition-all rounded-lg"
            )}
            placeholder="Titre du questionnaire..."
          />

          <Badge
            variant="outline"
            className="text-[10px] px-2 h-6 shrink-0 font-medium border-white/[0.12] text-muted-foreground/60"
          >
            {scopeLabel}
          </Badge>

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

          <ConfirmDialog
            title="Supprimer le questionnaire"
            description={`Etes-vous sur de vouloir supprimer "${localTitle}" ? Cette action est irreversible.`}
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

          <Button
            size="sm"
            onClick={handleSaveQuiz}
            disabled={!isDirty || saving}
            className={cn(
              "h-8 px-4 text-[12px] font-semibold rounded-lg transition-all",
              isDirty
                ? "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_12px_var(--vd-gold)/20]"
                : "bg-white/[0.06] text-muted-foreground/50 cursor-not-allowed"
            )}
          >
            {saving ? "..." : "Enregistrer"}
          </Button>
        </div>

        <Input
          value={localDescription}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalDescription(e.target.value)}
          className={cn(
            "h-7 text-[12px] bg-transparent border-transparent text-muted-foreground",
            "placeholder:text-muted-foreground/20",
            "focus-visible:border-[var(--vd-gold)]/30 focus-visible:bg-white/[0.03]",
            "hover:border-white/[0.08] transition-all rounded-lg"
          )}
          placeholder="Description (optionnelle)..."
        />
      </div>

      {/* Alerte si aucun type de question */}
      {!hasTypes && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertCircle className="size-4 text-amber-400 shrink-0" />
          <p className="text-[12px] text-amber-400/80">
            Aucun type de question configure - utilisez le bouton "Types" pour en creer.
          </p>
        </div>
      )}

      {/* Liste des questions */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">

          {loadingQuestions ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground/40">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-[13px]">Chargement...</span>
            </div>
          ) : questions.length === 0 && !showTypePicker ? (
            // Panel de demarrage rapide si le quiz est vide et qu'un template existe
            template && hasTypes ? (
              <div className="p-4 rounded-xl bg-[var(--vd-gold)]/[0.04] border border-[var(--vd-gold)]/15 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 text-[var(--vd-gold)]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--vd-gold)]">
                    Demarrage rapide
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                  {template.description}
                </p>
                <div className="space-y-1.5">
                  {template.questions.map((tq: QuizTemplateQuestion, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-1">
                      <span className="text-[12px] text-foreground/60 truncate">{tq.wording}</span>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-md font-medium border shrink-0",
                        tq.kind === "RATING"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                      )}>
                        {tq.kind === "RATING" ? "Note" : "Texte"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={handleApplyTemplateRequest}
                  disabled={applyingTemplate}
                  className="w-full h-8 text-[12px] bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/25 border border-[var(--vd-gold)]/25 rounded-lg font-semibold"
                >
                  {applyingTemplate ? "Application..." : "Appliquer ce template"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground/40">
                <IconStar className="size-8 opacity-40" />
                <p className="text-[13px]">Aucune question - ajoutez-en ci-dessous.</p>
              </div>
            )
          ) : (
            questions.map((q, i) => {
              const qt = typeForQuestion(q.questionTypeId)
              const kind = qt?.kind ?? "TEXT"
              const Icon = kindIcon(kind)
              return (
                <div
                  key={q.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i, q.id)}
                  onDragEnter={() => handleDragEnter(i, q.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 group",
                    "cursor-pointer select-none",
                    selectedQuestionId === q.id
                      ? "bg-[var(--vd-gold)]/[0.06] border-[var(--vd-gold)]/30 shadow-[0_0_0_1px_var(--vd-gold)/10]"
                      : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]",
                    draggingId === q.id && "opacity-40 scale-[0.99]",
                    dragOverId === q.id && draggingId !== q.id && "border-[var(--vd-gold)]/50 bg-[var(--vd-gold)]/5",
                  )}
                  onClick={() => { setShowTypePicker(false); setSelectedQuestionId(q.id) }}
                >
                  {/* Handle drag */}
                  <GripVertical className="size-4 text-muted-foreground/20 group-hover:text-muted-foreground/40 shrink-0 cursor-grab transition-colors" />

                  {/* Numero */}
                  <span className={cn(
                    "shrink-0 size-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all",
                    selectedQuestionId === q.id
                      ? "bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] border border-[var(--vd-gold)]/25"
                      : "bg-white/[0.06] text-muted-foreground/50 border border-white/[0.08]"
                  )}>
                    {i + 1}
                  </span>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground/80 group-hover:text-foreground transition-colors truncate leading-snug">
                      {q.wording}
                    </p>
                    {qt && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Icon className="size-3 text-muted-foreground/30" />
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                          KIND_COLORS[kind]
                        )}>
                          {qt.types}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton supprimer (visible au hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuestionDeleted(q.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-500/10"
                    title="Supprimer"
                  >
                    <IconDelete className="size-3.5" />
                  </button>

                  {/* Indicateur d'ouverture */}
                  <ChevronRight className={cn(
                    "size-4 shrink-0 transition-all",
                    selectedQuestionId === q.id
                      ? "text-[var(--vd-gold)] rotate-90"
                      : "text-muted-foreground/20 group-hover:text-muted-foreground/40"
                  )} />
                </div>
              )
            })
          )}

          {/* Selecteur de type inline */}
          {showTypePicker && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Choisir le type de question
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {questionTypes.map((qt) => {
                  const Icon = kindIcon(qt.kind)
                  return (
                    <button
                      key={qt.id}
                      type="button"
                      onClick={() => handleAddQuestionWithType(qt.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border",
                        "text-center transition-all duration-150 group",
                        "bg-white/[0.02] border-white/[0.08] text-muted-foreground",
                        "hover:border-[var(--vd-gold)]/40 hover:bg-[var(--vd-gold)]/8 hover:text-[var(--vd-gold)]"
                      )}
                    >
                      <Icon className="size-4 transition-colors group-hover:text-[var(--vd-gold)]" />
                      <span className="text-[11px] font-semibold leading-tight">{qt.types}</span>
                      <span className="text-[9px] opacity-50 leading-tight">{kindDescription(qt.kind)}</span>
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => setShowTypePicker(false)}
                className="w-full text-[11px] text-muted-foreground/40 hover:text-muted-foreground py-1 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bouton ajout */}
      {hasTypes && (
        <div className="px-4 pb-4 pt-2 border-t border-white/[0.07]">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full h-9 text-[12px] rounded-xl transition-all font-medium",
              showTypePicker
                ? "border-[var(--vd-gold)]/40 text-[var(--vd-gold)] bg-[var(--vd-gold)]/8"
                : "border-dashed border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40"
            )}
            onClick={() => setShowTypePicker((v) => !v)}
          >
            <IconPlus className="size-3.5 mr-2" />
            Ajouter une question
          </Button>
        </div>
      )}

      {/* Confirmation avant application du template si questions existantes */}
      <AlertDialog open={confirmTemplate} onOpenChange={setConfirmTemplate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remplacer les questions existantes ?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Ce quiz contient deja ${questions.length} question${questions.length > 1 ? "s" : ""}. L'application du template les remplacera toutes. Cette action est irreversible.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setConfirmTemplate(false); handleApplyTemplate() }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remplacer quand meme
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sheet de configuration de la question selectionnee */}
      <Sheet open={!!selectedQuestion} onOpenChange={(open) => !open && setSelectedQuestionId(null)}>
        <SheetContent
          className="w-[400px] sm:max-w-[400px] p-0 border-l border-white/[0.08]"
          style={{ background: "oklch(0.16 0.02 260)" }}
        >
          <SheetHeader className="px-6 py-4 border-b border-white/[0.07]">
            <SheetTitle className="text-[14px] font-semibold">Question {selectedQuestion && questions.indexOf(selectedQuestion) + 1}</SheetTitle>
          </SheetHeader>
          {selectedQuestion && (
            <QuestionConfigPanel
              key={selectedQuestion.id}
              question={selectedQuestion}
              questionTypes={questionTypes}
              impressions={impressions}
              onUpdated={handleQuestionUpdated}
              onDeleted={(id) => { handleQuestionDeleted(id); setSelectedQuestionId(null) }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
