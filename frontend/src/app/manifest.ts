import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Vodun Days - Festival Culturel du Bénin",
    short_name:       "Vodun Days",
    description:      "Plateforme numérique officielle des Vodun Days. Programme, carte interactive, contenus culturels et réalité augmentée.",
    start_url:        "/transition/programme",
    display:          "standalone",
    background_color: "#0a0a0a",
    theme_color:      "#F5A623",
    orientation:      "portrait",
    lang:             "fr",
    categories:       ["education", "entertainment", "travel"],
    icons: [
      { src: "/icon.png",            sizes: "any",    type: "image/png" },
      { src: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png",       sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  }
}
