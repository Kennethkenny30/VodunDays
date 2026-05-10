"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { GlassSurface } from "@/components/glass-surface";
import { MobileGateModal } from "@/components/mobile-gate-modal";
import { useMobileGate } from "@/hooks/use-mobile-gate";

const LOGO_URL = "/images/logo.png";

const navItems = [
  { label: "Programme", href: "#programme" },
  { label: "Lieux", href: "#lieux" },
  { label: "Culture", href: "#culture" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { gateState, intercept, closeGate } = useMobileGate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileGateModal
        isOpen={gateState.isOpen}
        onClose={closeGate}
        targetUrl={gateState.targetUrl}
        pageLabel={gateState.pageLabel}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-sm" : ""
        }`}
      >
        {/* Desktop Glass Navbar */}
        <div className="mx-auto hidden max-w-5xl md:block">
          <GlassSurface
            borderRadius={50}
            displace={0.4}
            distortionScale={-150}
            greenOffset={8}
            blueOffset={15}
            brightness={30}
            className="w-full"
          >
            <div className="flex w-full items-center justify-between px-8 py-3">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={LOGO_URL}
                  alt="Vodun Days"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </Link>

              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-medium tracking-wide text-foreground/90 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  href="/connexion"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Connexion
                </Link>
                <Link
                  href="/programme"
                  onClick={(e) => intercept(e, "/programme", "le Programme")}
                >
                  <GlassSurface
                    borderRadius={25}
                    brightness={50}
                    displace={0.3}
                    className="px-4 py-2 transition-transform hover:scale-105"
                  >
                    <span className="text-sm font-semibold text-foreground">Découvrir</span>
                  </GlassSurface>
                </Link>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Mobile Glass Navbar */}
        <div className="mx-auto md:hidden">
          <GlassSurface
            borderRadius={30}
            displace={0.4}
            distortionScale={-150}
            greenOffset={8}
            blueOffset={15}
            brightness={30}
            className="w-full"
          >
            <div className="flex w-full items-center justify-between px-4 py-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={LOGO_URL}
                  alt="Vodun Days"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </Link>
              <button
                type="button"
                className="text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </GlassSurface>

          {isMobileMenuOpen && (
            <div className="mt-2">
              <GlassSurface
                borderRadius={20}
                displace={0.3}
                brightness={25}
                className="w-full"
              >
                <div className="flex flex-col gap-1 p-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-foreground/90 transition-colors hover:bg-foreground/5 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-2">
                    <Link
                      href="/connexion"
                      className="rounded-lg px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-foreground/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/programme"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GlassSurface
                        borderRadius={10}
                        brightness={50}
                        className="mx-2 py-2 text-center transition-transform hover:scale-[1.02]"
                      >
                        <span className="text-xs font-semibold text-foreground">Découvrir</span>
                      </GlassSurface>
                    </Link>
                  </div>
                </div>
              </GlassSurface>
            </div>
          )}
        </div>
      </header>
    </>
  );
}