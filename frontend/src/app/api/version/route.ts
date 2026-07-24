import { NextResponse } from "next/server";

// Route non mise en cache : reflète la version du déploiement Vercel courant.
// Comparée côté client à NEXT_PUBLIC_APP_VERSION (inlinée au build) pour détecter une mise à jour.
export const dynamic = "force-dynamic";

export function GET() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";
  return NextResponse.json(
    { version },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
