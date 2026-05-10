// Types API - Vodun Days Dashboard
// Enveloppe standard de toutes les réponses API

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// Rôles utilisateur - valeurs exactes du backend
export type UserRole = "SUPER_ADMIN" | "ADMIN"

export type User = {
  id: string
  email: string
  role: UserRole
  active: boolean
  firstname: string
  lastname: string
  phone: string | null
  lastLoging: string | null // typo conservée côté backend
  createdBy: string | null // UUID de l'admin créateur
  createdAt: string
  updatedAt: string
}

export type UserUpdatePayload = {
  email?: string
  role?: UserRole
  active?: boolean
  firstname?: string
  lastname?: string
  phone?: string
}

export type Site = {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  type: string
  capacity: number
  createdAt: string
  updatedAt: string
  amenities?: Amenity[]
  events?: Event[]
  _count?: { events: number }
}

export type SiteCreatePayload = {
  name: string
  description?: string
  latitude: number
  longitude: number
  type: string
  capacity: number
}

export type Amenity = {
  id: string
  name: string
  siteId: string
  createdAt: string
  updatedAt: string
}

export type EventType = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Statuts d'événement - imposés côté UI
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ARCHIVED"

export type Event = {
  id: string
  name: string
  description: string | null
  status: EventStatus
  siteId: string
  eventTypeId: string
  createdBy: string // UUID brut
  createdAt: string
  updatedAt: string
  site?: Site
  eventType?: EventType
  programs?: Program[]
  artists?: Artist[]
  quizzes?: Quiz[]
}

export type EventCreatePayload = {
  name: string
  description?: string
  status: EventStatus
  siteId: string
  eventTypeId: string
}

// Créneaux horaires - toujours liés à un Event
export type Program = {
  id: string
  startTime: string // ISO 8601 datetime
  endTime: string // ISO 8601 datetime
  eventId: string
  createdAt: string
  updatedAt: string
}

export type ProgramCreatePayload = {
  startTime: string
  endTime: string
  eventId: string
}

export type Artist = {
  id: string
  name: string
  eventId: string
  createdAt: string
  updatedAt: string
}

export type Quiz = {
  id: string
  title: string
  description: string | null
  active: boolean
  eventId: string
  createdAt: string
  updatedAt: string
}

// Types pour l'audit et les logs
export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "INCIDENT" | "CONFIG"

export type AuditLog = {
  id: string
  action: AuditActionType
  description: string
  userId: string | null
  userName: string | null
  createdAt: string
}

// Types pour les notifications
export type NotificationStatus = "SENT" | "PENDING" | "FAILED"

export type Notification = {
  id: string
  title: string
  message: string
  target: "ALL" | "SITE" | "EVENT_TYPE"
  targetId?: string
  status: NotificationStatus
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}

// Types pour la configuration plateforme
export type PlatformConfig = {
  degradedMode: boolean
  gpsTracking: boolean
  pushNotifications: boolean
  maintenanceMode: boolean
}

// Types pour les statistiques
export type PlatformStats = {
  uptime: number
  redisConnected: boolean
  wsConnections: number
  fcmSubscribers: number
  cacheHitRate: number
  cacheActiveKeys: number
  cacheTtlAvg: number
}

// Types pour l'enquête
export type SurveyStats = {
  averageRating: number
  totalResponses: number
  satisfactionRate: number
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export type SurveyComment = {
  id: string
  text: string
  rating: number
  createdAt: string
}
