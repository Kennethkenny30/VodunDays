"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { value: "740K+", label: t("about.stats.festivaliers") },
    { value: "7",     label: t("about.stats.sites") },
    { value: "20+",   label: t("about.stats.animations") },
    { value: "3",     label: t("about.stats.jours") },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-title-word",
        { opacity: 0, y: 80, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2, stagger: 0.12, ease: "power4.out",
          scrollTrigger: { trigger: ".about-title", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".about-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".about-text", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".about-image",
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: ".about-image", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".stat-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen px-4 py-16 md:px-6 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="about-title mb-12 md:mb-20" style={{ perspective: "800px" }}>
          <h2 className="text-3xl font-serif font-bold leading-none tracking-tight text-foreground md:text-6xl lg:text-8xl">
            <span className="about-title-word inline-block">{t("about.title.word1")} </span>{" "}
            <span className="about-title-word inline-block">{t("about.title.word2")}</span>
            <br />
            <span className="about-title-word inline-block text-primary">{t("about.title.word3")}</span>{" "}
            <span className="about-title-word inline-block italic font-light">{t("about.title.word4")}</span>
          </h2>
        </div>

        <div className="mb-16 md:mb-24 grid gap-8 lg:grid-cols-5 lg:gap-12 items-center">
          <div className="about-image lg:col-span-3 relative overflow-hidden rounded-2xl aspect-4/3 lg:aspect-16/10">
            <Image
              src="/images/vodundays-6.jpg"
              alt="Cérémonie Vodun traditionnelle"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
              <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground md:px-4 md:py-1.5 md:text-sm">
                Ouidah, Bénin
              </span>
            </div>
          </div>

          <div className="about-text lg:col-span-2 flex flex-col justify-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary md:text-sm">
              {t("about.since")}
            </p>
            <p className="mb-6 text-base leading-relaxed text-foreground/80 md:text-lg lg:text-xl lg:leading-relaxed">
              {t("about.para1")}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base lg:text-lg">
              {t("about.para2")}
            </p>
          </div>
        </div>

        <div className="stat-grid grid grid-cols-2 gap-px md:grid-cols-4 overflow-hidden rounded-2xl border border-border">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item flex flex-col items-center justify-center bg-card p-6 text-center md:p-10"
            >
              <div className="mb-1 text-3xl font-serif font-bold text-primary md:mb-2 md:text-5xl lg:text-6xl">
                {stat.value}
              </div>
              <div className="text-xs tracking-wider uppercase text-muted-foreground md:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
