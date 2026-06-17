"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VODUN_VIDEO_URL = "/videos/vodun-days-bg.mp4";

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

    // Coupe l'autoplay immediatement pour laisser le scroll controller seul maitre
    video.pause();
    video.currentTime = 0;

    let videoScrollTrigger: ScrollTrigger | null = null;

    const initScrollTrigger = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      const duration = video.duration;

      // Valeur scrub elevee = mouvement plus fluide
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
    };

    video.addEventListener("loadedmetadata", initScrollTrigger);

    if (video.readyState >= 1 && video.duration) {
      initScrollTrigger();
    }

    return () => {
      video.removeEventListener("loadedmetadata", initScrollTrigger);
      videoScrollTrigger?.kill();
    };
  }, [scrollHeight]);

  return (
    <div ref={containerRef} className={`fixed inset-0 z-0 md:hidden ${className}`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/images/vodundays-1.jpg"
      >
        <source src={VODUN_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
