"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassSurface } from "@/components/glass-surface";
import { ArrowDown, MapPin, Calendar } from "lucide-react";
import { MobileGateModal } from "@/components/mobile-gate-modal";
import { useMobileGate } from "@/hooks/use-mobile-gate";

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const desktopBgRef = useRef<HTMLDivElement>(null);

  const { gateState, intercept, closeGate } = useMobileGate();

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
    <>
      <MobileGateModal
        isOpen={gateState.isOpen}
        onClose={closeGate}
        targetUrl={gateState.targetUrl}
        pageLabel={gateState.pageLabel}
      />

    <section className="relative flex min-h-screen items-center justify-center px-4 md:px-6">

        {/* Desktop background image */}
        <div
          ref={desktopBgRef}
          className="fixed inset-0 z-0 hidden md:block"
        >
          <img
            src="/arene-ouidah.jpg"
            alt="Arène de Ouidah"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <h1
          ref={titleRef}
            className="mb-4 md:mb-6 text-5xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight"
        >
            <span className="text-balance bg-linear-to-b from-white to-slate-900/10 bg-clip-text text-transparent">
              Célébrez la Tradition
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mb-6 md:mb-10 max-w-2xl text-pretty text-base md:text-lg lg:text-xl font-light leading-relaxed text-white/75"
        >
          Trois jours où{" "}
          <span className="font-medium text-white">Ouidah</span>{" "}
          s{"'"}éveille au rythme des tambours. Rituels, danses sacrées et
          traditions ancestrales,{" "}
          <span className="font-normal text-primary">
            l{"'"}âme vivante du Bénin
          </span>
          .
        </p>

        <div ref={ctaRef} className="flex flex-col items-center justify-center gap-3 md:gap-4 sm:flex-row">
            <Link
              href="/transition/programme"
              onClick={(e) => intercept(e, "/transition/programme", "le Programme")}
            >
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
                <span className="text-sm md:text-lg font-semibold text-foreground">
                  Explorer le Programme
                </span>
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
    </>
  );
}