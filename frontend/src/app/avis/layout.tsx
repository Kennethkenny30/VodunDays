import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Votre avis",
  description: "Donnez votre avis sur les Vodun Days. Répondez à notre quiz de satisfaction et partagez votre expérience du festival culturel de Ouidah.",
  openGraph: {
    title: "Donnez votre avis - Vodun Days",
    description: "Partagez votre expérience des Vodun Days et aidez-nous à améliorer le festival.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Avis Vodun Days" }],
  },
}

export default function AvisLayout({ children }: { children: React.ReactNode }) {
  return children
}
