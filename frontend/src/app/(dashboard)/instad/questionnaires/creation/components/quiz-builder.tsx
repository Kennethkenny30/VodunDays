"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { IconPlus, IconDelete, IconStar } from "@/components/icons"
import {
  AlertCircle, ArrowDown, ArrowUp, ChevronLeft, GripVertical, Loader2, Zap,
} from "lucide-react"
import { toast } from "sonner"
import { updateQuiz, deleteQuiz } from "@/lib/api/quiz"
import { createQuestion, deleteQuestion } from "@/lib/api/questions"
import { QUIZ_TEMPLATES } from "@/lib/quiz-templates"
import type { QuizTemplateQuestion } from "@/lib/quiz-templates"
import { KIND_META, KIND_ORDER, kindHasChoices, kindIcon } from "@/lib/question-kinds"
import { getQuizIssues } from "@/lib/quiz-validation"
import { getEnCompleteness, hasText, sameText, type Lang } from "@/lib/quiz-i18n"
import type { Quiz, QuizCreatePayload, Question, QuestionType, Impression, QuizScope, QuestionKind } from "@/lib/types/api"
import { QuestionConfigPanel } from "./question-config-panel"
import { useQuizQuestions } from "./use-quiz-questions"

interface QuizBuilderProps {
  quiz: Quiz
  questionTypes: QuestionType[]
  impressions: Impression[]
  onUpdated: (quiz: Quiz) => void
  onDeleted: (id: string) => void
  onQuestionsChanged?: (count: number) => void
}

const SCOPE_CHIP: Record<string, string> = {
  FESTIVAL: "Festival", ALL_EVENTS: "Tous évt.", ALL_SITES: "Tous sites", EVENT: "Événement",
}

const CHIP_TONES = {
  warn:  "bg-amber-500/10 border-amber-500/25 text-amber-400",
  ready: "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/25 text-[var(--vd-gold)]",
} as const

export function QuizBuilder({
  quiz,
  questionTypes,
  impressions,
  onUpdated,
  onDeleted,
  onQuestionsChanged,
}: QuizBuilderProps) {
  const {
    questions, choicesByQuestion, loading, loaded, reordering,
    appendQuestion, replaceQuestion, removeQuestion,
    updateChoices, ensureChoices, moveQuestion,
  } = useQuizQuestions(quiz.id, questionTypes)

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  // En-tête du quiz : titre / description enregistrés explicitement,
  // l'activation est une action distincte et immédiate.
  const [localTitle, setLocalTitle] = useState(quiz.title)
  const [localDescription, setLocalDescription] = useState(quiz.description ?? "")
  const [localTitleEn, setLocalTitleEn] = useState(quiz.titleEn ?? "")
  const [localDescriptionEn, setLocalDescriptionEn] = useState(quiz.descriptionEn ?? "")
  // Langue d'édition : EN = traductions uniquement, la structure reste modifiable en FR
  const [lang, setLang] = useState<Lang>("fr")
  const [saving, setSaving] = useState(false)
  const [togglingActive, setTogglingActive] = useState(false)
  const [showIssues, setShowIssues] = useState(false)

  const [applyingTemplate, setApplyingTemplate] = useState(false)
  const [confirmTemplate, setConfirmTemplate] = useState(false)

  // Ajout rapide
  const [draftWording, setDraftWording] = useState("")
  const [draftKind, setDraftKind] = useState<QuestionKind>("RATING")
  const [adding, setAdding] = useState(false)
  const draftInputRef = useRef<HTMLInputElement>(null)

  // Drag & drop : l'ordre n'est validé que sur un vrai drop
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const hasTypes = questionTypes.length > 0

  // Premier type disponible pour chaque comportement
  const typeByKind = useMemo(() => {
    const map = new Map<QuestionKind, QuestionType>()
    for (const t of questionTypes) if (!map.has(t.kind)) map.set(t.kind, t)
    return map
  }, [questionTypes])

  const kindOfQuestion = useCallback(
    (q: Question): QuestionKind => questionTypes.find((t) => t.id === q.questionTypeId)?.kind ?? "TEXT",
    [questionTypes]
  )

  // Le comportement choisi pour l'ajout rapide doit exister dans les types
  useEffect(() => {
    if (typeByKind.has(draftKind)) return
    const first = KIND_ORDER.find((k) => typeByKind.has(k))
    if (first) setDraftKind(first)
  }, [typeByKind, draftKind])

  // Prévient le parent une fois les questions chargées (jamais avec le 0 initial)
  const onQuestionsChangedRef = useRef(onQuestionsChanged)
  onQuestionsChangedRef.current = onQuestionsChanged
  useEffect(() => {
    if (loaded) onQuestionsChangedRef.current?.(questions.length)
  }, [loaded, questions.length])

  const issues = useMemo(
    () => (loaded ? getQuizIssues(questions, kindOfQuestion, choicesByQuestion) : []),
    [loaded, questions, kindOfQuestion, choicesByQuestion]
  )
  const issueQuestionIds = useMemo(
    () => new Set(issues.map((i) => i.questionId).filter((id): id is string => Boolean(id))),
    [issues]
  )

  const isEn = lang === "en"

  const enStats = useMemo(
    () => (loaded ? getEnCompleteness(quiz, questions, kindOfQuestion, choicesByQuestion) : null),
    [loaded, quiz, questions, kindOfQuestion, choicesByQuestion]
  )

  const isDirty =
    localTitle.trim() !== quiz.title.trim() ||
    localDescription.trim() !== (quiz.description ?? "").trim() ||
    localTitleEn.trim() !== (quiz.titleEn ?? "").trim() ||
    localDescriptionEn.trim() !== (quiz.descriptionEn ?? "").trim()

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null
  const scopeLabel = SCOPE_CHIP[quiz.scope] ?? quiz.scope
  const template = QUIZ_TEMPLATES[(quiz.scope as QuizScope) ?? "FESTIVAL"]

  // ── Quiz : enregistrement, activation, suppression ──────────────────────
  const handleSaveQuiz = async () => {
    const title = localTitle.trim()
    if (!title) { toast.error("Le titre ne peut pas être vide"); return }

    // Seuls les champs modifiés sont envoyés
    const payload: Partial<QuizCreatePayload> = {}
    const description = localDescription.trim()
    const titleEn = localTitleEn.trim()
    const descriptionEn = localDescriptionEn.trim()
    if (title !== quiz.title.trim()) payload.title = title
    if (description !== (quiz.description ?? "").trim()) payload.description = description
    if (titleEn !== (quiz.titleEn ?? "").trim()) payload.titleEn = titleEn
    if (descriptionEn !== (quiz.descriptionEn ?? "").trim()) payload.descriptionEn = descriptionEn
    if (Object.keys(payload).length === 0) return

    setSaving(true)
    try {
      const res = await updateQuiz(quiz.id, payload)
      if (!res.success) { toast.error(res.message || "Erreur lors de la sauvegarde"); return }
      onUpdated(res.data)
      setLocalTitle(res.data.title)
      setLocalDescription(res.data.description ?? "")
      setLocalTitleEn(res.data.titleEn ?? "")
      setLocalDescriptionEn(res.data.descriptionEn ?? "")
      toast.success("Questionnaire mis à jour")

      const enIgnored =
        (payload.titleEn !== undefined && !sameText(res.data.titleEn, payload.titleEn)) ||
        (payload.descriptionEn !== undefined && !sameText(res.data.descriptionEn, payload.descriptionEn))
      if (enIgnored) {
        toast.warning("Traduction EN non confirmée par le serveur", {
          description: "La réponse ne contient pas la traduction envoyée : vérifiez que l'API la prend bien en charge.",
        })
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (next: boolean) => {
    if (!loaded || togglingActive) return
    if (next && issues.length > 0) {
      setShowIssues(true)
      toast.error("Questionnaire incomplet", { description: issues[0].message })
      return
    }
    setTogglingActive(true)
    try {
      const res = await updateQuiz(quiz.id, { active: next })
      if (!res.success) { toast.error(res.message || "Erreur lors de la mise à jour"); return }
      onUpdated(res.data)
      toast.success(next ? "Questionnaire activé" : "Questionnaire désactivé")
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setTogglingActive(false)
    }
  }

  const handleDeleteQuiz = async () => {
    try {
      const res = await deleteQuiz(quiz.id)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return }
      onDeleted(quiz.id)
      toast.success("Questionnaire supprimé")
    } catch {
      toast.error("Erreur réseau")
    }
  }

  // ── Questions : ajout rapide, suppression ───────────────────────────────
  const handleAddQuestion = async () => {
    const wording = draftWording.trim()
    const type = typeByKind.get(draftKind)
    if (!wording || !type || adding) return
    setAdding(true)
    try {
      const res = await createQuestion({ wording, questionTypeId: type.id, quizId: quiz.id })
      if (!res.success) { toast.error(res.message || "Erreur lors de l'ajout"); return }
      appendQuestion(res.data)
      setDraftWording("")
      // Une question à choix doit recevoir ses options : on ouvre l'éditeur
      if (kindHasChoices(draftKind)) {
        updateChoices(res.data.id, (prev) => prev)
        setSelectedQuestionId(res.data.id)
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setAdding(false)
      draftInputRef.current?.focus()
    }
  }

  const handleQuestionDeleted = async (id: string): Promise<boolean> => {
    try {
      const res = await deleteQuestion(id)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return false }
      removeQuestion(id)
      setSelectedQuestionId((current) => (current === id ? null : current))
      return true
    } catch {
      toast.error("Erreur réseau")
      return false
    }
  }

  // ── Template : remplacement réel des questions existantes ───────────────
  const handleApplyTemplateRequest = () => {
    if (questions.length > 0) setConfirmTemplate(true)
    else void handleApplyTemplate()
  }

  const handleApplyTemplate = async () => {
    if (!template || !hasTypes) return
    setApplyingTemplate(true)
    try {
      // 1. Suppression des questions existantes ; on s'arrête si l'une échoue
      if (questions.length > 0) {
        const results = await Promise.allSettled(questions.map((q) => deleteQuestion(q.id)))
        const deletedIds = questions
          .filter((_, i) => {
            const r = results[i]
            return r.status === "fulfilled" && r.value.success
          })
          .map((q) => q.id)
        deletedIds.forEach((id) => removeQuestion(id))
        const failed = questions.length - deletedIds.length
        if (failed > 0) {
          toast.error("Remplacement interrompu", {
            description: `${failed} question${failed > 1 ? "s" : ""} n'${failed > 1 ? "ont" : "a"} pas pu être supprimée${failed > 1 ? "s" : ""}. Le template n'a pas été appliqué.`,
          })
          return
        }
      }

      // 2. Création dans l'ordre du template (série : l'ordre dépend de la création)
      const created: Question[] = []
      const skipped: string[] = []
      for (const tq of template.questions) {
        const type = typeByKind.get(tq.kind as QuestionKind)
        if (!type) { skipped.push(tq.wording); continue }
        const res = await createQuestion({ wording: tq.wording, questionTypeId: type.id, quizId: quiz.id })
        if (res.success) created.push(res.data)
        else skipped.push(tq.wording)
      }
      created.forEach((q) => appendQuestion(q))
      if (created.length > 0) setSelectedQuestionId(created[0].id)

      if (skipped.length === 0) {
        toast.success(`${created.length} questions ajoutées`)
      } else {
        toast.warning(`${created.length} question${created.length > 1 ? "s" : ""} ajoutée${created.length > 1 ? "s" : ""}, ${skipped.length} ignorée${skipped.length > 1 ? "s" : ""}`, {
          description: "Type de question manquant ou création refusée pour : " + skipped.join(", "),
        })
      }
    } catch {
      toast.error("Erreur lors de l'application du template")
    } finally {
      setApplyingTemplate(false)
    }
  }

  // ── Drag & drop ─────────────────────────────────────────────────────────
  const resetDrag = () => { setDragIndex(null); setOverIndex(null) }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null) moveQuestion(dragIndex, toIndex)
    resetDrag()
  }

  // ── Rendu ───────────────────────────────────────────────────────────────
  const chip = !loaded
    ? null
    : issues.length > 0
      ? { tone: CHIP_TONES.warn, label: `${quiz.active ? "Actif" : "Brouillon"} · ${issues.length} à corriger` }
      : !quiz.active
        ? { tone: CHIP_TONES.ready, label: "Prêt à activer" }
        : null

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Barre d'outils du quiz */}
      <div className="flex flex-col px-5 py-3 border-b border-white/[0.07] shrink-0 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {isDirty && (
            <span
              className="size-1.5 rounded-full bg-[var(--vd-gold)] shrink-0 animate-pulse"
              title="Modifications non sauvegardées"
            />
          )}

          <Input
            value={isEn ? localTitleEn : localTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              isEn ? setLocalTitleEn(e.target.value) : setLocalTitle(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && isDirty && !saving) void handleSaveQuiz()
            }}
            className={cn(
              "flex-1 min-w-[180px] h-8 text-[14px] font-semibold bg-transparent border-transparent",
              "placeholder:text-muted-foreground/30",
              "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.04]",
              "hover:border-white/[0.1] transition-all rounded-lg"
            )}
            placeholder={isEn ? "Questionnaire title (EN)…" : "Titre du questionnaire…"}
          />

          <div className="flex items-center gap-1 shrink-0" role="group" aria-label="Langue d'édition">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  "h-6 px-2 rounded-md border text-[10px] font-bold uppercase transition-all",
                  lang === l
                    ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/40 text-[var(--vd-gold)]"
                    : "bg-white/[0.02] border-white/[0.08] text-muted-foreground hover:border-white/20"
                )}
              >
                {l}
              </button>
            ))}
            {enStats && enStats.total > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1.5 h-6 inline-flex items-center rounded-md border font-medium",
                  enStats.done === enStats.total
                    ? "bg-green-500/10 border-green-500/25 text-green-400"
                    : "bg-white/[0.04] border-white/[0.1] text-muted-foreground/70"
                )}
                title="Éléments traduits en anglais"
              >
                {`EN ${enStats.done}/${enStats.total}`}
              </span>
            )}
          </div>

          <Badge
            variant="outline"
            className="text-[10px] px-2 h-6 shrink-0 font-medium border-white/[0.12] text-muted-foreground/60"
          >
            {scopeLabel}
          </Badge>

          {chip && (
            <button
              type="button"
              onClick={() => issues.length > 0 && setShowIssues((v) => !v)}
              className={cn(
                "text-[10px] px-2 h-6 shrink-0 font-medium rounded-md border",
                chip.tone,
                issues.length > 0 ? "cursor-pointer hover:brightness-125" : "cursor-default"
              )}
            >
              {chip.label}
            </button>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={quiz.active}
              onCheckedChange={handleToggleActive}
              disabled={!loaded || togglingActive}
              id="quiz-active"
              className="data-[state=checked]:bg-[var(--vd-gold)]"
            />
            <label
              htmlFor="quiz-active"
              className="text-[12px] text-muted-foreground cursor-pointer select-none"
            >
              {quiz.active ? "Actif" : "Inactif"}
            </label>
          </div>

          {!isEn && (
          <ConfirmDialog
            title="Supprimer le questionnaire"
            description={`Êtes-vous sûr de vouloir supprimer « ${quiz.title} » ? Ses questions et les réponses déjà collectées pourraient être supprimées avec lui. Cette action est irréversible.`}
            confirmLabel="Supprimer"
            variant="destructive"
            onConfirm={handleDeleteQuiz}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[12px] text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 h-8 px-3 rounded-lg"
              >
                <IconDelete className="size-3.5 mr-1.5" />
                Supprimer
              </Button>
            }
          />
          )}

          <Button
            type="button"
            size="sm"
            onClick={handleSaveQuiz}
            disabled={!isDirty || saving}
            className={cn(
              "h-8 px-4 text-[12px] font-semibold rounded-lg transition-all",
              isDirty
                ? "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
                : "bg-white/[0.06] text-muted-foreground/50 cursor-not-allowed"
            )}
          >
            {saving ? "…" : "Enregistrer"}
          </Button>
        </div>

        <Input
          value={isEn ? localDescriptionEn : localDescription}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            isEn ? setLocalDescriptionEn(e.target.value) : setLocalDescription(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && isDirty && !saving) void handleSaveQuiz()
          }}
          className={cn(
            "h-7 text-[12px] bg-transparent border-transparent text-muted-foreground",
            "placeholder:text-muted-foreground/20",
            "focus-visible:border-[var(--vd-gold)]/30 focus-visible:bg-white/[0.03]",
            "hover:border-white/[0.08] transition-all rounded-lg"
          )}
          placeholder={isEn ? "Description (EN, optional)…" : "Description (optionnelle)…"}
        />
        {isEn && (
          <p className="text-[11px] text-muted-foreground/50 truncate px-1">
            {`FR · ${quiz.title}${hasText(quiz.description) ? ` - ${quiz.description}` : ""}`}
          </p>
        )}
      </div>

      {/* Points à corriger avant activation */}
      {showIssues && issues.length > 0 && (
        <div className="mx-4 mt-3 shrink-0 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80">
            À corriger avant activation
          </p>
          <ul className="space-y-1">
            {issues.map((issue) => {
              const questionId = issue.questionId
              return (
                <li key={issue.id}>
                  {questionId ? (
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionId(questionId)}
                      className="text-[12px] text-amber-300/80 hover:text-amber-200 hover:underline underline-offset-2 text-left"
                    >
                      {issue.message}
                    </button>
                  ) : (
                    <span className="text-[12px] text-amber-300/80">{issue.message}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Alerte si aucun type de question */}
      {!hasTypes && (
        <div className="mx-4 mt-3 shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertCircle className="size-4 text-amber-400 shrink-0" />
          <p className="text-[12px] text-amber-400/80">
            Aucun type de question configuré - utilisez le bouton « Types de question » en haut de la page pour en créer.
          </p>
        </div>
      )}

      {/* Corps : liste des questions + éditeur persistant */}
      <div className="flex flex-1 min-h-0 overflow-hidden mt-3 border-t border-white/[0.07]">

        {/* Colonne liste */}
        <div
          className={cn(
            "flex-col min-h-0 w-full lg:w-[340px] lg:shrink-0 lg:border-r lg:border-white/[0.07]",
            selectedQuestion ? "hidden lg:flex" : "flex"
          )}
        >
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-2">

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground/40">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-[13px]">Chargement…</span>
                </div>
              ) : questions.length === 0 ? (
                template && hasTypes && !isEn ? (
                  <div className="p-4 rounded-xl bg-[var(--vd-gold)]/[0.04] border border-[var(--vd-gold)]/15 space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="size-3.5 text-[var(--vd-gold)]" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--vd-gold)]">
                        Démarrage rapide
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="space-y-1.5">
                      {template.questions.map((tq: QuizTemplateQuestion, i: number) => {
                        const meta = KIND_META[tq.kind as QuestionKind]
                        return (
                          <div key={i} className="flex items-center justify-between gap-3 py-1">
                            <span className="text-[12px] text-foreground/60 truncate">{tq.wording}</span>
                            <span className={cn("text-[9px] px-2 py-0.5 rounded-md font-medium border shrink-0", meta?.badge)}>
                              {meta?.shortLabel ?? tq.kind}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyTemplateRequest}
                      disabled={applyingTemplate}
                      className="w-full h-8 text-[12px] bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/25 border border-[var(--vd-gold)]/25 rounded-lg font-semibold"
                    >
                      {applyingTemplate ? "Application…" : "Appliquer ce template"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground/40">
                    <IconStar className="size-8 opacity-40" />
                    <p className="text-[13px] text-center">{isEn ? "Aucune question à traduire." : "Aucune question - ajoutez-en ci-dessous."}</p>
                  </div>
                )
              ) : (
                questions.map((q, i) => {
                  const kind = kindOfQuestion(q)
                  const meta = KIND_META[kind]
                  const Icon = kindIcon(kind)
                  const typeName = questionTypes.find((t) => t.id === q.questionTypeId)?.types
                  const selected = selectedQuestionId === q.id
                  const hasIssue = issueQuestionIds.has(q.id)
                  return (
                    <div
                      key={q.id}
                      role="button"
                      tabIndex={0}
                      draggable={!reordering && !isEn}
                      onClick={() => setSelectedQuestionId(q.id)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedQuestionId(q.id)
                        }
                      }}
                      onDragStart={(e) => {
                        setDragIndex(i)
                        e.dataTransfer.effectAllowed = "move"
                        e.dataTransfer.setData("text/plain", q.id)
                      }}
                      onDragOver={(e) => {
                        if (dragIndex === null) return
                        e.preventDefault()
                        if (overIndex !== i) setOverIndex(i)
                      }}
                      onDrop={(e) => handleDrop(e, i)}
                      onDragEnd={resetDrag}
                      className={cn(
                        "flex items-center gap-2.5 pl-2.5 pr-2 py-3 rounded-xl border transition-all duration-150 group",
                        "cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--vd-gold)]/40",
                        selected
                          ? "bg-[var(--vd-gold)]/[0.06] border-[var(--vd-gold)]/30"
                          : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]",
                        dragIndex === i && "opacity-40 scale-[0.99]",
                        overIndex === i && dragIndex !== null && dragIndex !== i && "border-[var(--vd-gold)]/50 bg-[var(--vd-gold)]/5"
                      )}
                    >
                      <GripVertical className="size-4 text-muted-foreground/20 group-hover:text-muted-foreground/40 shrink-0 cursor-grab transition-colors" />

                      <span className={cn(
                        "shrink-0 size-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all",
                        selected
                          ? "bg-[var(--vd-gold)]/15 text-[var(--vd-gold)] border border-[var(--vd-gold)]/25"
                          : "bg-white/[0.06] text-muted-foreground/50 border border-white/[0.08]"
                      )}>
                        {i + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-[13px] font-medium text-foreground/80 group-hover:text-foreground transition-colors truncate leading-snug",
                          isEn && !hasText(q.wordingEn) && "italic text-muted-foreground/50"
                        )}>
                          {isEn && hasText(q.wordingEn) ? q.wordingEn : q.wording}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Icon className="size-3 text-muted-foreground/30" />
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", meta.badge)}>
                            {typeName ?? meta.label}
                          </span>
                          {hasIssue && (
                            <AlertCircle className="size-3.5 text-amber-400 shrink-0" aria-label="À corriger" />
                          )}
                          {isEn && enStats?.missingQuestionIds.has(q.id) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium bg-amber-500/10 border-amber-500/25 text-amber-400">
                              EN manquant
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions : toujours visibles au tactile, au survol / focus sur desktop */}
                      <div className={cn("flex items-center gap-0.5 shrink-0 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity", isEn && "hidden")}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveQuestion(i, i - 1) }}
                          disabled={i === 0 || reordering}
                          className="p-1 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Monter la question"
                          title="Monter"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveQuestion(i, i + 1) }}
                          disabled={i === questions.length - 1 || reordering}
                          className="p-1 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Descendre la question"
                          title="Descendre"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <ConfirmDialog
                          title="Supprimer la question"
                          description={`Supprimer « ${q.wording} » ? Les réponses déjà collectées pourraient être supprimées avec elle. Cette action est irréversible.`}
                          confirmLabel="Supprimer"
                          variant="destructive"
                          onConfirm={() => handleQuestionDeleted(q.id)}
                          trigger={
                            <button
                              type="button"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10"
                              aria-label="Supprimer la question"
                              title="Supprimer"
                            >
                              <IconDelete className="size-3.5" />
                            </button>
                          }
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {isEn && (
            <p className="shrink-0 border-t border-white/[0.07] px-4 py-3 text-[11px] text-muted-foreground/50 leading-relaxed">
              Mode traduction : la structure (questions, options, ordre) se modifie en FR.
            </p>
          )}

          {/* Ajout rapide */}
          {hasTypes && !isEn && (
            <div className="shrink-0 border-t border-white/[0.07] p-3 space-y-2">
              <div className="flex gap-1.5" role="radiogroup" aria-label="Type de la nouvelle question">
                {KIND_ORDER.map((kind) => {
                  const meta = KIND_META[kind]
                  const Icon = meta.icon
                  const available = typeByKind.has(kind)
                  const active = draftKind === kind
                  return (
                    <button
                      key={kind}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={!available}
                      onClick={() => setDraftKind(kind)}
                      title={available ? meta.description : "Aucun type configuré pour ce comportement"}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[11px] font-medium transition-all",
                        "disabled:opacity-30 disabled:cursor-not-allowed",
                        active
                          ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/40 text-[var(--vd-gold)]"
                          : "bg-white/[0.02] border-white/[0.08] text-muted-foreground hover:border-white/20"
                      )}
                    >
                      <Icon className="size-3.5" />
                      <span className="hidden sm:inline">{meta.shortLabel}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <Input
                  ref={draftInputRef}
                  value={draftWording}
                  readOnly={adding}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftWording(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") { e.preventDefault(); void handleAddQuestion() }
                  }}
                  placeholder="Tapez une question puis Entrée…"
                  className={cn(
                    "flex-1 h-9 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                    "placeholder:text-muted-foreground/30",
                    "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]"
                  )}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddQuestion}
                  disabled={!draftWording.trim() || adding}
                  aria-label="Ajouter la question"
                  className="h-9 w-9 p-0 border-[var(--vd-gold)]/30 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/10 rounded-xl"
                >
                  {adding ? <Loader2 className="size-3.5 animate-spin" /> : <IconPlus className="size-3.5" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Colonne éditeur (remplace l'ancienne Sheet) */}
        <section
          className={cn(
            "flex-1 min-w-0 min-h-0 flex-col",
            selectedQuestion ? "flex" : "hidden lg:flex"
          )}
        >
          {selectedQuestion ? (
            <>
              <div className="lg:hidden shrink-0 px-3 py-2 border-b border-white/[0.07]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuestionId(null)}
                  className="h-8 px-2 text-[12px] text-muted-foreground"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Questions
                </Button>
              </div>
              <div className="flex-1 min-h-0">
                <QuestionConfigPanel
                  key={selectedQuestion.id}
                  question={selectedQuestion}
                  index={questions.indexOf(selectedQuestion) + 1}
                  lang={lang}
                  questionTypes={questionTypes}
                  impressions={impressions}
                  choices={choicesByQuestion[selectedQuestion.id]}
                  onEnsureChoices={ensureChoices}
                  onChoicesChange={updateChoices}
                  onUpdated={replaceQuestion}
                  onDeleted={handleQuestionDeleted}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-3 text-muted-foreground/50 px-6 text-center">
              <div className="size-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <IconStar className="size-6 opacity-30" />
              </div>
              <p className="text-[13px]">Sélectionnez une question pour la modifier</p>
            </div>
          )}
        </section>
      </div>

      {/* Confirmation avant remplacement par le template */}
      <AlertDialog open={confirmTemplate} onOpenChange={setConfirmTemplate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remplacer les questions existantes ?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Ce questionnaire contient déjà ${questions.length} question${questions.length > 1 ? "s" : ""}. L'application du template les supprimera définitivement, avec leurs options, avant de créer les nouvelles. Cette action est irréversible.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setConfirmTemplate(false); void handleApplyTemplate() }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remplacer quand même
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}