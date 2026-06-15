import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3001"
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/(dashboard)/",
          "/parametres/",
          "/connexion/",
          "/api/",
          "/transition/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
