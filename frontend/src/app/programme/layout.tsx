import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Programme",
  description: "Consultez le programme complet des Vodun Days : événements culturels, cérémonies, spectacles et animations à Ouidah. Filtrez par jour et organisez votre festival.",
  openGraph: {
    title: "Programme des Vodun Days",
    description: "Tous les événements culturels des Vodun Days à Ouidah, filtrés par jour et catégorie.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Programme Vodun Days" }],
  },
}

export default function ProgrammeLayout({ children }: { children: React.ReactNode }) {
  return children
}
