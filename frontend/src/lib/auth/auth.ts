import type { User, UpdateMePayload } from "@/lib/types/api"
import type { SessionUser } from "./session"
import { getApiBase } from "@/lib/api/client"

type AuthResponse<T> = {
  success: boolean
  message: string
  data: T
}

// Login

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResult = {
  user: Omit<User, "password">
  token: string
}

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse<LoginResult>> {
  // Route BFF Next.js : pose le cookie sur le domaine frontend pour que le middleware puisse le lire
  const res = await fetch("/api/auth/login", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })
  return res.json()
}

// Logout

export async function logoutUser(): Promise<void> {
  // Route BFF : efface le cookie frontend et appelle le logout backend
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => {})
}

// Me

/**
 * Récupère l'utilisateur connecté depuis le cookie.
 * Appelé au montage des pages protégées si sessionStorage est vide.
 *
 * Le statut HTTP est remonté pour que l'appelant distingue un vrai refus
 * d'authentification (401/403) d'une panne passagère du backend : seul le
 * premier cas doit détruire la session.
 */
export async function getMe(): Promise<AuthResponse<SessionUser> & { status: number }> {
  const res = await fetch(`${getApiBase()}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  const json = await res.json().catch(() => ({
    success: false,
    message: "Erreur reseau",
    data: null,
  }))
  return { ...json, status: res.status }
}

export async function updateMe(payload: UpdateMePayload): Promise<AuthResponse<{ user: SessionUser }>> {
  const res = await fetch(`${getApiBase()}/auth/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}
