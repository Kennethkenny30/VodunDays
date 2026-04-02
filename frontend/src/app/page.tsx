import { Header } from "@/components/header";
import { VideoScrollPlayer } from "@/components/video-scroll-player";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HighlightsSection } from "@/components/sections/highlights-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/footer";

const VIDEO_SCROLL_HEIGHT = "200vh";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Video Background with Scroll Scrubbing */}
      <VideoScrollPlayer scrollHeight={VIDEO_SCROLL_HEIGHT} />

      {/* Content Container */}
      <div className="relative z-20">
        <Header />
        
        {/* Sections with video background - needs enough height for full video playback */}
        <div className="relative" style={{ minHeight: VIDEO_SCROLL_HEIGHT }}>
          <HeroSection />
          <AboutSection />
          
        </div>

        {/* Sections without video background */}
        <div className="relative bg-background">
          
          <GallerySection />
          <FeaturesSection />
          <HighlightsSection />
          <CTASection />
          <Footer />
        </div>
      </div>
    </main>
  );
}
