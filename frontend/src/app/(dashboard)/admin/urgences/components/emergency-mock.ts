// ─── Types ────────────────────────────────────────────────────────────────────
// Ce fichier contient uniquement les types et configurations UI.
// Les données sont chargées depuis l'API /api/urgences.

export type EmergencyService = "SOINS_MEDICAUX" | "POLICE" | "SECURITE_FESTIVAL"
export type EmergencyType =
  | "MALAISE" | "BLESSURE" | "INCONSCIENT" | "ACCOUCHEMENT"
  | "ALTERCATION" | "VOL" | "AGRESSION" | "PERSONNE_DISPARUE"
  | "BOUSCULADE" | "INTRUSION" | "OBJET_SUSPECT" | "INCENDIE"
export type AlertStatus = "EN_ATTENTE" | "RECU" | "EN_COURS" | "RESOLU"

export interface TimelineEvent {
  status: AlertStatus
  label:  string
  detail: string
  time:   string
}

export interface AlertRequest {
  id:        string
  ref:       string
  service:   EmergencyService
  type:      EmergencyType
  name:      string
  status:    AlertStatus
  createdAt: string
  updatedAt: string
  timeline:  TimelineEvent[]
  location?: string
  note?:     string
  coords?:   { lat: number; lng: number }
}

// ─── Config labels ────────────────────────────────────────────────────────────

export const SERVICE_LABELS: Record<EmergencyService, string> = {
  SOINS_MEDICAUX:    "Soins Médicaux",
  POLICE:            "Police",
  SECURITE_FESTIVAL: "Sécurité Festival",
}

export const TYPE_LABELS: Record<EmergencyType, string> = {
  MALAISE:           "Malaise médical",
  BLESSURE:          "Blessure",
  INCONSCIENT:       "Personne inconsciente",
  ACCOUCHEMENT:      "Accouchement",
  ALTERCATION:       "Altercation",
  VOL:               "Vol",
  AGRESSION:         "Agression",
  PERSONNE_DISPARUE: "Personne disparue",
  BOUSCULADE:        "Bousculade",
  INTRUSION:         "Intrusion",
  OBJET_SUSPECT:     "Objet suspect",
  INCENDIE:          "Incendie",
}

export const STATUS_CONFIG: Record<AlertStatus, { label: string; badgeClass: string; dotClass: string }> = {
  EN_ATTENTE: {
    label:      "En attente",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dotClass:   "bg-amber-500",
  },
  RECU: {
    label:      "Reçu",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass:   "bg-blue-400",
  },
  EN_COURS: {
    label:      "En cours",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dotClass:   "bg-orange-400 animate-pulse",
  },
  RESOLU: {
    label:      "Résolu",
    badgeClass: "bg-green-500/10 text-green-500 border-green-500/20",
    dotClass:   "bg-green-500",
  },
}

export const SERVICE_CONFIG: Record<EmergencyService, { color: string; bg: string; border: string }> = {
  SOINS_MEDICAUX:    { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  POLICE:            { color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
  SECURITE_FESTIVAL: { color: "text-[#F56E0F]",   bg: "bg-[#F56E0F]/10",  border: "border-[#F56E0F]/20"   },
}
