"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, VideoOff } from "lucide-react";

type CameraState = "idle" | "requesting" | "active" | "denied" | "unavailable";

interface CameraViewProps {
  onBack: () => void;
}

export function CameraView({ onBack }: CameraViewProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      // getUserMedia absent sur iOS en contexte non sécurisé ou navigateurs anciens
      if (!navigator?.mediaDevices?.getUserMedia) {
        if (mounted) setCameraState("unavailable");
        return;
      }

      if (mounted) setCameraState("requesting");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width:  { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        // Composant démonté pendant l'attente de permission - libérer aussitôt
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraState("active");
      } catch (err) {
        if (!mounted) return;
        const name = err instanceof Error ? err.name : "";
        setCameraState(
          name === "NotAllowedError" || name === "PermissionDeniedError"
            ? "denied"
            : "unavailable"
        );
      }
    }

    startCamera();

    return () => {
      mounted = false;
      // Arrêt de tous les tracks - la caméra ne doit jamais rester active en arrière-plan
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const isLoading = cameraState === "idle" || cameraState === "requesting";

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Flux vidéo de la caméra arrière - playsInline requis sur iOS Safari */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* TODO: intégration AR.js + GPS - placement des marqueurs aux coordonnées des sites culturels */}

      {/* Ecrans d'état (chargement, erreur) */}
      {cameraState !== "active" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-vd-page-bg gap-5 px-8 text-center">
          {isLoading && (
            <>
              <Camera
                className="w-10 h-10 text-[#F56E0F] animate-pulse"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-white/60">
                Activation de la caméra...
              </p>
            </>
          )}

          {cameraState === "denied" && (
            <>
              <AlertCircle className="w-10 h-10 text-[#F56E0F]" strokeWidth={1.5} />
              <div>
                <p className="text-[15px] font-semibold text-white mb-1">
                  Accès refusé
                </p>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  Autorisez l'accès à la caméra dans les réglages de votre
                  appareil, puis revenez sur cette page.
                </p>
              </div>
              <button
                onClick={onBack}
                className="mt-1 px-5 py-2.5 rounded-full bg-[#F56E0F] text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
              >
                Retour au contenu
              </button>
            </>
          )}

          {cameraState === "unavailable" && (
            <>
              <VideoOff className="w-10 h-10 text-[#F56E0F]" strokeWidth={1.5} />
              <div>
                <p className="text-[15px] font-semibold text-white mb-1">
                  Caméra indisponible
                </p>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  La caméra n'est pas accessible sur cet appareil ou navigateur.
                </p>
              </div>
              <button
                onClick={onBack}
                className="mt-1 px-5 py-2.5 rounded-full bg-[#F56E0F] text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
              >
                Retour au contenu
              </button>
            </>
          )}
        </div>
      )}

      {/* Indicateur "prêt" quand la caméra est active */}
      {cameraState === "active" && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none">
          <div className="px-4 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/15">
            <p className="text-[12px] text-white/70 font-medium tracking-wide">
              Prêt à explorer
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
