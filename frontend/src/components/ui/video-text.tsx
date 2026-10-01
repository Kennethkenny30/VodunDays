"use client"

import React, {
  useEffect,
  useMemo,
  useRef,
  type ElementType,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

export interface VideoTextProps {
  /** URL de la vidéo */
  src: string
  /** Classes additionnelles pour le conteneur */
  className?: string
  /** Classes additionnelles pour la zone masquée (utile pour une couleur de repli tant que la vidéo charge) */
  maskClassName?: string
  /** Image affichée avant le chargement de la vidéo */
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  preload?: "auto" | "metadata" | "none"
  /** Le texte à afficher (la vidéo est "dedans") */
  children: ReactNode
  /**
   * Taille de police. Un nombre est interprété en vw, relatif à la largeur
   * du conteneur (le masque SVG se redimensionne tout seul).
   * @default 20
   */
  fontSize?: string | number
  fontWeight?: string | number
  textAnchor?: string
  dominantBaseline?: string
  /**
   * Attention : un SVG utilisé comme masque ne peut pas charger de police web,
   * seules les polices système sont disponibles.
   */
  fontFamily?: string
  /**
   * Largeur imposée au texte (ex. "94%"). Garantit que le mot remplit la
   * largeur quelle que soit la police système utilisée.
   */
  textLength?: string
  /** @default "spacingAndGlyphs" */
  lengthAdjust?: "spacing" | "spacingAndGlyphs"
  as?: ElementType
}

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export function VideoText({
  src,
  children,
  className = "",
  maskClassName = "",
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "metadata",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  textLength,
  lengthAdjust = "spacingAndGlyphs",
  as: Component = "div",
}: VideoTextProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const content = React.Children.toArray(children).join("")

  // Les unités vw d'un SVG utilisé comme image sont relatives à la taille de
  // l'image elle-même : pas besoin d'écouter "resize", et le masque est
  // disponible dès le premier rendu (pas de flash de la vidéo non masquée).
  const dataUrlMask = useMemo(() => {
    const size = typeof fontSize === "number" ? `${fontSize}vw` : fontSize
    const length = textLength
      ? ` textLength='${textLength}' lengthAdjust='${lengthAdjust}'`
      : ""
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>` +
      `<text x='50%' y='50%' font-size='${size}' font-weight='${fontWeight}'` +
      ` text-anchor='${textAnchor}' dominant-baseline='${dominantBaseline}'` +
      ` font-family='${fontFamily}'${length}>${escapeXml(content)}</text></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [
    content,
    fontSize,
    fontWeight,
    textAnchor,
    dominantBaseline,
    fontFamily,
    textLength,
    lengthAdjust,
  ])

  // Lecture uniquement quand le texte est visible + respect de prefers-reduced-motion
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true // l'attribut React `muted` n'est pas toujours appliqué au DOM

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!autoPlay || reduceMotion.matches) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [autoPlay])

  return (
    <Component className={cn("relative size-full", className)}>
      <div
        className={cn("absolute inset-0 flex items-center justify-center", maskClassName)}
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          poster={poster}
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>

      {/* Texte de secours pour le SEO / l'accessibilité */}
      <span className="sr-only">{content}</span>
    </Component>
  )
}
