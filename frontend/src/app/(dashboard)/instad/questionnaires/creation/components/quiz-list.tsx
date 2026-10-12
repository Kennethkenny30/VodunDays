"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconPlus, IconCalendar, IconSearch } from "@/components/icons"
import { CreateQuizDialog } from "./create-quiz-dialog"
import type { Quiz, Event, QuizScope } from "@/lib/types/api"

interface QuizListProps {
  quizzes: Quiz[]
  events: Event[]
  loading: boolean
  selectedQuizId: string | null
  onSelect: (id: string) => void
  onCreated: (quiz: Quiz) => void
  // Nombre de questions par questionnaire (prioritaire sur quiz.questions)
  questionCounts?: Record<string, number>
}

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
  questionCounts,
}: QuizListProps) {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch]                   = useState("")

  // Nom de l'événement ciblé par un questionnaire de portée EVENT
  const eventNameOf = (quiz: Quiz): string | undefined =>
    quiz.scope === "EVENT" ? events.find((ev) => ev.id === quiz.eventId)?.name : undefined

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

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
                    {questionCounts?.[quiz.id] ?? quiz.questions?.length ?? 0}q
                  </span>
                </div>
                {eventNameOf(quiz) && (
                  <p className="pl-3.5 mt-1 text-[10px] text-muted-foreground/50 truncate">
                    {eventNameOf(quiz)}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Bouton de création : ouvre la card modale */}
      <div className="p-3 border-t border-white/[0.07]">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-[12px] border-dashed border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40 rounded-xl transition-all"
          onClick={() => setShowForm(true)}
        >
          <IconPlus className="size-3.5 mr-1.5" />
          Nouveau questionnaire
        </Button>
      </div>

      <CreateQuizDialog
        open={showForm}
        onOpenChange={setShowForm}
        events={events}
        onCreated={onCreated}
      />
    </aside>
  )
}