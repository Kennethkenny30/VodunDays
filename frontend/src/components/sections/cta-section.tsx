"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MobileGateModal } from "@/components/mobile-gate-modal";
import { useMobileGate } from "@/hooks/use-mobile-gate";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { gateState, intercept, closeGate } = useMobileGate();

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
              <Button
                size="lg"
                className="group bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
                onClick={(e) => intercept(e as unknown as React.MouseEvent, "/programme", "le Programme")}
              >
                Commencer
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-foreground/20 bg-transparent px-8 py-6 text-lg font-semibold text-foreground hover:bg-foreground/10"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}