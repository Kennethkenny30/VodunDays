'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { BottomNav } from '@/components/layout/BottomNav';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Bell, BellOff, Globe, Info, Shield, HelpCircle,
  ChevronRight, Smartphone, Mail, Check, X,
  ChevronDown, Copy, CheckCheck, Facebook,
  Instagram, Twitter, Youtube, MapPin, ExternalLink,
  Fingerprint, RefreshCw, Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { setLocale } from '@/i18n/actions';
import type { Locale } from '@/i18n/locale';

type ModalKey = 'notif' | 'version' | 'about' | 'help' | 'privacy' | 'contact' | null;
type FaqItem = { q: string; a: string };
type PrivacySection = { title: string; highlight: boolean; content: string };

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const;

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0',
        enabled ? 'bg-[#F56E0F]' : 'bg-foreground/10'
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
        className={cn(
          'absolute top-0.75 w-4.5 h-4.5 rounded-full bg-white shadow',
          enabled ? 'left-5.5' : 'left-0.75'
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
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3',
        onClick && 'hover:bg-foreground/4 active:bg-foreground/6',
        'transition-colors rounded-xl group'
      )}
    >
      <div className="w-9 h-9 rounded-full bg-foreground/6 flex items-center justify-center shrink-0 group-hover:bg-foreground/9 transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="flex-1 text-left text-[14px] font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-2">{children}</div>
    </Tag>
  );
}

function Sheet({
  open, onClose, title, children,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 36 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-70',
              'bg-vd-card-surface rounded-t-[28px]',
              'border-t border-vd-border-soft',
              'px-5 pb-10 pt-5 max-h-[88vh] overflow-y-auto'
            )}
          >
            <div className="w-10 h-1 rounded-full bg-foreground/20 mx-auto mb-6" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-foreground">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-foreground/6 flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LanguagePicker() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  const selected = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const handleChange = (lang: (typeof LANGUAGES)[number]) => {
    setOpen(false);
    startTransition(async () => {
      await setLocale(lang.code as Locale);
      router.refresh();
    });
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/6 hover:bg-foreground/10 transition-colors text-[13px] text-muted-foreground disabled:opacity-50"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{selected.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'fixed', top: pos.top, right: pos.right }}
            className="z-80 w-36 rounded-2xl overflow-hidden bg-vd-card-surface border border-vd-border-soft shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChange(lang)}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[13px] transition-colors',
                  lang.code === locale
                    ? 'text-foreground bg-foreground/6'
                    : 'text-muted-foreground hover:bg-foreground/4 hover:text-foreground'
                )}
              >
                <span>{lang.label}</span>
                {lang.code === locale && <Check className="w-3.5 h-3.5 text-[#F56E0F]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NotifModal({ open, onClose, on, setOn }: { open: boolean; onClose: () => void; on: boolean; setOn: (v: boolean) => void }) {
  const t = useTranslations('params');
  return (
    <Sheet open={open} onClose={onClose} title={t('rows.notifications')}>
      <div className={cn('flex items-center justify-between p-4 rounded-2xl mb-4', 'bg-foreground/4 border border-vd-border-soft')}>
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', on ? 'bg-[#F56E0F]/20' : 'bg-foreground/6')}>
            {on ? <Bell className="w-5 h-5 text-[#F56E0F]" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{on ? t('notifications.enabled') : t('notifications.disabled')}</p>
            <p className="text-[12px] text-muted-foreground">{on ? t('notifications.enabledSub') : t('notifications.disabledSub')}</p>
          </div>
        </div>
        <Toggle enabled={on} onChange={setOn} />
      </div>
      {[t('notifications.newEvents'), t('notifications.reminders'), t('notifications.updates')].map((label) => (
        <div key={label} className={cn('flex items-center justify-between px-4 py-3.5 rounded-xl mb-2 bg-foreground/3 border border-vd-border-soft', !on && 'opacity-30 pointer-events-none')}>
          <p className="text-[13px] text-foreground">{label}</p>
          <Toggle enabled={on} onChange={() => {}} />
        </div>
      ))}
    </Sheet>
  );
}

function VersionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('params');
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText('1.0.0');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Sheet open={open} onClose={onClose} title={t('version.title')}>
      <div className="bg-foreground/4 border border-vd-border-soft rounded-2xl p-5 mb-4 text-center">
        <p className="text-[42px] font-black text-foreground tracking-tight">1.0.0</p>
        <p className="text-[12px] text-muted-foreground mt-1">{t('version.current')}</p>
        <button onClick={copy} className={cn('mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-[13px] transition-colors', copied ? 'bg-green-500/20 text-green-400' : 'bg-foreground/6 text-muted-foreground hover:bg-foreground/10')}>
          {copied
            ? <><CheckCheck className="w-4 h-4" /> {t('version.copied')}</>
            : <><Copy className="w-4 h-4" /> {t('version.copy')}</>}
        </button>
      </div>
      {[
        { label: t('version.releaseDate'), value: t('version.releaseDateValue') },
        { label: t('version.platform'), value: t('version.platformValue') },
        { label: t('version.developer'), value: t('version.developerValue') },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between px-1 py-2.5 border-b border-vd-border-soft">
          <span className="text-[13px] text-muted-foreground">{label}</span>
          <span className="text-[13px] text-foreground">{value}</span>
        </div>
      ))}
    </Sheet>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('params');
  return (
    <Sheet open={open} onClose={onClose} title={t('about.title')}>
      <div className="bg-[#F56E0F]/10 border border-[#F56E0F]/20 rounded-2xl p-5 mb-5">
        <p className="text-[13px] text-[#F56E0F]/90 leading-relaxed">{t('about.tagline')}</p>
      </div>
      <p className="text-[14px] text-foreground/80 leading-relaxed mb-5">{t('about.description')}</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: t('about.edition'), value: t('about.editionValue') },
          { label: t('about.location'), value: t('about.locationValue') },
          { label: t('about.duration'), value: t('about.durationValue') },
          { label: t('about.entry'), value: t('about.entryValue') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-foreground/4 rounded-xl p-3">
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <p className="text-[13px] font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[#F56E0F]" />
        <span className="text-[13px] text-muted-foreground">{t('about.place')}</span>
      </div>
      <a href="https://vodundays.bj" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F56E0F]/15 border border-[#F56E0F]/25 text-[#F56E0F] text-[14px] font-semibold">
        <ExternalLink className="w-4 h-4" /> {t('about.visit')}
      </a>
    </Sheet>
  );
}

function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('params');
  const faq = t.raw('help.faq') as FaqItem[];
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <Sheet open={open} onClose={onClose} title={t('help.title')}>
      <p className="text-[13px] text-muted-foreground mb-5">{t('help.subtitle')}</p>
      <div className="space-y-2 mb-6">
        {faq.map((item, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-foreground/4 border border-vd-border-soft">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
              <span className="text-[13px] font-medium text-foreground pr-3">{item.q}</span>
              <motion.span animate={{ rotate: expanded === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <p className="px-4 pb-4 text-[12px] text-muted-foreground leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <a href="https://vodundays.bj/infos-pratiques/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/6 text-muted-foreground text-[13px] hover:bg-foreground/10 transition-colors">
        <ExternalLink className="w-4 h-4" /> {t('help.moreInfo')}
      </a>
    </Sheet>
  );
}

function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('params');
  const sections = t.raw('privacy.sections') as PrivacySection[];
  const [fakeUuid] = useState(() =>
    `${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 14)}`
  );

  return (
    <Sheet open={open} onClose={onClose} title={t('privacy.title')}>
      <div className="bg-[#1a2a1a] border border-green-500/25 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-4 h-4 text-green-400" />
          <p className="text-[12px] font-semibold text-green-400">{t('privacy.sessionActive')}</p>
        </div>
        <p className="text-[11px] text-green-300/70 leading-relaxed mb-3">{t('privacy.sessionDesc')}</p>
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
          <RefreshCw className="w-3 h-3 text-green-400/60 shrink-0" />
          <span className="text-[10px] font-mono text-green-400/60 truncate">{fakeUuid}</span>
        </div>
      </div>

      <p className="text-[12px] text-muted-foreground mb-4 leading-relaxed">{t('privacy.legalNote')}</p>

      <div className="space-y-3 mb-6">
        {sections.map((s) => (
          <div
            key={s.title}
            className={cn(
              'border rounded-xl p-4',
              s.highlight ? 'bg-green-500/5 border-green-500/20' : 'bg-foreground/4 border-vd-border-soft'
            )}
          >
            <p className={cn('text-[12px] font-semibold mb-1.5', s.highlight ? 'text-green-400' : 'text-[#F56E0F]')}>
              {s.title}
            </p>
            <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-line">{s.content}</p>
          </div>
        ))}
      </div>

      <a href="https://vodundays.bj/politique-de-confidentialite/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/6 text-muted-foreground text-[13px] hover:bg-foreground/10 transition-colors">
        <ExternalLink className="w-4 h-4" /> {t('privacy.fullPolicy')}
      </a>
    </Sheet>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('params');
  const socials = [
    { icon: Facebook,  label: 'Facebook',   handle: '@vodundays', url: 'https://www.facebook.com/vodundays' },
    { icon: Instagram, label: 'Instagram',  handle: '@vodundays', url: 'https://www.instagram.com/vodundays/' },
    { icon: Twitter,   label: 'X / Twitter', handle: '@vodundays', url: 'https://x.com/vodundays' },
    { icon: Youtube,   label: 'YouTube',    handle: 'Vodun Days', url: 'https://www.youtube.com/playlist?list=PL6nGRnf5v3jg5ByAAlBgMpCKWi743C2HC' },
  ];
  return (
    <Sheet open={open} onClose={onClose} title={t('contact.title')}>
      <div className="bg-foreground/4 border border-vd-border-soft rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F56E0F]/15 flex items-center justify-center">
          <Mail className="w-5 h-5 text-[#F56E0F]" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">{t('contact.email')}</p>
          <p className="text-[14px] font-semibold text-foreground">contact@vodundays.bj</p>
        </div>
      </div>
      <div className="bg-foreground/4 border border-vd-border-soft rounded-2xl p-4 mb-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground/6 flex items-center justify-center mt-0.5">
          <MapPin className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">{t('contact.address')}</p>
          <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">{t('contact.addressValue')}</p>
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 px-1">{t('contact.social')}</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {socials.map(({ icon: Icon, label, handle, url }) => (
          <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-xl bg-foreground/4 border border-vd-border-soft hover:bg-foreground/8 transition-colors">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-semibold text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{handle}</p>
            </div>
          </a>
        ))}
      </div>
      <a href="https://vodundays.bj/contact/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F56E0F]/15 border border-[#F56E0F]/25 text-[#F56E0F] text-[14px] font-semibold">
        <ExternalLink className="w-4 h-4" /> {t('contact.form')}
      </a>
    </Sheet>
  );
}

export default function ParametresPage() {
  const t = useTranslations('params');
  const [notifOn, setNotifOn] = useState(true);
  const [modal, setModal] = useState<ModalKey>(null);
  const close = () => setModal(null);

  return (
    <div className="min-h-screen bg-vd-page-bg">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)' }} />

      <header
        className="relative z-10 px-4 pb-4"
        style={{ paddingTop: "max(24px, env(safe-area-inset-top))" }}
      >
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <Image src="/images/logo.png" alt="Vodun Days Logo" fill className="object-contain" priority />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{t('appLabel')}</p>
            <h1 className="text-[22px] font-black text-foreground tracking-[-0.02em]">{t('title')}</h1>
          </div>
        </motion.div>
      </header>

      <main className="px-4 pb-28 space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 px-1">{t('sections.preferences')}</h2>
          <div className="rounded-[16px] overflow-visible bg-vd-card-surface border border-vd-border-soft">
            <SettingsRow icon={notifOn ? Bell : BellOff} label={t('rows.notifications')} onClick={() => setModal('notif')}>
              <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded-full', notifOn ? 'bg-[#F56E0F]/15 text-[#F56E0F]' : 'bg-foreground/6 text-muted-foreground')}>
                {notifOn ? t('notifications.enabled') : t('notifications.disabled')}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-vd-border-soft" />
            <SettingsRow icon={Globe} label={t('rows.language')}>
              <LanguagePicker />
            </SettingsRow>
            <div className="mx-3 h-px bg-vd-border-soft" />
            <SettingsRow icon={Monitor} label="Apparence">
              <ThemeToggle />
            </SettingsRow>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 px-1">{t('sections.application')}</h2>
          <div className="rounded-[16px] overflow-hidden bg-vd-card-surface border border-vd-border-soft">
            <SettingsRow icon={Smartphone} label={t('rows.version')} onClick={() => setModal('version')}>
              <span className="text-[13px] text-muted-foreground">1.0.0</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-vd-border-soft" />
            <SettingsRow icon={Info} label={t('rows.about')} onClick={() => setModal('about')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-vd-border-soft" />
            <SettingsRow icon={HelpCircle} label={t('rows.help')} onClick={() => setModal('help')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 px-1">{t('sections.legal')}</h2>
          <div className="rounded-[16px] overflow-hidden bg-vd-card-surface border border-vd-border-soft">
            <SettingsRow icon={Shield} label={t('rows.privacy')} onClick={() => setModal('privacy')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
            <div className="mx-3 h-px bg-vd-border-soft" />
            <SettingsRow icon={Mail} label={t('rows.contact')} onClick={() => setModal('contact')}>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </SettingsRow>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35 }} className="text-center pt-2">
          <p className="text-[12px] text-muted-foreground">{t('footer.name')}</p>
          <p className="text-[11px] text-muted-foreground/50 mt-1">{t('footer.location')}</p>
        </motion.div>
      </main>

      <NotifModal   open={modal === 'notif'}   onClose={close} on={notifOn} setOn={setNotifOn} />
      <VersionModal open={modal === 'version'} onClose={close} />
      <AboutModal   open={modal === 'about'}   onClose={close} />
      <HelpModal    open={modal === 'help'}    onClose={close} />
      <PrivacyModal open={modal === 'privacy'} onClose={close} />
      <ContactModal open={modal === 'contact'} onClose={close} />

      <BottomNav />
    </div>
  );
}
