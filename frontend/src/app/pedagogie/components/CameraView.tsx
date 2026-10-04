"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, VideoOff } from "lucide-react";
import * as THREE from "three";
import { ImageTargetOverlay, type TargetCorners } from "./ImageTargetOverlay";

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
      // Requis aussi pour les Image Targets, meme avec disableWorldTracking.
      // Timeout explicite : si xr-slam.js est absent/bloque, loadChunk peut
      // ne jamais resoudre ni rejeter - sans ce garde-fou, initXR8 reste
      // bloque indefiniment sur "Activation du tracking AR..." sans la
      // moindre erreur en console, impossible a diagnostiquer autrement.
      if (!window.XR8.XrController) {
        await Promise.race([
          window.XR8.loadChunk("slam"),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout chargement chunk slam (xr-slam.js) - verifier qu'il est deploye dans public/8thwall/")),
              8000
            )
          ),
        ]);
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

// window.XRExtras est undefined dans ce build self-hoste, donc
// FullWindowCanvas est inutilisable. Ce module dimensionne le buffer du canvas
// (canvas.width/height) sur la taille du CONTENEUR React.
//
// Deux pieges a eviter :
// 1) Le cycle de vie 8th Wall est onStart -> onAttach : XR8.Threejs cree son
//    renderer dans onStart et appelle renderer.setSize(canvas.width,
//    canvas.height). Si le buffer vaut encore 300x150 (defaut du canvas) a ce
//    moment, three ecrit style.width/height = 300px/150px en inline.
//    => le canvas doit etre dimensionne AVANT XR8.run() (voir initXR8) et des
//    onStart, pas seulement dans onAttach.
// 2) On ne mesure jamais le canvas lui-meme : son clientWidth/clientHeight
//    refletent le style inline pose par three (boucle auto-referente qui
//    fige la taille). On mesure le conteneur, stable et independant.
// Delai avant de considerer une cible comme perdue : le suivi decroche souvent
// une fraction de seconde (mouvement, reflet). Evite de defaire le flou et de
// relancer la narration a chaque micro-perte.
const LOST_GRACE_MS = 1500;

function sizeCanvasToContainer(canvas: HTMLCanvasElement, container: HTMLElement) {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function containerCanvasPipelineModule(container: HTMLElement) {
  let canvas: HTMLCanvasElement | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const resize = () => {
    if (canvas) sizeCanvasToContainer(canvas, container);
  };

  // Un module ne doit JAMAIS lever d'exception dans onStart/onAttach : le
  // moteur interromprait son demarrage sans rien afficher (ecran bloque sur
  // "Activation du tracking AR..."). Garde + try/catch + log explicite.
  const attach = (attached: HTMLCanvasElement | undefined, phase: string) => {
    try {
      if (!attached) return;
      canvas = attached;
      resize();
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);
      }
    } catch (err) {
      console.error(`[AR] container-canvas ${phase} a echoue :`, err);
    }
  };

  return {
    name: "container-canvas",
    onStart: (args: { canvas?: HTMLCanvasElement }) => attach(args?.canvas, "onStart"),
    onAttach: (args: { canvas?: HTMLCanvasElement }) => attach(args?.canvas, "onAttach"),
    onDetach: () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      canvas = null;
    },
    onDeviceOrientationChange: () => {
      requestAnimationFrame(resize);
    },
  };
}

export function CameraView({ onBack }: CameraViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  // Ref pour la transform courante de la cible suivie, mise a jour par les
  // evenements 8th Wall et lue par la boucle de projection ecran
  const trackedTransformRef = useRef<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: number;
    scaledWidth: number;
    scaledHeight: number;
  } | null>(null);

  // Nom de la cible actuellement suivie : les evenements des autres cibles
  // sont ignores (sinon deux cibles visibles se melangeraient dans la ref)
  const trackedNameRef = useRef<string | null>(null);

  // 4 coins de la cible projetes a l'ecran, ecrits a chaque frame et lus
  // directement par l'overlay (aucun setState par frame)
  const cornersRef = useRef<TargetCorners | null>(null);

  const lostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    let pipelineRegistered = false;
    let rafId: number | null = null;

    // Vecteurs reutilises pour ne pas allouer a chaque frame
    const cornerVec = new THREE.Vector3();
    const rotationQuat = new THREE.Quaternion();

    // Projette les 4 coins de la cible vers des coordonnees ecran (px).
    // Dimensions reelles = scaledWidth/scaledHeight (normalisees) x scale, puis
    // coins orientes par la rotation de la cible (plan de l'image = XY local)
    // et deplaces a sa position : le contour suit donc la perspective.
    function projectTrackedTargetToScreen() {
      const transform = trackedTransformRef.current;
      const canvas = canvasRef.current;
      if (!transform || !canvas || !window.XR8?.Threejs) {
        rafId = requestAnimationFrame(projectTrackedTargetToScreen);
        return;
      }

      try {
        const { camera } = window.XR8.Threejs.xrScene();

        const scale = transform.scale || 1;
        const halfWidth = (transform.scaledWidth * scale) / 2;
        const halfHeight = (transform.scaledHeight * scale) / 2;
        const { rotation, position } = transform;
        rotationQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        let behindCamera = false;

        const project = (signX: number, signY: number) => {
          cornerVec
            .set(signX * halfWidth, signY * halfHeight, 0)
            .applyQuaternion(rotationQuat);
          cornerVec.x += position.x;
          cornerVec.y += position.y;
          cornerVec.z += position.z;
          cornerVec.project(camera);
          if (cornerVec.z > 1) behindCamera = true;
          return {
            x: ((cornerVec.x + 1) / 2) * w,
            y: ((1 - cornerVec.y) / 2) * h,
          };
        };

        const corners: TargetCorners = [
          project(-1, 1), // haut-gauche
          project(1, 1), // haut-droit
          project(1, -1), // bas-droit
          project(-1, -1), // bas-gauche
        ];

        // Coin derriere la camera : projection incoherente, on garde la
        // derniere position valide
        if (!behindCamera) cornersRef.current = corners;
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
              const { name, position, rotation, scale, scaledWidth, scaledHeight } =
                event.detail;

              // Cible retrouvee pendant le delai de grace : on annule la perte
              if (lostTimerRef.current) {
                clearTimeout(lostTimerRef.current);
                lostTimerRef.current = null;
              }

              trackedNameRef.current = name;
              trackedTransformRef.current = {
                position,
                rotation,
                scale,
                scaledWidth,
                scaledHeight,
              };
              setActiveTarget(name);
            },
          },
          {
            event: "reality.imageupdated",
            process: (event: any) => {
              if (!mounted) return;
              const { name, position, rotation, scale, scaledWidth, scaledHeight } =
                event.detail;
              if (name !== trackedNameRef.current) return;
              trackedTransformRef.current = {
                position,
                rotation,
                scale,
                scaledWidth,
                scaledHeight,
              };
            },
          },
          {
            event: "reality.imagelost",
            process: (event: any) => {
              if (!mounted) return;
              if (event.detail?.name !== trackedNameRef.current) return;

              // Delai de grace : on garde la derniere pose (le flou et le
              // texte restent en place) avant de conclure que la cible a
              // vraiment disparu
              if (lostTimerRef.current) clearTimeout(lostTimerRef.current);
              lostTimerRef.current = setTimeout(() => {
                lostTimerRef.current = null;
                trackedNameRef.current = null;
                trackedTransformRef.current = null;
                cornersRef.current = null;
                if (mounted) setActiveTarget(null);
              }, LOST_GRACE_MS);
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
        // XRExtras indisponible dans ce build self-hoste (voir note plus
        // haut) - containerCanvasPipelineModule gere le dimensionnement
        const canvasEl = canvasRef.current;
        const containerEl = containerRef.current;
        if (!canvasEl || !containerEl) throw new Error("Canvas AR introuvable");

        XR8.addCameraPipelineModules([
          containerCanvasPipelineModule(containerEl),
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

        // Buffer dimensionne AVANT le run : XR8.Threejs lit canvas.width/height
        // dans onStart pour creer son renderer
        sizeCanvasToContainer(canvasEl, containerEl);

        XR8.run({ canvas: canvasEl });

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
      if (lostTimerRef.current) {
        clearTimeout(lostTimerRef.current);
        lostTimerRef.current = null;
      }

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
    <div ref={containerRef} className="absolute inset-0 bg-black overflow-hidden">
      {/* Canvas controle directement par XR8 (camera + rendu Three.js) */}
      {/* w-full!/h-full! (important) : three.js ecrit style.width/height en px
          inline via renderer.setSize - sans !important le canvas resterait fige
          a cette taille au lieu de remplir le conteneur */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full! h-full!" />

      {/* Flou progressif hors cible + texte machine a ecrire sur cible detectee */}
      <ImageTargetOverlay targetName={activeTarget} cornersRef={cornersRef} />

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