"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { IconPlus, IconDelete } from "@/components/icons"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  updateQuestion,
  getChoices,
  createChoice,
  deleteChoice,
  getQuestionsImpressions,
  linkImpression,
  unlinkImpression,
} from "@/lib/api/questions"
import type { Question, QuestionType, QuestionKind, Impression, Choice } from "@/lib/types/api"

interface QuestionConfigPanelProps {
  question: Question
  questionTypes: QuestionType[]
  impressions: Impression[]
  onUpdated: (q: Question) => void
  onDeleted: (id: string) => void
}

function kindShowsChoices(kind: QuestionKind): boolean {
  return kind === "SINGLE" || kind === "MULTIPLE"
}

function kindIsRating(kind: QuestionKind): boolean {
  return kind === "RATING"
}

export function QuestionConfigPanel({
  question,
  questionTypes,
  impressions,
  onUpdated,
  onDeleted,
}: QuestionConfigPanelProps) {
  const [wording, setWording] = useState(question.wording)
  const [questionTypeId, setQuestionTypeId] = useState(question.questionTypeId)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const [choices, setChoices] = useState<Choice[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)
  const [newChoiceText, setNewChoiceText] = useState("")
  const [addingChoice, setAddingChoice] = useState(false)

  const [linkedImpressionIds, setLinkedImpressionIds] = useState<string[]>([])
  const [togglingImpression, setTogglingImpression] = useState<string | null>(null)

  // Recharge choices et impressions a chaque changement de question.
  // Le composant remonte via key={question.id} donc wording/typeId/isDirty sont deja reinitialises.
  useEffect(() => {
    const loadRelated = async () => {
      setLoadingRelated(true)
      try {
        const [choicesRes, impRes] = await Promise.all([
          getChoices(question.id),
          getQuestionsImpressions(question.id),
        ])
        if (choicesRes.success) setChoices(choicesRes.data)
        if (impRes.success) setLinkedImpressionIds(impRes.data.map((qi: { impressionId: string }) => qi.impressionId))
      } catch {
        toast.error("Impossible de charger les donnees de la question")
      } finally {
        setLoadingRelated(false)
      }
    }
    loadRelated()
  }, [question.id])

  useEffect(() => {
    setIsDirty(
      wording !== question.wording ||
      questionTypeId !== question.questionTypeId
    )
  }, [wording, questionTypeId, question.wording, question.questionTypeId])

  const handleSave = async () => {
    if (!wording.trim()) { toast.error("Le libelle ne peut pas etre vide"); return }
    setSaving(true)
    try {
      const res = await updateQuestion(question.id, { wording, questionTypeId })
      if (!res.success) { toast.error(res.message || "Erreur lors de la sauvegarde"); return }
      onUpdated(res.data)
      setIsDirty(false)
      toast.success("Question mise a jour")
    } catch {
      toast.error("Erreur reseau")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    onDeleted(question.id)
  }

  const handleAddChoice = async () => {
    if (!newChoiceText.trim()) return
    setAddingChoice(true)
    try {
      const res = await createChoice({ wording: newChoiceText.trim(), questionId: question.id })
      if (!res.success) { toast.error(res.message || "Erreur lors de l'ajout"); return }
      setChoices((prev) => [...prev, res.data])
      setNewChoiceText("")
    } catch {
      toast.error("Erreur reseau")
    } finally {
      setAddingChoice(false)
    }
  }

  const handleDeleteChoice = async (choiceId: string) => {
    try {
      const res = await deleteChoice(choiceId)
      if (!res.success) { toast.error(res.message || "Erreur lors de la suppression"); return }
      setChoices((prev) => prev.filter((c) => c.id !== choiceId))
    } catch {
      toast.error("Erreur reseau")
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
      toast.error("Erreur reseau")
    } finally {
      setTogglingImpression(null)
    }
  }

  const selectedKind: QuestionKind =
    questionTypes.find((t) => t.id === questionTypeId)?.kind ?? "TEXT"
  const showChoices = kindShowsChoices(selectedKind)
  const isRating = kindIsRating(selectedKind)

  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6 max-w-xl">

        {/* En-tete panneau */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Configurer la question</h3>
            <p className="text-[12px] text-muted-foreground/60 mt-0.5">
              Libelle, type, options et reactions
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isDirty && (
              <span className="text-[10px] font-medium text-[var(--vd-gold)] bg-[var(--vd-gold)]/10 border border-[var(--vd-gold)]/20 rounded-full px-2 py-0.5">
                Non sauvegarde
              </span>
            )}
            <ConfirmDialog
              title="Supprimer la question"
              description="Etes-vous sur de vouloir supprimer cette question ? Cette action est irreversible."
              confirmLabel="Supprimer"
              variant="destructive"
              onConfirm={handleDelete}
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <IconDelete className="size-3.5" />
                </Button>
              }
            />
          </div>
        </div>

        {/* Libelle */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Libelle
          </Label>
          <Input
            value={wording}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWording(e.target.value)}
            placeholder="Votre question..."
            className={cn(
              "h-10 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
              "placeholder:text-muted-foreground/30",
              "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
              "transition-all duration-200"
            )}
          />
        </div>

        {/* Type de question */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Type de reponse
          </Label>
          <div className="flex flex-wrap gap-2">
            {questionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setQuestionTypeId(type.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[12px] font-medium",
                  "transition-all duration-200 focus-visible:outline-none",
                  questionTypeId === type.id
                    ? "bg-[var(--vd-gold)]/12 border-[var(--vd-gold)]/50 text-[var(--vd-gold)] shadow-[0_0_0_1px_var(--vd-gold)/15]"
                    : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:text-foreground hover:bg-white/[0.06]"
                )}
              >
                {type.types}
              </button>
            ))}
          </div>
        </div>

        {/* Options de reponse (QCM uniquement) */}
        {loadingRelated ? (
          <div className="flex items-center gap-2 text-muted-foreground/40 py-2">
            <Loader2 className="size-3.5 animate-spin" />
            <span className="text-[12px]">Chargement...</span>
          </div>
        ) : showChoices ? (
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Options de reponse
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
                    <span className="flex-1 text-[13px] text-foreground/80">{choice.wording}</span>
                    <button
                      onClick={() => handleDeleteChoice(choice.id)}
                      className="text-muted-foreground/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Supprimer"
                    >
                      <IconDelete className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newChoiceText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChoiceText(e.target.value)}
                placeholder="Nouvelle option..."
                className={cn(
                  "flex-1 h-9 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                  "placeholder:text-muted-foreground/30",
                  "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                  "transition-all"
                )}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleAddChoice() }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddChoice}
                disabled={!newChoiceText.trim() || addingChoice}
                className="h-9 w-9 p-0 border-white/[0.1] hover:border-[var(--vd-gold)]/30 hover:bg-[var(--vd-gold)]/8 rounded-xl transition-all"
              >
                <IconPlus className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          // Informatif pour les types sans choix
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <p className="text-[12px] text-muted-foreground/50 leading-relaxed">
              {isRating
                ? "Ce type utilise une notation 1-5 etoiles - pas d'options a configurer."
                : "Ce type attend une reponse libre - pas d'options a configurer."}
            </p>
          </div>
        )}

        {/* Impressions / reactions */}
        {!loadingRelated && impressions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Reactions associees
            </Label>
            <div className="flex flex-wrap gap-2">
              {impressions.map((imp) => {
                const active = linkedImpressionIds.includes(imp.id)
                return (
                  <button
                    key={imp.id}
                    onClick={() => handleToggleImpression(imp.id)}
                    disabled={togglingImpression === imp.id}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-medium",
                      "transition-all duration-200 focus-visible:outline-none",
                      active
                        ? "bg-[var(--vd-gold)]/12 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                        : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:bg-white/[0.06]",
                      togglingImpression === imp.id && "opacity-50"
                    )}
                  >
                    {/* imp.emoji est un champ BDD, pas un emoji code en dur */}
                    <span className="text-[14px]">{imp.emoji}</span>
                    <span className={active ? "text-[var(--vd-gold)]" : ""}>{imp.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="h-px bg-white/[0.07]" />

        <Button
          className={cn(
            "w-full h-10 text-[13px] font-semibold rounded-xl transition-all",
            "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90",
            "shadow-[0_0_16px_var(--vd-gold)/15]"
          )}
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          {saving ? "Sauvegarde..." : "Enregistrer la question"}
        </Button>
      </div>
    </ScrollArea>
  )
}
