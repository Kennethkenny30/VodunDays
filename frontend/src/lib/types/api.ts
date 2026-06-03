
export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type UserRole = "SUPER_ADMIN" | "ADMIN"

export type User = {
  id: string
  email: string
  role: UserRole
  active: boolean
  firstname: string
  lastname: string
  phone: string | null
  lastLoging: string | null
  createdBy: string | null
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

// ─── Catégories de marqueurs carte ───────────────────────────────────────────
// Enum aligné avec schema.prisma MarkerCategory

export type MarkerCategory =
  | "SITE"
  | "TOILETTES"
  | "URGENCES"
  | "TRANSPORT"
  | "ASSISTANCE"
  | "PRA"

// ─── Site ─────────────────────────────────────────────────────────────────────

export type Site = {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  // sous-type fonctionnel libre (ex: "CULTUREL", "NAVETTE", "PRA_SCENE"…)
  type: string
  // catégorie de marqueur carte — pilote l'icône et le filtre
  category: MarkerCategory
  capacity: number
  // ── Champs PRA (nuls si category !== "PRA") ───────────────────────────────
  arLabel:   string | null
  arContent: string | null
  arRadius:  number | null
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
  category: MarkerCategory
  capacity: number
  // PRA
  arLabel?:   string
  arContent?: string
  arRadius?:  number
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

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ARCHIVED"

export type Event = {
  id: string
  name: string
  description: string | null
  status: EventStatus
  siteId: string
  eventTypeId: string
  createdBy: string
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

export type Program = {
  id: string
  startTime: string
  endTime: string
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

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "AUTH" | "INCIDENT" | "CONFIG"

export type AuditLog = {
  id: string
  action: AuditActionType
  module: string
  description: string
  metadata: Record<string, unknown> | null
  userId: string | null
  userName: string | null
  ipAddress: string | null
  createdAt: string
}

export type NotificationTarget = "ALL" | "SITE" | "EVENT_TYPE"
export type NotificationStatus = "PENDING" | "SENT" | "FAILED"

export type Notification = {
  id:          string
  title:       string
  message:     string
  target:      NotificationTarget
  targetId:    string | null
  status:      NotificationStatus
  scheduledAt: string | null
  sentAt:      string | null
  createdAt:   string
  updatedAt:   string
}

export type NotificationCreatePayload = {
  title:       string
  message:     string
  target?:     NotificationTarget
  targetId?:   string
  scheduledAt?: string
}

export type AlertType   = "MEDICAL" | "SECURITY" | "FIRE" | "LOST" | "TECHNICAL" | "OTHER"
export type AlertStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"

export type Alert = {
  id: string
  uuid: string
  displayName: string
  type: AlertType
  description: string
  status: AlertStatus
  siteId: string | null
  latitude: number | null
  longitude: number | null
  timeline: AlertTimeline[]
  createdAt: string
  updatedAt: string
  site?: Pick<Site, "id" | "name">
}

export type AlertTimeline = {
  id: string
  status: AlertStatus
  note: string | null
  userId: string | null
  userName: string | null
  createdAt: string
}

export type AlertCreatePayload = {
  uuid: string
  displayName: string
  type: AlertType
  description: string
  siteId?: string
  latitude?: number
  longitude?: number
}

export type UserCreatePayload = {
  email: string
  password: string
  firstname: string
  lastname: string
  phone?: string
  role?: UserRole
}

export type QuizCreatePayload = {
  title: string
  description?: string
  active?: boolean
  eventId: string
}

export type QuestionType = {
  id: string
  types: string
  createdAt: string
  updatedAt: string
}

export type Impression = {
  id: string
  name: string
  emoji: string
  createdAt: string
  updatedAt: string
}

export type Choice = {
  id: string
  wording: string
  questionId: string
  createdAt: string
  updatedAt: string
}

export type Question = {
  id: string
  wording: string
  questionTypeId: string
  quizId: string
  createdAt: string
  updatedAt: string
  questionType?: QuestionType
  choices?: Choice[]
  impressions?: Impression[]
}

export type QuestionCreatePayload = {
  wording: string
  questionTypeId: string
  quizId: string
}

export type Answer = {
  id: string
  response: string
  questionId: string
  uuid?: string | null
  createdAt: string
  updatedAt: string
}

export type PlatformConfig = {
  degradedMode: boolean
  gpsTracking: boolean
  pushNotifications: boolean
  maintenanceMode: boolean
}

export type PlatformStats = {
  uptime: number
  redisConnected: boolean
  wsConnections: number
  fcmSubscribers: number
  cacheHitRate: number
  cacheActiveKeys: number
  cacheTtlAvg: number
}

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