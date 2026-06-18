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

/** Lit le champ `role` du payload JWT sans vérifier la signature. */
function decodeRole(token: string): string | null {
  try {
    const part    = token.split(".")[1]
    const decoded = atob(part.replace(/-/g, "+").replace(/_/g, "/"))
    return (JSON.parse(decoded) as { role?: string }).role ?? null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isPublic    = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  // Pas connecté → accès à une route protégée
  if (isProtected && !token) {
    const loginUrl = new URL("/connexion", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token) {
    const role = decodeRole(token)

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
