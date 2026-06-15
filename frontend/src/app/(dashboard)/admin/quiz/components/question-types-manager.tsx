"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { IconPlus, IconDelete } from "@/components/icons"
import { Star, Circle, CheckSquare, AlignLeft, Settings } from "lucide-react"
import { toast } from "sonner"
import {
  getQuestionTypes,
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
} from "@/lib/api/questions"
import type { QuestionType, QuestionKind } from "@/lib/types/api"

interface QuestionTypesManagerProps {
  onTypesChanged: (types: QuestionType[]) => void
}

const KIND_OPTIONS: { value: QuestionKind; label: string; description: string }[] = [
  { value: "RATING",   label: "Note étoilée",   description: "Notation 1-5 étoiles" },
  { value: "SINGLE",   label: "Choix unique",   description: "Une seule réponse"    },
  { value: "MULTIPLE", label: "Choix multiple", description: "Plusieurs réponses"   },
  { value: "TEXT",     label: "Texte libre",    description: "Réponse ouverte"      },
]

const KIND_COLORS: Record<QuestionKind, string> = {
  RATING:   "bg-amber-500/10 border-amber-500/25 text-amber-400",
  SINGLE:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
  MULTIPLE: "bg-purple-500/10 border-purple-500/25 text-purple-400",
  TEXT:     "bg-slate-500/10 border-slate-500/25 text-slate-400",
}

function kindIcon(kind: QuestionKind) {
  switch (kind) {
    case "RATING":   return Star
    case "SINGLE":   return Circle
    case "MULTIPLE": return CheckSquare
    default:         return AlignLeft
  }
}

export function QuestionTypesManager({ onTypesChanged }: QuestionTypesManagerProps) {
  const [types, setTypes]                   = useState<QuestionType[]>([])
  const [loadingTypes, setLoadingTypes]     = useState(true)
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)

  const [formName, setFormName] = useState("")
  const [formKind, setFormKind] = useState<QuestionKind>("TEXT")
  const [saving, setSaving]     = useState(false)
  const [isDirty, setIsDirty]   = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoadingTypes(true)
      try {
        const res = await getQuestionTypes()
        if (res.success) setTypes(res.data)
        else toast.error("Impossible de charger les types")
      } catch {
        toast.error("Erreur réseau")
      } finally {
        setLoadingTypes(false)
      }
    }
    load()
  }, [])

  // Calcule isDirty selon le mode (création ou édition)
  useEffect(() => {
    if (selectedTypeId === null) {
      setIsDirty(formName.trim().length > 0)
    } else {
      const original = types.find((t) => t.id === selectedTypeId)
      setIsDirty(
        !!original &&
        (formName.trim() !== original.types || formKind !== original.kind)
      )
    }
  }, [formName, formKind, selectedTypeId, types])

  const selectType = (type: QuestionType) => {
    setSelectedTypeId(type.id)
    setFormName(type.types)
    setFormKind(type.kind)
  }

  const resetToCreate = () => {
    setSelectedTypeId(null)
    setFormName("")
    setFormKind("TEXT")
  }

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error("Le nom ne peut pas être vide")
      return
    }
    setSaving(true)
    try {
      if (selectedTypeId === null) {
        // Création
        const res = await createQuestionType(formName.trim(), formKind)
        if (!res.success) {
          toast.error(res.message || "Erreur lors de la création")
          return
        }
        const next = [...types, res.data]
        setTypes(next)
        onTypesChanged(next)
        resetToCreate()
        toast.success("Type créé")
      } else {
        // Mise à jour
        const res = await updateQuestionType(selectedTypeId, formName.trim(), formKind)
        if (!res.success) {
          toast.error(res.message || "Erreur lors de la mise à jour")
          return
        }
        const next = types.map((t) => (t.id === selectedTypeId ? res.data : t))
        setTypes(next)
        onTypesChanged(next)
        setFormName(res.data.types)
        setFormKind(res.data.kind)
        toast.success("Type mis à jour")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteQuestionType(id)
      if (!res.success) {
        toast.error(res.message || "Erreur lors de la suppression")
        return
      }
      const next = types.filter((t) => t.id !== id)
      setTypes(next)
      onTypesChanged(next)
      if (selectedTypeId === id) resetToCreate()
      toast.success("Type supprimé")
    } catch {
      toast.error("Erreur réseau")
    }
  }

  const isEditing = selectedTypeId !== null
  const formTitle = isEditing ? "Modifier le type" : "Nouveau type"

  return (
    <div className="flex h-full overflow-hidden">

      {/* Panel gauche - liste */}
      <div className="w-[240px] shrink-0 flex flex-col border-r border-white/[0.07]">

        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07]">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
            Types
          </span>
          <Badge
            variant="secondary"
            className="bg-white/[0.06] text-muted-foreground/50 border-white/[0.08] text-[10px] font-mono h-4 px-1.5"
          >
            {types.length}
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loadingTypes ? (
              <EmptyState icon={Settings} title="Chargement..." description="" />
            ) : types.length === 0 ? (
              <EmptyState
                icon={Settings}
                title="Aucun type"
                description="Créez votre premier type ci-contre."
              />
            ) : (
              types.map((t) => {
                const Icon = kindIcon(t.kind)
                return (
                  <div
                    key={t.id}
                    onClick={() => selectType(t)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer",
                      "transition-all duration-150 group",
                      selectedTypeId === t.id
                        ? "bg-white/[0.06] border-[var(--vd-gold)]/30"
                        : "border-transparent hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className={cn(
                      "size-3.5 shrink-0 transition-colors",
                      selectedTypeId === t.id ? "text-[var(--vd-gold)]" : "text-muted-foreground/40"
                    )} />
                    <span className="flex-1 min-w-0 text-[12px] font-medium text-foreground/80 truncate">
                      {t.types}
                    </span>
                    <ConfirmDialog
                      title="Supprimer le type"
                      description={`Supprimer "${t.types}" ? Les questions associées perdront ce type.`}
                      confirmLabel="Supprimer"
                      variant="destructive"
                      onConfirm={() => handleDelete(t.id)}
                      trigger={
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-red-400 transition-all p-0.5 rounded"
                        >
                          <IconDelete className="size-3" />
                        </button>
                      }
                    />
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-white/[0.07]">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToCreate}
            className={cn(
              "w-full h-8 text-[11px] rounded-xl transition-all",
              !isEditing
                ? "border-[var(--vd-gold)]/40 text-[var(--vd-gold)] bg-[var(--vd-gold)]/8"
                : "border-dashed border-[var(--vd-gold)]/25 text-[var(--vd-gold)] hover:bg-[var(--vd-gold)]/8 hover:border-[var(--vd-gold)]/40"
            )}
          >
            <IconPlus className="size-3.5 mr-1.5" />
            Nouveau type
          </Button>
        </div>
      </div>

      {/* Panel droit - formulaire */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 space-y-6 max-w-md">

          {/* En-tête */}
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">{formTitle}</h3>
            <p className="text-[12px] text-muted-foreground/60 mt-0.5">
              {isEditing
                ? "Modifiez le nom et le comportement de ce type."
                : "Définissez un nouveau type de question pour vos questionnaires."}
            </p>
          </div>

          {/* Champ nom */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Nom affiché
            </Label>
            <Input
              value={formName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
              placeholder="ex. Note étoilée, Choix unique..."
              className={cn(
                "h-10 text-[13px] bg-white/[0.04] border-white/[0.08] rounded-xl",
                "placeholder:text-muted-foreground/30",
                "focus-visible:border-[var(--vd-gold)]/40 focus-visible:bg-white/[0.06]",
                "transition-all duration-200"
              )}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleSave()
              }}
            />
          </div>

          {/* Sélecteur de kind */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
              Comportement
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {KIND_OPTIONS.map((opt) => {
                const Icon = kindIcon(opt.value)
                const isSelected = formKind === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormKind(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-3 py-3 rounded-xl border text-center",
                      "transition-all duration-150 focus-visible:outline-none",
                      isSelected
                        ? "bg-[var(--vd-gold)]/10 border-[var(--vd-gold)]/50 text-[var(--vd-gold)]"
                        : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/20 hover:bg-white/[0.05]"
                    )}
                  >
                    <Icon className={cn("size-4 transition-colors", isSelected ? "text-[var(--vd-gold)]" : "text-muted-foreground/40")} />
                    <span className="text-[11px] font-semibold leading-tight">{opt.label}</span>
                    <span className="text-[9px] opacity-60 leading-tight">{opt.description}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Apercu du badge kind */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground/40">Apercu :</span>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-2 h-5 font-medium border", KIND_COLORS[formKind])}
            >
              {formKind}
            </Badge>
          </div>

          <div className="h-px bg-white/[0.07]" />

          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={cn(
              "w-full h-10 text-[13px] font-semibold rounded-xl transition-all",
              isDirty
                ? "bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_16px_var(--vd-gold)/15]"
                : "bg-white/[0.06] text-muted-foreground/40 cursor-not-allowed"
            )}
          >
            {saving ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le type"}
          </Button>
        </div>
      </div>
    </div>
  )
}
