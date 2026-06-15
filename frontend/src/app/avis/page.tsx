"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { ArrowLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { SatisfactionStep } from "@/components/SatisfactionStep";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { WaitingScreen } from "@/components/WaitingScreen";
import { getPublicQuizzes } from "@/lib/api/quiz";
import { getQuestions, submitAnswer } from "@/lib/api/questions";
import type { Quiz, Question } from "@/lib/types/api";
import { useTranslations } from "next-intl";

// Clés localStorage
const LS_UUID_KEY = "vd_survey_uuid";
const submittedKey = (quizId: string) => `vd_submitted_${quizId}`;

// Fallback uuid v4 pour les contextes non-https
function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getOrCreateUuid(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(LS_UUID_KEY);
  if (stored) return stored;
  const id = generateUuid();
  localStorage.setItem(LS_UUID_KEY, id);
  return id;
}

// Lecture des params URL sans useSearchParams (évite l'instabilité de référence)
function getUrlParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

// Détection du type de question
function isRatingType(label: string) {
  const l = label.toLowerCase();
  return l.includes("note") || l.includes("étoile");
}
function isTextType(label: string) {
  const l = label.toLowerCase();
  return l.includes("texte") || l.includes("libre");
}

// Multi-choix stocké en JSON pour tolérer les virgules dans les libellés
function parseMultiple(val: string): string[] {
  try { return JSON.parse(val) as string[]; }
  catch { return val.split(",").filter(Boolean); }
}

// Segmented Progress Bar
function SegmentedProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-1 w-full">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[3px] rounded-full transition-colors duration-300"
          style={{ background: i <= currentStep ? "#F56E0F" : "rgba(255,255,255,0.10)" }}
        />
      ))}
    </div>
  );
}

// Toast inline
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
        "px-5 py-3 rounded-xl text-[13px] font-semibold text-white",
        "shadow-lg backdrop-blur-sm max-w-[80vw] text-center",
        type === "success"
          ? "bg-[#1B7A6E]/90 border border-[#2AAA9E]/40"
          : "bg-[#F56E0F]/90 border border-[#F56E0F]/40"
      )}
    >
      {message}
    </motion.div>
  );
}

// Rendu d'une question QCM ou texte libre
function QuestionStep({
  question,
  value,
  onChange,
  onNext,
  stepIndex,
  totalSteps,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
}) {
  const t = useTranslations("avis");
  const label = question.questionType?.types ?? "";
  const isText = isTextType(label);
  const isMultiple = label.toLowerCase().includes("multiple");
  const choices = question.choices ?? [];

  const noChoicesAvailable = !isText && !isRatingType(label) && choices.length === 0;
  const canProceed = isText || noChoicesAvailable || value.trim().length > 0;
  const selectedValues = isMultiple ? parseMultiple(value) : [];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#878787] text-center mb-2">
          {t("step", { current: stepIndex + 1, total: totalSteps })}
        </p>
        <h3 className="text-[18px] font-black text-white text-center mb-6 leading-snug">
          {question.wording}
        </h3>

        {isText ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("placeholder")}
            rows={4}
            className={cn(
              "w-full px-3 py-2.5 rounded-xl resize-none",
              "bg-black/30 border border-white/10",
              "text-white text-[13px] placeholder:text-[#878787]",
              "focus:outline-none focus:border-[#F56E0F]/40",
              "transition-colors duration-200 box-border"
            )}
          />
        ) : noChoicesAvailable ? (
          <p className="text-center text-[13px] text-[#878787] py-4">
            {t("noOptions")}
          </p>
        ) : (
          <div className="space-y-2">
            {choices.map((choice) => {
              const selected = isMultiple
                ? selectedValues.includes(choice.wording)
                : value === choice.wording;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    if (isMultiple) {
                      const current = parseMultiple(value);
                      const next = selected
                        ? current.filter((v) => v !== choice.wording)
                        : [...current, choice.wording];
                      onChange(JSON.stringify(next));
                    } else {
                      onChange(choice.wording);
                    }
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-[13px] transition-all",
                    selected
                      ? "bg-[#F56E0F]/15 border-[#F56E0F]/60 text-white"
                      : "bg-white/4 border-white/10 text-[#878787] hover:border-white/20"
                  )}
                >
                  {choice.wording}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "w-full mt-6 py-3.5 rounded-xl",
            "text-[14px] font-black tracking-wide",
            "transition-all duration-200 active:scale-[0.98]",
            canProceed
              ? "bg-[#F56E0F] text-white shadow-[0_4px_24px_rgba(245,110,15,0.4)]"
              : "bg-white/10 text-[#878787] cursor-not-allowed"
          )}
        >
          {t("next")}
        </button>
      </div>
    </motion.div>
  );
}

// Machine d'états pour le chargement - évite toute ambiguïté entre phases
// "already-submitted" = soumis lors d'une session précédente (pas la confirmation)
type LoadPhase = "loading" | "no-quiz" | "load-error" | "ready" | "already-submitted";

// Page principale
export default function AvisPage() {
  const t  = useTranslations("avis");
  const tc = useTranslations("common");
  const [quiz, setQuiz]               = useState<Quiz | null>(null);
  const [quizzes, setQuizzes]         = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [phase, setPhase]             = useState<LoadPhase>("loading");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [toast, setToast]             = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Ref pour éviter les double-exécutions (React Strict Mode) et les stale closures
  const loadedRef = useRef(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Charge les questions d'un quiz donne et bascule l'état local
  const loadQuizById = async (target: Quiz) => {
    const uuid = getOrCreateUuid();
    if (uuid && localStorage.getItem(submittedKey(target.id))) {
      setQuiz(target);
      setPhase("already-submitted");
      return;
    }

    const questionsRes = await getQuestions(target.id);
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!questionsRes.success) {
      setPhase("load-error");
      return;
    }

    setQuiz(target);
    setQuestions(questionsRes.data);
    setCurrentStep(0);
    setAnswers({});
    setPhase(questionsRes.data.length > 0 ? "ready" : "no-quiz");
  };

  const loadQuiz = async () => {
    setPhase("loading");
    loadedRef.current = false;

    try {
      // URL params lus ici, une seule fois par appel, sans dépendance externe
      const eventIdParam = getUrlParam("eventId");

      const quizRes = await getPublicQuizzes(eventIdParam ?? undefined);
      if (!quizRes.success || quizRes.data.length === 0) {
        setPhase("no-quiz");
        return;
      }

      const all = quizRes.data;
      setQuizzes(all);

      // Priorité : EVENT (si eventId) → FESTIVAL → ALL_EVENTS → ALL_SITES → premier
      const initial =
        (eventIdParam ? all.find((q) => q.scope === "EVENT" && q.eventId === eventIdParam) : undefined) ||
        all.find((q) => q.scope === "FESTIVAL") ||
        all.find((q) => q.scope === "ALL_EVENTS") ||
        all.find((q) => q.scope === "ALL_SITES") ||
        all[0] ||
        null;

      if (!initial) {
        setPhase("no-quiz");
        return;
      }

      setSelectedQuizId(initial.id);
      await loadQuizById(initial);
    } catch {
      if (!loadedRef.current) setPhase("load-error");
    }
  };

  // Basculement vers un autre quiz depuis le sélecteur
  const selectQuiz = async (id: string) => {
    const found = quizzes.find((q) => q.id === id);
    if (!found || id === selectedQuizId) return;

    setSelectedQuizId(id);
    setIsSubmitted(false);
    setPhase("loading");
    loadedRef.current = false;
    await loadQuizById(found);
  };

  // Un seul déclenchement au montage - pas de dépendance sur searchParams
  useEffect(() => {
    loadQuiz();
    return () => {
      // Annule toute mise à jour d'état si le composant est démonté
      loadedRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!quiz) return;
    setIsSubmitting(true);

    const submissions = questions
      .map((q) => ({ questionId: q.id, response: answers[q.id] ?? "" }))
      .filter((a) => a.response.trim().length > 0);

    if (submissions.length === 0) {
      showToast(t("validationError"), "error");
      setIsSubmitting(false);
      return;
    }

    const uuid = getOrCreateUuid();
    try {
      await Promise.all(
        submissions.map((a) =>
          submitAnswer({ response: a.response, questionId: a.questionId, uuid })
        )
      );
      localStorage.setItem(submittedKey(quiz.id), "1");
      showToast(t("success"), "success");
      setIsSubmitted(true);
    } catch {
      showToast(t("sendError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0E0D12]">
        <ConfirmationScreen />
        <BottomNav />
      </div>
    );
  }

  const isLastStep = currentStep === questions.length - 1;
  const currentQuestion = questions[currentStep];
  const currentType = currentQuestion?.questionType?.types ?? "";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,110,15,0.08) 0%, transparent 60%), #0E0D12",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-[#0E0D12]/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <Link
              href="/programme"
              className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          )}
          <div />
          <div className="w-10" />
        </div>
        {phase === "ready" && questions.length > 0 && (
          <SegmentedProgressBar currentStep={currentStep} totalSteps={questions.length} />
        )}
      </header>

      {/* Sélecteur multi-quiz */}
      {quizzes.length > 1 && (
        <div className="px-4 pt-3 pb-0 overflow-x-auto flex gap-2 scrollbar-hide">
          {quizzes.map((q) => {
            const submitted = !!localStorage.getItem(submittedKey(q.id));
            const isActive  = selectedQuizId === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => selectQuiz(q.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full",
                  "text-[12px] font-semibold border transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#F56E0F] text-white border-[#F56E0F]"
                    : submitted
                    ? "bg-white/4 text-[#878787] border-white/10"
                    : "bg-white/8 text-white/70 border-white/15 hover:border-white/30"
                )}
              >
                {submitted && <Check className="size-3" />}
                {q.title}
              </button>
            );
          })}
        </div>
      )}

      {/* En-tête page */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#878787] mb-1">
          {t("category")}
        </p>
        <h1 className="text-[22px] font-black text-white leading-tight mb-1">
          {quiz?.title ?? t("title")}
        </h1>
        <p className="text-[13px] text-[#878787]">
          {t("subtitle")}
        </p>
      </div>

      {/* Contenu selon la phase */}
      <main className="px-4 pt-6 pb-36">
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 pt-20 text-white/40">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-[13px]">{t("loading")}</p>
          </div>
        )}

        {phase === "no-quiz" && (
          <div className="flex flex-col items-center justify-center gap-3 pt-20 text-white/40">
            <p className="text-[14px]">{t("empty")}</p>
          </div>
        )}

        {phase === "already-submitted" && (
          <WaitingScreen quizTitle={quiz?.title} onCheck={() => { loadedRef.current = false; setIsSubmitted(false); loadQuiz(); }} />
        )}

        {phase === "load-error" && (
          <div className="flex flex-col items-center justify-center gap-4 pt-20">
            <p className="text-[14px] text-[#878787] text-center">
              {t("error")}
            </p>
            <button
              type="button"
              onClick={() => { loadedRef.current = false; setIsSubmitted(false); loadQuiz(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[13px] text-white/70 hover:bg-white/[0.1] transition-all"
            >
              <RefreshCw className="size-4" />
              {tc("retry")}
            </button>
          </div>
        )}

        {phase === "ready" && (
          <AnimatePresence mode="wait">
            {currentQuestion && isRatingType(currentType) ? (
              <SatisfactionStep
                key={currentQuestion.id}
                stepIndex={currentStep}
                totalSteps={questions.length}
                question={currentQuestion.wording}
                ratingKey={currentQuestion.id}
                value={Number(answers[currentQuestion.id] ?? 0)}
                onChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: String(val) }))
                }
                onNext={isLastStep ? handleSubmit : handleNext}
              />
            ) : currentQuestion ? (
              <QuestionStep
                key={currentQuestion.id}
                question={currentQuestion}
                value={answers[currentQuestion.id] ?? ""}
                onChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }))
                }
                onNext={isLastStep ? handleSubmit : handleNext}
                stepIndex={currentStep}
                totalSteps={questions.length}
              />
            ) : null}

            {isLastStep && isRatingType(currentType) && isSubmitting && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
              >
                <Loader2 className="size-8 animate-spin text-[#F56E0F]" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
