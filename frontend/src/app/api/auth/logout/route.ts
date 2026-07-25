import { NextRequest, NextResponse } from "next/server"
import { getBackendOrigin } from "@/lib/api/backend-url"

export async function POST(request: NextRequest) {
  // Le backend identifie la session via le Bearer, comme le proxy /api/backend :
  // le cookie du domaine frontend ne lui est d'aucune utilité.
  const token = request.cookies.get("vd_token")?.value
  await fetch(`${getBackendOrigin()}/api/auth/logout`, {
    method:  "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).catch(() => {})

  const response = NextResponse.json({ success: true, message: "Deconnecte" })
  response.cookies.delete("vd_token")
  return response
}
