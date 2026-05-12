"use client"

import { useState, useEffect } from "react"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ProgramOverview } from "./components/program-overview"
import { EventsManager } from "./components/events-manager"
import { NotificationsCenter } from "./components/notifications-center"
import { SurveyResults } from "./components/survey-results"

// Page principale Admin Culture - Pilotage du programme culturel
export default function AdminPage() {
  const [today, setToday] = useState("")

  useEffect(() => {
    const raw = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })
    setToday(raw.charAt(0).toUpperCase() + raw.slice(1))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {today || "Chargement..."}
        </h1>
        <p className="text-sm text-muted-foreground">
          Vodun Days — édition en cours
        </p>
      </div>

      {/* Section 1 - Vue du programme en cours */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-4">Vue du programme</h2>
        <ProgramOverview />
      </section>

      {/* Section 2 - Gestion des événements */}
      <section>
        <EventsManager />
      </section>

      {/* Section 3 - Communications */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationsCenter />
        <SurveyResults />
      </section>
    </div>
  )
}