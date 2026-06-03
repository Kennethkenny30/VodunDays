/**
 * Client API — Vodun Days Dashboard
 *
 * Toutes les requêtes incluent credentials: "include" pour que le navigateur
 * envoie automatiquement le cookie HttpOnly vd_token au backend.
 * Plus besoin d'injecter manuellement le header Authorization.
 */
import type { ApiResponse } from "@/lib/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options

  const config: RequestInit = {
    method,
    credentials: "include", // envoie le cookie HttpOnly vd_token
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

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
