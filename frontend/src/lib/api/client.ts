/**
 * Client API - Vodun Days Dashboard
 *
 * Le navigateur n'appelle jamais le backend en direct : il passe par le proxy
 * same-origin /api/backend, qui relaie la requête au backend en convertissant
 * le cookie HttpOnly vd_token en header Authorization. Un cookie posé sur le
 * domaine Vercel ne peut pas atteindre le domaine du backend.
 * La locale active est transmise via X-Locale pour que le backend puisse
 * l'utiliser si nécessaire.
 */
import type { ApiResponse } from "@/lib/types/api"
import { normalizeApiUrl } from "@/lib/api/backend-url"
import { clearSession } from "@/lib/auth/session"

// Proxy same-origin côté navigateur ; URL absolue en repli côté serveur, où une
// URL relative n'est pas résolvable.
export function getApiBase(): string {
  if (typeof window !== "undefined") return "/api/backend"
  return normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
}

// Une page du dashboard monte plusieurs composants qui fetchent en parallèle :
// sans ce verrou, un token expiré déclencherait autant de logouts et de
// redirections concurrentes.
let expiring = false

/**
 * Termine la session côté navigateur puis redirige vers /connexion.
 * Appelle la route BFF plutôt que logoutUser() de auth.ts, qui importe
 * getApiBase depuis ce fichier : l'import créerait un cycle.
 */
export async function expireSession(): Promise<void> {
  if (expiring) return
  expiring = true
  clearSession()
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
  window.location.href = "/connexion"
}

function getClientLocale(): string {
  if (typeof document === "undefined") return "fr";
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "fr";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options

  // Timeout de 15 s : evite le spinner infini si le backend/DB ne repond pas
  const controller = new AbortController()
  const timeoutId  = setTimeout(() => controller.abort(), 15_000)

  const config: RequestInit = {
    method,
    credentials: "include", // envoie le cookie HttpOnly vd_token
    cache: "no-store",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "X-Locale": getClientLocale(),
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(`${getApiBase()}${endpoint}`, config)
  } catch (err) {
    // Inclut les erreurs reseau et les timeouts (AbortError)
    const isTimeout = err instanceof DOMException && err.name === "AbortError"
    return {
      success: false,
      message: isTimeout ? "Le serveur ne repond pas (timeout)" : "Erreur reseau",
      data: null as T,
    } as ApiResponse<T>
  } finally {
    clearTimeout(timeoutId)
  }

  // 401 → session expirée. Il faut supprimer le cookie avant de rediriger :
  // sinon le middleware, qui ne voit qu'un cookie présent, renvoie aussitôt
  // vers le dashboard et la page se recharge en boucle.
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      await expireSession()
    }
    throw new Error("Session expirée")
  }

  const json = await response.json().catch(() => ({
    success: false,
    message: "Erreur réseau",
    data: null,
  }))

  return json as ApiResponse<T>
}

export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body }),

  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body }),

  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),
}
