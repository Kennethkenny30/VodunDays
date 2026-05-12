"use client"

import { EventsManager } from "../components/events-manager"
import { PageTransition } from "@/components/dashboard/page-transition"

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Événements</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les événements du programme culturel Vodun Days
          </p>
        </div>
        <EventsManager />
      </div>
    </PageTransition>
  )
}
