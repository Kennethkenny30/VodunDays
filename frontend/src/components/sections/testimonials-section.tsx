"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

interface Testimonial {
  id: string;
  name: string;
  handle: string;
  body: string;
  href: string;
}

// Avis positifs réels publiés sur X.com pendant/après l'édition 2026, sélectionnés
// parmi un lot fourni par Kenny (source : recherche Grok) puis filtrés pour ne garder
// que les réactions personnelles authentiques (festivaliers, guides, comptes culturels).
// Les comptes purement corporate/institutionnels (marques, ONG, communiqués officiels)
// et les doublons ont été écartés. Chaque carte pointe vers le post original sur X.
// Exception à la règle "aucun emoji" de CLAUDE.md : les emojis dans name/body sont ceux
// des posts réels (fidélité de citation), à conserver tels quels, choix assumé par Kenny.
const testimonials: Testimonial[] = [
  {
    id: "2010077581614428627",
    name: "Tonton Max",
    handle: "@iamTontonMax",
    body: "Magnifique spectacle à l'arène de Ouidah. Proudly Beninese. 🇧🇯❤️",
    href: "https://x.com/iamTontonMax/status/2010077581614428627",
  },
  {
    id: "2010269591167959131",
    name: "Moutiou Adjibi",
    handle: "@moutiou_adjibi",
    body: "J'ai vécu mes premiers Vodun Days et c'était absolument incroyable. J'ai fait le plein d'ondes positives.",
    href: "https://x.com/moutiou_adjibi/status/2010269591167959131",
  },
  {
    id: "2009919364053545297",
    name: "No Limit🇧🇯",
    handle: "@No_Limit229",
    body: "Incroyable performance de Mama Angélique Kidjo aux Vodun Days ✨🔥",
    href: "https://x.com/No_Limit229/status/2009919364053545297",
  },
  {
    id: "2010407464563327118",
    name: "No Limit🇧🇯",
    handle: "@No_Limit229",
    body: "Des centaines de milliers de personnes venues des 4 coins du monde pour voir la beauté de la culture béninoise 🇧🇯",
    href: "https://x.com/No_Limit229/status/2010407464563327118",
  },
  {
    id: "2009561791442084027",
    name: "Judicaelle Irakoze",
    handle: "@Judicaelle_",
    body: "Thousands and thousands of people in Ouidah celebrating Vodoun. This is the Africa we want.",
    href: "https://x.com/Judicaelle_/status/2009561791442084027",
  },
  {
    id: "2010051090088431856",
    name: "Karabo Morule",
    handle: "@KaraboMorule",
    body: "Seeing this live was amazing! Madame Kidjo is a proper rockstar!!",
    href: "https://x.com/KaraboMorule/status/2010051090088431856",
  },
  {
    id: "2009927492270731412",
    name: "🇨🇮Autorité🇧🇯",
    handle: "@sedo229",
    body: "Très belle prestation de la légende Ricos Campos. Ouidah était en feu 🔥",
    href: "https://x.com/sedo229/status/2009927492270731412",
  },
  {
    id: "2009414648286658594",
    name: "Benin Roots",
    handle: "@BeninRoots",
    body: "Prestation magnifique de notre Maman Angélique Kidjo sur les Vodun Days.",
    href: "https://x.com/BeninRoots/status/2009414648286658594",
  },
  {
    id: "2009528033221177669",
    name: "Guide Kophi Tours",
    handle: "@guidekofi",
    body: "First time performing in Benin, Freddy Meiway did amazing.",
    href: "https://x.com/guidekofi/status/2009528033221177669",
  },
  {
    id: "2010721191087260027",
    name: "Impact Bénin",
    handle: "@impactbenin229",
    body: "Vodoun Days : Couvent Mami Dan, l'apothéose. ✨",
    href: "https://x.com/impactbenin229/status/2010721191087260027",
  },
  {
    id: "2011540825415578023",
    name: "Fardoll",
    handle: "@Fardoll_MEDALI",
    body: "#VodunDays2026 c'était ouf 🔥",
    href: "https://x.com/Fardoll_MEDALI/status/2011540825415578023",
  },
  {
    id: "2012278324798624100",
    name: "CYBAFRIK™",
    handle: "@cybafrik_io",
    body: "Ancestry. Spirit. Living culture. Vodun Days, Benin 🇧🇯🔥",
    href: "https://x.com/cybafrik_io/status/2012278324798624100",
  },
  {
    id: "2009466004397580730",
    name: "Bénin Bouge",
    handle: "@BeninBouge",
    body: "Ciara sur la scène des Vodun Days 2026 à Ouidah. Une présence marquante, entre émotion et puissance scénique.",
    href: "https://x.com/BeninBouge/status/2009466004397580730",
  },
  {
    id: "2010252296370762056",
    name: "Actualités229🇧🇯",
    handle: "@actualites229",
    body: "Invité d'honneur cette année, le Ballet folklorique de Bahia, venu se reconnecter avec ses racines africaines.",
    href: "https://x.com/actualites229/status/2010252296370762056",
  },
  {
    id: "2016616123542716821",
    name: "anold🇧🇯",
    handle: "@anold229",
    body: "400 000 visiteurs en 2025, 740 000 pour l'édition 2026. Un niveau incroyable, et ce n'est pas fini 🔥🇧🇯",
    href: "https://x.com/anold229/status/2016616123542716821",
  },
  {
    id: "2010360616137924992",
    name: "Wikimédia Bénin",
    handle: "@WikimediaBj",
    body: "Retour en images de notre participation aux Vodun Days 2026, le plus grand événement culturel du Bénin.",
    href: "https://x.com/WikimediaBj/status/2010360616137924992",
  },
  {
    id: "2009682130901536862",
    name: "Bénin Bouge",
    handle: "@BeninBouge",
    body: "Le Vodoun est aujourd'hui une source de fierté qui ouvre le Bénin au monde. Le Vodun fait bouger le Bénin 🇧🇯",
    href: "https://x.com/BeninBouge/status/2009682130901536862",
  },
];

const firstRow = testimonials.slice(0, 5);
const secondRow = testimonials.slice(5, 10);
const thirdRow = testimonials.slice(10, 14);
const fourthRow = testimonials.slice(14, 17);

function TestimonialCard({ name, handle, body, href }: Testimonial) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <figure
        className={cn(
          "relative h-full w-56 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4 md:w-64",
          "border-border/60 bg-card/60 backdrop-blur-sm transition-colors hover:bg-card/90"
        )}
      >
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground">
              {name}
            </figcaption>
            <p className="text-xs text-muted-foreground">{handle}</p>
          </div>
          <Twitter className="h-4 w-4 shrink-0 text-muted-foreground/50" strokeWidth={1.5} />
        </div>
        <blockquote className="mt-2 text-sm leading-relaxed text-foreground/80">
          {body}
        </blockquote>
      </figure>
    </Link>
  );
}

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto mb-10 max-w-7xl md:mb-14">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary md:text-sm">
          {t("eyebrow")}
        </p>
        <h2 className="text-2xl font-serif font-bold leading-none tracking-tight text-foreground md:text-3xl lg:text-4xl text-balance">
          {t("title")}
        </h2>
      </div>

      <div className="relative flex h-[360px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px] md:h-96">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-40px) translateY(0px) translateZ(-80px) rotateX(15deg) rotateY(-10deg) rotateZ(15deg)",
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:26s]">
            {firstRow.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:26s]">
            {secondRow.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="hidden [--duration:26s] md:flex">
            {thirdRow.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="hidden [--duration:26s] md:flex">
            {fourthRow.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </Marquee>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-background" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background" />
      </div>
    </section>
  );
}