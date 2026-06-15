"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconPlus, IconCalendar, IconSearch } from "@/components/icons"
import { Globe, CalendarDays, MapPin, Star } from "lucide-react"
import { toast } from "sonner"
import { createQuiz } from "@/lib/api/quiz"
import { SCOPE_LABELS } from "@/lib/quiz-templates"
import type { Quiz, Event, QuizScope } from "@/lib/types/api"

interface QuizListProps {
  quizzes: Quiz[]
  events: Event[]
  loading: boolean
  selectedQuizId: string | null
  onSelect: (id: string) => void
  onCreated: (quiz: Quiz) => void
}

const SCOPE_OPTIONS: { value: QuizScope; icon: React.ReactNode; description: string }[] = [
  {
    value: "FESTIVAL",
    icon: <Globe className="size-4" />,
    description: "Satisfaction globale",
  },
  {
    value: "ALL_EVENTS",
    icon: <CalendarDays className="size-4" />,
    description: "Tous les spectacles",
  },
  {
    value: "ALL_SITES",
    icon: <MapPin className="size-4" />,
    description: "Tous les espaces",
  },
  {
    value: "EVENT",
    icon: <Star className="size-4" />,
    description: "Un événement précis",
  },
]

// Badge scope affiché dans la liste
function ScopeBadge({ scope }: { scope: QuizScope }) {
  const colors: Record<QuizScope, string> = {
    FESTIVAL:   "bg-purple-500/10 border-purple-500/20 text-purple-400",
    ALL_EVENTS: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    ALL_SITES:  "bg-teal-500/10 border-teal-500/20 text-teal-400",
    EVENT:      "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/20 text-[var(--vd-gold)]",
  }
  const labels: Record<QuizScope, string> = {
    FESTIVAL: "Festival", ALL_EVENTS: "Tous evt.", ALL_SITES: "Tous sites", EVENT: "Événement",
  }
  return (
    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 font-medium border", colors[scope])}>
      {labels[scope]}
    </Badge>
  )
}

export function QuizList({
  quizzes,
  events,
  loading,
  selectedQuizId,
  onSelect,
  onCreated,
}: QuizListProps) {
  const [creating, setCreating]               = useState(false)
  const [showForm, setShowForm]               = useState(false)
  const [newTitle, setNewTitle]               = useState("")
  const [newDescription, setNewDescription]   = useState("")
  const [selectedScope, setSelectedScope]     = useState<QuizScope>("FESTIVAL")
  const [selectedEventId, setSelectedEventId] = useState("")
  const [search, setSearch]                   = useState("")

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  // Seuls les événements publiés sont proposés pour le scope EVENT
  const publishedEvents = events.filter((ev) => ev.status === "PUBLISHED")

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    if (selectedScope === "EVENT" && !selectedEventId) {
      toast.error("Sélectionnez un événement")
      return
    }
    setCreating(true)
    try {
      const res = await createQuiz({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        scope: selectedScope,
        active: false,
        ...(selectedScope === "EVENT" && { eventId: selectedEventId }),
      })
      if (!res.success) {
        toast.error(res.message || "Erreur lors de la création")
        return
      }
      onCreated(res.data)
      setNewTitle("")
      setNewDescription("")
      setSelectedScope("FESTIVAL")
      setSelectedEventId("")
      setShowForm(false)
      toast.success("Questionnaire créé")
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setNewTitle("")
    setNewDescription("")
    setSelectedScope("FESTIVAL")
    setSelectedEventId("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") resetForm()
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-transparent">

      {/* En-tête */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Questionnaires
        </span>
        <Badge
          variant="secondary"
          className="bg-white/[0.06] text-muted-foreground border-white/[0.08] text-[10px] font-mono h-5 px-1.5"
        >
          {quizzes.length}
        </Badge>
      </div>

      {/* Recherche */}
      <div className="px-3 py-2.5 border-b border-white/[0.07]">
        <div className="relative">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[12px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06] rounded-lg transition-all"
          />
        </div>
      </div>

      {/* Liste */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <EmptyState icon={IconCalendar} title="Chargement..." description="" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={IconCalendar}
              title={search ? "Aucun résultat" : "Aucun questionnaire"}
              description={search ? "" : "Créez votre premier questionnaire."}
            />
          ) : (
            filtered.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => onSelect(quiz.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 group",
                  "hover:bg-white/[0.04]",
                  selectedQuizId === quiz.id
                    ? "bg-white/[0.06] border-[var(--vd-gold)]/30 shadow-[inset_0_0_0_1px_rgba(200,145,58,0.1)]"
                    : "border-transparent"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    "size-1.5 rounded-full shrink-0 transition-colors",
                    quiz.active ? "bg-[var(--vd-gold)]" : "bg-white/20"
                  )} />
                  <p className={cn(
                    "text-[13px] font-medium truncate leading-none transition-colors",
                    selectedQuizId === quiz.id ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                  )}>
                    {quiz.title}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pl-3.5 flex-wrap">
                  <ScopeBadge scope={quiz.scope} />
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 font-medium border",
                      quiz.active
                        ? "bg-green-500/8 border-green-500/20 text-green-400"
                        : "bg-white/[0.03] border-white/[0.08] text-muted-foreground/50"
                    )}
                  >
                    {quiz.active ? "Actif" : "Inactif"}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/40 font-mono">
                    {quiz.questions?.length ?? 0}q
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Formulaire de création ou bouton */}
      <div className="p-3 border-t border-white/[0.07] space-y-2">
        {showForm ? (
          <div className="space-y-2.5">
            {/* Titre */}
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nom du questionnaire..."
              maxLength={80}
              className="h-8 text-[12px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06] rounded-lg transition-all"
            />

            {/* Description */}
            <Input
              value={newDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value)}
              placeholder="Description (optionnelle)..."
              maxLength={200}
              className="h-8 text-[12px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06] rounded-lg transition-all"
            />

            {/* Sélecteur de portée - grille 2x2 */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-1.5">
                Portée
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {SCOPE_OPTIONS.map((opt) => {
                  const meta = SCOPE_LABELS[opt.value]
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedScope(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-center transition-all duration-150",
                        selectedScope === opt.value
                          ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                          : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                    >
                      <span className={cn(
                        "transition-colors",
                        selectedScope === opt.value ? "text-[var(--vd-gold)]" : "text-muted-foreground/50"
                      )}>
                        {opt.icon}
                      </span>
                      <span className="text-[10px] font-semibold leading-tight">{meta.label}</span>
                      <span className="text-[9px] opacity-60 leading-tight">{meta.sublabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sélecteur d'événement - uniquement pour scope EVENT, filtre sur PUBLISHED */}
            {selectedScope === "EVENT" && (
              <select
                value={selectedEventId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEventId(e.target.value)}
                className="w-full h-8 text-[12px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 text-foreground/80 focus:outline-none focus:border-[var(--vd-gold)]/40"
              >
                <option value="">Choisir un événement...</option>
                {publishedEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-7 text-[11px] text-muted-foreground/70 hover:text-foreground border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]"
                onClick={resetForm}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                className="flex-1 h-7 text-[11px] bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 font-semibold"
                onClick={handleCreate}
                disabled={!newTitle.trim() || (selectedScope === "EVENT" && !selectedEventId) || creating}
              >
                {creating ? "..." : "Créer"}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-[12px] border-dashed border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40 rounded-xl transition-all"
            onClick={() => setShowForm(true)}
          >
            <IconPlus className="size-3.5 mr-1.5" />
            Nouveau questionnaire
          </Button>
        )}
      </div>
    </aside>
  )
}
