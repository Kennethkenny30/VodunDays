"use client"

import { UsersRolesManager } from "../components/users-roles-manager"
import { PageTransition } from "@/components/dashboard/page-transition"

export default function RolesPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion des rôles</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les utilisateurs et leurs permissions sur la plateforme
          </p>
        </div>
        <UsersRolesManager />
      </div>
    </PageTransition>
  )
}
