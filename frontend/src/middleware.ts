/**
 * Middleware Next.js - Protection des routes dashboard
 *
 * Logique :
 *  - /admin/*      → accessible aux rôles ADMIN et SUPER_ADMIN
 *                    (si SUPER_ADMIN → redirigé vers /superadmin)
 *  - /superadmin/* → accessible uniquement au rôle SUPER_ADMIN
 *                    (si ADMIN → redirigé vers /admin)
 *  - /connexion    → redirige vers le bon dashboard si déjà connecté
 *
 * Le cookie HttpOnly "vd_token" est accessible dans l'Edge Runtime.
 * On décode le payload JWT (sans vérifier la signature) uniquement
 * pour lire le rôle et effectuer le routage. La vérification cryptographique
 * reste faite par le backend Express à chaque appel API.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "vd_token"

const PROTECTED_ROUTES = ["/admin", "/superadmin"]
const PUBLIC_ROUTES    = ["/connexion"]

type TokenPayload = { role?: string; exp?: number }

/** Lit le payload JWT sans vérifier la signature. */
function decodePayload(token: string): TokenPayload | null {
  try {
    const part    = token.split(".")[1]
    const decoded = atob(part.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded) as TokenPayload
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get(COOKIE_NAME)?.value

  const payload = rawToken ? decodePayload(rawToken) : null

  // Un token expiré doit être traité comme absent. Sinon le middleware renvoie
  // indéfiniment vers le dashboard, où le premier appel API répond 401 et
  // redirige vers /connexion : la page se recharge en boucle.
  const expired = !payload || (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now())
  const token   = expired ? undefined : rawToken

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isPublic    = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  // Pas connecté → accès à une route protégée
  if (isProtected && !token) {
    const loginUrl = new URL("/connexion", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    const response = NextResponse.redirect(loginUrl)
    if (rawToken) response.cookies.delete(COOKIE_NAME)
    return response
  }

  // Cookie périmé sur une route non protégée : on le purge au passage.
  if (rawToken && expired) {
    const response = NextResponse.next()
    response.cookies.delete(COOKIE_NAME)
    return response
  }

  if (token) {
    const role = payload?.role ?? null

    // Déjà connecté → tente d'accéder à /connexion
    if (isPublic) {
      const dest = role === "SUPER_ADMIN" ? "/superadmin" : "/admin"
      return NextResponse.redirect(new URL(dest, request.url))
    }

    // SUPER_ADMIN sur /admin/* → renvoyer vers /superadmin
    if (pathname.startsWith("/admin") && role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/superadmin", request.url))
    }

    // ADMIN (ou rôle inconnu) sur /superadmin/* → renvoyer vers /admin
    if (pathname.startsWith("/superadmin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).+)",
  ],
}
