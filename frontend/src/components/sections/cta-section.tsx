"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { MobileGateModal } from "@/components/mobile-gate-modal";
import { useMobileGate } from "@/hooks/use-mobile-gate";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { gateState, intercept, closeGate } = useMobileGate();
  const { canInstall, isIOS, install } = useInstallPrompt();
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
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

    <section ref={sectionRef} className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="cta-content rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center md:p-16">
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">
              Prêt à Vivre l{"'"}Expérience{" "}
              <span className="text-primary">Vodun Days</span> ?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
            Téléchargez notre application et accédez à toutes les informations
            pour profiter pleinement du festival.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/transition/programme"
              onClick={(e) => intercept(e, "/transition/programme", "le Programme")}
            >
              <Button
                size="lg"
                className="group bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
              >
                Commencer
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {canInstall && (
              <div className="relative">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/20 bg-transparent px-8 py-6 text-lg font-semibold text-foreground hover:bg-foreground/10"
                  onClick={isIOS ? () => setShowIOSHint((v) => !v) : install}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Installer
                </Button>
                {isIOS && showIOSHint && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-border/60 bg-card/95 backdrop-blur px-4 py-3 text-sm text-muted-foreground text-center shadow-lg">
                    Sur Safari : appuyer sur{" "}
                    <span className="font-medium text-foreground">Partager</span>{" "}
                    puis{" "}
                    <span className="font-medium text-foreground">Sur l{"'"}écran d{"'"}accueil</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
