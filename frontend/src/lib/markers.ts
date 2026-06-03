// lib/markers.ts
// Config UI des catégories de marqueurs.
// Les données POI viennent entièrement de la BDD — aucune donnée hardcodée.

export const MARKER_CATEGORIES = {
  sites: {
    label: "Sites Culturels",
    color: "#F56E0F",
    shape: "diamond",
    icon:  "landmark",
    },
  toilettes: {
    label: "Toilettes",
    color: "#4488FF",
    shape: "circle",
    icon:  "toilet",
    },
  urgences: {
    label: "Urgences",
    color: "#FF3333",
    shape: "cross",
    icon:  "siren",
    },
  transport: {
    label: "Transport",
    color: "#FFbb00",
    shape: "square",
    icon:  "bus",
    },
  assistance: {
    label: "Assistance",
    color: "#AA44FF",
    shape: "star",
    icon:  "life-buoy",
    },
  pra: {
    label: "Réalité Augm.",
    color: "#00E5CC",
    shape: "hexagon",
    icon:  "scan",
    },
} as const;

export type MarkerCategory = keyof typeof MARKER_CATEGORIES;

// Point d'intérêt sur la carte — aligné avec le modèle Sites de la BDD
export interface POI {
  id:           string;
  name:         string;
  longitude:    number;
  latitude:     number;
  category:     MarkerCategory;
  amenities?:   string[];
  description?: string;
  // Champs PRA — présents uniquement si category === "pra"
  arLabel?:     string;
  arContent?:   string;
  arRadius?:    number;
}

// Mapping enum BDD (MAJUSCULES) → clé frontend (minuscules)
const CATEGORY_MAP: Record<string, MarkerCategory> = {
  SITE:       "sites",
  TOILETTES:  "toilettes",
  URGENCES:   "urgences",
  TRANSPORT:  "transport",
  ASSISTANCE: "assistance",
  PRA:        "pra",
};

type BackendSite = {
  id:          string;
  name:        string;
  description: string | null;
  latitude:    number;
  longitude:   number;
  category:    string;
  arLabel?:    string | null;
  arContent?:  string | null;
  arRadius?:   number | null;
  amenities?:  { name: string }[];
};

/**
 * Charge tous les POI depuis la BDD via l'API.
 * Toutes les catégories (sites, toilettes, urgences, transport, assistance, pra)
 * sont stockées en BDD — il n'y a plus de données statiques de fallback.
 */
export async function loadPOIs(): Promise<POI[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const res  = await fetch(`${API_BASE}/sites`, { credentials: "include" });
  const json = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    console.error("[loadPOIs] Réponse API invalide", json);
    return [];
  }

  return json.data.map((site: BackendSite): POI => ({
    id:          site.id,
    name:        site.name,
    latitude:    site.latitude,
    longitude:   site.longitude,
    // Fallback sur "sites" si une valeur inconnue arrive
    category:    CATEGORY_MAP[site.category] ?? "sites",
    description: site.description ?? undefined,
    amenities:   site.amenities?.map((a) => a.name) ?? [],
    arLabel:     site.arLabel   ?? undefined,
    arContent:   site.arContent ?? undefined,
    arRadius:    site.arRadius  ?? undefined,
  }));
}