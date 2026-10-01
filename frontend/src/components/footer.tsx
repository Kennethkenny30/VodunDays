import { LegalAccordion } from "@/components/legal-accordion";
import { VideoText } from "@/components/ui/video-text";

export function Footer() {
  return (
    <footer className="relative w-full">

      {/* Wordmark géant */}
      <div className="relative h-[13vw] min-h-[72px] w-full select-none">
        <VideoText
          src="/videos/vd-footer.mp4"
          fontSize={14}
          fontWeight={900}
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          textLength="94%"
          maskClassName="bg-[var(--vd-gold)]/25"
        >
          VODUNDAYS
        </VideoText>
      </div>

      {/* Barre légale (en bas) */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-[11px] text-muted-foreground/40">
          &copy; {new Date().getFullYear()} Kondo Technologie. Tous droits réservés.
        </p>
        <LegalAccordion />
      </div>
    </footer>
  );
}