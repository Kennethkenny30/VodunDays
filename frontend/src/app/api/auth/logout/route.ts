import { NextRequest, NextResponse } from "next/server"

function getBackendBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  return raw.replace(/\/api$/, "")
}

export async function POST(request: NextRequest) {
  await fetch(`${getBackendBase()}/api/auth/logout`, {
    method:  "POST",
    headers: { Cookie: request.headers.get("cookie") || "" },
  }).catch(() => {})

  const response = NextResponse.json({ success: true, message: "Deconnecte" })
  response.cookies.delete("vd_token")
  return response
}
