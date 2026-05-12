"use client"

import { StatusCard } from "./components/status-card"
import { ModulesCard } from "./components/modules-card"
import { CacheCard } from "./components/cache-card"
import { ActivityCard } from "./components/activity-card"
import { IncidentCenter } from "./components/incident-center"

export default function SuperAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Super Admin</h1>
        <p className="text-sm text-muted-foreground">
          Supervision et configuration de la plateforme Vodun Days
        </p>
      </div>

      <section>
        <h2 className="text-base font-medium tracking-tight text-muted-foreground mb-4">
          Métriques plateforme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard className="md:col-span-2" />
          <ModulesCard />
          <CacheCard />
          <ActivityCard className="lg:col-span-2" />
        </div>
      </section>

      <section>
        <IncidentCenter />
      </section>
    </div>
  )
}