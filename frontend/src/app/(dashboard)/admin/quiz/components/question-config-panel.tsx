"use client"

// TODO: Connecter au backend — remplacer toutes les mutations locales par des appels API

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { IconPlus, IconDelete } from "@/components/icons"
import { toast } from "sonner"
import type { Question, QuestionType, Impression, Answer } from "@/lib/types/api"

interface QuestionConfigPanelProps {
  question: Question
  questionTypes: QuestionType[]
  impressions: Impression[]
  onUpdated: (q: Question) => void
  onDeleted: (id: string) => void
}

// Types qui affichent la section "options de réponse"
const TYPES_WITH_CHOICES = ["type-2", "type-3"]

const TYPE_ICONS: Record<string, string> = {
  "type-1": "⭐", "type-2": "◉", "type-3": "☑", "type-4": "✎",
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

  // TODO: api.get<Answer[]>(`/answers?questionId=${question.id}`)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswerText, setNewAnswerText] = useState("")

  // TODO: api.get(`/questions-impressions?questionId=${question.id}`)
  const [impressionsLiees, setImpressionsLiees] = useState<string[]>([])

  useEffect(() => {
    setWording(question.wording)
    setQuestionTypeId(question.questionTypeId)
    setAnswers([])
    setImpressionsLiees([])
    setIsDirty(false)
  }, [question.id, question.wording, question.questionTypeId])

  useEffect(() => {
    setIsDirty(wording !== question.wording || questionTypeId !== question.questionTypeId)
  }, [wording, questionTypeId, question.wording, question.questionTypeId])

  // TODO: api.patch<Question>(`/questions/${question.id}`, { wording, questionTypeId })
  const handleSave = () => {
    if (!wording.trim()) { toast.error("Le libellé ne peut pas être vide"); return }
    onUpdated({ ...question, wording, questionTypeId })
    setIsDirty(false)
    toast.success("Question mise à jour")
  }

  // TODO: api.delete(`/questions/${question.id}`)
  const handleDelete = () => {
    onDeleted(question.id)
    toast.success("Question supprimée")
  }

  // TODO: api.post<Answer>("/answers", { response: newAnswerText, questionId: question.id })
  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return
    const a: Answer = {
      id: `answer-mock-${Date.now()}`,
      response: newAnswerText.trim(),
      questionId: question.id,
    }
    setAnswers((prev) => [...prev, a])
    setNewAnswerText("")
  }

  // TODO: api.delete(`/answers/${answerId}`)
  const handleDeleteAnswer = (answerId: string) => {
    setAnswers((prev) => prev.filter((a) => a.id !== answerId))
  }

  // TODO: api.post/delete("/questions-impressions")
  const handleToggleImpression = (impressionId: string) => {
    setImpressionsLiees((prev) =>
      prev.includes(impressionId)
        ? prev.filter((id) => id !== impressionId)
        : [...prev, impressionId]
    )
  }

  const showChoices = TYPES_WITH_CHOICES.includes(questionTypeId)

  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6 max-w-xl">

        {/* ── En-tête panneau ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Configurer la question</h3>
            <p className="text-[12px] text-muted-foreground/60 mt-0.5">
              Libellé, type, réponses et réactions
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isDirty && (
              <span className="text-[10px] font-medium text-[var(--vd-gold)] bg-[var(--vd-gold)]/10 border border-[var(--vd-gold)]/20 rounded-full px-2 py-0.5">
                Non sauvegardé
              </span>
            )}
            <ConfirmDialog
              title="Supprimer la question"
              description="Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
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

        {/* ── Libellé ──────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Libellé
          </Label>
          <Input
            value={wording}
            onChange={(e) => setWording(e.target.value)}
            placeholder="Votre question…"
            className={cn(
              "h-10 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
              "placeholder:text-muted-foreground/30",
              "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
              "transition-all duration-200"
            )}
          />
        </div>

        {/* ── Type de question ─────────────────────────────────────────── */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            Type de réponse
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
                <span className="text-[13px]">{TYPE_ICONS[type.id] ?? "◆"}</span>
                {type.types}
              </button>
            ))}
          </div>
        </div>

        {/* ── Options de réponse (choix unique/multiple uniquement) ────── */}
        {showChoices ? (
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Options de réponse
            </Label>

            {answers.length === 0 ? (
              <p className="text-[12px] text-muted-foreground/40 italic">
                Aucune option — ajoutez-en ci-dessous.
              </p>
            ) : (
              <div className="space-y-2">
                {answers.map((answer, i) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] group hover:border-white/[0.1] transition-all"
                  >
                    <span className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[13px] text-foreground/80">{answer.response}</span>
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="text-muted-foreground/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Supprimer"
                    >
                      <IconDelete className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Ajout d'option */}
            <div className="flex gap-2">
              <Input
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Nouvelle option…"
                className={cn(
                  "flex-1 h-9 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                  "placeholder:text-muted-foreground/30",
                  "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                  "transition-all"
                )}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddAnswer() }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddAnswer}
                disabled={!newAnswerText.trim()}
                className="h-9 w-9 p-0 border-white/[0.1] hover:border-[var(--vd-gold)]/30 hover:bg-[var(--vd-gold)]/8 rounded-xl transition-all"
              >
                <IconPlus className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Informatif pour les types sans choix */
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <span className="text-[16px]">{TYPE_ICONS[questionTypeId] ?? "◆"}</span>
            <p className="text-[12px] text-muted-foreground/50 leading-relaxed">
              {questionTypeId === "type-1"
                ? "Ce type utilise une notation 1–5 étoiles — pas d'options à configurer."
                : "Ce type attend une réponse libre — pas d'options à configurer."}
            </p>
          </div>
        )}

        {/* ── Impressions / réactions ──────────────────────────────────── */}
        {impressions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Réactions associées
            </Label>
            <div className="flex flex-wrap gap-2">
              {impressions.map((imp) => {
                const active = impressionsLiees.includes(imp.id)
                return (
                  <button
                    key={imp.id}
                    onClick={() => handleToggleImpression(imp.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-medium",
                      "transition-all duration-200 focus-visible:outline-none",
                      active
                        ? "bg-[var(--vd-gold)]/12 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                        : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:bg-white/[0.06]"
                    )}
                  >
                    <span className="text-[14px]">{imp.emoji}</span>
                    <span className={active ? "text-[var(--vd-gold)]" : ""}>{imp.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Séparateur ───────────────────────────────────────────────── */}
        <div className="h-px bg-white/[0.07]" />

        {/* ── Bouton sauvegarder ───────────────────────────────────────── */}
        <Button
          className={cn(
            "w-full h-10 text-[13px] font-semibold rounded-xl transition-all",
            "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90",
            "shadow-[0_0_16px_var(--vd-gold)/15]"
          )}
          onClick={handleSave}
        >
          Enregistrer la question
        </Button>
      </div>
    </ScrollArea>
  )
}