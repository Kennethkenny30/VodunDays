import type { Metadata } from "next"
import { culturalSites } from "@/lib/culture-sites"

interface LayoutProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return culturalSites.map((site) => ({ slug: site.slug }))
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params
  const site = culturalSites.find((s) => s.slug === slug)

  if (!site) {
    return { title: "Site culturel", description: "Découvrez les sites sacrés des Vodun Days à Ouidah." }
  }

  const entities = site.entities.join(", ")

  return {
    title: site.name,
    description: site.description,
    openGraph: {
      title: `${site.name} - Vodun Days`,
      description: site.description,
      images: site.image
        ? [{ url: site.image, width: 1200, height: 630, alt: site.name }]
        : [{ url: "/arene-ouidah.JPG", width: 1200, height: 630, alt: site.name }],
    },
    keywords: ["Vodun Days", "Ouidah", site.name, ...site.entities, "culture", "Bénin", entities],
  }
}

export default function CultureSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
