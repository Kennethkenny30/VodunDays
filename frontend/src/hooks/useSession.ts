/**
 * Hook useSession - récupère l'utilisateur connecté.
 *
 * 1. Lit d'abord sessionStorage (instantané, pas de réseau).
 * 2. Si absent (nouvel onglet, refresh), appelle GET /auth/me via le proxy
 *    same-origin, qui transmet le cookie HttpOnly au backend.
 * 3. Expose loading, user, et refetch().
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { getSession, saveSession, clearSession } from "@/lib/auth/session"
import { getMe, logoutUser } from "@/lib/auth/auth"
import { expireSession } from "@/lib/api/client"
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
        return
      }
      setUser(null)
      // Seul un vrai refus d'authentification termine la session. Sur une panne
      // passagère du backend, on laisse l'utilisateur connecté plutôt que de le
      // déconnecter. expireSession supprime aussi le cookie : sans ça le
      // middleware renverrait aussitôt vers le dashboard et la page bouclerait.
      if (json.status === 401 || json.status === 403) {
        await expireSession()
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

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
