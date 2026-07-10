import Image from "next/image";
import Link from "next/link";
import { Calendar, Facebook, Instagram, MapPin, Twitter, Users } from "lucide-react";

const navLinks = [
  { label: "Programme",  href: "/programme"  },
  { label: "Carte",      href: "/carte"       },
  { label: "Pédagogie",  href: "/pedagogie"   },
  { label: "Urgences",   href: "/urgences"    },
  { label: "Avis",       href: "/avis"        },
];

const legalLinks = [
  { label: "Mentions légales",  href: "#" },
  { label: "Confidentialité",   href: "#" },
  { label: "Conditions",        href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook",  href: "#", icon: Facebook  },
  { label: "Twitter",   href: "#", icon: Twitter   },
];

const festivalInfo = [
  { icon: Calendar, text: "8-10 Janvier 2027"        },
  { icon: MapPin,   text: "Ouidah, Bénin"             },
  { icon: Users,    text: "+800 000 festivaliers"      },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/60 backdrop-blur-sm">

      {/* Séparateur décoratif top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--vd-gold)]/40 to-transparent" />

      {/* Corps principal */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Colonne marque */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Vodun Days"
                width={48}
                height={48}
                className="object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-[18px] font-extrabold tracking-tight text-foreground">
                  VODUN<span className="text-[var(--vd-gold)]">DAYS</span>
                </span>
                <span className="text-[10px] tracking-[0.18em] text-muted-foreground/50 uppercase mt-0.5">
                  Festival Culturel
                </span>
              </div>
            </Link>

            {/* Badge officiel 
            <span className="mb-5 inline-flex items-center rounded-full border border-[var(--vd-gold)]/30 bg-[var(--vd-gold)]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--vd-gold)]">
              Officiel
            </span>*/}

            <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-muted-foreground/60">
              Plateforme numérique officielle des Vodun Days. Célébrez la tradition ancestrale du Bénin.
            </p>
          </div>

          {/* Colonne navigation */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vd-gold)]">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted-foreground/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne infos festival */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vd-gold)]">
              Le Festival
            </h4>
            <ul className="space-y-3.5">
              {festivalInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--vd-gold)]/60" strokeWidth={1.5} />
                  <span className="text-[13px] text-muted-foreground/70">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne réseaux sociaux */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vd-gold)]">
              Suivez-nous
            </h4>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground/50 transition-all hover:border-[var(--vd-gold)]/50 hover:text-[var(--vd-gold)]"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de bas de page */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 sm:flex-row">
          <p className="text-[11px] text-muted-foreground/40">
            &copy; 2027 Vodun Days. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center gap-4">
                {i > 0 && <span className="text-foreground/15">·</span>}
                <Link
                  href={link.href}
                  className="text-[11px] text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
