"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Users, MapPinOff, Loader2, Radio } from "lucide-react"
import { getPlatformStats } from "@/lib/api/platform"
import type { PresenceBySite } from "@/lib/api/platform"

const REFRESH_MS = 30_000

const CATEGORY_COLORS: Record<string, string> = {
  SITE:       "#F56E0F",
  TOILETTES:  "#4488FF",
  URGENCES:   "#FF3333",
  TRANSPORT:  "#FFbb00",
  ASSISTANCE: "#AA44FF",
  PRA:        "#00E5CC",
  SCENE:      "#E91E8C",
}

interface PresenceCardProps {
  className?: string
}

export function PresenceCard({ className }: PresenceCardProps) {
  const [loading,       setLoading]       = useState(true)
  const [onlineNow,     setOnlineNow]     = useState(0)
  const [unassigned,    setUnassigned]    = useState(0)
  const [windowMinutes, setWindowMinutes] = useState(5)
  const [bySite,        setBySite]        = useState<PresenceBySite[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPlatformStats()
        if (res.success) {
          setOnlineNow(res.data.presence.onlineNow)
          setUnassigned(res.data.presence.unassigned)
          setWindowMinutes(res.data.presence.windowMinutes)
          setBySite(res.data.presence.bySite)
        }
      } catch {
        // non critique - on retentera au prochain cycle
      } finally {
        setLoading(false)
      }
    }
    load()
    intervalRef.current = setInterval(load, REFRESH_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const maxCount = Math.max(1, ...bySite.map(s => s.count), unassigned)

  return (
    <div className={cn("glass-card relative overflow-hidden p-6", className)}>
      <div
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-32 rounded-full opacity-15 blur-2xl"
        style={{ background: "oklch(0.75 0.16 145)" }}
      />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2.5 cursor-default min-w-0">
                <span className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-green-400" />
                </span>
                <span className="text-sm font-semibold tracking-tight truncate">
                  Festivaliers en ligne
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-[220px]">
              Ayant envoyé un signal de présence dans les {windowMinutes} dernières minutes
            </TooltipContent>
          </Tooltip>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-green-400 border-green-500/25 bg-green-500/8 shrink-0">
            Live
          </Badge>
        </div>

        <div className="flex items-baseline gap-2">
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground/40" />
          ) : (
            <>
              <span className="text-4xl font-bold tabular-nums tracking-tight">{onlineNow}</span>
              <Users className="size-4 text-muted-foreground/50" />
            </>
          )}
        </div>

        <div className="space-y-2">
          {!loading && bySite.length === 0 && unassigned === 0 && (
            <p className="text-xs text-muted-foreground/50 py-2">
              Aucun festivalier en ligne pour le moment
            </p>
          )}

          {bySite.map(site => (
            <Tooltip key={site.siteId}>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="size-1.5 rounded-full shrink-0"
                        style={{ background: site.category ? CATEGORY_COLORS[site.category] : "#888896" }}
                      />
                      <span className="text-xs text-muted-foreground truncate">{site.name}</span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums shrink-0">{site.count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(site.count / maxCount) * 100}%`,
                        background: site.category ? CATEGORY_COLORS[site.category] : "#888896",
                      }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {site.count} festivalier{site.count > 1 ? "s" : ""} sur {site.name}
              </TooltipContent>
            </Tooltip>
          ))}

          {unassigned > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-default pt-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPinOff className="size-3 text-muted-foreground/40 shrink-0" />
                      <span className="text-xs text-muted-foreground/60 truncate">Hors zone connue</span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums shrink-0">{unassigned}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/20 transition-all duration-500"
                      style={{ width: `${(unassigned / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs max-w-[200px]">
                Position hors du périmètre de tout site connu (zone non dessinée ou festivalier éloigné)
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <Radio className="size-3 text-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground/40">
            Actualisé toutes les {REFRESH_MS / 1000}s
          </span>
        </div>
      </div>
    </div>
  )
}
