import type { User, UpdateMePayload } from "@/lib/types/api"
import type { SessionUser } from "./session"
import { getApiBase } from "@/lib/api/client"

const API_BASE = getApiBase()

type AuthResponse<T> = {
  success: boolean
  message: string
  data: T
}

// ─── Login ────────────────────────────────────────────────────────────────────

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

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  // Route BFF : efface le cookie frontend et appelle le logout backend
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => {})
}

// ─── Me ───────────────────────────────────────────────────────────────────────

/**
 * Récupère l'utilisateur connecté depuis le cookie.
 * Appelé au montage des pages protégées si sessionStorage est vide.
 */
export async function getMe(): Promise<AuthResponse<SessionUser>> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  return res.json()
}

export async function updateMe(payload: UpdateMePayload): Promise<AuthResponse<{ user: SessionUser }>> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}
