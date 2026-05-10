"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Map, Calendar, Bell, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Calendar,
    title: "Programme Complet",
    description:
      "Consultez le programme journalier des rituels, animations et concerts en temps réel.",
  },
  {
    icon: Map,
    title: "Carte Interactive",
    description:
      "Naviguez facilement entre les sites culturels, points d'intérêt et services essentiels.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Recevez des alertes pour les événements importants et changements de programme.",
  },
  {
    icon: Users,
    title: "Expérience Culturelle",
    description:
      "Accédez à des contenus pédagogiques sur les rituels et traditions Vodun.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-card/80 px-6 py-24 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Fonctionnalités
          </span>
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">Votre Guide Numérique</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Une plateforme conçue pour améliorer votre expérience des Vodun Days
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card group rounded-2xl border border-border/50 bg-background/50 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-background/80 md:p-8"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
