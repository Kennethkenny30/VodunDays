"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { History, Search, Download, MapPin, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import {
  type AlertRequest, type EmergencyService,
  SERVICE_LABELS, TYPE_LABELS, STATUS_CONFIG, SERVICE_CONFIG,
} from "./emergency-mock"

function timeAgo(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
  } catch { return "-" }
}

function resolutionTime(createdAt: string, updatedAt: string) {
  try {
    const diff = (new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 60000
    if (diff < 60) return `${Math.round(diff)} min`
    return `${Math.floor(diff / 60)}h${Math.round(diff % 60).toString().padStart(2, "0")}`
  } catch { return "-" }
}

interface AlertHistoryListProps {
  alerts:    AlertRequest[]
  loading:   boolean
  className?: string
}

export function AlertHistoryList({ alerts, loading, className }: AlertHistoryListProps) {
  const [search,         setSearch]         = useState("")
  const [serviceFilter,  setServiceFilter]  = useState<EmergencyService | "ALL">("ALL")

  const resolved = useMemo(() => {
    return alerts
      .filter((a) => a.status === "RESOLU")
      .filter((a) => {
        const matchSearch  = search === "" ||
          a.ref.toLowerCase().includes(search.toLowerCase()) ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          TYPE_LABELS[a.type].toLowerCase().includes(search.toLowerCase())
        const matchService = serviceFilter === "ALL" || a.service === serviceFilter
        return matchSearch && matchService
      })
      // Plus récentes en premier
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [alerts, search, serviceFilter])

  const handleExport = () => {
    const rows = [
      ["Référence", "Service", "Type", "Déclarant", "Localisation", "Signalé le", "Résolu en"],
      ...resolved.map((a) => [
        a.ref,
        SERVICE_LABELS[a.service],
        TYPE_LABELS[a.type],
        a.name,
        a.location ?? "-",
        new Date(a.createdAt).toLocaleString("fr-FR"),
        resolutionTime(a.createdAt, a.updatedAt),
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href     = url
    link.download = `urgences-export-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Export téléchargé")
  }

  return (
    <div className={cn("glass-card p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <History className="size-5 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Historique</h2>
            <p className="text-xs text-muted-foreground">Alertes résolues</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={loading || resolved.length === 0}>
          <Download className="mr-2 size-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
          <Input
            placeholder="Référence, déclarant, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v as EmergencyService | "ALL")}>
          <SelectTrigger className="h-9 w-[160px] text-sm shrink-0">
            <SelectValue placeholder="Tous les services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les services</SelectItem>
            {(Object.keys(SERVICE_LABELS) as EmergencyService[]).map((s) => (
              <SelectItem key={s} value={s}>{SERVICE_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : resolved.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucune alerte résolue"
          description={search || serviceFilter !== "ALL" ? "Aucun résultat pour ces filtres." : "L'historique des alertes résolues apparaîtra ici."}
        />
      ) : (
        <ScrollArea className="h-[360px]">
          <div className="space-y-2 pr-2">
            {resolved.map((alert) => {
              const svcCfg    = SERVICE_CONFIG[alert.service]
              const statusCfg = STATUS_CONFIG[alert.status]

              return (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                  {/* Dot statut */}
                  <span className={cn("size-2 rounded-full shrink-0", statusCfg.dotClass)} />

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-mono font-semibold text-foreground/80">{alert.ref}</span>
                      <Badge variant="outline" className={cn("text-[10px] shrink-0", svcCfg.color, svcCfg.bg, svcCfg.border)}>
                        {SERVICE_LABELS[alert.service]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground/50 flex-wrap">
                      <span>{TYPE_LABELS[alert.type]}</span>
                      {alert.location && (
                        <>
                          <span className="text-muted-foreground/20">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-2.5 shrink-0" />
                            {alert.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Durée + temps */}
                  <div className="shrink-0 text-right space-y-0.5">
                    <div className="flex items-center gap-1 justify-end text-[11px] text-muted-foreground/40">
                      <Clock className="size-2.5" />
                      <span>{resolutionTime(alert.createdAt, alert.updatedAt)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/25 tabular-nums">
                      {timeAgo(alert.updatedAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {/* Résumé stats */}
      {!loading && resolved.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center gap-4 text-[12px] text-muted-foreground/40">
          <span>{resolved.length} alerte{resolved.length > 1 ? "s" : ""} résolue{resolved.length > 1 ? "s" : ""}</span>
          <span>·</span>
          <span>
            Temps moyen :{" "}
            {(() => {
              const total = resolved.reduce((acc, a) => {
                return acc + (new Date(a.updatedAt).getTime() - new Date(a.createdAt).getTime()) / 60000
              }, 0)
              const avg = Math.round(total / resolved.length)
              return avg < 60 ? `${avg} min` : `${Math.floor(avg / 60)}h${(avg % 60).toString().padStart(2, "0")}`
            })()}
          </span>
        </div>
      )}
    </div>
  )
}
