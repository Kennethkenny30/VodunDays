'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evite le flash de mauvaise icône au premier rendu SSR
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="size-9" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className={`flex size-9 items-center justify-center rounded-full border border-border/40 bg-card/60 text-foreground/70 backdrop-blur-sm transition-colors duration-200 hover:border-border hover:text-foreground active:scale-95 ${className ?? ''}`}
    >
      {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
    </button>
  )
}
