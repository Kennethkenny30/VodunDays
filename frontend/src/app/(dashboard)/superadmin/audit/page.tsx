"use client"

import { useState, useEffect, useCallback } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@/components/ui/timeline"
import { LoadingCard } from "@/components/dashboard/loading-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageTransition } from "@/components/dashboard/page-transition"
import {
  IconDownload,
  IconSearch,
  IconPlus,
  IconEdit,
  IconDelete,
  IconShield,
  IconWarning,
  IconSettings,
  IconUserCheck,
} from "@/components/icons"
import { toast } from "sonner"
import { api } from "@/lib/api/client"
import type { AuditLog, AuditActionType } from "@/lib/types/api"

// Configuration des badges par type
const typeConfig: Record<AuditActionType, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  CREATE: { label: "Création", className: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: IconPlus },
  UPDATE: { label: "Modification", className: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: IconEdit },
  DELETE: { label: "Suppression", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: IconDelete },
  AUTH: { label: "Authentification", className: "bg-violet-500/10 text-violet-500 border-violet-500/20", icon: IconUserCheck },
  INCIDENT: { label: "Incident", className: "bg-red-600/15 text-red-600 border-red-600/30", icon: IconWarning },
  CONFIG: { label: "Configuration", className: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: IconSettings },
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [userFilter, setUserFilter] = useState("")
  const perPage = 20

  // Chargement des données
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page",  page.toString())
      params.set("limit", perPage.toString())
      if (typeFilter !== "ALL") params.set("action", typeFilter)
      if (userFilter) params.set("search", userFilter)

      const res = await api.get<{ logs: AuditLog[]; pagination: { total: number } }>(
        `/audit?${params.toString()}`
      )

      if (res.success) {
        setLogs(res.data.logs)
        setTotal(res.data.pagination.total)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Erreur lors du chargement des logs")
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, userFilter])

  useEffect(() => {
    setMounted(true)
    fetchLogs()
  }, [fetchLogs])

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Description", "Utilisateur", "Date"]
    const rows = logs.map((log) => [
      log.id,
      log.action,
      log.description,
      log.userName || log.userId?.slice(0, 8) + "..." || "Système",
      format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: fr }),
    ])
    const csv = [headers, ...rows].map((row) => row.join(";")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Calcul de la pagination
  const totalPages = Math.ceil(total / perPage)

  // Formatage du temps relatif côté client uniquement
  const getRelativeTime = (dateStr: string) => {
    if (!mounted) return "..."
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  }

  // Formatage du nom utilisateur
  const formatUserName = (log: AuditLog) => {
    if (log.userName) return log.userName
    if (log.userId) return log.userId.slice(0, 8) + "..."
    return "Système"
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit & traçabilité</h1>
            <p className="text-muted-foreground">Historique complet des actions sur la plateforme</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="glass-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Filtre type */}
            <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les types</SelectItem>
                <SelectItem value="CREATE">Création</SelectItem>
                <SelectItem value="UPDATE">Modification</SelectItem>
                <SelectItem value="DELETE">Suppression</SelectItem>
                <SelectItem value="AUTH">Authentification</SelectItem>
                <SelectItem value="INCIDENT">Incident</SelectItem>
                <SelectItem value="CONFIG">Configuration</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre utilisateur */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par utilisateur..."
                value={userFilter}
                onChange={(e) => { setUserFilter(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>

            {/* Export CSV */}
            <Button variant="outline" onClick={handleExportCSV} disabled={logs.length === 0}>
              <IconDownload className="size-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-6">
          {loading ? (
            <LoadingCard lines={6} className="border-0 bg-transparent p-0" />
          ) : logs.length === 0 ? (
            <EmptyState
              icon={IconShield}
              title="Aucun log trouvé"
              description="Aucune action ne correspond à vos critères de recherche."
            />
          ) : (
            <Timeline>
              {logs.map((log) => {
                const config = typeConfig[log.action]
                const Icon = config.icon
                return (
                  <TimelineItem key={log.id}>
                    <TimelineIndicator className={config.className}>
                      <Icon className="size-4" />
                    </TimelineIndicator>
                    <TimelineContent>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <TimelineTitle>{log.description}</TimelineTitle>
                            <Badge variant="outline" className={cn("text-[10px]", config.className)}>
                              {config.label}
                            </Badge>
                          </div>
                          <TimelineDescription>
                            par {formatUserName(log)}
                          </TimelineDescription>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 text-right">
                          <TimelineTime>
                            {format(new Date(log.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                          </TimelineTime>
                          <span className="text-xs text-muted-foreground/70">
                            {getRelativeTime(log.createdAt)}
                          </span>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} résultat{total > 1 ? "s" : ""} • Page {page} sur {totalPages}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                    className={cn(page === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => { e.preventDefault(); setPage(pageNum) }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                    className={cn(page === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
