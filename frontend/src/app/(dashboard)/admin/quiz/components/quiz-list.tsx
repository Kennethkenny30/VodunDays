"use client"

// TODO: Connecter au backend — remplacer handleCreate par api.post("/quiz", {...})

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconPlus, IconCalendar, IconSearch } from "@/components/icons"
import type { Quiz } from "@/lib/types/api"

interface QuizListProps {
  quizzes: Quiz[]
  loading: boolean
  selectedQuizId: string | null
  onSelect: (id: string) => void
  onCreated: (quiz: Quiz) => void
}

export function QuizList({
  quizzes,
  loading,
  selectedQuizId,
  onSelect,
  onCreated,
}: QuizListProps) {
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [search, setSearch] = useState("")

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  // TODO: Remplacer par api.post<Quiz>("/quiz", { title, description, active, eventId })
  const handleCreate = () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const quiz: Quiz = {
      id: `quiz-mock-${Date.now()}`,
      title: newTitle.trim(),
      description: "",
      active: false,
      eventId: "event-mock",
      questions: [],
    }
    onCreated(quiz)
    setNewTitle("")
    setShowForm(false)
    setCreating(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") { setShowForm(false); setNewTitle("") }
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
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[12px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06] rounded-lg transition-all"
          />
        </div>
      </div>

      {/* Liste */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <EmptyState
              icon={IconCalendar}
              title="Chargement…"
              description=""
            />
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
                {/* Indicateur + titre */}
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
                {/* Meta */}
                <div className="flex items-center gap-2 pl-3.5">
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
          <div className="space-y-2">
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nom du questionnaire…"
              maxLength={80}
              className="h-8 text-[12px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30 focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06] rounded-lg transition-all"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-7 text-[11px] text-muted-foreground/70 hover:text-foreground border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]"
                onClick={() => { setShowForm(false); setNewTitle("") }}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                className="flex-1 h-7 text-[11px] bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 font-semibold"
                onClick={handleCreate}
                disabled={!newTitle.trim() || creating}
              >
                Créer
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