"use client";

import { useState, useCallback } from "react";

interface MobileGateState {
  isOpen: boolean;
  targetUrl: string;
  pageLabel: string;
}

/**
 * Hook pour intercepter la navigation vers des pages mobile-only.
 * Sur desktop (≥ 768px), ouvre la modale avec QR code au lieu de naviguer.
 * Sur mobile/tablette, laisse passer la navigation normalement.
 */
export function useMobileGate() {
  const [state, setState] = useState<MobileGateState>({
    isOpen: false,
    targetUrl: "",
    pageLabel: "",
  });

  const intercept = useCallback(
    (e: React.MouseEvent, targetUrl: string, pageLabel: string) => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        e.preventDefault();
        setState({ isOpen: true, targetUrl, pageLabel });
      }
      // Sur mobile : navigation normale, on ne fait rien
    },
    []
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { gateState: state, intercept, closeGate: close };
}
