import type { QuizScope, QuestionKind } from "@/lib/types/api"

export interface QuizTemplateQuestion {
  wording: string
  kind: QuestionKind
}

export interface QuizTemplate {
  scope: QuizScope
  label: string
  description: string
  questions: QuizTemplateQuestion[]
}

export const QUIZ_TEMPLATES: Record<QuizScope, QuizTemplate> = {
  FESTIVAL: {
    scope: "FESTIVAL",
    label: "Festival général",
    description: "Satisfaction globale du festival",
    questions: [
      { wording: "Satisfaction globale de l'événement", kind: "RATING" },
      { wording: "Organisation et logistique",          kind: "RATING" },
      { wording: "Accessibilité du site",               kind: "RATING" },
      { wording: "Ambiance générale",                   kind: "RATING" },
      { wording: "Commentaire libre",                   kind: "TEXT"   },
    ],
  },
  ALL_EVENTS: {
    scope: "ALL_EVENTS",
    label: "Tous les événements",
    description: "Feedback artistique général",
    questions: [
      { wording: "Qualité artistique",            kind: "RATING" },
      { wording: "Scénographie et mise en scène", kind: "RATING" },
      { wording: "Durée et programme",            kind: "RATING" },
      { wording: "Commentaire",                   kind: "TEXT"   },
    ],
  },
  ALL_SITES: {
    scope: "ALL_SITES",
    label: "Tous les sites",
    description: "Feedback sur les espaces du festival",
    questions: [
      { wording: "Propreté du site",             kind: "RATING" },
      { wording: "Commodités et équipements",    kind: "RATING" },
      { wording: "Signalisation et orientation", kind: "RATING" },
      { wording: "Suggestions d'amélioration",   kind: "TEXT"   },
    ],
  },
  EVENT: {
    scope: "EVENT",
    label: "Événement spécifique",
    description: "Feedback sur un événement précis",
    questions: [
      { wording: "Qualité de l'événement",       kind: "RATING" },
      { wording: "Accueil et ambiance",           kind: "RATING" },
      { wording: "Rapport qualité / expérience", kind: "RATING" },
      { wording: "Suggestions",                  kind: "TEXT"   },
    ],
  },
}

// Labels affichés dans l'UI selon le scope
export const SCOPE_LABELS: Record<QuizScope, { label: string; sublabel: string }> = {
  FESTIVAL:   { label: "Festival",   sublabel: "général" },
  ALL_EVENTS: { label: "Événements", sublabel: "tous"    },
  ALL_SITES:  { label: "Sites",      sublabel: "tous"    },
  EVENT:      { label: "Événement",  sublabel: "précis"  },
}
