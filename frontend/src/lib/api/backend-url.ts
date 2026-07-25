/**
 * Résolution de l'URL du backend Express.
 *
 * Utilisé uniquement côté serveur Next (routes BFF et proxy). Le navigateur,
 * lui, n'appelle jamais le backend en direct : il passe par /api/backend
 * (voir getApiBase dans client.ts).
 */

// Normalise l'URL : ajoute https:// si le schéma est absent (variable d'env mal renseignée).
export function normalizeApiUrl(raw: string): string {
  return raw.startsWith("http") ? raw : `https://${raw}`
}

/** Origine du backend, sans le suffixe /api. */
export function getBackendOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  return normalizeApiUrl(raw).replace(/\/api\/?$/, "")
}
