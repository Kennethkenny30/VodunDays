import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon agenda",
  description: "Planifiez votre expérience des Vodun Days. Organisez votre agenda personnel, sélectionnez vos événements et gérez votre programme de festival à Ouidah.",
  openGraph: {
    title: "Mon agenda - Vodun Days",
    description: "Créez votre agenda personnalisé pour le festival Vodun Days à Ouidah.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Agenda Vodun Days" }],
  },
}

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children
}
