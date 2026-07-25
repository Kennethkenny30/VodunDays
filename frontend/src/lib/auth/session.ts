/**
 * Gestion de la session utilisateur côté frontend.
 *
 * Stratégie :
 *  - Le token JWT est stocké dans un cookie HttpOnly posé par le backend
 *    (inaccessible depuis JS → sécurisé contre XSS).
 *  - On stocke uniquement les infos publiques de l'utilisateur
 *    (id, email, role, firstname, lastname) dans sessionStorage
 *    pour affichage immédiat sans re-fetch.
 *  - Si sessionStorage est vide (ex: nouvel onglet, rafraîchissement),
 *    on re-fetch via GET /auth/me à travers le proxy same-origin, qui
 *    transmet le cookie au backend.
 */

import type { User } from "@/lib/types/api"

const SESSION_KEY = "vd_user"

export type SessionUser = Pick<
  User,
  "id" | "email" | "role" | "firstname" | "lastname" | "phone"
>

// Écriture

/** Sauvegarde les infos utilisateur dans sessionStorage après login. */
export function saveSession(user: SessionUser): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

// Lecture

/** Retourne l'utilisateur depuis sessionStorage, ou null si absent. */
export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

// Suppression

/** Vide la session locale. Le cookie est supprimé par POST /api/auth/logout. */
export function clearSession(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(SESSION_KEY)
}

// Helpers

/** Retourne vrai si l'utilisateur a l'un des rôles fournis. */
export function hasRole(
  user: SessionUser | null,
  ...roles: SessionUser["role"][]
): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/** Retourne le nom complet affiché. */
export function getDisplayName(user: SessionUser | null): string {
  if (!user) return "Utilisateur"
  return `${user.firstname} ${user.lastname}`.trim()
}

/** Retourne les initiales pour l'avatar. */
export function getInitials(user: SessionUser | null): string {
  if (!user) return "?"
  const f = user.firstname?.[0] ?? ""
  const l = user.lastname?.[0] ?? ""
  return `${f}${l}`.toUpperCase() || user.email[0].toUpperCase()
}
