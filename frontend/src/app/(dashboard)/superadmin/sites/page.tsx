"use client"

import { SitesManager } from "../components/sites-manager"
import { PageTransition } from "@/components/dashboard/page-transition"

export default function SitesPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sites & géographie</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les sites géographiques du festival Vodun Days
          </p>
        </div>
        <SitesManager />
      </div>
    </PageTransition>
  )
}
