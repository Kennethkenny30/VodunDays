import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carte interactive",
  description: "Explorez la carte interactive des Vodun Days : sites culturels, points d'urgence, transports, toilettes et expériences AR à Ouidah et ses environs.",
  openGraph: {
    title: "Carte interactive - Vodun Days",
    description: "Découvrez tous les lieux du festival Vodun Days sur la carte interactive de Ouidah.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Carte Vodun Days" }],
  },
}

export default function CarteLayout({ children }: { children: React.ReactNode }) {
  return children
}
