"use client";

import { useRef, useEffect, useId, type ReactNode, type CSSProperties } from "react";

interface GlassSurfaceProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  displace?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  brightness?: number;
  opacity?: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  onClick?: () => void;
}

export function GlassSurface({
  children,
  width = "auto",
  height = "auto",
  borderRadius = 16,
  className = "",
  displace = 0.3,
  distortionScale = -120,
  redOffset = 0,
  greenOffset = 5,
  blueOffset = 10,
  brightness = 40,
  opacity = 1,
  mixBlendMode = "normal",
  onClick,
}: GlassSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // useId génère un ID stable et identique côté serveur et client (pas de hydration mismatch)
  const rawId = useId();
  const filterId = `glass-filter-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty("--mouse-x", `${x}%`);
      container.style.setProperty("--mouse-y", `${y}%`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={displace * 0.01}
              numOctaves={3}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale * 0.1}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values={`
                1 0 0 0 ${redOffset / 255}
                0 1 0 0 ${greenOffset / 255}
                0 0 1 0 ${blueOffset / 255}
                0 0 0 1 0
              `}
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={containerRef}
        onClick={onClick}
        className={`glass-surface relative overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: `${borderRadius}px`,
          opacity,
          mixBlendMode,
          ["--mouse-x" as string]: "50%",
          ["--mouse-y" as string]: "50%",
        }}
      >
        {/* Glass background layers */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: `${borderRadius}px`,
            background: `
              radial-gradient(
                ellipse at var(--mouse-x) var(--mouse-y),
                var(--vd-glass-radial-outer) 0%,
                var(--vd-glass-radial-inner) 40%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Main glass layer */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: `${borderRadius}px`,
            background: `linear-gradient(
              135deg,
              var(--vd-glass-grad-start) 0%,
              var(--vd-glass-grad-mid) 50%,
              var(--vd-glass-grad-end) 100%
            )`,
            backdropFilter: `blur(12px) brightness(${100 + brightness}%)`,
            WebkitBackdropFilter: `blur(12px) brightness(${100 + brightness}%)`,
          }}
        />

        {/* Border glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: `${borderRadius}px`,
            border: "1px solid var(--vd-glass-border-color)",
            boxShadow: `
              inset 0 1px 1px var(--vd-glass-inset-shadow),
              0 4px 30px rgba(0, 0, 0, 0.1)
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>
    </>
  );
}