import { NextRequest, NextResponse } from "next/server"
import { getBackendOrigin } from "@/lib/api/backend-url"

export async function POST(request: NextRequest) {
  const body = await request.json()

  let data: Record<string, unknown>
  let status = 500
  try {
    const backendRes = await fetch(`${getBackendOrigin()}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    })
    status = backendRes.status
    data   = await backendRes.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Impossible de contacter le serveur." },
      { status: 503 }
    )
  }

  const response = NextResponse.json(data, { status })

  if (data.success && typeof data.data === "object" && data.data !== null) {
    const token = (data.data as Record<string, unknown>).token
    if (typeof token === "string") {
      // "lax" plutôt que "strict" : en strict, arriver sur le site depuis un lien
      // externe n'envoie pas le cookie, et le middleware redirige un utilisateur
      // pourtant connecté vers /connexion. Lax bloque toujours les requêtes
      // cross-site non-GET, donc la protection CSRF reste équivalente ici.
      response.cookies.set("vd_token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:   7 * 24 * 60 * 60,
        path:     "/",
      })
    }
  }

  return response
}
