/**
 * Middleware Next.js - Protection des routes dashboard
 *
 * Logique :
 *  - /admin/*   → accessible uniquement aux rôles ADMIN et SUPER_ADMIN
 *  - /superadmin/* → accessible uniquement au rôle SUPER_ADMIN
 *  - /connexion  → redirige vers le dashboard si déjà connecté
 *
 * Stratégie :
 *  Le cookie HttpOnly "vd_token" n'est pas lisible côté JS,
 *  mais il EST accessible dans le middleware Next.js (côté serveur Edge).
 *  On vérifie juste sa présence ici - la validation réelle du JWT
 *  est faite par le backend à chaque appel API.
 *
 *  Pour une vérification plus stricte en prod, on peut décoder
 *  le JWT ici avec jose (compatible Edge Runtime).
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "vd_token"

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = ["/admin", "/superadmin"]

// Routes publiques (pas de redirection si connecté)
const PUBLIC_ROUTES = ["/connexion"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // ── Pas connecté → accès à une route protégée ────────────────────────────
  if (isProtected && !token) {
    const loginUrl = new URL("/connexion", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Déjà connecté → tente d'accéder à /connexion ─────────────────────────
  // On le redirige vers son dashboard (on ne connaît pas le rôle ici
  // sans décoder le JWT, donc on envoie vers /admin par défaut -
  // la sidebar gère ensuite la navigation selon le rôle réel)
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Appliquer le middleware sur toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico
     * - /api/* (routes API Next.js, pas le backend Express)
     * - fichiers avec extension (images, fonts…)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).+)",
  ],
}
