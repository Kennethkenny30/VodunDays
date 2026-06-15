import { api } from "./client"
import type { Notification, NotificationCreatePayload } from "@/lib/types/api"

type NotificationsResult = {
  notifications: Notification[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

export type NotifStats = { total: number; sent: number; pending: number; failed: number }

type NotifQueryParams = {
  target?: string
  status?: string
  page?: number
  limit?: number
}

export async function getNotifications(params?: NotifQueryParams) {
  const q = new URLSearchParams()
  if (params?.target && params.target !== "ALL") q.set("target", params.target)
  if (params?.status) q.set("status", params.status)
  if (params?.page)   q.set("page",   String(params.page))
  if (params?.limit)  q.set("limit",  String(params.limit))
  const qs = q.toString()
  return api.get<NotificationsResult>(qs ? `/notifications?${qs}` : "/notifications")
}

export async function getNotificationStats() {
  return api.get<NotifStats>("/notifications/stats")
}

export async function createNotification(payload: NotificationCreatePayload) {
  return api.post<Notification>("/notifications", payload)
}

export async function updateNotification(id: string, payload: { status?: string; sentAt?: string }) {
  return api.patch<Notification>(`/notifications/${id}`, payload)
}

export async function deleteNotification(id: string) {
  return api.delete<null>(`/notifications/${id}`)
}
