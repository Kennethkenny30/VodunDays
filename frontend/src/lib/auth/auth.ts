/**
 * Appels API liés à l'authentification.
 * Utilise credentials: "include" pour que le navigateur envoie
 * automatiquement le cookie HttpOnly vd_token à chaque requête.
 */

import type { User } from "@/lib/types/api"
import type { SessionUser } from "./session"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

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
  token: string // retourné aussi dans le body pour les clients non-browser
}

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse<LoginResult>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // le backend pose le cookie HttpOnly
    body: JSON.stringify(payload),
  })
  return res.json()
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include", // le backend efface le cookie
  }).catch(() => {
    // silencieux : on vide la session locale de toute façon
  })
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
