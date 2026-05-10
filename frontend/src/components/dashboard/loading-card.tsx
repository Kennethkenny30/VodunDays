import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingCardProps {
  lines?: number
  className?: string
}

// Skeleton de chargement en forme de card
export function LoadingCard({ lines = 3, className }: LoadingCardProps) {
  return (
    <div className={cn("glass-card p-6 space-y-4", className)}>
      <Skeleton className="h-4 w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// Variante pour les métriques
export function LoadingMetric({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-6 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-2 w-16" />
    </div>
  )
}
