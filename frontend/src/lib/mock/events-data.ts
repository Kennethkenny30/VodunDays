
// Données de démo alignées avec les mocks du superadmin (sites-manager.tsx)
// À retirer une fois le backend /sites et /event-types opérationnels.

import type { Site, EventType } from "@/lib/types/api"

const NOW = new Date().toISOString()

// ─── Sites ────────────────────────────────────────────────────────────────────
// Identiques aux mockSites de sites-manager.tsx

export const MOCK_SITES: Site[] = [
  {
    id: "1",
    name: "Temple des Pythons",
    description: "Temple sacré abritant les pythons royaux",
    latitude: 6.3654,
    longitude: 2.0878,
    type: "RELIGIEUX",
    capacity: 200,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "2",
    name: "Place Chacha",
    description: "Place historique du marché aux esclaves",
    latitude: 6.3612,
    longitude: 2.0834,
    type: "PATRIMOINE",
    capacity: 500,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "3",
    name: "Musée d'Histoire de Ouidah",
    description: "Musée retraçant l'histoire de la ville",
    latitude: 6.3678,
    longitude: 2.0912,
    type: "MUSEE",
    capacity: 150,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "4",
    name: "Route des Esclaves",
    description: "Chemin historique menant à la Porte du Non-Retour",
    latitude: 6.3521,
    longitude: 2.0956,
    type: "PATRIMOINE",
    capacity: 800,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "5",
    name: "Forêt Sacrée de Kpasse",
    description: "Forêt royale abritant les esprits ancestraux",
    latitude: 6.3701,
    longitude: 2.0867,
    type: "RELIGIEUX",
    capacity: 300,
    createdAt: NOW,
    updatedAt: NOW,
  },
]

// ─── Types d'événement ────────────────────────────────────────────────────────
// Catégories culturelles représentatives du festival Vodun Days

export const MOCK_EVENT_TYPES: EventType[] = [
  { id: "et-1", name: "Cérémonie vodun",   createdAt: NOW, updatedAt: NOW },
  { id: "et-2", name: "Concert",           createdAt: NOW, updatedAt: NOW },
  { id: "et-3", name: "Exposition",        createdAt: NOW, updatedAt: NOW },
  { id: "et-4", name: "Conférence",        createdAt: NOW, updatedAt: NOW },
  { id: "et-5", name: "Procession",        createdAt: NOW, updatedAt: NOW },
  { id: "et-6", name: "Atelier",           createdAt: NOW, updatedAt: NOW },
]