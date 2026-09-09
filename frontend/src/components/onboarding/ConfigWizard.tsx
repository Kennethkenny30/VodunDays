"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Lightbulb,
  Languages,
  User,
  EyeOff,
  Cake,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { CountryCombobox } from "./CountryCombobox";
import { GlassCard } from "./GlassCard";
import { setLocale } from "@/i18n/actions";
import { completeOnboarding } from "@/lib/api/onboarding";
import { enablePush, disablePush } from "@/lib/push";
import type {
  AgeRange,
  FestivalEdition,
  FestivalierPayload,
  Gender,
} from "@/lib/types/api";

const ACCENT = "#F56E0F";
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// Variants directionnels : on glisse vers la gauche en avancant, vers
// la droite en reculant, pilote par la valeur "direction" (1 ou -1).
const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -32 : 32 }),
};

type StepId =
  | "language"
  | "notifications"
  | "gender"
  | "ageRange"
  | "nationality"
  | "edition";

const STEPS: StepId[] = [
  "language",
  "notifications",
  "gender",
  "ageRange",
  "nationality",
  "edition",
];

type Draft = {
  language: "fr" | "en" | null;
  notificationsEnabled: boolean;
  gender: Gender | null;
  ageRange: AgeRange | null;
  nationality: string | null;
  edition: FestivalEdition | null;
};

// Rangee a pastille circulaire reutilisee pour toutes les options a choix unique.
// La pastille anime la transition icone -> coche a la selection.
function OptionRow({
  label,
  selected,
  icon: Icon,
  onClick,
}: {
  label: string;
  selected: boolean;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "w-full flex items-center gap-3 text-left px-3.5 py-3 rounded-2xl border transition-colors",
        selected
          ? "bg-[#F56E0F]/12 border-[#F56E0F]/50"
          : "bg-foreground/5 border-foreground/10 hover:border-foreground/20"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center size-8 rounded-full shrink-0 overflow-hidden transition-colors",
          !selected && "bg-foreground/10 text-muted-foreground"
        )}
        style={selected ? { background: ACCENT, color: "#fff" } : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={selected ? "check" : "icon"}
            initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex items-center justify-center"
          >
            {selected ? <Check className="size-4" /> : <Icon className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span
        className={cn(
          "text-[14px] font-semibold",
          selected ? "text-foreground" : "text-foreground/80"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}

// Barre de progression a pastilles inspiree de la maquette : un rail
// rempli d'un degrade sombre -> accent jusqu'a l'etape courante, avec
// une pastille par etape (coche animee si terminee, numero si en cours,
// "+" a venir).
function Stepper({
  steps,
  stepIndex,
  onJump,
  registerCircleRef,
  t,
}: {
  steps: StepId[];
  stepIndex: number;
  onJump: (index: number) => void;
  registerCircleRef: (index: number, el: HTMLButtonElement | null) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const fillPercent = (stepIndex / (steps.length - 1)) * 100;

  return (
    <div className="mt-5">
      <div className="relative h-11 rounded-full bg-foreground/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ background: `linear-gradient(90deg, rgba(15,15,18,0.92), ${ACCENT})` }}
        />
        <div className="relative h-full flex items-center justify-between px-1.5">
          {steps.map((id, i) => {
            const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "upcoming";
            return (
              <button
                key={id}
                ref={(el) => registerCircleRef(i, el)}
                type="button"
                disabled={state !== "done"}
                onClick={() => onJump(i)}
                aria-label={t(`stepper.${id}`)}
                className={cn(
                  "flex items-center justify-center size-8 rounded-full shrink-0 overflow-hidden transition-colors",
                  state === "upcoming" && "bg-foreground/15 text-muted-foreground cursor-not-allowed",
                  (state === "done" || state === "current") && "bg-white text-neutral-900",
                  state === "current" && "shadow-[0_0_0_4px_rgba(245,110,15,0.35)] cursor-default",
                  state === "done" && "cursor-pointer"
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={state}
                    initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="flex items-center justify-center"
                  >
                    {state === "done" ? (
                      <Check className="size-4" />
                    ) : state === "upcoming" ? (
                      <Plus className="size-3.5" />
                    ) : (
                      <span className="text-[12px] font-black">{i + 1}</span>
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between px-1 mt-2">
        {steps.map((id, i) => (
          <span
            key={id}
            className={cn(
              "flex-1 text-center text-[9px] font-semibold truncate px-0.5 transition-colors",
              i === stepIndex ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {t(`stepper.${id}`)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Bandeau "astuce" repris de la maquette : icone dans un cercle + texte
// contextuel a l'etape courante, anime a chaque changement d'etape.
function TipBanner({ stepId, text }: { stepId: StepId; text: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-foreground/5 border border-foreground/10"
        >
          <span
            className="flex items-center justify-center size-6 rounded-full shrink-0"
            style={{ background: "rgba(245,110,15,0.15)" }}
          >
            <Lightbulb className="size-3.5" style={{ color: ACCENT }} />
          </span>
          <p className="text-[11px] text-muted-foreground leading-snug">{text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ConfigWizard({
  uuid,
  onComplete,
}: {
  uuid: string;
  onComplete: () => void;
}) {
  const t = useTranslations("onboarding.config");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<Draft>({
    language: (locale as "fr" | "en") ?? "fr",
    notificationsEnabled: true,
    gender: null,
    ageRange: null,
    // Benin pre-selectionne par defaut, modifiable via la recherche.
    nationality: "BJ",
    edition: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifDenied, setNotifDenied] = useState(false);

  // Position horizontale du bubble tail, mesuree en pixels par rapport
  // au conteneur de la carte pour suivre precisement le cercle actif.
  const cardStageRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [tailX, setTailX] = useState<number | null>(null);

  const registerCircleRef = (index: number, el: HTMLButtonElement | null) => {
    circleRefs.current[index] = el;
  };

  const stepId = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const canProceed = (() => {
    switch (stepId) {
      case "language":      return draft.language !== null;
      case "notifications": return true;
      case "gender":         return draft.gender !== null;
      case "ageRange":       return draft.ageRange !== null;
      case "nationality":    return draft.nationality !== null;
      case "edition":        return draft.edition !== null;
      default:               return false;
    }
  })();

  // Mesure la position du cercle actif du stepper pour y faire pointer
  // le bubble tail sous la carte, de facon reactive au responsive.
  useLayoutEffect(() => {
    const measure = () => {
      const container = cardStageRef.current;
      const circle = circleRefs.current[stepIndex];
      if (!container || !circle) return;
      const containerRect = container.getBoundingClientRect();
      const circleRect = circle.getBoundingClientRect();
      setTailX(circleRect.left + circleRect.width / 2 - containerRect.left);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stepIndex]);

  const handleNotificationsToggle = async (checked: boolean) => {
    // Optimiste : on affiche l'etat demande tout de suite.
    setDraft((d) => ({ ...d, notificationsEnabled: checked }));
    setNotifDenied(false);

    if (checked) {
      const result = await enablePush(uuid);
      if (!result.ok) {
        // Permission refusee ou navigateur incompatible : on revient a l'etat reel.
        setDraft((d) => ({ ...d, notificationsEnabled: false }));
        if (result.reason === "denied") setNotifDenied(true);
      }
    } else {
      await disablePush();
    }
  };

  const goBack = () => {
    if (stepIndex === 0 || submitting) return;
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  // Saut direct depuis le stepper : uniquement vers une etape deja validee.
  const jumpTo = (index: number) => {
    if (index >= stepIndex || submitting) return;
    setDirection(-1);
    setStepIndex(index);
  };

  const goNext = async () => {
    if (!canProceed || submitting) return;

    // Applique la langue tout de suite : les etapes suivantes s'affichent
    // deja dans la langue choisie.
    if (stepId === "language" && draft.language) {
      await setLocale(draft.language);
    }

    if (!isLastStep) {
      setDirection(1);
      setStepIndex((i) => i + 1);
      return;
    }

    const payload: FestivalierPayload = {
      language: draft.language ?? "fr",
      notificationsEnabled: draft.notificationsEnabled,
      gender: draft.gender as Gender,
      ageRange: draft.ageRange as AgeRange,
      nationality: draft.nationality as string,
      edition: draft.edition as FestivalEdition,
    };

    setSubmitting(true);
    setError(null);
    try {
      const res = await completeOnboarding(uuid, payload);
      if (!res.success) throw new Error(res.message);
      onComplete();
    } catch {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Titre bold hors carte, anime a chaque changement d'etape. */}
      <div className="mb-5 text-center px-2 overflow-hidden">
        <p className="sr-only" role="status" aria-live="polite">
          {t("progressLabel", { current: stepIndex + 1, total: STEPS.length })}
        </p>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={stepId}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: EASE }}
          >
            <h2 className="text-[22px] font-black text-foreground leading-tight mb-1.5">
              {t(`${stepId}.title`)}
            </h2>
            <p className="text-[13px] text-muted-foreground">{t(`${stepId}.subtitle`)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div ref={cardStageRef} className="relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepId}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: EASE }}
          >
            <GlassCard innerClassName="p-5">
              {stepId === "language" && (
              <div className="space-y-2" role="radiogroup">
                <OptionRow
                  label={t("language.fr")}
                  icon={Languages}
                  selected={draft.language === "fr"}
                  onClick={() => setDraft((d) => ({ ...d, language: "fr" }))}
                />
                <OptionRow
                  label={t("language.en")}
                  icon={Languages}
                  selected={draft.language === "en"}
                  onClick={() => setDraft((d) => ({ ...d, language: "en" }))}
                />
              </div>
            )}

            {stepId === "notifications" && (
              <div>
                <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-foreground/5 border border-foreground/10">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex items-center justify-center size-8 rounded-full shrink-0 overflow-hidden transition-colors",
                        !draft.notificationsEnabled && "text-muted-foreground"
                      )}
                      style={
                        draft.notificationsEnabled
                          ? { background: ACCENT, color: "#fff" }
                          : undefined
                      }
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={draft.notificationsEnabled ? "on" : "off"}
                          initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className="flex items-center justify-center"
                        >
                          {draft.notificationsEnabled ? (
                            <Bell className="size-4" />
                          ) : (
                            <BellOff className="size-4" />
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">
                        {t("notifications.toggleLabel")}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t("notifications.enableHint")}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={draft.notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                <AnimatePresence>
                  {notifDenied && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="text-[12px] text-red-400 overflow-hidden"
                    >
                      {t("notifications.permissionDenied")}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            {stepId === "gender" && (
              <div className="space-y-2" role="radiogroup">
                {(
                  [
                    ["MALE", "gender.male", User],
                    ["FEMALE", "gender.female", User],
                    ["UNDISCLOSED", "gender.undisclosed", EyeOff],
                  ] as [Gender, string, React.ElementType][]
                ).map(([value, key, Icon]) => (
                  <OptionRow
                    key={value}
                    label={t(key)}
                    icon={Icon}
                    selected={draft.gender === value}
                    onClick={() => setDraft((d) => ({ ...d, gender: value }))}
                  />
                ))}
              </div>
            )}

            {stepId === "ageRange" && (
              <div className="space-y-2" role="radiogroup">
                {(
                  [
                    ["UNDER_18", "underEighteen"],
                    ["FROM_18_TO_24", "eighteenToTwentyFour"],
                    ["FROM_25_TO_34", "twentyFiveToThirtyFour"],
                    ["FROM_35_TO_44", "thirtyFiveToFortyFour"],
                    ["FROM_45_TO_54", "fortyFiveToFiftyFour"],
                    ["FROM_55_AND_ABOVE", "fiftyFiveAndAbove"],
                  ] as [AgeRange, string][]
                ).map(([value, key]) => (
                  <OptionRow
                    key={value}
                    label={t(`ageRange.${key}`)}
                    icon={Cake}
                    selected={draft.ageRange === value}
                    onClick={() => setDraft((d) => ({ ...d, ageRange: value }))}
                  />
                ))}
              </div>
            )}

            {stepId === "nationality" && (
              <CountryCombobox
                value={draft.nationality}
                onChange={(code) => setDraft((d) => ({ ...d, nationality: code }))}
                placeholder={t("nationality.trigger")}
                searchPlaceholder={t("nationality.searchPlaceholder")}
                emptyLabel={t("nationality.empty")}
              />
            )}

            {stepId === "edition" && (
              <div className="space-y-2" role="radiogroup">
                {(
                  [
                    ["FIRST", "first"],
                    ["SECOND", "second"],
                    ["THIRD", "third"],
                    ["FOURTH_AND_ABOVE", "fourthAndAbove"],
                  ] as [FestivalEdition, string][]
                ).map(([value, key]) => (
                  <OptionRow
                    key={value}
                    label={t(`edition.${key}`)}
                    icon={PartyPopper}
                    selected={draft.edition === value}
                    onClick={() => setDraft((d) => ({ ...d, edition: value }))}
                  />
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>

        {tailX !== null && (
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{ top: "100%", left: 0 }}
            animate={{ x: tailX }}
            transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.6 }}
          >
            <div
              className="-translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "10px solid rgba(255,255,255,0.10)",
                filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))",
              }}
            />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mt-3 text-[12px] text-center text-red-400 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <Stepper steps={STEPS} stepIndex={stepIndex} onJump={jumpTo} registerCircleRef={registerCircleRef} t={t} />
      <TipBanner stepId={stepId} text={t(`${stepId}.tip`)} />

      <div className="flex items-center gap-2 mt-4">
        <AnimatePresence initial={false}>
          {stepIndex > 0 && (
            <motion.button
              key="back"
              type="button"
              onClick={goBack}
              disabled={submitting}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.2, ease: EASE }}
              aria-label={tc("back")}
              className="shrink-0 size-[52px] rounded-full bg-foreground/8 border border-foreground/10 text-foreground/70 flex items-center justify-center disabled:opacity-50"
            >
              <ArrowLeft className="size-4 shrink-0" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canProceed || submitting}
          whileTap={canProceed && !submitting ? { scale: 0.97 } : undefined}
          className={cn(
            "flex-1 py-3.5 rounded-2xl text-[14px] font-black tracking-wide overflow-hidden",
            "transition-colors duration-200 flex items-center justify-center gap-2",
            canProceed && !submitting
              ? "text-white shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
              : "bg-foreground/10 text-muted-foreground cursor-not-allowed"
          )}
          style={canProceed && !submitting ? { background: ACCENT } : undefined}
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitting ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                <Loader2 className="size-4 animate-spin" />
              </motion.span>
            ) : (
              <motion.span
                key={`${stepId}-cta`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="flex items-center gap-2"
              >
                {isLastStep ? t("finish") : tc("next")}
                <ArrowRight className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}