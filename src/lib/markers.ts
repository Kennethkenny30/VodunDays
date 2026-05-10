// Catégories de marqueurs — couleur, forme, icône Lucide, emoji affiché dans les labels
export const MARKER_CATEGORIES = {
  sites: {
    label: "Sites Culturels",
    color: "#F56E0F",
    shape: "diamond",
    icon: "landmark",
    emoji: "🏛️",
  },
  toilettes: {
    label: "Toilettes",
    color: "#4488FF",
    shape: "circle",
    icon: "bath",
    emoji: "🚻",
  },
  urgences: {
    label: "Urgences",
    color: "#FF3333",
    shape: "cross",
    icon: "heart-pulse",
    emoji: "🚑",
  },
  transport: {
    label: "Transport",
    color: "#FFbb00",
    shape: "square",
    icon: "car",
    emoji: "🚌",
  },
  assistance: {
    label: "Assistance",
    color: "#AA44FF",
    shape: "star",
    icon: "info",
    emoji: "ℹ️",
  },
} as const;

export type MarkerCategory = keyof typeof MARKER_CATEGORIES;

// Point d'intérêt sur la carte
export interface POI {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  category: MarkerCategory;
  amenities?: string[];
  description?: string;
}

// Données mockées — sites culturels et services du festival Vodun Days
export const POI_DATA: POI[] = [
  // ── Sites culturels ──
  {
    id: "1",
    name: "Place Maro",
    longitude: 2.0844,
    latitude: 6.3623,
    category: "sites",
    amenities: ["Cérémonie", "Photo", "Guide"],
    description: "Place principale des cérémonies Egungun",
  },
  {
    id: "2",
    name: "Fort Français",
    longitude: 2.0889,
    latitude: 6.3612,
    category: "sites",
    amenities: ["Exposition", "Histoire", "Guide"],
    description: "Site historique colonial avec cérémonies Zangbeto",
  },
  {
    id: "3",
    name: "Place Ninsouxwé",
    longitude: 2.0856,
    latitude: 6.3598,
    category: "sites",
    amenities: ["Cérémonie", "Danse", "Musique"],
    description: "Lieu de rassemblement pour les rituels ancestraux",
  },
  {
    id: "4",
    name: "Forêt Kpassè",
    longitude: 2.0912,
    latitude: 6.3578,
    category: "sites",
    amenities: ["Nature", "Spirituel", "Méditation"],
    description: "Forêt sacrée avec l'iroko légendaire",
  },
  {
    id: "5",
    name: "Temple Mami",
    longitude: 2.0978,
    latitude: 6.3545,
    category: "sites",
    amenities: ["Spirituel", "Offrandes", "Prière"],
    description: "Temple dédié à la divinité des eaux Mami Wata",
  },
  {
    id: "6",
    name: "Couvent Sakpata",
    longitude: 2.0934,
    latitude: 6.3556,
    category: "sites",
    amenities: ["Initiation", "Guérison", "Spirituel"],
    description: "Couvent de la divinité de la terre Sakpata",
  },
  // ── Toilettes ──
  {
    id: "t1",
    name: "Toilettes Place Maro",
    longitude: 2.0848,
    latitude: 6.3620,
    category: "toilettes",
    amenities: ["Accessible PMR"],
  },
  {
    id: "t2",
    name: "Toilettes Fort",
    longitude: 2.0885,
    latitude: 6.3615,
    category: "toilettes",
  },
  {
    id: "t3",
    name: "Toilettes Forêt",
    longitude: 2.0908,
    latitude: 6.3582,
    category: "toilettes",
  },
  // ── Urgences ──
  {
    id: "u1",
    name: "Poste Médical Central",
    longitude: 2.0860,
    latitude: 6.3605,
    category: "urgences",
    amenities: ["Premiers secours", "Médecin"],
  },
  {
    id: "u2",
    name: "Poste Secours Forêt",
    longitude: 2.0920,
    latitude: 6.3570,
    category: "urgences",
    amenities: ["Premiers secours"],
  },
  // ── Transport ──
  {
    id: "tr1",
    name: "Station Zémidjan Centre",
    longitude: 2.0850,
    latitude: 6.3610,
    category: "transport",
    amenities: ["Motos", "Tricycles"],
  },
  {
    id: "tr2",
    name: "Arrêt Bus Principal",
    longitude: 2.0895,
    latitude: 6.3608,
    category: "transport",
    amenities: ["Bus", "Navette"],
  },
  {
    id: "tr3",
    name: "Parking Forêt Kpassè",
    longitude: 2.0925,
    latitude: 6.3565,
    category: "transport",
    amenities: ["Parking", "Tricycles"],
  },
  // ── Assistance ──
  {
    id: "a1",
    name: "Point Info Festival",
    longitude: 2.0855,
    latitude: 6.3618,
    category: "assistance",
    amenities: ["Informations", "Guides", "Cartes"],
  },
  {
    id: "a2",
    name: "Bureau d'Accueil",
    longitude: 2.0880,
    latitude: 6.3600,
    category: "assistance",
    amenities: ["Inscription", "Objets trouvés"],
  },
];
