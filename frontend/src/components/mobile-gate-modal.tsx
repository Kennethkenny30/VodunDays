"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Smartphone, QrCode } from "lucide-react";
import { GlassSurface } from "@/components/glass-surface";

interface MobileGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  pageLabel?: string;
}

function buildQrUrl(url: string) {
  const encoded = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0d0d0d&color=ffffff&qzone=2&data=${encoded}`;
}

export function MobileGateModal({
  isOpen,
  onClose,
  targetUrl,
  pageLabel = "cette page",
}: MobileGateModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const absoluteUrl =
    typeof window !== "undefined"
      ? targetUrl.startsWith("http")
        ? targetUrl
        : `${window.location.origin}${targetUrl}`
      : targetUrl;

  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.05 }
      );
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!overlayRef.current || !cardRef.current) return;
    gsap.to(cardRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.25, ease: "power2.in" });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.1,
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassSurface
          borderRadius={24}
          displace={0.6}
          distortionScale={-200}
          redOffset={0}
          greenOffset={12}
          blueOffset={25}
          brightness={20}
          className="w-full"
        >
          {/* Accent gradient top */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[var(--vd-gold)]/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>

          <div className="p-8 pt-10">
            {/* Icon */}
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--vd-gold)]/20 bg-[var(--vd-gold)]/10">
                <Smartphone className="h-7 w-7 text-[var(--vd-gold)]" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-white">
              Expérience Mobile Uniquement
            </h2>

            {/* Body */}
            <p className="mb-8 text-center text-sm leading-relaxed text-white/50">
              {`La page `}
              <span className="text-white/80">{pageLabel}</span>
              {` est optimisée pour les écrans mobiles et tablettes. Scannez le QR code pour l'ouvrir directement sur votre téléphone.`}
            </p>

            {/* QR Code */}
            <div className="mx-auto mb-6 flex w-fit flex-col items-center gap-3">
              <div className="overflow-hidden rounded-2xl border border-white/10 p-2 bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildQrUrl(absoluteUrl)}
                  alt={`QR code vers ${pageLabel}`}
                  width={180}
                  height={180}
                  className="block rounded-xl"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <QrCode size={11} />
                <span>Scannez avec votre appareil photo</span>
              </div>
            </div>

            {/* URL display */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-center">
              <p className="truncate text-xs font-mono text-white/30">{absoluteUrl}</p>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </GlassSurface>
      </div>
    </div>
  );
}