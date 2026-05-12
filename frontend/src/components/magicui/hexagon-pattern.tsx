"use client"

import { cn } from "@/lib/utils"

interface HexagonPatternProps {
  className?: string
}

// Motif hexagonal SVG pour le fond du dashboard
export function HexagonPattern({ className }: HexagonPatternProps) {
  return (
    <svg
      className={cn("h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="hexagon-pattern"
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1)"
        >
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#hexagon-pattern)"
      />
    </svg>
  )
}
