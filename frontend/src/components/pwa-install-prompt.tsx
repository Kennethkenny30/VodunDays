"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Share2, SquarePlus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "vd_install_dismissed";
const DISMISS_DAYS = 7;
const SHOW_DELAY_MS = 12_000;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  return /ipad|iphone|ipod/i.test(ua) && /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
}

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const onIOS = isIOSSafari();
    setIos(onIOS);

    let timer: ReturnType<typeof setTimeout>;

    if (onIOS) {
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    const onInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setVisible(false);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setPrompt(null);
  }

  return (
    <AnimatePresence>
      {visible && showGuide && (
        <motion.div
          key="ios-guide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed left-0 right-0 z-60 flex justify-center px-4 pointer-events-none"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div
            className="w-full max-w-md pointer-events-auto rounded-2xl p-4 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #252433 0%, #1e1d2e 100%)",
              border: "1px solid oklch(0.82 0.14 85 / 0.3)",
              boxShadow: "0 0 40px oklch(0.82 0.14 85 / 0.12), 0 20px 60px #00000080",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Ajouter a l'écran d'accueil</p>
              <button
                onClick={() => setShowGuide(false)}
                className="text-white/30 hover:text-white/60 transition-colors p-1 -mr-0.5"
                aria-label="Fermer le guide"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: "oklch(0.82 0.14 85 / 0.15)", color: "oklch(0.82 0.14 85)" }}
                >
                  1
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span>Appuie sur</span>
                  <span className="inline-flex items-center gap-1 text-white font-medium px-2 py-0.5 rounded-lg bg-white/8">
                    <Share2 size={13} />
                    Partager
                  </span>
                </div>
              </div>

              <div
                className="ml-4 w-px h-3"
                style={{ background: "oklch(0.82 0.14 85 / 0.2)" }}
              />

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: "oklch(0.82 0.14 85 / 0.15)", color: "oklch(0.82 0.14 85)" }}
                >
                  2
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span>Selectionne</span>
                  <span className="inline-flex items-center gap-1 text-white font-medium px-2 py-0.5 rounded-lg bg-white/8">
                    <SquarePlus size={13} />
                    Sur l'écran d'accueil
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {visible && (
        <motion.div
          key="install-card"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div
            className="w-full max-w-md pointer-events-auto rounded-2xl p-4 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #1e1d28 0%, #1a1925 100%)",
              border: "1px solid oklch(0.82 0.14 85 / 0.2)",
              boxShadow: "0 0 40px oklch(0.82 0.14 85 / 0.08), 0 20px 60px #00000060",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl overflow-hidden shrink-0"
                  style={{ boxShadow: "0 0 12px oklch(0.82 0.14 85 / 0.2)" }}
                >
                  <Image
                    src="/images/logo.png"
                    alt="Vodun Days"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Vodun Days</p>
                  <p className="text-xs text-white/55 leading-snug mt-0.5">
                    Programme, carte et contenus<br />accessibles hors ligne
                  </p>
                </div>
              </div>

              <button
                onClick={dismiss}
                className="text-white/30 hover:text-white/60 transition-colors p-1 -mt-0.5 -mr-0.5 shrink-0"
                aria-label="Fermer"
              >
                <X size={15} />
              </button>
            </div>

            <div
              className="mt-3 mb-4 h-px w-full"
              style={{ background: "oklch(0.82 0.14 85 / 0.08)" }}
            />

            {ios ? (
              <button
                onClick={() => setShowGuide(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{ background: "oklch(0.82 0.14 85)", color: "#0a0a0a" }}
              >
                <Share2 size={14} />
                Voir comment installer
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-white/35 leading-tight max-w-40">
                  Installe l'app pour une meilleure expérience
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={dismiss}
                    className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    Plus tard
                  </button>
                  <button
                    onClick={install}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full transition-all hover:brightness-110 active:scale-95"
                    style={{
                      background: "oklch(0.82 0.14 85)",
                      color: "#0a0a0a",
                    }}
                  >
                    Installer
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
