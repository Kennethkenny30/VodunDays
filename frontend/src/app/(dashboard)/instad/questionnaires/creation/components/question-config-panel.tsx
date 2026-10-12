"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { IconPlus, IconDelete } from "@/components/icons"
import { AlertCircle, Check, Loader2, RotateCw, Sparkles } from "lucide-react"
import { toast } from "sonner"
import {
  updateQuestion,
  createChoice,
  updateChoice,
  deleteChoice,
  getQuestionsImpressions,
  linkImpression,
  unlinkImpression,
} from "@/lib/api/questions"
import { DEFAULT_QUESTION_WORDING, kindHasChoices, kindIcon, kindIsRating } from "@/lib/question-kinds"
import { MIN_CHOICES } from "@/lib/quiz-validation"
import { sameText, type Lang } from "@/lib/quiz-i18n"
import type { Question, QuestionCreatePayload, QuestionType, QuestionKind, Impression, Choice } from "@/lib/types/api"

interface QuestionConfigPanelProps {
  question: Question
  // Position (1-based) de la question dans le questionnaire
  index: number
  // Langue d'édition : FR = structure et libellés, EN = traductions uniquement
  lang: Lang
  questionTypes: QuestionType[]
  impressions: Impression[]
  // Options de la question ; undefined tant qu'elles ne sont pas chargées
  choices: Choice[] | undefined
  onEnsureChoices: (questionId: string) => Promise<boolean>
  onChoicesChange: (questionId: string, updater: (prev: Choice[]) => Choice[]) => void
  onUpdated: (q: Question) => void
  // Retourne true si la suppression a réussi
  onDeleted: (id: string) => Promise<boolean>
}

type SaveState = "idle" | "pending" | "saving" | "saved" | "error" | "invalid"

const AUTOSAVE_DELAY_MS = 800

const EN_NOT_CONFIRMED = {
  title: "Traduction EN non confirmée par le serveur",
  description: "La réponse ne contient pas la traduction envoyée : vérifiez que l'API la prend bien en charge.",
}

// Champs modifiés par rapport à la question enregistrée. Le libellé FR vide
// n'est jamais envoyé (il est signalé « requis ») ; le libellé EN, lui, peut
// être vidé.
function buildPayload(
  values: { wording: string; wordingEn: string; questionTypeId: string },
  saved: Question
): Partial<QuestionCreatePayload> {
  const payload: Partial<QuestionCreatePayload> = {}
  const wording = values.wording.trim()
  if (wording && wording !== saved.wording) payload.wording = wording
  if (values.questionTypeId !== saved.questionTypeId) payload.questionTypeId = values.questionTypeId
  const wordingEn = values.wordingEn.trim()
  if (wordingEn !== (saved.wordingEn ?? "").trim()) payload.wordingEn = wordingEn
  return payload
}

function SaveIndicator({ state, onRetry }: { state: SaveState; onRetry: () => void }) {
  switch (state) {
    case "pending":
      return <p className="text-[11px] text-muted-foreground/50 mt-0.5">Modifications en attente…</p>
    case "saving":
      return (
        <p className="text-[11px] text-muted-foreground/60 mt-0.5 flex items-center gap-1.5">
          <Loader2 className="size-3 animate-spin" /> Enregistrement…
        </p>
      )
    case "saved":
      return (
        <p className="text-[11px] text-green-400/80 mt-0.5 flex items-center gap-1.5">
          <Check className="size-3" /> Enregistré
        </p>
      )
    case "invalid":
      return <p className="text-[11px] text-amber-400/80 mt-0.5">Le libellé FR est requis pour enregistrer.</p>
    case "error":
      return (
        <p className="text-[11px] text-red-400/80 mt-0.5 flex items-center gap-1.5">
          Échec de l&apos;enregistrement
          <button type="button" onClick={onRetry} className="underline underline-offset-2 hover:text-red-300">
            Réessayer
          </button>
        </p>
      )
    default:
      return <p className="text-[11px] text-muted-foreground/50 mt-0.5">Les modifications sont enregistrées automatiquement.</p>
  }
}

// Ligne de traduction EN d'une option : texte FR en référence, saisie EN
// enregistrée à la sortie du champ.
function ChoiceEnRow({ choice, index, onSaved }: { choice: Choice; index: number; onSaved: (c: Choice) => void }) {
  const [value, setValue] = useState(choice.wordingEn ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValue(choice.wordingEn ?? "")
  }, [choice.wordingEn])

  const commit = async () => {
    if (saving || sameText(choice.wordingEn, value)) return
    setSaving(true)
    try {
      const res = await updateChoice(choice.id, { wordingEn: value.trim() })
      if (!res.success) { toast.error(res.message || "Erreur lors de la sauvegarde"); return }
      onSaved(res.data)
      if (!sameText(res.data.wordingEn, value)) toast.warning(EN_NOT_CONFIRMED.title, { description: EN_NOT_CONFIRMED.description })
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-3.5 py-2.5 space-y-2">
      <div className="flex items-center gap-2.5">
        <span className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 shrink-0">
          {index}
        </span>
        <span className="flex-1 min-w-0 text-[12px] text-muted-foreground/70 break-words">{choice.wording}</span>
        {saving && <Loader2 className="size-3.5 animate-spin text-muted-foreground/50 shrink-0" />}
      </div>
      <Input
        value={value}
        readOnly={saving}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onBlur={() => { void commit() }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur() }
        }}
        placeholder="English option…"
        className={cn(
          "h-9 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
          "placeholder:text-muted-foreground/30",
          "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]"
        )}
      />
    </div>
  )
}

export function QuestionConfigPanel({
  question,
  index,
  lang,
  questionTypes,
  impressions,
  choices,
  onEnsureChoices,
  onChoicesChange,
  onUpdated,
  onDeleted,
}: QuestionConfigPanelProps) {
  const isEn = lang === "en"

  const [wording, setWording] = useState(question.wording)
  const [wordingEn, setWordingEn] = useState(question.wordingEn ?? "")
  const [questionTypeId, setQuestionTypeId] = useState(question.questionTypeId)
  const [saveState, setSaveState] = useState<SaveState>("idle")

  const [choicesFailed, setChoicesFailed] = useState(false)
  const [newChoiceText, setNewChoiceText] = useState("")
  const [addingChoice, setAddingChoice] = useState(false)

  const [loadingImpressions, setLoadingImpressions] = useState(true)
  const [linkedImpressionIds, setLinkedImpressionIds] = useState<string[]>([])
  const [togglingImpression, setTogglingImpression] = useState<string | null>(null)

  const wordingInputRef = useRef<HTMLInputElement>(null)
  const choiceInputRef = useRef<HTMLInputElement>(null)

  // ── Autosave ────────────────────────────────────────────────────────────
  // Le panneau est remonté à chaque changement de question (key={question.id}).
  // Les valeurs courantes passent par une ref pour que persist() reste stable :
  // il est appelé par le debounce, au blur, et une dernière fois au démontage.
  const latest = useRef({ wording, wordingEn, questionTypeId, question })
  latest.current = { wording, wordingEn, questionTypeId, question }
  const onUpdatedRef = useRef(onUpdated)
  onUpdatedRef.current = onUpdated
  const seqRef = useRef(0)
  const lastSentRef = useRef("")
  const deletedRef = useRef(false)

  const hasChanges = useMemo(
    () => Object.keys(buildPayload({ wording, wordingEn, questionTypeId }, question)).length > 0,
    [wording, wordingEn, questionTypeId, question]
  )
  const wordingMissing = wording.trim() === ""

  const persist = useCallback(async () => {
    if (deletedRef.current) return
    const { wording: w, wordingEn: wEn, questionTypeId: typeId, question: q } = latest.current
    const payload = buildPayload({ wording: w, wordingEn: wEn, questionTypeId: typeId }, q)
    if (Object.keys(payload).length === 0) return

    const signature = JSON.stringify(payload)
    if (signature === lastSentRef.current) return
    lastSentRef.current = signature

    const seq = ++seqRef.current
    setSaveState("saving")
    try {
      const res = await updateQuestion(q.id, payload)
      if (!res.success) {
        lastSentRef.current = ""
        toast.error(res.message || "Erreur lors de la sauvegarde")
        if (seq === seqRef.current) setSaveState("error")
        return
      }
      // Une sauvegarde plus récente est en cours : son résultat fera foi
      if (seq !== seqRef.current) return
      onUpdatedRef.current(res.data)
      setSaveState("saved")
      if (payload.wordingEn !== undefined && !sameText(res.data.wordingEn, payload.wordingEn)) {
        toast.warning(EN_NOT_CONFIRMED.title, { description: EN_NOT_CONFIRMED.description })
      }
    } catch {
      lastSentRef.current = ""
      toast.error("Erreur réseau")
      if (seq === seqRef.current) setSaveState("error")
    }
  }, [])

  // Sauvegarde différée à chaque modification
  useEffect(() => {
    if (!hasChanges) {
      setSaveState((s) => (wordingMissing ? "invalid" : s === "saved" || s === "saving" ? s : "idle"))
      return
    }
    setSaveState(wordingMissing ? "invalid" : "pending")
    const timer = setTimeout(() => { void persist() }, AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [wording, wordingEn, questionTypeId, hasChanges, wordingMissing, persist])

  // Dernière sauvegarde au démontage (changement de question ou fermeture) :
  // évite de perdre une modification faite moins d'une seconde avant.
  useEffect(() => () => { void persist() }, [persist])

  // Questions héritées de l'ancien flux : libellé par défaut sélectionné
  // d'emblée, prêt à être remplacé par la première frappe.
  useEffect(() => {
    if (!isEn && question.wording === DEFAULT_QUESTION_WORDING) {
      wordingInputRef.current?.focus()
      wordingInputRef.current?.select()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Impressions (réactions) ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingImpressions(true)
      try {
        const res = await getQuestionsImpressions(question.id)
        if (cancelled) return
        if (res.success) setLinkedImpressionIds(res.data.map((qi) => qi.impressionId))
      } catch {
        if (!cancelled) toast.error("Impossible de charger les réactions de la question")
      } finally {
        if (!cancelled) setLoadingImpressions(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [question.id])

  // ── Type et options ─────────────────────────────────────────────────────
  const selectedKind: QuestionKind = questionTypes.find((t) => t.id === questionTypeId)?.kind ?? "TEXT"
  const showChoices = kindHasChoices(selectedKind)
  const isRating = kindIsRating(selectedKind)

  // Charge les options dès que le type sélectionné les utilise
  useEffect(() => {
    if (!showChoices || choices !== undefined || choicesFailed) return
    let cancelled = false
    onEnsureChoices(question.id).then((ok) => {
      if (!cancelled && !ok) setChoicesFailed(true)
    })
    return () => { cancelled = true }
  }, [showChoices, choices, choicesFailed, question.id, onEnsureChoices])

  const handleAddChoice = async () => {
    const text = newChoiceText.trim()
    if (!text || !choices || addingChoice) return
    if (choices.some((c) => c.wording.trim().toLowerCase() === text.toLowerCase())) {
      toast.error("Cette option existe déjà")
      return
    }
    setAddingChoice(true)
    try {
      const res = await createChoice({ wording: text, questionId: question.id })
      if (!res.success) { toast.error(res.message || "Erreur lors de l'ajout"); return }
      onChoicesChange(question.id, (prev) => [...prev, res.data])
      setNewChoiceText("")
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setAddingChoice(false)
      choiceInputRef.current?.focus()
    }
  }

  const handleDeleteChoice = async (choiceId: string) => {
    try {
      const res = await deleteChoice(choiceId)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return }
      onChoicesChange(question.id, (prev) => prev.filter((c) => c.id !== choiceId))
    } catch {
      toast.error("Erreur réseau")
    }
  }

  const handleToggleImpression = async (impressionId: string) => {
    if (togglingImpression) return
    setTogglingImpression(impressionId)
    const isLinked = linkedImpressionIds.includes(impressionId)
    try {
      if (isLinked) {
        const res = await unlinkImpression(question.id, impressionId)
        if (!res.success) { toast.error(res.message || "Erreur"); return }
        setLinkedImpressionIds((prev) => prev.filter((id) => id !== impressionId))
      } else {
        const res = await linkImpression(question.id, impressionId)
        if (!res.success) { toast.error(res.message || "Erreur"); return }
        setLinkedImpressionIds((prev) => [...prev, impressionId])
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setTogglingImpression(null)
    }
  }

  const handleDelete = async () => {
    // Empêche la sauvegarde de démontage de viser une question supprimée
    deletedRef.current = true
    const ok = await onDeleted(question.id)
    if (!ok) deletedRef.current = false
  }

  const loadingChoices = showChoices && choices === undefined && !choicesFailed

  const choicesLoadingNode = (
    <div className="flex items-center gap-2 text-muted-foreground/40 py-2">
      <Loader2 className="size-3.5 animate-spin" />
      <span className="text-[12px]">Chargement des options…</span>
    </div>
  )

  const choicesFailedNode = (
    <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/5 border border-red-500/20">
      <AlertCircle className="size-4 text-red-400 shrink-0" />
      <p className="flex-1 text-[12px] text-red-400/80">Impossible de charger les options.</p>
      <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => setChoicesFailed(false)}>
        <RotateCw className="size-3 mr-1.5" /> Réessayer
      </Button>
    </div>
  )

  const orphanChoices = !showChoices && (choices?.length ?? 0) > 0

  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6 max-w-xl">

        {/* En-tête */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center size-9 rounded-xl bg-[var(--vd-gold)]/10 border border-[var(--vd-gold)]/20 shrink-0">
              <Sparkles className="size-4 text-[var(--vd-gold)]" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">
                {isEn ? `Question ${index} · Traduction EN` : `Question ${index}`}
              </h3>
              <SaveIndicator
                state={saveState}
                onRetry={() => { lastSentRef.current = ""; void persist() }}
              />
            </div>
          </div>
          {!isEn && (
            <ConfirmDialog
              title="Supprimer la question"
              description="Êtes-vous sûr de vouloir supprimer cette question ? Les réponses déjà collectées pourraient être supprimées avec elle. Cette action est irréversible."
              confirmLabel="Supprimer"
              variant="destructive"
              onConfirm={handleDelete}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label="Supprimer la question"
                  className="h-8 w-8 p-0 shrink-0 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <IconDelete className="size-3.5" />
                </Button>
              }
            />
          )}
        </div>

        {isEn ? (
          <>
            {/* Libellé : FR en référence, EN en saisie */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Libellé (FR)
              </Label>
              <p className="text-[13px] text-muted-foreground bg-white/[0.025] border border-white/[0.06] rounded-xl px-3.5 py-2.5 break-words">
                {question.wording}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Libellé (EN)
              </Label>
              <Input
                value={wordingEn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWordingEn(e.target.value)}
                onBlur={() => { void persist() }}
                placeholder="English wording…"
                className={cn(
                  "h-10 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                  "placeholder:text-muted-foreground/30",
                  "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                  "transition-all duration-200"
                )}
              />
            </div>

            {/* Options : traduction ligne par ligne */}
            {showChoices && (
              loadingChoices ? choicesLoadingNode
                : choicesFailed ? choicesFailedNode
                : choices ? (
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                      Options (EN)
                    </Label>
                    {choices.length === 0 ? (
                      <p className="text-[12px] text-muted-foreground/40 italic">
                        Aucune option à traduire - ajoutez-en d&apos;abord en mode FR.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {choices.map((choice, i) => (
                          <ChoiceEnRow
                            key={choice.id}
                            choice={choice}
                            index={i + 1}
                            onSaved={(updated) =>
                              onChoicesChange(question.id, (prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : null
            )}
          </>
        ) : (
          <>
            {/* Libellé */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Libellé
              </Label>
              <Input
                ref={wordingInputRef}
                value={wording}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWording(e.target.value)}
                onBlur={() => { void persist() }}
                placeholder="Votre question…"
                className={cn(
                  "h-10 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                  "placeholder:text-muted-foreground/30",
                  "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                  "transition-all duration-200"
                )}
              />
            </div>

            {/* Type de réponse */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Type de réponse
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {questionTypes.map((type) => {
                  const Icon = kindIcon(type.kind)
                  const active = questionTypeId === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setQuestionTypeId(type.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left",
                        "transition-all duration-200 focus-visible:outline-none",
                        active
                          ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                          : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-white/[0.06]"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center size-7 rounded-lg shrink-0 transition-colors",
                        active ? "bg-[var(--vd-gold)]/15" : "bg-white/[0.05]"
                      )}>
                        <Icon className="size-3.5" />
                      </span>
                      <span className="text-[12px] font-medium truncate">{type.types}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Options de réponse (QCM uniquement) */}
            {loadingChoices ? (
              choicesLoadingNode
            ) : showChoices && choicesFailed ? (
              choicesFailedNode
            ) : showChoices && choices ? (
              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                  Options de réponse
                </Label>

                {choices.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground/40 italic">
                    Aucune option - ajoutez-en ci-dessous.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {choices.map((choice, i) => (
                      <div
                        key={choice.id}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] group hover:border-white/[0.1] transition-all"
                      >
                        <span className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0 text-[13px] text-foreground/80 break-words">{choice.wording}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteChoice(choice.id)}
                          className="text-muted-foreground/40 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-all"
                          title="Supprimer l'option"
                          aria-label={`Supprimer l'option ${choice.wording}`}
                        >
                          <IconDelete className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {choices.length < MIN_CHOICES && (
                  <p className="text-[11px] text-amber-400/80">
                    {`Ajoutez au moins ${MIN_CHOICES} options pour pouvoir activer le questionnaire.`}
                  </p>
                )}

                <div className="flex gap-2">
                  <Input
                    ref={choiceInputRef}
                    value={newChoiceText}
                    readOnly={addingChoice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChoiceText(e.target.value)}
                    placeholder="Nouvelle option…"
                    className={cn(
                      "flex-1 h-9 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                      "placeholder:text-muted-foreground/30",
                      "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                      "transition-all"
                    )}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") { e.preventDefault(); void handleAddChoice() }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Ajouter l'option"
                    onClick={handleAddChoice}
                    disabled={!newChoiceText.trim() || addingChoice}
                    className="h-9 w-9 p-0 border-white/[0.1] hover:border-[var(--vd-gold)]/30 hover:bg-[var(--vd-gold)]/8 rounded-xl transition-all"
                  >
                    {addingChoice ? <Loader2 className="size-3.5 animate-spin" /> : <IconPlus className="size-3.5" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                  <p className="text-[12px] text-muted-foreground/50 leading-relaxed">
                    {isRating
                      ? "Ce type utilise une notation de 1 à 5 étoiles - pas d'options à configurer."
                      : "Ce type attend une réponse libre - pas d'options à configurer."}
                  </p>
                </div>
                {orphanChoices && (
                  <p className="text-[11px] text-muted-foreground/50">
                    {`Cette question conserve ${choices?.length} option${(choices?.length ?? 0) > 1 ? "s" : ""} inutilisée${(choices?.length ?? 0) > 1 ? "s" : ""} avec ce type. Elles réapparaîtront si vous revenez à un type à choix.`}
                  </p>
                )}
              </div>
            )}

            {/* Réactions associées */}
            {!loadingImpressions && impressions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                  Réactions associées
                </Label>
                <div className="flex flex-wrap gap-2">
                  {impressions.map((imp) => {
                    const active = linkedImpressionIds.includes(imp.id)
                    return (
                      <button
                        key={imp.id}
                        type="button"
                        onClick={() => handleToggleImpression(imp.id)}
                        disabled={togglingImpression === imp.id}
                        aria-pressed={active}
                        className={cn(
                          "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-medium",
                          "transition-all duration-200 focus-visible:outline-none",
                          active
                            ? "bg-[var(--vd-gold)]/12 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                            : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:bg-white/[0.06]",
                          togglingImpression === imp.id && "opacity-50"
                        )}
                      >
                        {/* imp.emoji est un champ BDD, pas un emoji codé en dur */}
                        <span className="text-[14px]">{imp.emoji}</span>
                        <span>{imp.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}