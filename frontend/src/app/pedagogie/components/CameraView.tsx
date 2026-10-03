"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, VideoOff } from "lucide-react";
import * as THREE from "three";
import { ImageTargetOverlay, type ScreenRect } from "./ImageTargetOverlay";

type CameraState = "idle" | "loading" | "active" | "denied" | "unavailable";

interface CameraViewProps {
  onBack: () => void;
}

// Cibles Image Target 8th Wall - generees via npx @8thwall/image-target-cli
// Pour chaque cible, deposer dans public/8thwall/image-targets/ :
//  - <nom>.json            (metadonnees completes : type, properties, etc.)
//  - <nom>_luminance.jpg   (image traitee pour la detection)
const IMAGE_TARGET_NAMES = ["lissa", "aziza"];
const IMAGE_TARGETS_BASE = "/8thwall/image-targets";

// Le moteur exige les objets JSON complets generes par le CLI (notamment
// `properties` : left/top/width/height/originalWidth/originalHeight/isRotated).
// Un objet minimal {imagePath, name, isRotated} fait echouer silencieusement
// l'initialisation de la session : onStart n'est jamais appele.
async function loadImageTargetData(): Promise<any[]> {
  return Promise.all(
    IMAGE_TARGET_NAMES.map(async (name) => {
      const url = `${IMAGE_TARGETS_BASE}/${name}.json`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Image target introuvable : ${url} (${res.status})`);
      }
      const json = await res.json();
      // imagePath doit etre une URL resolvable depuis la page
      return { ...json, name, imagePath: `${IMAGE_TARGETS_BASE}/${name}_luminance.jpg` };
    })
  );
}

declare global {
  interface Window {
    XR8: any;
    XRExtras: any;
  }
}

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

// Singleton au niveau module - charge runtime.js/xr.js et attend xrloaded
// UNE SEULE FOIS pour toute la duree de vie de la page. Partage entre tous
// les montages/demontages du composant : indispensable en dev avec React
// Strict Mode, qui invoque useEffect deux fois (montage -> nettoyage ->
// remontage) et casserait un chargement de script non partage, car le
// deuxieme passage retrouverait les balises <script> deja presentes dans le
// DOM (resolution instantanee sans vrai rechargement) sans garantie que
// window.XR8.XrController soit deja peuple a ce moment precis.
let xr8ReadyPromise: Promise<void> | null = null;

function ensureXR8Ready(): Promise<void> {
  if (!xr8ReadyPromise) {
    xr8ReadyPromise = (async () => {
      // Self-hosting : xr.js/runtime.js copies depuis
      // node_modules/@8thwall/engine-binary/dist/ vers public/8thwall/
      await loadScript("/8thwall/runtime.js");
      await loadScript("/8thwall/xr.js");

      // window.XR8 n'est assigne par le moteur qu'au moment de xrloaded -
      // il faut attendre cet evenement avant de referencer ses sous-modules
      await new Promise<void>((resolve) => {
        if (window.XR8) {
          resolve();
        } else {
          window.addEventListener("xrloaded", () => resolve(), { once: true });
        }
      });

      // Le moteur self-hosted laisse XR8.XrController a null tant que le
      // chunk "slam" (xr-slam.js, dans public/8thwall/) n'est pas charge.
      // xrloaded se declenche AVANT, donc on le charge explicitement ici.
      // Requis aussi pour les Image Targets, meme avec disableWorldTracking
      if (!window.XR8.XrController) {
        await window.XR8.loadChunk("slam");
      }
    })();

    // Si le chargement echoue, on autorise une nouvelle tentative au
    // prochain montage au lieu de conserver une promesse rejetee
    xr8ReadyPromise.catch(() => {
      xr8ReadyPromise = null;
    });
  }
  return xr8ReadyPromise;
}

// Dimensionne le buffer du canvas sur celui de son conteneur React.
// Remplace XR8.FullWindowCanvas, qui deplace le canvas dans <body>
// (document.body.appendChild) : il sort alors du conteneur du composant,
// peut passer derriere l'UI de la page et reste orphelin apres demontage.
function containerCanvasPipelineModule() {
  let canvas: HTMLCanvasElement | null = null;

  const resize = () => {
    if (!canvas) return;
    canvas.width = canvas.clientWidth || window.innerWidth;
    canvas.height = canvas.clientHeight || window.innerHeight;
  };

  return {
    name: "container-canvas",
    onAttach: ({ canvas: attached }: { canvas: HTMLCanvasElement }) => {
      canvas = attached;
      resize();
    },
    onDetach: () => {
      canvas = null;
    },
    onDeviceOrientationChange: () => {
      requestAnimationFrame(resize);
    },
  };
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
    let pipelineRegistered = false;
    let rafId: number | null = null;

    // Projette la position 3D de la cible suivie vers des coordonnees ecran
    // (px) pour positionner l'overlay HTML
    function projectTrackedTargetToScreen() {
      const transform = trackedTransformRef.current;
      const canvas = canvasRef.current;
      if (!transform || !canvas || !window.XR8?.Threejs) {
        rafId = requestAnimationFrame(projectTrackedTargetToScreen);
        return;
      }

      try {
        const { camera } = window.XR8.Threejs.xrScene();

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
        onException: (error: unknown) => {
          console.error("[AR] Exception pipeline XR8 :", error);
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
              if (!mounted) return;
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
        // Chargement des scripts partage (singleton) - voir ensureXR8Ready.
        // En dev avec Strict Mode, les deux invocations de l'effet attendent
        // la MEME promesse, pas de double chargement ni de course
        await ensureXR8Ready();

        // Donnees completes des cibles (JSON du CLI) - echec explicite si absentes
        const imageTargetData = await loadImageTargetData();

        if (!mounted) return;

        const { XR8 } = window;

        // XR8.Threejs.pipelineModule() exige window.THREE deja present -
        // le moteur ne l'embarque pas, c'est a l'app de le fournir
        (window as any).THREE = THREE;

        // Enregistrement du pipeline PAR MONTAGE REEL (pas de singleton ici,
        // contrairement au chargement des scripts) : chaque montage du
        // composant (ex. bascule Contenu/Realite AR) doit reconfigurer son
        // propre pipeline proprement, et le nettoyage ci-dessous le retire
        // a chaque demontage via clearCameraPipelineModules.
        // XRExtras n'est pas fourni par le binaire self-hosted : le canvas est
        // dimensionne par containerCanvasPipelineModule (reste dans son
        // conteneur), et Loading/RuntimeError sont geres par l'UI React
        XR8.addCameraPipelineModules([
          containerCanvasPipelineModule(),
          XR8.GlTextureRenderer.pipelineModule(),
          XR8.Threejs.pipelineModule(),
          XR8.XrController.pipelineModule(),
          imageTargetPipelineModule(),
        ]);
        pipelineRegistered = true;

        // SLAM desactive : uniquement du tracking d'image ici. imageTargetData
        // definit les cibles directement depuis le code (imagePath/name/isRotated)
        XR8.XrController.configure({
          disableWorldTracking: true,
          imageTargetData,
        });

        XR8.run({ canvas: canvasRef.current });

        rafId = requestAnimationFrame(projectTrackedTargetToScreen);
      } catch (err) {
        // Erreur reelle affichee en clair - indispensable pour diagnostiquer,
        // le message utilisateur generique ne doit jamais etre la seule trace
        console.error("[AR] Echec initialisation XR8 :", err);
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

      // Nettoyage systematique du pipeline de CE montage, pour que le
      // prochain montage reel reparte propre (bascule AR on/off repetee,
      // ou double-invocation de l'effet en dev Strict Mode)
      if (pipelineRegistered && window.XR8) {
        try {
          window.XR8.clearCameraPipelineModules();
          window.XR8.stop();
        } catch {
          // XR8 deja arrete ou pipeline deja vide
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