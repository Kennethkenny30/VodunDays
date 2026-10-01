"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronUp, FileText, MapPin, Scale, ScrollText, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

// Remplacez les "#" par vos vraies pages quand elles existent.
const legalLinks = [
  { label: "Mentions légales", href: "#", icon: FileText    },
  { label: "Confidentialité",  href: "#", icon: ShieldCheck },
  { label: "Conditions",       href: "#", icon: ScrollText  },
];

const legalInfo = [
  { label: "Éditeur du site", value: "Kondo Technologie" },
  { label: "Festival",        value: "Vodun Days · Ouidah, Bénin" },
];

export function LegalAccordion() {
  const [open, setOpen] = useState(false);
  const pointerType = useRef<string>("mouse");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Tactile : un appui en dehors referme le panneau
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => {
        pointerType.current = e.pointerType;
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      {/* Panneau : s'ouvre vers le haut pour ne pas décaler le wordmark.
          Le pb-2 sert de pont invisible entre le déclencheur et le panneau. */}
      <div
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "absolute bottom-full left-1/2 z-20 grid w-64 -translate-x-1/2 pb-2 sm:left-auto sm:right-0 sm:translate-x-0",
          "transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden rounded-xl border border-border/40 bg-card/95 shadow-xl backdrop-blur-md">
          <ul className="p-2">
            {legalLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--vd-gold)]/70" strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <dl className="space-y-2.5 border-t border-border/30 px-5 py-4">
            {legalInfo.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vd-gold)]">
                  {label}
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground/70">
                  {label === "Festival" && (
                    <MapPin className="h-3 w-3 shrink-0 text-[var(--vd-gold)]/60" strokeWidth={1.5} />
                  )}
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Déclencheur : icône + texte */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          const fromKeyboard = e.detail === 0;
          setOpen((o) => (!fromKeyboard && pointerType.current === "mouse" ? true : !o));
        }}
        className="group flex items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-1.5 text-[11px] text-muted-foreground/60 transition-colors hover:border-[var(--vd-gold)]/50 hover:text-foreground focus-visible:border-[var(--vd-gold)]/50 focus-visible:outline-none"
      >
        <Scale className="h-3.5 w-3.5 text-[var(--vd-gold)]/70" strokeWidth={1.5} />
        Informations légales
        <ChevronUp
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300 motion-reduce:transition-none",
            open ? "rotate-0" : "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
