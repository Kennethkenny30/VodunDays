"use client"

import { NotificationsCenter } from "../components/notifications-center"
import { PageTransition } from "@/components/dashboard/page-transition"

export default function NotificationsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les notifications envoyées aux festivaliers
          </p>
        </div>
        <NotificationsCenter />
      </div>
    </PageTransition>
  )
}
