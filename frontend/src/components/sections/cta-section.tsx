"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { GlassSurface } from "@/components/glass-surface";
import { ArrowRight, Download } from "lucide-react";
import { MobileGateModal } from "@/components/mobile-gate-modal";
import { useMobileGate } from "@/hooks/use-mobile-gate";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const t = useTranslations("home.cta");
  const sectionRef = useRef<HTMLElement>(null);
  const { gateState, intercept, closeGate } = useMobileGate();
  const { canInstall, isIOS, install } = useInstallPrompt();
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <MobileGateModal
        isOpen={gateState.isOpen}
        onClose={closeGate}
        targetUrl={gateState.targetUrl}
        pageLabel={gateState.pageLabel}
      />

      <section
        ref={sectionRef}
        className="relative bg-background px-6 py-24 md:py-32"
      >
        <div className="cta-content mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("titleLine1")}
            <br />
            <span className="text-muted-foreground/60">{t("titleLine2")}</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
            {t("subtitle")}
          </p>

          {/* Largeur fixe identique (w-48) sur tous les breakpoints pour que les deux boutons restent parfaitement alignés */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/transition/programme"
              onClick={(e) => intercept(e, "/transition/programme", "le Programme")}
            >
              <Button
                size="lg"
                className="group h-12 w-48 rounded-full bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("start")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {canInstall && (
              <div className="relative">
                <button
                  type="button"
                  onClick={isIOS ? () => setShowIOSHint((v) => !v) : install}
                  className="block appearance-none border-0 bg-transparent p-0"
                >
                  <GlassSurface
                    width={192}
                    height={48}
                    borderRadius={9999}
                    displace={0.5}
                    distortionScale={-180}
                    redOffset={0}
                    greenOffset={10}
                    blueOffset={20}
                    brightness={50}
                    className="transition-transform hover:scale-105"
                  >
                    <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <Download className="h-4 w-4" />
                      {t("install")}
                    </span>
                  </GlassSurface>
                </button>
                {isIOS && showIOSHint && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border/60 bg-card/95 backdrop-blur px-4 py-3 text-sm text-muted-foreground text-center shadow-lg">
                    {t("iosHint.prefix")}{" "}
                    <span className="font-medium text-foreground">{t("iosHint.share")}</span>{" "}
                    {t("iosHint.middle")}{" "}
                    <span className="font-medium text-foreground">{t("iosHint.addHome")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}