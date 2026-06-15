import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pédagogie & Réalité Augmentée",
  description: "Plongez dans le patrimoine vodun grâce aux contenus pédagogiques et à la réalité augmentée des Vodun Days. Découvrez les sites sacrés, les divinités et les traditions de Ouidah.",
  openGraph: {
    title: "Pédagogie & AR - Vodun Days",
    description: "Explorez le patrimoine vodun de Ouidah en réalité augmentée et via les contenus culturels des Vodun Days.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Pédagogie Vodun Days" }],
  },
}

export default function PedagogieLayout({ children }: { children: React.ReactNode }) {
  return children
}
