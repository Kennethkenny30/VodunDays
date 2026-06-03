import { api } from "./client"
import type { AuditLog } from "@/lib/types/api"

type AuditResult = {
  logs: AuditLog[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

type AuditStats = {
  total: number
  last24h: number
  byAction: { action: string; count: number }[]
  byModule: { module: string; count: number }[]
}

type AuditQueryParams = {
  action?:    string
  module?:    string
  userId?:    string
  search?:    string
  startDate?: string
  endDate?:   string
  page?:      number
  limit?:     number
}

export async function getAuditLogs(params?: AuditQueryParams) {
  const q = new URLSearchParams()
  if (params?.action)    q.set("action",    params.action)
  if (params?.module)    q.set("module",    params.module)
  if (params?.userId)    q.set("userId",    params.userId)
  if (params?.search)    q.set("search",    params.search)
  if (params?.startDate) q.set("startDate", params.startDate)
  if (params?.endDate)   q.set("endDate",   params.endDate)
  if (params?.page)      q.set("page",      String(params.page))
  if (params?.limit)     q.set("limit",     String(params.limit))
  const qs = q.toString()
  return api.get<AuditResult>(qs ? `/audit?${qs}` : "/audit")
}

export async function getAuditStats() {
  return api.get<AuditStats>("/audit/stats")
}
