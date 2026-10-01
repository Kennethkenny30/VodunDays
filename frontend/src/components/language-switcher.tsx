"use client";

import { useTransition } from "react";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { useLocale } from "use-intl";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { setLocale } from "@/i18n/actions";
import { LOCALES, type Locale } from "@/i18n/locale";

const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

const wordMotionProps: MotionProps = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.25, ease: "easeOut" },
};

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending) return;
    const currentIndex = LOCALES.indexOf(locale);
    const next = LOCALES[(currentIndex + 1) % LOCALES.length];
    startTransition(() => {
      setLocale(next);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Changer de langue"
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground disabled:opacity-50",
        className
      )}
    >
      <Languages className="h-4 w-4 shrink-0" />
      <span className="overflow-hidden py-1 leading-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={locale}
            className="inline-block whitespace-nowrap"
            {...wordMotionProps}
          >
            {LOCALE_LABELS[locale]}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}