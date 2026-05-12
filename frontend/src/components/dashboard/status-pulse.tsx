import { cn } from "@/lib/utils"

type StatusType = "online" | "degraded" | "incident"

interface StatusPulseProps {
  status: StatusType
  className?: string
}

// Indicateur de statut avec animation pulse
export function StatusPulse({ status, className }: StatusPulseProps) {
  const colors: Record<StatusType, string> = {
    online: "bg-green-500",
    degraded: "bg-amber-500",
    incident: "bg-red-500",
  }

  return (
    <span className={cn("relative flex size-3", className)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full status-pulse",
          colors[status],
          "opacity-75"
        )}
      />
      <span
        className={cn(
          "relative inline-flex size-3 rounded-full",
          colors[status]
        )}
      />
    </span>
  )
}
