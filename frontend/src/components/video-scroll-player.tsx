"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VODUN_VIDEO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQO_Qq2IkI961XZ59FGvcqRJcBDvoo2dbpJ43ly9mU-oPg74flcTIPWXDOQ4fm3QGOb-7GGjtq2PCwj1anz1EgfalgXbCGXF8b7jajDboQ-PDHrhfkSChoG6kD5UUMM1G9EEXzGBi.mp4";

interface VideoScrollPlayerProps {
  className?: string;
  scrollHeight?: string;
}

export function VideoScrollPlayer({ 
  className = "",
  scrollHeight = "500vh"
}: VideoScrollPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    let videoScrollTrigger: ScrollTrigger | null = null;
    let fadeOutTrigger: ScrollTrigger | null = null;

    const initScrollTrigger = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      
      const duration = video.duration;

      // Video scrubbing based on scroll - higher scrub value = slower/smoother
      videoScrollTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: scrollHeight + " top",
        scrub: 3,
        onUpdate: (self) => {
          if (video.readyState >= 2) {
            video.currentTime = self.progress * duration;
          }
        },
      });

      // Fade out the video container at the end
      fadeOutTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "450vh top",
        end: scrollHeight + " top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(container, { opacity: 1 - self.progress });
        },
      });
    };

    video.addEventListener("loadedmetadata", initScrollTrigger);
    
    if (video.readyState >= 1 && video.duration) {
      initScrollTrigger();
    }

    return () => {
      video.removeEventListener("loadedmetadata", initScrollTrigger);
      videoScrollTrigger?.kill();
      fadeOutTrigger?.kill();
    };
  }, [scrollHeight]);

  return (
    <div ref={containerRef} className={`fixed inset-0 z-0 md:hidden ${className}`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src={VODUN_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
