"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  BookHeart,
  CalendarDays,
  MapPin,
  Scan,
  ShieldAlert,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Cadre téléphone mobile avec dynamic island et indicateur home
function PhoneMockup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex shrink-0 flex-col overflow-hidden rounded-[20px] bg-[#0d0d12] ${className}`}
      style={{
        border: "3px solid #252530",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      {/* Dynamic island */}
      <div className="flex shrink-0 items-center justify-center pb-1 pt-2">
        <div
          className="h-2 w-8 rounded-full bg-black"
          style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)" }}
        />
      </div>
      {/* Écran - contenu de l'app */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
      {/* Indicateur home (iPhone style) */}
      <div className="flex shrink-0 items-center justify-center py-1.5">
        <div className="h-0.5 w-7 rounded-full bg-white/25" />
      </div>
    </div>
  );
}

// Mini-preview Programme - capture réelle de /programme (PlannerCard + DayFilter + ProgramCard)
function MiniProgramme() {
  return (
    <img
      src="/images/features/preview-programme.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none h-full w-full select-none object-cover object-top"
    />
  );
}

// Mini-preview Carte - capture réelle de la navigation/carte interactive
function MiniCarte() {
  return (
    <img
      src="/images/features/preview-carte.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none h-full w-full select-none object-cover object-top"
    />
  );
}

// Mini-preview Agenda - capture réelle de /planner (StatsBar + Timeline)
function MiniAgenda() {
  return (
    <img
      src="/images/features/preview-agenda.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none h-full w-full select-none object-cover object-top"
    />
  );
}

// Mini-preview Notifications - capture réelle du centre de notifications
function MiniNotifications() {
  return (
    <img
      src="/images/features/preview-notifications.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none h-full w-full select-none object-cover object-top"
    />
  );
}

// Mini-preview Urgences - capture réelle du flux de signalement d'urgence
function MiniUrgences() {
  return (
    <img
      src="/images/features/preview-urgences.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none h-full w-full select-none object-cover object-top"
    />
  );
}

// Wrapper Double-Bezel : coque externe + noyau interne (Doppelrand)
function BezelCard({
  className = "",
  innerClassName = "",
  children,
  variants,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  variants?: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      className={`feature-card group relative rounded-[2rem] border border-border/10 bg-foreground/[0.03] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-border/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] ${className}`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] ${innerClassName}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

// CTA Button-in-Button : ArrowUpRight dans son propre cercle imbriqué
function CardCTA() {
  return (
    <div className="flex w-fit items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.04] px-4 py-2 text-xs font-medium text-muted-foreground opacity-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-primary/30 group-hover:bg-primary/[0.08] group-hover:text-primary group-hover:opacity-100">
      Explorer
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-primary/20">
        <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
      </span>
    </div>
  );
}

// Variants Framer Motion : la grille orchestre l'apparition progressive de ses cartes
const bentoVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Variant appliqué à chaque BezelCard : reprend le style flou + translation utilisé jusqu'ici
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow : fondu simple, cohérent avec les autres sections
      gsap.fromTo(
        ".features-eyebrow",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 85%",
          },
        }
      );

      // Titre : flip mot-par-mot (identique à AboutSection) pour une signature cohérente
      gsap.fromTo(
        ".features-title-word",
        { opacity: 0, y: 80, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 85%",
          },
        }
      );

      // Cartes : reveal géré par Framer Motion (voir cardVariants / bentoVariants ci-dessous)

      gsap.to(".accent-float-icon", {
        y: -7,
        duration: 2.4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Motion parallaxe : les mockups téléphone dérivent à des vitesses alternées au scroll
      gsap.utils.toArray<HTMLElement>(".feature-phone").forEach((phone, i) => {
        gsap.to(phone, {
          yPercent: i % 2 === 0 ? -10 : 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="features-header mb-14 md:mb-20"
          style={{ perspective: "800px" }}
        >
          <p className="features-eyebrow mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary md:text-sm">
            Fonctionnalités
          </p>
          <h2 className="max-w-lg font-serif text-3xl font-bold leading-none tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="features-title-word inline-block">Votre</span>{" "}
            <span className="features-title-word inline-block">guide</span>
            <br />
            <span className="features-title-word inline-block text-primary">
              numérique
            </span>
          </h2>
        </div>

        <motion.div
          className="features-bento grid grid-cols-1 gap-4 md:grid-cols-12"
          variants={bentoVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >

          {/* === RANGÉE 1 === */}

          {/* Carte 01 - Programme en Direct : téléphone immersif ancré à droite */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-7 md:h-[360px]"
            innerClassName="bg-[oklch(0.11_0_0)]"
          >
            {/* Orbe ambiant orange - biaisé vers le téléphone à droite */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 72% 24%, rgba(245,110,15,0.12), transparent)",
              }}
            />
            {/* Téléphone ancré à droite, légèrement incliné pour la profondeur */}
            <div className="absolute inset-0 flex items-center justify-end pb-6 pt-6 pr-3 md:pr-6">
              <PhoneMockup className="feature-phone h-[300px] w-[138px] rotate-[3deg] drop-shadow-2xl">
                <MiniProgramme />
              </PhoneMockup>
            </div>
            {/* Scrim gauche → droite pour la lisibilité du texte, sans assombrir le téléphone */}
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.11_0_0)] via-[oklch(0.11_0_0)]/75 to-transparent md:via-[oklch(0.11_0_0)]/55" />
            {/* Voile bas pour le CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0_0)]/80 via-transparent to-transparent" />
            {/* Contenu texte */}
            <div className="relative flex h-full max-w-[75%] flex-col justify-between p-6 md:max-w-[19rem] md:p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                  Programme
                </span>
                <CalendarDays className="h-4 w-4 text-primary/70" strokeWidth={1} />
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold leading-tight text-foreground md:text-3xl">
                  Programme en Direct
                </h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  Filtrez les 3 jours par type et suivez les mises à jour en temps réel.
                </p>
                <CardCTA />
              </div>
            </div>
          </BezelCard>


          {/* Carte 02 - Carte Interactive : téléphone dans le slot image */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-5 md:h-[360px]"
            innerClassName="bg-card flex flex-col"
          >
            <div className="relative flex h-44 shrink-0 items-start justify-center overflow-hidden bg-[#0d0f14] md:h-[55%]">
              {/* Glow orange subtil - cohérent avec la couleur primary du site */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(245,110,15,0.06), transparent 70%)",
                }}
              />
              <PhoneMockup className="feature-phone mt-4 h-[212px] w-[98px]">
                <MiniCarte />
              </PhoneMockup>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" strokeWidth={1} />
                  <span className="rounded-full border border-border/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Navigation
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold leading-tight text-foreground">
                  Carte Interactive
                </h3>
                <p className="text-sm text-muted-foreground">
                  6 sites culturels et services essentiels géolocalisés pour naviguer dans le festival.
                </p>
              </div>
              <CardCTA />
            </div>
          </BezelCard>

          {/* === RANGÉE 2 === */}

          {/* Carte 03 - Réalité Augmentée : accent or, dot-grid halftone */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-5 md:h-[260px]"
            innerClassName="bg-primary/[0.06] flex flex-col items-center justify-center text-center"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle, oklch(0.78 0.15 85 / 0.4) 1px, transparent 1px)`,
                backgroundSize: "22px 22px",
              }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center gap-4 px-6 py-10">
              <Scan className="accent-float-icon h-14 w-14 text-primary" strokeWidth={1} />
              <div>
                <span className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                  Immersion
                </span>
                <h3 className="mt-2 text-xl font-bold leading-tight text-foreground">
                  Réalité Augmentée
                </h3>
                <p className="mt-2 max-w-[22ch] text-sm text-muted-foreground">
                  Visualisez les esprits Vodun via votre caméra sur les sites culturels.
                </p>
              </div>
            </div>
          </BezelCard>

          {/* Carte 04 - Mon Agenda : téléphone dans le slot gauche */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-7 md:h-[260px]"
            innerClassName="bg-card flex flex-col md:flex-row"
          >
            <div className="relative flex h-48 shrink-0 items-start justify-center overflow-hidden bg-[#0d0f14] md:h-full md:w-[42%]">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(245,110,15,0.06), transparent 70%)",
                }}
              />
              <PhoneMockup className="feature-phone mt-5 h-[212px] w-[98px]">
                <MiniAgenda />
              </PhoneMockup>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BookHeart className="h-3.5 w-3.5 text-primary/70" strokeWidth={1} />
                  <span className="rounded-full border border-border/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Planification
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-tight text-foreground md:text-2xl">
                  Mon Agenda
                </h3>
                <p className="text-sm text-muted-foreground">
                  Planifiez vos événements favoris, détectez les conflits horaires et construisez votre programme sur mesure.
                </p>
              </div>
              <CardCTA />
            </div>
          </BezelCard>

          {/* === RANGÉE 3 === */}

          {/* Carte 05 - Notifications Push : téléphone dans le slot image */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-4 md:h-[260px]"
            innerClassName="bg-card flex flex-col"
          >
            <div className="relative flex h-36 shrink-0 items-start justify-center overflow-hidden bg-[#0d0f14] md:h-[50%]">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(245,110,15,0.05), transparent 70%)",
                }}
              />
              <PhoneMockup className="feature-phone mt-3 h-[212px] w-[98px]">
                <MiniNotifications />
              </PhoneMockup>
            </div>
            <div className="flex flex-1 flex-col justify-center p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-primary/70" strokeWidth={1} />
                <span className="rounded-full border border-border/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Alertes
                </span>
              </div>
              <h3 className="text-base font-bold leading-tight text-foreground">
                Notifications Push
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Alertes ciblées sur les événements et changements du festival.
              </p>
            </div>
          </BezelCard>

          {/* Carte 06 - Signalement Urgences : téléphone dans le slot gauche */}
          <BezelCard
            variants={cardVariants}
            className="md:col-span-8 md:h-[260px]"
            innerClassName="bg-card flex flex-col md:flex-row"
          >
            <div className="relative flex h-48 shrink-0 items-start justify-center overflow-hidden bg-[#0d0f14] md:h-full md:w-[38%]">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.08), transparent 70%)",
                }}
              />
              <PhoneMockup className="feature-phone mt-5 h-[212px] w-[98px]">
                <MiniUrgences />
              </PhoneMockup>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-4 p-6 md:p-7">
              <div
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 opacity-[0.04]"
                aria-hidden="true"
              >
                <ShieldAlert className="h-56 w-56 text-foreground" strokeWidth={0.5} />
              </div>
              <div className="relative flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
                  <ShieldAlert className="h-4 w-4 text-destructive" strokeWidth={1} />
                </div>
                <span className="rounded-full border border-destructive/30 bg-destructive/[0.08] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-destructive/80">
                  Sécurité
                </span>
              </div>
              <div className="relative">
                <h3 className="mb-2 text-xl font-bold leading-tight text-foreground md:text-2xl">
                  Signalement Urgences
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Signalez instantanément tout incident - médical, sécurité, incendie - et accédez aux services d'urgence localisés sur site.
                </p>
              </div>
            </div>
          </BezelCard>

        </motion.div>
      </div>
    </section>
  );
}