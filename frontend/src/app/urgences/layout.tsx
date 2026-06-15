import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Signaler une urgence",
  description: "Signalez une urgence lors des Vodun Days à Ouidah. Accès rapide aux services de secours et assistance médicale durant le festival.",
  openGraph: {
    title: "Urgences - Vodun Days",
    description: "Signalez une urgence médicale ou de sécurité pendant les Vodun Days à Ouidah.",
    images: [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: "Urgences Vodun Days" }],
  },
}

export default function UrgencesLayout({ children }: { children: React.ReactNode }) {
  return children
}
