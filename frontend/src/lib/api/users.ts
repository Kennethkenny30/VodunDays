// API Users - Vodun Days Dashboard
import { api } from "./client"
import type { User, UserUpdatePayload, UserRole } from "@/lib/types/api"

type UsersQueryParams = {
  role?: UserRole
  active?: boolean
}

// Récupère la liste des utilisateurs
export async function getUsers(params?: UsersQueryParams) {
  const searchParams = new URLSearchParams()
  if (params?.role) searchParams.set("role", params.role)
  if (params?.active !== undefined) searchParams.set("active", String(params.active))

  const query = searchParams.toString()
  const endpoint = query ? `/users?${query}` : "/users"

  return api.get<User[]>(endpoint)
}

// Récupère un utilisateur par son ID
export async function getUser(id: string) {
  return api.get<User>(`/users/${id}`)
}

// Met à jour un utilisateur
export async function updateUser(id: string, payload: UserUpdatePayload) {
  return api.patch<User>(`/users/${id}`, payload)
}

// Supprime un utilisateur
export async function deleteUser(id: string) {
  return api.delete<null>(`/users/${id}`)
}

// Active ou désactive un utilisateur
export async function toggleUserActive(id: string, active: boolean) {
  return api.patch<User>(`/users/${id}`, { active })
}
