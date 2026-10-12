"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Globe, CalendarDays, MapPin, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createQuiz } from "@/lib/api/quiz"
import { SCOPE_LABELS } from "@/lib/quiz-templates"
import type { Quiz, Event, QuizScope } from "@/lib/types/api"

interface CreateQuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: Event[]
  onCreated: (quiz: Quiz) => void
}

const SCOPE_OPTIONS: { value: QuizScope; icon: React.ReactNode }[] = [
  { value: "FESTIVAL",   icon: <Globe className="size-4" /> },
  { value: "ALL_EVENTS", icon: <CalendarDays className="size-4" /> },
  { value: "ALL_SITES",  icon: <MapPin className="size-4" /> },
  { value: "EVENT",      icon: <Star className="size-4" /> },
]

// Accent visuel par portée - cohérent avec ScopeBadge de la liste
const SCOPE_ACCENT: Record<QuizScope, { bg: string; ring: string; text: string; iconBg: string; dot: string }> = {
  FESTIVAL:   { bg: "bg-purple-500/[0.08]",       ring: "ring-purple-400/30",       text: "text-purple-300",       iconBg: "bg-purple-500/15",       dot: "bg-purple-300" },
  ALL_EVENTS: { bg: "bg-blue-500/[0.08]",         ring: "ring-blue-400/30",         text: "text-blue-300",         iconBg: "bg-blue-500/15",         dot: "bg-blue-300" },
  ALL_SITES:  { bg: "bg-teal-500/[0.08]",         ring: "ring-teal-400/30",         text: "text-teal-300",         iconBg: "bg-teal-500/15",         dot: "bg-teal-300" },
  EVENT:      { bg: "bg-[var(--vd-gold)]/[0.08]", ring: "ring-[var(--vd-gold)]/30", text: "text-[var(--vd-gold)]", iconBg: "bg-[var(--vd-gold)]/15", dot: "bg-[var(--vd-gold)]" },
}

const FIELD_CLASS =
  "bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 " +
  "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06] rounded-xl transition-all"

export function CreateQuizDialog({ open, onOpenChange, events, onCreated }: CreateQuizDialogProps) {
  const [creating, setCreating]               = useState(false)
  const [title, setTitle]                     = useState("")
  const [description, setDescription]         = useState("")
  const [selectedScope, setSelectedScope]     = useState<QuizScope>("FESTIVAL")
  const [selectedEventId, setSelectedEventId] = useState("")

  // Seuls les événements publiés sont proposés pour la portée EVENT
  const publishedEvents = events.filter((ev) => ev.status === "PUBLISHED")

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setSelectedScope("FESTIVAL")
    setSelectedEventId("")
  }

  const handleOpenChange = (next: boolean) => {
    if (creating) return // pas de fermeture pendant l'envoi
    if (!next) resetForm()
    onOpenChange(next)
  }

  const canSubmit = title.trim().length > 0 && (selectedScope !== "EVENT" || !!selectedEventId) && !creating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setCreating(true)
    try {
      const res = await createQuiz({
        title: title.trim(),
        description: description.trim() || undefined,
        scope: selectedScope,
        active: false,
        ...(selectedScope === "EVENT" && { eventId: selectedEventId }),
      })
      if (!res.success) {
        toast.error(res.message || "Erreur lors de la création")
        return
      }
      onCreated(res.data)
      resetForm()
      onOpenChange(false)
      toast.success("Questionnaire créé")
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-2xl p-0 gap-0"
        style={{ background: "oklch(0.14 0.02 260)" }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/[0.07] text-left">
            <DialogTitle className="text-[15px] font-semibold">Nouveau questionnaire</DialogTitle>
            <DialogDescription className="text-[12px] text-muted-foreground/60">
              Renseignez le nom et la portée. Vous ajouterez les questions ensuite.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="quiz-title" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Nom du questionnaire
              </Label>
              <Input
                id="quiz-title"
                autoFocus
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="ex. Satisfaction globale 2026"
                maxLength={80}
                className={cn("h-10 text-[13px]", FIELD_CLASS)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-description" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Description <span className="normal-case tracking-normal font-normal">(optionnelle)</span>
              </Label>
              <Input
                id="quiz-description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                placeholder="À quoi sert ce questionnaire ?"
                maxLength={200}
                className={cn("h-10 text-[13px]", FIELD_CLASS)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">Portée</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Portée du questionnaire">
                {SCOPE_OPTIONS.map((opt) => {
                  const meta = SCOPE_LABELS[opt.value]
                  const accent = SCOPE_ACCENT[opt.value]
                  const active = selectedScope === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedScope(opt.value)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200",
                        active
                          ? cn("border-transparent ring-1", accent.bg, accent.ring)
                          : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center size-8 rounded-lg shrink-0 transition-colors",
                        active ? accent.iconBg : "bg-white/[0.05]"
                      )}>
                        <span className={active ? accent.text : "text-muted-foreground/50"}>{opt.icon}</span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={cn("block text-[12px] font-semibold leading-tight", active ? accent.text : "text-foreground/80")}>
                          {meta.label}
                        </span>
                        <span className="block text-[10px] text-muted-foreground/50 leading-tight mt-0.5">
                          {meta.sublabel}
                        </span>
                      </span>
                      <span className={cn(
                        "size-4 rounded-full border shrink-0 flex items-center justify-center transition-all",
                        active ? "border-transparent" : "border-white/15"
                      )}>
                        {active && <span className={cn("size-1.5 rounded-full", accent.dot)} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedScope === "EVENT" && (
              <div className="space-y-2">
                <Label htmlFor="quiz-event" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                  Événement
                </Label>
                <select
                  id="quiz-event"
                  value={selectedEventId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEventId(e.target.value)}
                  className="w-full h-10 text-[13px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 text-foreground/80 focus:outline-none focus:border-[var(--vd-gold)]/40"
                >
                  <option value="">Choisir un événement...</option>
                  {publishedEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-white/[0.07] flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={creating}
              className="h-9 px-4 text-[12px] text-muted-foreground/70 hover:text-foreground border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] rounded-xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-9 px-5 text-[12px] font-semibold rounded-xl bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90"
            >
              {creating ? <Loader2 className="size-3.5 animate-spin" /> : "Créer le questionnaire"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
