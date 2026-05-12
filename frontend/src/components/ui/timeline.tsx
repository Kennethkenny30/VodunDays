"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Conteneur principal de la timeline
interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {children}
    </div>
  )
}

// Item individuel de la timeline
interface TimelineItemProps {
  children: React.ReactNode
  className?: string
}

export function TimelineItem({ children, className }: TimelineItemProps) {
  return (
    <div className={cn("relative flex gap-4 pb-6 last:pb-0", className)}>
      {children}
    </div>
  )
}

// Indicateur (icône/point) sur la ligne verticale
interface TimelineIndicatorProps {
  children?: React.ReactNode
  className?: string
}

export function TimelineIndicator({ children, className }: TimelineIndicatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border bg-background",
          className
        )}
      >
        {children}
      </div>
      {/* Ligne verticale */}
      <div className="w-px flex-1 bg-border" />
    </div>
  )
}

// Contenu de l'item
interface TimelineContentProps {
  children: React.ReactNode
  className?: string
}

export function TimelineContent({ children, className }: TimelineContentProps) {
  return (
    <div className={cn("flex-1 pt-0.5 pb-2", className)}>
      {children}
    </div>
  )
}

// Titre de l'item
interface TimelineTitleProps {
  children: React.ReactNode
  className?: string
}

export function TimelineTitle({ children, className }: TimelineTitleProps) {
  return (
    <p className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </p>
  )
}

// Description de l'item
interface TimelineDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function TimelineDescription({ children, className }: TimelineDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  )
}

// Horodatage de l'item
interface TimelineTimeProps {
  children: React.ReactNode
  className?: string
}

export function TimelineTime({ children, className }: TimelineTimeProps) {
  return (
    <time className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </time>
  )
}
