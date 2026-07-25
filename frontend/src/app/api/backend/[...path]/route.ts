/**
 * Proxy vers le backend Express.
 *
 * Le cookie vd_token est posé sur le domaine frontend (Vercel) par la route BFF
 * de login. Il ne peut donc jamais être envoyé au backend, qui vit sur un autre
 * domaine. Le navigateur appelle ce proxy en same-origin, et c'est le serveur
 * Next qui relaie la requête au backend en convertissant le cookie en header
 * Authorization: Bearer. Le token reste HttpOnly, jamais exposé au JavaScript.
 */
import { NextRequest, NextResponse } from "next/server"
import { getBackendOrigin } from "@/lib/api/backend-url"

export const dynamic = "force-dynamic"

// Le backend peut être en veille chez son hébergeur : un démarrage à froid
// dépasse la durée par défaut d'une fonction Vercel.
export const maxDuration = 30

const COOKIE_NAME = "vd_token"

type RouteContext = { params: Promise<{ path: string[] }> }

async function forward(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const url = `${getBackendOrigin()}/api/${path.join("/")}${request.nextUrl.search}`

  const headers: Record<string, string> = {}

  const contentType = request.headers.get("content-type")
  if (contentType) headers["Content-Type"] = contentType

  const locale = request.headers.get("x-locale")
  if (locale) headers["X-Locale"] = locale

  // Le backend accepte le fallback Bearer (voir backend/middlewares/auth.middleware.js).
  // On ne relaie pas le header Cookie brut : inutile de transmettre les cookies
  // de thème et de locale au backend.
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (token) headers["Authorization"] = `Bearer ${token}`

  const method = request.method
  const hasBody = method !== "GET" && method !== "HEAD"

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Impossible de contacter le serveur.", data: null },
      { status: 502 }
    )
  }

  // Le statut est relayé tel quel : la logique client dépend notamment du 401.
  const payload = await response.text()
  return new NextResponse(payload, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  })
}

export const GET = forward
export const POST = forward
export const PATCH = forward
export const PUT = forward
export const DELETE = forward
