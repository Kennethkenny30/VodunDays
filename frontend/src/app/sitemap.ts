import type { MetadataRoute } from "next"
import { culturalSites } from "@/lib/culture-sites"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3001"
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/programme`,           lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/carte`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/pedagogie`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/avis`,                lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/urgences`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/planner`,             lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
  ]

  const culturePages: MetadataRoute.Sitemap = culturalSites.map((site) => ({
    url:             `${base}/culture/${site.slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }))

  return [...staticPages, ...culturePages]
}
