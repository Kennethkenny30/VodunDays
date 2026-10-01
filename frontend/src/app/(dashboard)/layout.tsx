import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopBar } from "@/components/dashboard/dashboard-topbar"
import { DashboardSplash } from "@/components/dashboard/dashboard-splash"
import { PageTransition } from "@/components/dashboard/page-transition"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vodundays-dashboard-theme" attribute="class">
      <TooltipProvider delayDuration={300}>
        <DashboardSplash />

        {/* Fond plein écran — visible dans la marge autour de la carte flottante */}
        <div
          className="relative min-h-screen overflow-hidden p-2 md:p-4"
          style={{ background: "var(--vd-deep)" }}
        >
          {/* Motif hexagonal - même style que la page connexion */}
          <HexagonPattern
            hexagons={[
              [1, 1], [4, 4], [2, 2], [3, 4],
              [5, 4], [8, 2], [6, 3], [8, 5], [10, 10],
            ]}
            className={cn(
              "absolute inset-0 z-0 pointer-events-none",
              "[mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,white,transparent)]",
              "fill-amber-500/20 stroke-amber-500/20"
            )}
          />

          {/* ── Sidebar et topbar sont deux blocs indépendants, chacun avec ses 4 coins
                arrondis et sa propre ombre — aucun conteneur partagé, aucun lien visuel
                entre eux, exactement comme sur la référence ── */}
          <div
            className={cn(
              "relative z-10 flex h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] gap-3 md:gap-4",
              "print:h-auto print:block print:gap-0"
            )}
          >
            <div className="print:hidden">
              <DashboardSidebar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden print:block">
              {/* ── Carte de contenu : le topbar flotte par-dessus (position absolue,
                    fond flouté), le scroll du contenu passe visuellement dessous
                    au lieu de disparaître avant d'y arriver ── */}
              <div className="relative flex-1 overflow-hidden bg-[oklch(0.13_0.02_260/0.6)] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.65)] print:overflow-visible print:shadow-none print:bg-transparent">
                <main className="absolute inset-0 overflow-y-auto p-4 pt-24 md:p-6 md:pt-28 lg:p-8 lg:pt-28 print:relative print:inset-auto print:overflow-visible print:p-0">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>

                <div className="absolute inset-x-0 top-0 z-20 p-3 md:p-4 print:hidden">
                  <DashboardTopBar />
                </div>
              </div>

              <footer className="print:hidden shrink-0 px-4 py-1 pt-3 text-center text-xs text-muted-foreground md:px-6 lg:px-8">
                © {new Date().getFullYear()} Kondo Technologie. Tous droits réservés.
              </footer>
            </div>
          </div>
        </div>
      </TooltipProvider>

      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}