"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  Bell, BellOff, Globe, Info, Shield, HelpCircle,
  ChevronRight, Smartphone, Mail, Check, X,
  ChevronDown, Copy, CheckCheck, Facebook,
  Instagram, Twitter, Youtube, MapPin, ExternalLink,
  Fingerprint, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Language  = { code: string; label: string; flag: string };
type ModalKey  = "notif" | "version" | "about" | "help" | "privacy" | "contact" | null;

// ─── Data ─────────────────────────────────────────────────────────────────────

const LANGUAGES: Language[] = [
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
];

const FAQ = [
  { q: "Quelles sont les dates des Vodun Days ?",          a: "Les Vodun Days ont lieu les 8, 9 et 10 janvier 2026 à Ouidah, près de la Porte du non-retour." },
  { q: "Comment se rendre à Ouidah depuis Cotonou ?",      a: "Ouidah est à environ 40 km de Cotonou, soit ~1h en voiture. Vous pouvez utiliser votre véhicule ou un service de VTC." },
  { q: "Faut-il un visa pour venir au Bénin ?",            a: "Le Bénin propose un e-Visa en quelques heures sur evisa.bj. Tarifs : 50€ (30j simple), 75€ (30j multiple), 100€ (90j multiple)." },
  { q: "Quel aéroport utiliser ?",                         a: "L'aéroport Bernardin Gantin de Cotonou, situé à ~40 km d'Ouidah, est recommandé pour les participants internationaux." },
  { q: "Y a-t-il un camping sur place ?",                  a: "Oui ! L'espace camping est proche de l'Arène, de la scène et de la plage. 7 000 FCFA/nuit avec votre tente, 20 000 FCFA/nuit avec tente louée sur place." },
];

const PRIVACY_SECTIONS = [
  {
    title: "Aucune donnée personnelle retenue",
    highlight: true,
    content:
      "Cette application ne collecte, ne stocke et ne transmet aucune donnée personnelle. Votre identité reste entièrement anonyme.",
  },
  {
    title: "Identification par UUID de session",
    highlight: true,
    content:
      "L'app utilise un identifiant UUID généré aléatoirement à chaque session. Cet identifiant est temporaire, non-nominatif et supprimé automatiquement à la fermeture de l'application. Il ne permet pas de vous identifier.",
  },
  {
    title: "Données collectées sur le site web",
    highlight: false,
    content:
      "La politique ci-dessous concerne le site vodundays.bj. Bénin Tourisme peut y collecter nom, prénom et coordonnées (email, téléphone) uniquement si vous remplissez un formulaire.",
  },
  {
    title: "Finalité du traitement (site web)",
    highlight: false,
    content:
      "Les données du site sont utilisées pour le marketing, les promotions et la gestion des plaintes, dans le respect du Code du numérique de la République du Bénin.",
  },
  {
    title: "Vos droits",
    highlight: false,
    content:
      "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition. Contactez contact@vodundays.bj pour exercer vos droits.",
  },
  {
    title: "Contact DPO",
    highlight: false,
    content:
      "Email : contact@vodundays.bj\nAdresse : Immeuble SAINTE CECILE, Rue Sylvère Alexandre R.7.15, Quartier Gbèdomidji, Cotonou, Bénin.",
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0",
        enabled ? "bg-[#F56E0F]" : "bg-white/10"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 35 }}
        className={cn(
          "absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow",
          enabled ? "left-[22px]" : "left-[3px]"
        )}
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon, label, children, onClick,
}: {
  icon: React.ElementType; label: string; children?: React.ReactNode; onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3",
        onClick && "hover:bg-white/[0.04] active:bg-white/[0.06]",
        "transition-colors rounded-xl group"
      )}
    >
      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/[0.09] transition-colors">
        <Icon className="w-4 h-4 text-[#878787]" />
      </div>
      <p className="flex-1 text-left text-[14px] font-medium text-white">{label}</p>
      <div className="flex items-center gap-2">{children}</div>
    </Tag>
  );
}

/** Bottom sheet — z-[70] so it always sits above BottomNav (z-50) */
function Sheet({
  open, onClose, title, children,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — z-[60] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          {/* Sheet panel — z-[70] */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 36 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70]",
              "bg-[#1B1B1E] rounded-t-[28px]",
              "border-t border-white/[0.06]",
              "px-5 pb-10 pt-5 max-h-[88vh] overflow-y-auto"
            )}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-white">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                <X className="w-4 h-4 text-[#878787]" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Language picker ──────────────────────────────────────────────────────────
// Rendered via a portal-like fixed overlay to escape overflow:hidden on the card

function LanguagePicker({ selected, onChange }: { selected: Language; onChange: (l: Language) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  // Recompute position every time the dropdown opens
  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] transition-colors text-[13px] text-[#878787]"
      >
        <span>{selected.flag}</span>
        <span>{selected.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      {/* Fixed overlay — z-[80] so it clears both the card AND the sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-[80] w-44 rounded-2xl overflow-hidden bg-[#222226] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[13px] transition-colors",
                  lang.code === selected.code
                    ? "text-white bg-white/[0.06]"
                    : "text-[#878787] hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {lang.code === selected.code && <Check className="w-3.5 h-3.5 text-[#F56E0F]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function NotifModal({ open, onClose, on, setOn }: { open: boolean; onClose: () => void; on: boolean; setOn: (v: boolean) => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      <div className={cn("flex items-center justify-between p-4 rounded-2xl mb-4", "bg-white/[0.04] border border-white/[0.06]")}>
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", on ? "bg-[#F56E0F]/20" : "bg-white/[0.06]")}>
            {on ? <Bell className="w-5 h-5 text-[#F56E0F]" /> : <BellOff className="w-5 h-5 text-[#878787]" />}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white">{on ? "Activées" : "Désactivées"}</p>
            <p className="text-[12px] text-[#878787]">{on ? "Vous recevez les alertes" : "Aucune alerte envoyée"}</p>
          </div>
        </div>
        <Toggle enabled={on} onChange={setOn} />
      </div>
      {["Nouveaux événements", "Rappels avant les dates", "Mises à jour de l'app"].map((label) => (
        <div key={label} className={cn("flex items-center justify-between px-4 py-3.5 rounded-xl mb-2 bg-white/[0.03] border border-white/[0.04]", !on && "opacity-30 pointer-events-none")}>
          <p className="text-[13px] text-white">{label}</p>
          <Toggle enabled={on} onChange={() => {}} />
        </div>
      ))}
    </Sheet>
  );
}

function VersionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText("1.0.0"); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <Sheet open={open} onClose={onClose} title="Version">
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5 mb-4 text-center">
        <p className="text-[42px] font-black text-white tracking-tight">1.0.0</p>
        <p className="text-[12px] text-[#878787] mt-1">Vodun Days – Version actuelle</p>
        <button onClick={copy} className={cn("mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[13px] transition-colors", copied ? "bg-green-500/20 text-green-400" : "bg-white/[0.06] text-[#878787] hover:bg-white/[0.10]")}>
          {copied ? <><CheckCheck className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le numéro</>}
        </button>
      </div>
      {[{ label: "Date de sortie", value: "Janvier 2026" }, { label: "Plateforme", value: "iOS & Android" }, { label: "Développeur", value: "Équipe Vodun Days" }].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between px-1 py-2.5 border-b border-white/[0.05]">
          <span className="text-[13px] text-[#878787]">{label}</span>
          <span className="text-[13px] text-white">{value}</span>
        </div>
      ))}
    </Sheet>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="À propos">
      <div className="bg-[#F56E0F]/10 border border-[#F56E0F]/20 rounded-2xl p-5 mb-5">
        <p className="text-[13px] text-[#F56E0F]/90 leading-relaxed">Premier rendez-vous international autour des arts, de la culture et de la spiritualité Vodun.</p>
      </div>
      <p className="text-[14px] text-white/80 leading-relaxed mb-5">
        Du 8 au 10 janvier 2026, Ouidah devient la capitale internationale de la célébration du Vodun. Danses Hounvè, sorties des Zangbétos et Egungun, processions en l'honneur des divinités, concerts en plein air sur le bord de mer…
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[{ label: "Édition", value: "2026" }, { label: "Lieu", value: "Ouidah, Bénin" }, { label: "Durée", value: "3 jours" }, { label: "Entrée", value: "Billetterie en ligne" }].map(({ label, value }) => (
          <div key={label} className="bg-white/[0.04] rounded-xl p-3">
            <p className="text-[11px] text-[#878787] mb-1">{label}</p>
            <p className="text-[13px] font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[#F56E0F]" />
        <span className="text-[13px] text-[#878787]">Porte du non-retour, Plage de Ouidah</span>
      </div>
      <a href="https://vodundays.bj" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F56E0F]/15 border border-[#F56E0F]/25 text-[#F56E0F] text-[14px] font-semibold">
        <ExternalLink className="w-4 h-4" /> Visiter vodundays.bj
      </a>
    </Sheet>
  );
}

function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <Sheet open={open} onClose={onClose} title="Aide & Support">
      <p className="text-[13px] text-[#878787] mb-5">Questions fréquentes sur les Vodun Days 2026.</p>
      <div className="space-y-2 mb-6">
        {FAQ.map((item, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.05]">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
              <span className="text-[13px] font-medium text-white pr-3">{item.q}</span>
              <motion.span animate={{ rotate: expanded === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                <ChevronDown className="w-4 h-4 text-[#878787]" />
              </motion.span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <p className="px-4 pb-4 text-[12px] text-[#878787] leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <a href="https://vodundays.bj/infos-pratiques/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] text-[#878787] text-[13px] hover:bg-white/[0.10] transition-colors">
        <ExternalLink className="w-4 h-4" /> Plus d'infos sur vodundays.bj
      </a>
    </Sheet>
  );
}

function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Generate a fake UUID for display purposes
  const fakeUuid = useRef(`${Math.random().toString(36).slice(2,10)}-${Math.random().toString(36).slice(2,6)}-${Math.random().toString(36).slice(2,6)}-${Math.random().toString(36).slice(2,14)}`);

  return (
    <Sheet open={open} onClose={onClose} title="Confidentialité">

      {/* UUID session banner */}
      <div className="bg-[#1a2a1a] border border-green-500/25 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-4 h-4 text-green-400" />
          <p className="text-[12px] font-semibold text-green-400">Session anonyme active</p>
        </div>
        <p className="text-[11px] text-green-300/70 leading-relaxed mb-3">
          Votre session est identifiée par un UUID temporaire, généré aléatoirement. Il est supprimé à la fermeture de l'app et ne permet pas de vous identifier.
        </p>
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
          <RefreshCw className="w-3 h-3 text-green-400/60 shrink-0" />
          <span className="text-[10px] font-mono text-green-400/60 truncate">{fakeUuid.current}</span>
        </div>
      </div>

      <p className="text-[12px] text-[#878787] mb-4 leading-relaxed">
        Politique de confidentialité de Bénin Tourisme, organisateur des Vodun Days. Fondée sur l'article 415 du Code du numérique de la République du Bénin.
      </p>

      <div className="space-y-3 mb-6">
        {PRIVACY_SECTIONS.map((s) => (
          <div
            key={s.title}
            className={cn(
              "border rounded-xl p-4",
              s.highlight
                ? "bg-green-500/[0.05] border-green-500/20"
                : "bg-white/[0.04] border-white/[0.05]"
            )}
          >
            <p className={cn("text-[12px] font-semibold mb-1.5", s.highlight ? "text-green-400" : "text-[#F56E0F]")}>
              {s.title}
            </p>
            <p className="text-[12px] text-[#878787] leading-relaxed whitespace-pre-line">{s.content}</p>
          </div>
        ))}
      </div>

      <a href="https://vodundays.bj/politique-de-confidentialite/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] text-[#878787] text-[13px] hover:bg-white/[0.10] transition-colors">
        <ExternalLink className="w-4 h-4" /> Politique complète sur le site
      </a>
    </Sheet>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const socials = [
    { icon: Facebook,  label: "Facebook",  handle: "@vodundays", url: "https://www.facebook.com/vodundays" },
    { icon: Instagram, label: "Instagram", handle: "@vodundays", url: "https://www.instagram.com/vodundays/" },
    { icon: Twitter,   label: "X / Twitter",handle: "@vodundays", url: "https://x.com/vodundays" },
    { icon: Youtube,   label: "YouTube",   handle: "Vodun Days", url: "https://www.youtube.com/playlist?list=PL6nGRnf5v3jg5ByAAlBgMpCKWi743C2HC" },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Contact">
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F56E0F]/15 flex items-center justify-center">
          <Mail className="w-5 h-5 text-[#F56E0F]" />
        </div>
        <div>
          <p className="text-[11px] text-[#878787] mb-0.5">Email officiel</p>
          <p className="text-[14px] font-semibold text-white">contact@vodundays.bj</p>
        </div>
      </div>
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 mb-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mt-0.5">
          <MapPin className="w-5 h-5 text-[#878787]" />
        </div>
        <div>
          <p className="text-[11px] text-[#878787] mb-0.5">Adresse</p>
          <p className="text-[13px] text-white leading-relaxed">Immeuble SAINTE CECILE,{"\n"}Rue Sylvère Alexandre R.7.15,{"\n"}Quartier Gbèdomidji, Cotonou, Bénin</p>
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-widest text-[#878787] mb-3 px-1">Réseaux sociaux</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {socials.map(({ icon: Icon, label, handle, url }) => (
          <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.04] hover:bg-white/[0.08] transition-colors">
            <Icon className="w-4 h-4 text-[#878787]" />
            <div>
              <p className="text-[11px] font-semibold text-white">{label}</p>
              <p className="text-[10px] text-[#878787]">{handle}</p>
            </div>
          </a>
        ))}
      </div>
      <a href="https://vodundays.bj/contact/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F56E0F]/15 border border-[#F56E0F]/25 text-[#F56E0F] text-[14px] font-semibold">
        <ExternalLink className="w-4 h-4" /> Formulaire de contact
      </a>
    </Sheet>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParametresPage() {
  const [notifOn, setNotifOn] = useState(true);
  const [lang,    setLang]    = useState<Language>(LANGUAGES[0]);
  const [modal,   setModal]   = useState<ModalKey>(null);
  const close = () => setModal(null);

  return (
    <div className="min-h-screen bg-[#151419]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)" }} />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <Image src="/images/logo.png" alt="Vodun Days Logo" fill className="object-contain" priority />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#878787] mb-1">Application</p>
            <h1 className="text-[22px] font-black text-white tracking-[-0.02em]">Paramètres</h1>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <main className="px-4 pb-28 space-y-5">

        {/* Préférences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-[#878787] mb-2 px-1">Préférences</h2>
          {/* overflow-visible so the language dropdown can escape */}
          <div className="rounded-[16px] overflow-visible bg-[#1B1B1E] border border-white/[0.06]">
            <SettingsRow icon={notifOn ? Bell : BellOff} label="Notifications" onClick={() => setModal("notif")}>
              <span className={cn("text-[12px] font-medium px-2 py-0.5 rounded-full", notifOn ? "bg-[#F56E0F]/15 text-[#F56E0F]" : "bg-white/[0.06] text-[#878787]")}>
                {notifOn ? "Activées" : "Désactivées"}
              </span>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-white/[0.05]" />
            <SettingsRow icon={Globe} label="Langue">
              <LanguagePicker selected={lang} onChange={setLang} />
            </SettingsRow>
          </div>
        </motion.div>

        {/* Application */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-[#878787] mb-2 px-1">Application</h2>
          <div className="rounded-[16px] overflow-hidden bg-[#1B1B1E] border border-white/[0.06]">
            <SettingsRow icon={Smartphone} label="Version" onClick={() => setModal("version")}>
              <span className="text-[13px] text-[#878787]">1.0.0</span>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-white/[0.05]" />
            <SettingsRow icon={Info} label="À propos" onClick={() => setModal("about")}>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-white/[0.05]" />
            <SettingsRow icon={HelpCircle} label="Aide & Support" onClick={() => setModal("help")}>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
          </div>
        </motion.div>

        {/* Légal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-[#878787] mb-2 px-1">Légal</h2>
          <div className="rounded-[16px] overflow-hidden bg-[#1B1B1E] border border-white/[0.06]">
            <SettingsRow icon={Shield} label="Confidentialité" onClick={() => setModal("privacy")}>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-white/[0.05]" />
            <SettingsRow icon={Mail} label="Contact" onClick={() => setModal("contact")}>
              <ChevronRight className="w-4 h-4 text-[#878787]/50" />
            </SettingsRow>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35 }} className="text-center pt-2">
          <p className="text-[12px] text-[#878787]">Vodun Days 2026</p>
          <p className="text-[11px] text-[#878787]/50 mt-1">Ouidah, Bénin</p>
        </motion.div>
      </main>

      {/* Modals */}
      <NotifModal   open={modal === "notif"}   onClose={close} on={notifOn} setOn={setNotifOn} />
      <VersionModal open={modal === "version"} onClose={close} />
      <AboutModal   open={modal === "about"}   onClose={close} />
      <HelpModal    open={modal === "help"}    onClose={close} />
      <PrivacyModal open={modal === "privacy"} onClose={close} />
      <ContactModal open={modal === "contact"} onClose={close} />

      <BottomNav />
    </div>
  );
}