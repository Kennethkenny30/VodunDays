"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Donnees de la galerie
const galleryItems = [
  {
    title: "Danses Rituelles",
    description:
      "Expressions corporelles en communion avec les divinit\u00e9s Vodun, port\u00e9es par le rythme des percussions ancestrales.",
    image: "/images/vodundays-2.jpg",
  },
  {
    title: "For\u00eat Sacr\u00e9e de Kpass\u00e8",
    description:
      "Site spirituel majeur accueillant les animations des divinit\u00e9s Hunv\u025b, K\u0254ku, Kabada et Atchinan dans un cadre naturel pr\u00e9serv\u00e9.",
    image: "/images/vodundays-17.jpg",
  },
  {
    title: "Animation Zangbeto",
    description:
      "Les gardiens mystiques de la nuit dans leurs performances spectaculaires, incarnant la justice et la protection.",
    image: "/images/vodundays-8.jpg",
  },
  {
    title: "Animation Egungun",
    description:
      "Les masques sacr\u00e9s des anc\u00eatres revenant parmi les vivants dans une danse ancestrale charg\u00e9e de spiritualit\u00e9.",
    image: "/images/vodundays-0019.jpg",
  },
  {
    title: "Consultation Tof\u00e2",
    description:
      "Consultation nationale du F\u00e2 tra\u00e7ant les grandes tendances de l\u2019ann\u00e9e. Un moment tr\u00e8s attendu par tout le peuple b\u00e9ninois.",
    image: "/images/vodundays-14.jpg",
  },
  {
    title: "Concert G\u00e9ant",
    description:
      "Une soir\u00e9e musicale grandiose c\u00e9l\u00e9brant la culture b\u00e9ninoise avec les plus grands artistes de la sc\u00e8ne africaine.",
    image: "/images/vodundays-16.jpg",
  },
];

// Hauteur de scroll allouee a la section (controle la vitesse du defilement horizontal)
const SCROLL_HEIGHT = "250vh";

export function GallerySection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<{ start: number; end: number } | null>(null);

  // Navigation carte par carte via les fleches
  const scrollParCarte = useCallback((direction: "left" | "right") => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const pas = (st.end - st.start) / galleryItems.length;
    const cible =
      direction === "right"
        ? Math.min(window.scrollY + pas, st.end)
        : Math.max(window.scrollY - pas, st.start);
    window.scrollTo({ top: cible, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    async function init() {
      const [gsapModule, stModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      const gsap = gsapModule.default;
      const ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const track = trackRef.current;
      const outer = outerRef.current;
      if (!track || !outer) return;

      // Fonction dynamique : recalculee a chaque refresh (resize inclus)
      const getScrollDist = () => track.scrollWidth - window.innerWidth + 40;
      if (getScrollDist() <= 0) return;

      ctx = gsap.context(() => {
        // Animation d'entree du titre
        gsap.fromTo(
          ".gallery-title",
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: ".gallery-title", start: "top 100%" },
          }
        );

        // Tween avec valeur fonctionnelle : x recalcule a chaque ScrollTrigger.refresh()
        const tween = gsap.to(track, { x: () => -getScrollDist(), ease: "none" });

        // Scroll horizontal pilote par scrub - pas de pin GSAP, pas de pin-spacer
        // Le layout est gere entierement par CSS (outer height + sticky)
        const st = ScrollTrigger.create({
          trigger: outer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          refreshPriority: -1,
          invalidateOnRefresh: true,
          animation: tween,
          onRefresh: (self) => {
            scrollTriggerRef.current = { start: self.start, end: self.end };
          },
        });

        scrollTriggerRef.current = { start: st.start, end: st.end };

        // Animation d'entree progressive des cartes
        const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: outer, start: "top 90%" },
            }
          );
        });
      });
    }

    init();
    return () => {
      ctx?.revert();
      if (trackRef.current) {
        trackRef.current.style.transform = "";
      }
      scrollTriggerRef.current = null;
    };
  }, []);

  return (
    // Outer : hauteur explicite dans le DOM React - cree l'espace de scroll
    // GSAP ne touche plus au layout, donc plus de pin-spacer et plus de gaps
    <div ref={outerRef} style={{ height: SCROLL_HEIGHT }}>
      {/* Sticky CSS : reste visible pendant tout le scroll de l'outer */}
      <div className="sticky top-0 overflow-hidden" style={{ height: "100vh" }}>
        {/* En-tete de la section */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 pb-4 pt-4 md:pt-24 md:pb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="gallery-title">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary md:text-sm">
                {"D\u00e9couvrez"}
              </p>
              <h2 className="text-2xl font-serif font-bold leading-none tracking-tight text-foreground md:text-3xl lg:text-4xl text-balance">
                Les Temps Forts
              </h2>
            </div>
            <div className="flex items-end gap-4">
              <p className="max-w-md text-sm text-muted-foreground md:text-base md:text-right leading-relaxed">
                {"Une immersion sensorielle au c\u0153ur des traditions s\u00e9culaires du B\u00e9nin."}
              </p>
              {/* Boutons navigation gauche / droite */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollParCarte("left")}
                  aria-label="Carte pr\u00e9c\u00e9dente"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-transparent text-foreground backdrop-blur-sm transition-all hover:bg-foreground hover:text-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollParCarte("right")}
                  aria-label="Carte suivante"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-transparent text-foreground backdrop-blur-sm transition-all hover:bg-foreground hover:text-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Piste horizontale */}
        <div className="overflow-hidden flex items-center" style={{ height: "calc(100vh - 160px)" }}>
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 px-[calc((100vw-80vw)/2)] md:px-0 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
            style={{ willChange: "transform" }}
          >
            {galleryItems.map((item, index) => (
              <CarteDeLaGalerie key={item.title} item={item} index={index} />
            ))}
            <div className="shrink-0 w-4 md:w-8" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Carte individuelle de la galerie (tailles responsive : telephone 75vw, tablette 55vw, desktop fixe)
function CarteDeLaGalerie({
  item,
  index,
}: {
  item: (typeof galleryItems)[number];
  index: number;
}) {
  return (
    <div className="gallery-card group relative shrink-0 w-[75vw] sm:w-[55vw] md:w-[28vw] lg:w-[22vw] xl:w-[20vw]">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          width={600}
          height={800}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 75vw, (max-width: 768px) 55vw, (max-width: 1024px) 28vw, 22vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute top-3 left-3 md:top-4 md:left-4 font-serif text-4xl md:text-5xl font-bold text-white/5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
          <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 md:px-3.5 md:py-1.5 backdrop-blur-md shadow-lg">
            <h3 className="mb-0.5 text-sm font-serif font-bold text-white md:text-base lg:text-lg leading-tight">
              {item.title}
            </h3>
            <p className="text-[11px] text-white/70 md:text-xs leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}