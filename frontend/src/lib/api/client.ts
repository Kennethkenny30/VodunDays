/**
 * Client API - Vodun Days Dashboard
 *
 * Toutes les requêtes incluent credentials: "include" pour que le navigateur
 * envoie automatiquement le cookie HttpOnly vd_token au backend.
 * La locale active est transmise via X-Locale pour que le backend puisse
 * l'utiliser si nécessaire.
 */
import type { ApiResponse } from "@/lib/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
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
    response = await fetch(`${API_BASE_URL}${endpoint}`, config)
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

  // 401 → session expirée, rediriger vers /connexion
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/connexion"
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
