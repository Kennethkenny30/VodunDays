import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopBar } from "@/components/dashboard/dashboard-topbar"
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
        <div
          className="relative min-h-screen overflow-hidden"
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

          <div className="relative z-10 flex h-screen overflow-hidden">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
              <DashboardTopBar />

              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </div>
          </div>
        </div>
      </TooltipProvider>

      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}