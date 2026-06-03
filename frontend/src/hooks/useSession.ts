/**
 * Hook useSession — récupère l'utilisateur connecté.
 *
 * 1. Lit d'abord sessionStorage (instantané, pas de réseau).
 * 2. Si absent (nouvel onglet, refresh), appelle GET /api/auth/me
 *    (le cookie HttpOnly est envoyé automatiquement).
 * 3. Expose loading, user, et refetch().
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { getSession, saveSession, clearSession } from "@/lib/auth/session"
import { getMe, logoutUser } from "@/lib/auth/auth"
import { useRouter } from "next/navigation"
import type { SessionUser } from "@/lib/auth/session"

export function useSession() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const json = await getMe()
      if (json.success && json.data) {
        saveSession(json.data)
        setUser(json.data)
      } else {
        clearSession()
        setUser(null)
        router.replace("/connexion")
      }
    } catch {
      clearSession()
      setUser(null)
      router.replace("/connexion")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const cached = getSession()
    if (cached) {
      setUser(cached)
      setLoading(false)
    } else {
      // sessionStorage vide → re-vérifier le cookie avec /me
      fetchMe()
    }
  }, [fetchMe])

  const logout = useCallback(async () => {
    await logoutUser()
    clearSession()
    setUser(null)
    router.replace("/connexion")
  }, [router])

  return { user, loading, logout, refetch: fetchMe }
}
