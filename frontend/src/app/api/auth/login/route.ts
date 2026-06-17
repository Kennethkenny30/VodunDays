import { NextRequest, NextResponse } from "next/server"

function getBackendBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  return raw.replace(/\/api$/, "")
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  let data: Record<string, unknown>
  let status = 500
  try {
    const backendRes = await fetch(`${getBackendBase()}/api/auth/login`, {
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
      response.cookies.set("vd_token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:   7 * 24 * 60 * 60,
        path:     "/",
      })
    }
  }

  return response
}
