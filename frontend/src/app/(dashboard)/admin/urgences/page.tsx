"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { EmergencyStatsBar }   from "./components/emergency-stats-bar"
import { ActiveAlertsTable }   from "./components/active-alerts-table"
import { AlertHistoryList }    from "./components/alert-history-list"
import { PageTransition }      from "@/components/dashboard/page-transition"
import { getAlerts, updateAlertStatus } from "@/lib/api/urgences"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Alert, AlertStatus } from "@/lib/types/api"
import type { AlertRequest } from "./components/emergency-mock"

const POLL_INTERVAL_MS = 15_000

// ─── Mapping type DB → type interne UI ───────────────────────────────────────
// L'API retourne MEDICAL/SECURITY/FIRE/LOST/TECHNICAL/OTHER
// Les composants UI attendent MALAISE/BLESSURE/etc.
// On choisit un représentant par catégorie.
const DB_TYPE_TO_UI: Record<string, AlertRequest["type"]> = {
  MEDICAL:   "MALAISE",
  SECURITY:  "ALTERCATION",
  FIRE:      "INCENDIE",
  LOST:      "PERSONNE_DISPARUE",
  TECHNICAL: "OBJET_SUSPECT",
  OTHER:     "BOUSCULADE",
}

// ─── Adaptateur API → format composants existants ────────────────────────────

function toAlertRequest(alert: Alert): AlertRequest {
  return {
    id:        alert.id,
    ref:       `VD-${alert.id.slice(0, 6).toUpperCase()}`,
    service:   alert.type === "MEDICAL"                          ? "SOINS_MEDICAUX"
             : alert.type === "SECURITY" || alert.type === "FIRE" ? "SECURITE_FESTIVAL"
             : alert.type === "LOST"                             ? "POLICE"
             : "SECURITE_FESTIVAL",
    // Conversion réelle du type DB vers type UI (plus de cast dangereux)
    type:      DB_TYPE_TO_UI[alert.type] ?? "BOUSCULADE",
    name:      alert.displayName,
    status:    alert.status === "OPEN"        ? "EN_ATTENTE"
             : alert.status === "IN_PROGRESS" ? "EN_COURS"
             : alert.status === "RESOLVED"    ? "RESOLU"
             : "RESOLU",
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
    location:  alert.site?.name || undefined,
    coords:    alert.latitude && alert.longitude
                 ? { lat: alert.latitude, lng: alert.longitude }
                 : undefined,
    note:      alert.description,
    timeline:  alert.timeline.map((t) => ({
      status: t.status === "OPEN"        ? "EN_ATTENTE"
            : t.status === "IN_PROGRESS" ? "EN_COURS"
            : t.status === "RESOLVED"    ? "RESOLU"
            : "RESOLU",
      label:  t.note || t.status,
      detail: t.userName ? `Par ${t.userName}` : "Système",
      time:   new Date(t.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    })),
  }
}

// Mapping statut mock → statut API
function toApiStatus(mockStatus: AlertRequest["status"]): AlertStatus {
  const map: Record<string, AlertStatus> = {
    EN_ATTENTE: "OPEN",
    RECU:       "IN_PROGRESS",
    EN_COURS:   "IN_PROGRESS",
    RESOLU:     "RESOLVED",
  }
  return map[mockStatus] ?? "OPEN"
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UrgencesPage() {
  const [rawAlerts,   setRawAlerts]   = useState<Alert[]>([])
  const [loading,     setLoading]     = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshing,  setRefreshing]  = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else         setRefreshing(true)
    try {
      const res = await getAlerts({ limit: 100 })
      if (res.success) {
        setRawAlerts(res.data.alerts)
        setLastRefresh(new Date())
      } else {
        if (!silent) toast.error(res.message || "Impossible de charger les alertes")
      }
    } catch {
      if (!silent) toast.error("Erreur réseau lors du chargement des urgences")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    pollRef.current = setInterval(() => loadData(true), POLL_INTERVAL_MS)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [loadData])

  const handleStatusUpdate = useCallback(async (
    id: string,
    nextMockStatus: AlertRequest["status"],
    note?: string,
  ) => {
    const apiStatus = toApiStatus(nextMockStatus)
    const res = await updateAlertStatus(id, apiStatus, note)
    if (res.success) {
      setRawAlerts((prev) => prev.map((a) => (a.id === id ? res.data : a)))
      setLastRefresh(new Date())
      toast.success("Statut mis à jour")
    } else {
      throw new Error(res.message || "Erreur lors de la mise à jour")
    }
  }, [])

  const alerts = rawAlerts.map(toAlertRequest)

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Gestion des urgences</h1>
            <p className="text-sm text-muted-foreground">
              Vodun Days - supervision et traitement des alertes en temps réel
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lastRefresh && (
              <span className="text-[11px] text-muted-foreground/40 tabular-nums hidden sm:block">
                Mis à jour {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            <button
              onClick={() => loadData()}
              disabled={loading || refreshing}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium",
                "bg-white/[0.05] border border-white/[0.09] text-muted-foreground/60",
                "hover:bg-white/[0.09] hover:text-foreground/80 transition-all",
                "disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              <RefreshCw className={cn("size-3.5", (loading || refreshing) && "animate-spin")} />
              Rafraîchir
            </button>
          </div>
        </div>

        <EmergencyStatsBar alerts={alerts} loading={loading} />

        <ActiveAlertsTable
          alerts={alerts.filter((a) => a.status !== "RESOLU")}
          loading={loading}
          onStatusUpdate={handleStatusUpdate}
          onRefresh={() => loadData()}
        />

        <AlertHistoryList
          alerts={alerts.filter((a) => a.status === "RESOLU")}
          loading={loading}
        />
      </div>
    </PageTransition>
  )
}