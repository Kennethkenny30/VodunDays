import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accès à l'espace administrateur Vodun Days.",
  robots: { index: false, follow: false },
}

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children
}
