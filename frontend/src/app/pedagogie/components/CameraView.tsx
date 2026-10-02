"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, VideoOff } from "lucide-react";
import { ImageTargetOverlay, type ScreenRect } from "./ImageTargetOverlay";

type CameraState = "idle" | "loading" | "active" | "denied" | "unavailable";

interface CameraViewProps {
  onBack: () => void;
}

// Cibles Image Target 8th Wall - generees via npx @8thwall/image-target-cli
// imagePath pointe vers l'image luminance (traitee pour la detection),
// deposee a ce chemin exact dans public/8thwall/image-targets/
const IMAGE_TARGETS = [
  { imagePath: "/8thwall/image-targets/lissa_luminance.jpg", name: "lissa", isRotated: true },
  { imagePath: "/8thwall/image-targets/aziza_luminance.jpg", name: "aziza", isRotated: false },
];

declare global {
  interface Window {
    XR8: any;
    XRExtras: any;
  }
}

export function CameraView({ onBack }: CameraViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [targetRect, setTargetRect] = useState<ScreenRect | null>(null);

  // Ref pour la transform courante de la cible suivie, mise a jour par les
  // evenements 8th Wall et lue par la boucle de projection ecran
  const trackedTransformRef = useRef<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scaledWidth: number;
    scaledHeight: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    let xr8Started = false;
    let rafId: number | null = null;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Echec chargement ${src}`));
        document.head.appendChild(script);
      });
    }

    // Projette la position 3D de la cible suivie vers des coordonnees ecran
    // (px) pour positionner l'overlay HTML. Necessite la camera Three.js
    // active du pipeline XR8 - a verifier/ajuster contre l'API reelle du
    // build self-hoste (nom exact d'acces a la scene/camera XR8.Threejs)
    function projectTrackedTargetToScreen() {
      const transform = trackedTransformRef.current;
      const canvas = canvasRef.current;
      if (!transform || !canvas || !window.XR8?.Threejs) {
        rafId = requestAnimationFrame(projectTrackedTargetToScreen);
        return;
      }

      try {
        const { camera } = window.XR8.Threejs.xrScene();
        const THREE = window.XR8.Threejs.THREE ?? (window as any).THREE;

        // Dimensions reelles de la cible dans la scene, fournies par 8th
        // Wall (imagefound.detail.scaledWidth/scaledHeight pour type FLAT)
        const halfWidth = transform.scaledWidth / 2;
        const halfHeight = transform.scaledHeight / 2;

        const left = new THREE.Vector3(
          transform.position.x - halfWidth,
          transform.position.y,
          transform.position.z
        ).project(camera);
        const right = new THREE.Vector3(
          transform.position.x + halfWidth,
          transform.position.y,
          transform.position.z
        ).project(camera);
        const top = new THREE.Vector3(
          transform.position.x,
          transform.position.y + halfHeight,
          transform.position.z
        ).project(camera);
        const bottom = new THREE.Vector3(
          transform.position.x,
          transform.position.y - halfHeight,
          transform.position.z
        ).project(camera);

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const toPx = (v: { x: number; y: number }) => ({
          x: ((v.x + 1) / 2) * w,
          y: ((1 - v.y) / 2) * h,
        });

        const l = toPx(left).x;
        const r = toPx(right).x;
        const t = toPx(top).y;
        const b = toPx(bottom).y;

        if (mounted) {
          setTargetRect({
            x: Math.min(l, r),
            y: Math.min(t, b),
            width: Math.abs(r - l),
            height: Math.abs(b - t),
          });
        }
      } catch {
        // Camera ou scene pas encore prete - on reessaie a la frame suivante
      }

      rafId = requestAnimationFrame(projectTrackedTargetToScreen);
    }

    // Module gerant les evenements de detection d'Image Target
    function imageTargetPipelineModule() {
      return {
        name: "image-target-handler",
        onStart: () => {
          if (mounted) setCameraState("active");
        },
        listeners: [
          {
            event: "reality.imagefound",
            process: (event: any) => {
              if (!mounted) return;
              const { name, position, rotation, scaledWidth, scaledHeight } = event.detail;
              trackedTransformRef.current = { position, rotation, scaledWidth, scaledHeight };
              setActiveTarget(name);
            },
          },
          {
            event: "reality.imageupdated",
            process: (event: any) => {
              const { position, rotation, scaledWidth, scaledHeight } = event.detail;
              trackedTransformRef.current = { position, rotation, scaledWidth, scaledHeight };
            },
          },
          {
            event: "reality.imagelost",
            process: () => {
              if (!mounted) return;
              trackedTransformRef.current = null;
              setActiveTarget(null);
              setTargetRect(null);
            },
          },
        ],
      };
    }

    async function initXR8() {
      if (mounted) setCameraState("loading");

      try {
        // Self-hosting confirme contre un projet officiel genere par 8th
        // Wall Desktop (ex. "Image Targets") :
        // - runtime.js = XRExtras, deja self-hoste dans ce type de projet
        // - xr.js = XR8 (moteur principal), a copier depuis
        //   node_modules/@8thwall/engine-binary/dist/xr.js vers
        //   public/8thwall/ pour un self-hosting complet (sinon laisser
        //   l'URL jsdelivr ci-dessous, aucun appKey requis dans les deux cas)
        await loadScript("/8thwall/runtime.js");
        await loadScript("/8thwall/xr.js");
        // Variante CDN (pas de self-hosting complet mais pas de compte 8th
        // Wall requis non plus) :
        // await loadScript("https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js");

        if (!mounted) return;

        const { XR8, XRExtras } = window;

        XR8.addCameraPipelineModules([
          XR8.GlTextureRenderer.pipelineModule(),
          XR8.Threejs.pipelineModule(),
          XR8.XrController.pipelineModule(),
          XRExtras.FullWindowCanvas.pipelineModule(),
          XRExtras.Loading.pipelineModule(),
          XRExtras.RuntimeError.pipelineModule(),
          imageTargetPipelineModule(),
        ]);

        // SLAM desactive : uniquement du tracking d'image ici. imageTargetData
        // definit les cibles directement depuis le code (imagePath/name/isRotated),
        // genere par l'Image Target Processor - verifie contre doc 8thwall.org
        XR8.XrController.configure({
          disableWorldTracking: true,
          imageTargetData: IMAGE_TARGETS,
        });

        XR8.run({ canvas: canvasRef.current });
        xr8Started = true;

        rafId = requestAnimationFrame(projectTrackedTargetToScreen);
      } catch (err) {
        if (!mounted) return;
        const message = String((err as Error)?.message ?? err ?? "").toLowerCase();
        setCameraState(
          message.includes("denied") || message.includes("permission")
            ? "denied"
            : "unavailable"
        );
      }
    }

    initXR8();

    return () => {
      mounted = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      // Arret propre du pipeline XR8 - la camera ne doit jamais rester
      // active en arriere-plan apres demontage du composant
      if (xr8Started && window.XR8) {
        try {
          window.XR8.stop();
        } catch {
          // XR8 deja arrete ou jamais demarre correctement
        }
      }
    };
  }, []);

  const isLoading = cameraState === "idle" || cameraState === "loading";

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Canvas controle directement par XR8 (camera + rendu Three.js) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Contour flouté progressif + texte mot par mot sur cible detectee */}
      <ImageTargetOverlay targetName={activeTarget} rect={targetRect} />

      {cameraState !== "active" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-vd-page-bg gap-5 px-8 text-center">
          {isLoading && (
            <>
              <Camera
                className="w-10 h-10 text-[#F56E0F] animate-pulse"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-white/60">
                Activation du tracking AR...
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

      {cameraState === "active" && !activeTarget && (
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