"use client"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

// Effet de bordure lumineuse animée
export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "var(--vd-gold)",
  colorTo = "var(--vd-earth)",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[border:calc(var(--border-width))_solid_transparent]",
        "[background:padding-box_linear-gradient(to_right,transparent,transparent),border-box_conic-gradient(from_calc(var(--size)*1deg),transparent_25%,var(--color-from)_50%,var(--color-to)_75%,transparent)]",
        "[animation:border-beam_var(--duration)_linear_infinite_var(--delay)]",
        "after:absolute after:inset-0 after:rounded-[inherit] after:bg-background after:-z-10",
        className
      )}
    />
  )
}
