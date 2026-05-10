"use client"

import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Liste avec animation d'entrée progressive
export function AnimatedList({
  children,
  className,
  delay = 0.1,
}: AnimatedListProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence initial={false}>
        {Array.isArray(children)
          ? children.map((child, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * delay, duration: 0.2 }}
              >
                {child}
              </motion.div>
            ))
          : children}
      </AnimatePresence>
    </div>
  )
}

interface AnimatedListItemProps {
  children: React.ReactNode
  className?: string
}

// Item individuel de la liste animée
export function AnimatedListItem({ children, className }: AnimatedListItemProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-3", className)}>
      {children}
    </div>
  )
}
