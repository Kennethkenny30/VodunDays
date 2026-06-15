"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { MapPin, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Stethoscope, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { AlertDetailModal } from "./alert-detail-modal"
import {
  type AlertRequest, type AlertStatus, type EmergencyService,
  TYPE_LABELS, STATUS_CONFIG, SERVICE_CONFIG, SERVICE_LABELS,
} from "./emergency-mock"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_ICONS: Record<EmergencyService, React.ElementType> = {
  SOINS_MEDICAUX:    Stethoscope,
  POLICE:            ShieldCheck,
  SECURITE_FESTIVAL: ShieldAlert,
}

function timeAgo(dateStr: string) {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr }) }
  catch { return "-" }
}

// ─── AlertRow ─────────────────────────────────────────────────────────────────

interface AlertRowProps {
  alert:   AlertRequest
  onClick: () => void
}

function AlertRow({ alert, onClick }: AlertRowProps) {
  const svcCfg      = SERVICE_CONFIG[alert.service]
  const statusCfg   = STATUS_CONFIG[alert.status]
  const ServiceIcon = SERVICE_ICONS[alert.service]

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 group",
        "bg-white/[0.02] border-white/[0.07]",
        "hover:bg-white/[0.05] hover:border-white/[0.12]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F56E0F]/40",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icône service */}
        <div className={cn("rounded-xl p-2 border shrink-0", svcCfg.bg, svcCfg.border)}>
          <ServiceIcon className={cn("size-4", svcCfg.color)} strokeWidth={1.7} />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-[12px] font-mono font-bold text-foreground/80">{alert.ref}</span>
            <Badge variant="outline" className={cn("text-[10px]", statusCfg.badgeClass)}>
              <span className={cn("size-1.5 rounded-full mr-1 inline-block shrink-0", statusCfg.dotClass)} />
              {statusCfg.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50 flex-wrap">
            <span className="font-medium text-foreground/60">{TYPE_LABELS[alert.type]}</span>
            {alert.location && (
              <>
                <span className="text-muted-foreground/20">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-2.5 shrink-0" />
                  <span className="truncate max-w-[160px]">{alert.location}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Temps + flèche */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/30 tabular-nums hidden sm:block">
            {timeAgo(alert.createdAt)}
          </span>
          <ChevronRight className="size-4 text-muted-foreground/20 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  )
}

// ─── ActiveAlertsTable ────────────────────────────────────────────────────────

interface ActiveAlertsTableProps {
  alerts:          AlertRequest[]
  loading:         boolean
  /** Appelé par le modal - délégue vers l'API via la page parente */
  onStatusUpdate:  (id: string, nextStatus: AlertRequest["status"], note?: string) => Promise<void>
  onRefresh:       () => void
  className?:      string
}

export function ActiveAlertsTable({
  alerts,
  loading,
  onStatusUpdate,
  onRefresh,
  className,
}: ActiveAlertsTableProps) {
  const [selected,  setSelected]  = useState<AlertRequest | null>(null)
  const [advancing, setAdvancing] = useState(false)

  const active = alerts.filter((a) => a.status !== "RESOLU")

  /**
   * Appelé depuis AlertDetailModal quand l'admin avance le statut.
   * - Appelle onStatusUpdate (page.tsx → API)
   * - Si succès : met à jour l'alerte sélectionnée dans le modal et ferme si RESOLU
   * - Si échec  : toast d'erreur (l'exception remonte de la page)
   */
  const handleAdvance = async (id: string, nextStatus: AlertRequest["status"], note?: string) => {
    setAdvancing(true)
    try {
      await onStatusUpdate(id, nextStatus, note)

      // Mise à jour optimiste de l'alerte affichée dans le modal
      // (la liste complète sera mise à jour par l'état de la page)
      setSelected((prev) => {
        if (!prev || prev.id !== id) return prev
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        const STATUS_LABELS: Record<AlertRequest["status"], string> = {
          EN_ATTENTE: "Alerte reçue",
          RECU:       "Dossier pris en charge",
          EN_COURS:   "Intervention en cours",
          RESOLU:     "Situation résolue",
        }
        return {
          ...prev,
          status:    nextStatus,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...prev.timeline,
            {
              status: nextStatus,
              label:  STATUS_LABELS[nextStatus],
              detail: note ? `Note : ${note}` : "Mis à jour par l'administrateur",
              time:   now,
            },
          ],
        }
      })

      if (nextStatus === "RESOLU") setSelected(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      toast.error(msg)
    } finally {
      setAdvancing(false)
    }
  }

  return (
    <div className={cn("glass-card p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="size-5 text-muted-foreground" />
            {active.length > 0 && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Alertes en cours</h2>
            <p className="text-xs text-muted-foreground">
              {active.length === 0
                ? "Aucune alerte active"
                : `${active.length} alerte${active.length > 1 ? "s" : ""} nécessite${active.length === 1 ? "" : "nt"} attention`}
            </p>
          </div>
        </div>

        {/* Indicateur live */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Aucune alerte active"
          description="Toutes les situations signalées ont été traitées."
        />
      ) : (
        <div className="space-y-2">
          {active
            .sort((a, b) => {
              const order: AlertRequest["status"][] = ["EN_ATTENTE", "RECU", "EN_COURS", "RESOLU"]
              return order.indexOf(a.status) - order.indexOf(b.status)
            })
            .map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onClick={() => setSelected(alert)}
              />
            ))}
        </div>
      )}

      {/* Modal détail */}
      <AlertDetailModal
        alert={selected}
        advancing={advancing}
        onClose={() => setSelected(null)}
        onAdvance={handleAdvance}
      />
    </div>
  )
}