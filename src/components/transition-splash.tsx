"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Greeting {
  text: string;
  language: string;
}

// Salutations multilingues par defaut
const defaultGreetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "Olá", language: "Portuguese" },
];

interface TransitionSplashProps {
  greetings?: Greeting[];
  redirectTo: string;
  intervalMs?: number;
}

export function TransitionSplash({
  greetings = defaultGreetings,
  redirectTo,
  intervalMs = 600,
}: TransitionSplashProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= greetings.length) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isAnimating, greetings.length, intervalMs]);

  // Redirection apres la fin de l'animation
  useEffect(() => {
    if (!isAnimating) {
      const timeout = setTimeout(() => {
        router.push(redirectTo);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, router, redirectTo]);

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  };

  return (
    <main
      className="flex min-h-svh items-center justify-center px-4"
      style={{ backgroundColor: "#F56E0F" }}
    >
      <section
        aria-label="Transition Vodun Days"
        className="flex flex-col items-center justify-center gap-6"
        style={{ marginTop: "-120px" }}
      >
        <Image
          src="/images/vodundays_logo2.png"
          alt="Vodun Days logo"
          width={280}
          height={280}
          priority
          className=" w-24 sm:w-32 md:w-40 lg:w-48"
        />

        <div className="relative flex h-20 w-80 flex-col items-center justify-center overflow-visible">
          {isAnimating ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                initial={textVariants.hidden}
                animate={textVariants.visible}
                exit={textVariants.exit}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute flex flex-col items-center gap-1"
                aria-live="off"
              >
                <span className="font-medium text-xl sm:text-2xl md:text-3xl text-white">
                  {greetings[currentIndex].text}
                </span>
                <span className="text-xs sm:text-sm text-white/70">
                  {greetings[currentIndex].language}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="font-medium text-xl sm:text-2xl md:text-3xl text-white">
                {greetings[currentIndex].text}
              </span>
              <span className="text-xs sm:text-sm text-white/70">
                {greetings[currentIndex].language}
              </span>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
