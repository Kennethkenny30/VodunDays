import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Vodun Days - Festival Culturel du Bénin",
    short_name:       "Vodun Days",
    description:      "Plateforme numérique officielle des Vodun Days. Programme, carte interactive, contenus culturels et réalité augmentée.",
    start_url:        "/transition/programme",
    display:          "standalone",
    background_color: "#F56E0F",
    theme_color:      "#F5A623",
    orientation:      "portrait",
    lang:             "fr",
    categories:       ["education", "entertainment", "travel"],
    icons: [
      { src: "/icon-192.png",          sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png",              sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png",        sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  }
}
