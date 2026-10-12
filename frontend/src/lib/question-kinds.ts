import { AlignLeft, CheckSquare, Circle, Star, type LucideIcon } from "lucide-react"
import type { QuestionKind } from "@/lib/types/api"

// Source unique pour tout ce qui dépend du « comportement » d'une question
// (icône, libellés, couleur). Remplace les copies qui existaient dans
// quiz-builder, question-config-panel et question-types-manager.

// Libellé historique posé par l'ancien flux de création. Il n'est plus
// généré, mais des questions existantes peuvent encore le porter : la
// validation de publication les signale.
export const DEFAULT_QUESTION_WORDING = "Nouvelle question"

export const KIND_ORDER: QuestionKind[] = ["RATING", "SINGLE", "MULTIPLE", "TEXT"]

export type KindMeta = {
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
  badge: string
}

export const KIND_META: Record<QuestionKind, KindMeta> = {
  RATING: {
    label: "Note étoilée",
    shortLabel: "Note",
    description: "Notation de 1 à 5 étoiles",
    icon: Star,
    badge: "bg-amber-500/10 border-amber-500/25 text-amber-400",
  },
  SINGLE: {
    label: "Choix unique",
    shortLabel: "Unique",
    description: "Une seule réponse",
    icon: Circle,
    badge: "bg-blue-500/10 border-blue-500/25 text-blue-400",
  },
  MULTIPLE: {
    label: "Choix multiple",
    shortLabel: "Multiple",
    description: "Plusieurs réponses",
    icon: CheckSquare,
    badge: "bg-purple-500/10 border-purple-500/25 text-purple-400",
  },
  TEXT: {
    label: "Texte libre",
    shortLabel: "Texte",
    description: "Réponse libre",
    icon: AlignLeft,
    badge: "bg-slate-500/10 border-slate-500/25 text-slate-400",
  },
}

export function kindIcon(kind: QuestionKind): LucideIcon {
  return KIND_META[kind]?.icon ?? AlignLeft
}

export function kindHasChoices(kind: QuestionKind): boolean {
  return kind === "SINGLE" || kind === "MULTIPLE"
}

export function kindIsRating(kind: QuestionKind): boolean {
  return kind === "RATING"
}
