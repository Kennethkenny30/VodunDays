import { api, getApiBase } from "./client"
import type { Alert, AlertCreatePayload } from "@/lib/types/api"

type AlertsResult = {
  alerts: Alert[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

export type AlertStats = {
  total: number
  byStatus: { open: number; inProgress: number; resolved: number; closed: number }
  byType: { type: string; count: number }[]
}

type AlertQueryParams = {
  status?: string
  type?:   string
  siteId?: string
  page?:   number
  limit?:  number
}

export async function createAlert(payload: AlertCreatePayload) {
  const API_BASE = getApiBase()
  const res = await fetch(`${API_BASE}/urgences`, {
    method:      "POST",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:        JSON.stringify(payload),
  })
  return res.json()
}

export async function getAlerts(params?: AlertQueryParams) {
  const q = new URLSearchParams()
  if (params?.status) q.set("status", params.status)
  if (params?.type)   q.set("type",   params.type)
  if (params?.siteId) q.set("siteId", params.siteId)
  if (params?.page)   q.set("page",   String(params.page))
  if (params?.limit)  q.set("limit",  String(params.limit))
  const qs = q.toString()
  return api.get<AlertsResult>(qs ? `/urgences?${qs}` : "/urgences")
}

export async function getAlert(id: string) {
  return api.get<Alert>(`/urgences/${id}`)
}

export async function getAlertStats() {
  return api.get<AlertStats>("/urgences/stats")
}

export async function updateAlertStatus(id: string, status: string, note?: string) {
  return api.patch<Alert>(`/urgences/${id}/status`, { status, note })
}
