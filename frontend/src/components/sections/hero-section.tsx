"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassSurface } from "@/components/glass-surface";
import { ArrowDown, MapPin, Calendar } from "lucide-react";

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.9 }
      );
      gsap.fromTo(
        infoRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.2 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 md:px-6">
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/*<div className="mb-4 md:mb-6 inline-flex items-center gap-1.5 md:gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-primary backdrop-blur-sm">
          <span className="h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse rounded-full bg-primary" />
          10 Janvier 2027 - Ouidah, Bénin
        </div>    text-muted-foreground*/}

        <h1
          ref={titleRef}
          className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-foreground"
        >
          <span className="text-balance">
            Célébrez la{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Tradition
            </span>
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mb-6 md:mb-10 max-w-2xl text-sm md:text-lg lg:text-xl"
        >
          Plongez au cœur des Vodun Days, l{"'"}événement culturel et spirituel majeur 
          du Bénin. Découvrez rituels, danses et traditions ancestrales.
        </p>

        <div ref={ctaRef} className="flex flex-col items-center justify-center gap-3 md:gap-4 sm:flex-row">
          <Link href="/transition/programme">
            <GlassSurface
              borderRadius={30}
              displace={0.5}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              brightness={50}
              className="px-5 py-3 md:px-8 md:py-4 transition-transform hover:scale-105"
            >
              <span className="text-sm md:text-lg font-semibold text-foreground">Explorer le Programme</span>
            </GlassSurface>
          </Link>
          <Link href="/transition/carte">
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 bg-transparent px-5 py-4 md:px-8 md:py-6 text-sm md:text-lg font-semibold text-foreground hover:bg-foreground/10"
            >
              Voir la Carte
            </Button>
          </Link>
        </div>

        <div
          ref={infoRef}
          className="mt-10 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>08-10 Janvier 2027</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Ouidah, Bénin</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-primary">+800K</span>
            <span>Festivaliers attendus</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-4 w-4 md:h-6 md:w-6 text-foreground/50" />
      </div>
    </section>
  );
}