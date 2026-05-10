"use client"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash2, Database, Key, Clock, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface CacheCardProps {
  className?: string
}

export function CacheCard({ className }: CacheCardProps) {
  const hitRate = 87.5
  const activeKeys = 2456
  const avgTtl = 3600

  const handlePurge = () => {
    toast.success("Cache Redis purgé avec succès", {
      description: "Les données seront reconstituées progressivement.",
    })
  }

  // Couleur dynamique selon le taux de hit
  const hitRateColor =
    hitRate >= 80
      ? "text-green-400"
      : hitRate >= 60
      ? "text-amber-400"
      : "text-red-400"

  const progressColor =
    hitRate >= 80
      ? "[&>div]:bg-green-500"
      : hitRate >= 60
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-red-500"

  return (
    <div className={cn("glass-card p-5 flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Database className="size-4 text-muted-foreground" />
        <h3 className="text-base font-semibold tracking-tight">Cache Redis</h3>
      </div>

      {/* Métriques */}
      <div className="space-y-3">
        {/* Taux de hit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-1.5 cursor-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3 text-muted-foreground/60" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                    Taux de hit
                  </span>
                </div>
                <span className={cn("font-mono text-sm font-semibold", hitRateColor)}>
                  <NumberTicker value={hitRate} decimals={1} />%
                </span>
              </div>
              <Progress
                value={hitRate}
                className={cn("h-1.5 bg-white/8", progressColor)}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-[220px] text-center">
            Proportion des requêtes servies depuis le cache. Au-dessus de 80% = excellent.
          </TooltipContent>
        </Tooltip>

        {/* Clés actives */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/4 hover:bg-white/7 transition-colors cursor-default">
              <div className="flex items-center gap-2">
                <Key className="size-3.5 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground">Clés actives</span>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                <NumberTicker value={activeKeys} />
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Nombre total de clés stockées dans Redis en ce moment
          </TooltipContent>
        </Tooltip>

        {/* TTL moyen */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/4 hover:bg-white/7 transition-colors cursor-default">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground">TTL moyen</span>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {avgTtl.toLocaleString("fr-FR")}s
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Durée de vie moyenne des entrées — après ce délai les clés expirent automatiquement
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Bouton purge — responsif avec mt-auto pour coller en bas */}
      <div className="mt-auto pt-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <ConfirmDialog
                title="Purger le cache Redis"
                description="Toutes les données en cache seront supprimées. Les performances peuvent être temporairement affectées le temps que le cache se reconstitue."
                confirmLabel="Purger"
                variant="destructive"
                requireTyping="PURGER"
                onConfirm={handlePurge}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                  >
                    <Trash2 className="size-3.5 shrink-0" />
                    <span className="ml-2 truncate">Purger le cache</span>
                  </Button>
                }
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-[200px] text-center">
            Vide entièrement le cache Redis. Tapez PURGER pour confirmer.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}