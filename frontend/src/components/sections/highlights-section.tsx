"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const highlightKeys = ["ceremonies", "danses", "artisanat", "gastronomie"];

export function HighlightsSection() {
  const t = useTranslations("home.highlights");
  const sectionRef = useRef<HTMLElement>(null);

  const highlights = highlightKeys.map((key, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`),
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".highlight-item",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">{t("title")}</span>
          </h2>
        </div>

        <div className="space-y-8">
          {highlights.map((item) => (
            <div
              key={item.number}
              className="highlight-item group flex flex-col gap-6 border-b border-border/30 pb-8 transition-colors hover:border-primary/50 md:flex-row md:items-center md:gap-12"
            >
              <span className="text-5xl font-bold text-primary/30 transition-colors group-hover:text-primary md:text-6xl">
                {item.number}
              </span>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-foreground md:text-2xl">
                  {item.title}
                </h3>
                <p className="max-w-xl text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:flex">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}