// lib/types.ts - Aligned with Prisma models

export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProgramType =
  | "RITUAL"
  | "ANIMATION"
  | "CONCERT"
  | "EXHIBITION"
  | "CONFERENCE";

export type NotificationType = "IMMINENT" | "SCHEDULE_CHANGE" | "SAFETY";

// Site culturel
export interface CulturalSite {
  id: string;
  name: string;
  slug: string;
  entities: string[];
  description: string;
  image?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  thematicColor?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  programs?: Program[];
  sites?: Site[];
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  zoneGeoJson?: unknown;
  type?: string;
  capacity?: number;
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  eventId?: string;
  siteId?: string | null;
  title: string;
  titleEn?: string | null;
  description?: string;
  descriptionEn?: string | null;
  type: ProgramType;
  startTime: string;
  endTime: string;
  artists?: { id: string; name: string; imageUrl?: string | null; genre?: string | null }[];
  capacity?: number;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  site?: Site;
  event?: Event;
  // UI-specific fields
  location: string;
  locationEn?: string | null;
  rating: number;
  image: string;
  isLive?: boolean;
  day: number;
  isFavorite?: boolean;
  siteLat?: number | null;
  siteLng?: number | null;
  // Regroupement ProgramCard : creneaux additionnels du meme evenement,
  // tombant le meme jour (voir mapEventToPrograms). Chaque entree est un
  // Program complet et independant - ajoutable/retirable du planner comme
  // n'importe quel autre creneau. Absent ou vide = pas de regroupement.
  otherSlots?: Program[];
}

export interface EventSite {
  eventId: string;
  siteId: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

export interface SatisfactionResponse {
  globalRating: number;
  organizationRating: number;
  accessibilityRating: number;
  securityRating: number;
  comment?: string;
  submittedAt: Date;
  locale: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  wind: number;
  humidity: number;
  uv: number;
  location: string;
  hourly?: Array<{ h: string; t: number; icon: string }>
}