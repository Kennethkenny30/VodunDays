"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

// Contenu culturel associe a chaque cible - a valider/enrichir par l'equipe
// contenu avant mise en production, ceci est un texte de demarrage
export const TARGET_CONTENT: Record<string, { title: string; description: string }> = {
  lissa: {
    title: "Lissa",
    description:
      "Divinite du ciel et du soleil dans le pantheon vodun fon, souvent associee a Mawu. Lissa incarne la force, la chaleur et le principe masculin createur, en complementarite avec la lune et la nuit.",
  },
  aziza: {
    title: "Aziza",
    description:
      "Esprits de la foret vivant dans les grands arbres, notamment le fromager. Les Aziza sont reputes avoir enseigne aux hommes l'usage du feu et les secrets de la medecine par les plantes.",
  },
};

export interface ScreenPoint {
  x: number;
  y: number;
}

// Les 4 coins de la cible projetes a l'ecran (px), dans l'ordre :
// haut-gauche, haut-droit, bas-droit, bas-gauche. Ecrit par CameraView a
// chaque frame, lu ici sans passer par le state React (suivi fluide).
export type TargetCorners = [ScreenPoint, ScreenPoint, ScreenPoint, ScreenPoint];

interface ImageTargetOverlayProps {
  targetName: string | null;
  cornersRef: MutableRefObject<TargetCorners | null>;
}

type Side = "below" | "above" | "dock";

// --- Flou ---
const BLUR_MAX = 14; // px
const BLUR_DURATION = 0.9; // s
const BLUR_EXIT_DURATION = 0.5; // s
const DIM_MAX = 0.38; // assombrissement du fond flou (lisibilite du texte)

// --- Machine a ecrire ---
const CHARS_PER_SECOND = 38;

// --- Placement du texte ---
const TEXT_MAX_WIDTH = 420;
const SIDE_MARGIN = 20;
const SAFE_TOP = 88; // sous le selecteur de mode Contenu / Realite AR
const SAFE_BOTTOM = 32;
const GAP = 18; // espace entre la cible et le texte
const HYSTERESIS = 24; // evite de basculer dessus/dessous en continu
const FOLLOW = 0.18; // lissage vertical du texte (0 = fige, 1 = instantane)

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Zone nette : le calque flou est plein ecran, perce d'un trou polygonal
// (regle evenodd) aux 4 coins de la cible - le trou suit la perspective
function buildHolePath(w: number, h: number, corners: TargetCorners) {
  const [a, b, c, d] = corners;
  const f = (n: number) => n.toFixed(1);
  return `path(evenodd, "M0 0H${w}V${h}H0Z M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}L${f(c.x)} ${f(c.y)}L${f(d.x)} ${f(d.y)}Z")`;
}

// Choix du cote du texte : sous la cible en priorite (lecture naturelle :
// image puis texte), sinon au-dessus, sinon ancre en bas de l'ecran avec un
// voile degrade. Hysteresis pour ne pas faire sauter le texte d'un cote a
// l'autre quand la cible bouge autour du seuil.
function pickSide(current: Side | null, above: number, below: number, need: number): Side {
  if (current === "below" && below >= need - HYSTERESIS) return "below";
  if (current === "above" && above >= need - HYSTERESIS) return "above";
  const margin = current === "dock" ? HYSTERESIS : 0;
  if (below >= need + margin) return "below";
  if (above >= need + margin) return "above";
  return "dock";
}

function Typewriter({
  text,
  start,
  instant,
}: {
  text: string;
  start: boolean;
  instant: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!start) return;

    if (instant) {
      countRef.current = text.length;
      setCount(text.length);
      return;
    }

    // Reprend depuis le caractere atteint (si le flou est relance)
    const from = countRef.current;
    const t0 = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const next = Math.min(
        text.length,
        from + Math.floor(((now - t0) / 1000) * CHARS_PER_SECOND)
      );
      if (next !== countRef.current) {
        countRef.current = next;
        setCount(next);
      }
      if (next < text.length) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, instant, text]);

  const done = count >= text.length;

  // Tap : affiche tout le texte d'un coup
  const skip = () => {
    countRef.current = text.length;
    setCount(text.length);
  };

  // Le texte restant est rendu invisible (et non absent) : la mise en page
  // est definitive des le depart, les mots ne sautent pas de ligne en cours
  // de frappe
  return (
    <p
      onClick={skip}
      className="pointer-events-auto text-[15px] leading-relaxed text-white"
      style={{ textShadow: "0 1px 14px rgba(0,0,0,0.7)" }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, count)}</span>
      {start && !done && (
        <motion.span
          aria-hidden
          className="ml-[1px] inline-block h-[1em] w-[2px] bg-[#F56E0F] align-[-0.12em]"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
      <span aria-hidden className="invisible">
        {text.slice(count)}
      </span>
    </p>
  );
}

export function ImageTargetOverlay({ targetName, cornersRef }: ImageTargetOverlayProps) {
  const prefersReduced = useReducedMotion();

  // Cible affichee : conservee pendant l'animation de sortie du flou
  const [shownTarget, setShownTarget] = useState<string | null>(null);
  const [blurDone, setBlurDone] = useState(false);
  const [dock, setDock] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const blurLayerRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const sizeRef = useRef({ w: 0, h: 0 });
  const textHeightRef = useRef(0);
  const startedRef = useRef(false);
  const sideRef = useRef<Side | null>(null);
  const yRef = useRef<number | null>(null);
  const activeRef = useRef<string | null>(targetName);
  const blurAnimRef = useRef<{ stop: () => void } | null>(null);

  // Un seul motion value pilote le flou ET l'assombrissement
  const blur = useMotionValue(0);
  const backdrop = useTransform(blur, (v) => `blur(${v}px)`);
  const dim = useTransform(blur, [0, BLUR_MAX], ["rgba(0,0,0,0)", `rgba(0,0,0,${DIM_MAX})`]);

  // Le trou net repose sur clip-path: path(evenodd, ...). Sans ce support,
  // on ne floute pas du tout (la cible resterait floue elle aussi) : seul
  // l'assombrissement s'applique.
  const [canClip] = useState(
    () =>
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("clip-path", "path(evenodd, 'M0 0H1V1Z')")
  );

  useEffect(() => {
    activeRef.current = targetName;
  }, [targetName]);

  const runBlur = useCallback(
    (to: number, duration: number, onComplete?: () => void) => {
      blurAnimRef.current?.stop();
      blurAnimRef.current = animate(blur, to, {
        duration: prefersReduced ? 0 : duration,
        ease: "easeInOut",
        onComplete,
      });
    },
    [blur, prefersReduced]
  );

  useEffect(() => () => blurAnimRef.current?.stop(), []);

  // Entree / sortie selon la cible suivie
  useEffect(() => {
    if (targetName) {
      setShownTarget(targetName);
      // Cible retrouvee (ou changee) alors que le flou est deja lance
      if (startedRef.current) {
        setBlurDone(false);
        runBlur(BLUR_MAX, BLUR_DURATION, () => setBlurDone(true));
      }
      return;
    }

    // Cible perdue : on relache le flou puis on demonte
    setBlurDone(false);
    runBlur(0, BLUR_EXIT_DURATION, () => {
      startedRef.current = false;
      sideRef.current = null;
      yRef.current = null;
      setDock(false);
      setShownTarget(null);
    });
  }, [targetName, runBlur]);

  // Taille de l'ecran (mise en cache, pas de lecture de layout par frame)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => {
      sizeRef.current = { w: root.clientWidth, h: root.clientHeight };
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Hauteur du bloc de texte (necessaire pour choisir le cote)
  useEffect(() => {
    const el = textContentRef.current;
    if (!el) return;
    const update = () => {
      textHeightRef.current = el.offsetHeight;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [shownTarget]);

  // Boucle de rendu : trou net, declenchement du flou, placement du texte.
  // Tout passe par le DOM direct (refs) pour rester fluide a 60 fps.
  useEffect(() => {
    if (!shownTarget) return;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const corners = cornersRef.current;
      const { w, h } = sizeRef.current;
      if (!corners || !w || !h) return;

      // 1. Zone nette aux coins de la cible
      const layer = blurLayerRef.current;
      if (layer && canClip) layer.style.clipPath = buildHolePath(w, h, corners);

      // 2. Le flou demarre une fois la premiere position connue, pour ne
      //    jamais flouter la cible elle-meme
      if (!startedRef.current && activeRef.current) {
        startedRef.current = true;
        setBlurDone(false);
        runBlur(BLUR_MAX, BLUR_DURATION, () => setBlurDone(true));
      }

      // 3. Texte : cote le plus degage autour de la cible
      const box = textBoxRef.current;
      if (!box) return;

      const ys = corners.map((p) => p.y);
      const top = clamp(Math.min(...ys), 0, h);
      const bottom = clamp(Math.max(...ys), 0, h);
      const textW = Math.min(w - SIDE_MARGIN * 2, TEXT_MAX_WIDTH);
      const textH = textHeightRef.current;

      const side = pickSide(
        sideRef.current,
        top - SAFE_TOP,
        h - SAFE_BOTTOM - bottom,
        textH + GAP
      );
      if (side !== sideRef.current) {
        sideRef.current = side;
        setDock(side === "dock");
      }

      let targetY: number;
      if (side === "below") targetY = bottom + GAP;
      else if (side === "above") targetY = top - GAP - textH;
      else targetY = h - SAFE_BOTTOM - textH;
      targetY = clamp(targetY, SAFE_TOP, Math.max(SAFE_TOP, h - SAFE_BOTTOM - textH));

      // Lissage vertical : le texte suit la cible sans trembler avec elle.
      // Horizontalement il reste centre : une ligne de lecture stable.
      const previousY = yRef.current ?? targetY;
      const y = previousY + (targetY - previousY) * FOLLOW;
      yRef.current = y;

      box.style.width = `${textW}px`;
      box.style.transform = `translate3d(${(w - textW) / 2}px, ${y}px, 0)`;
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [shownTarget, cornersRef, canClip, runBlur]);

  const content = shownTarget ? TARGET_CONTENT[shownTarget] : null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {content && (
        <>
          {/* Calque flou plein ecran, perce aux coins de la cible (clip-path) */}
          <motion.div
            ref={blurLayerRef}
            className="absolute inset-0"
            style={
              canClip
                ? {
                    backdropFilter: backdrop,
                    WebkitBackdropFilter: backdrop,
                    backgroundColor: dim,
                  }
                : { backgroundColor: dim }
            }
          />

          {/* Voile en bas quand le texte n'a de place ni dessus ni dessous */}
          <AnimatePresence>
            {dock && (
              <motion.div
                key="dock-scrim"
                className="absolute inset-x-0 bottom-0 h-2/5"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Conteneur positionne par la boucle de rendu (transform direct) */}
          <div ref={textBoxRef} className="absolute left-0 top-0 will-change-transform">
            <motion.div
              ref={textContentRef}
              initial={{ opacity: 0, y: 8 }}
              animate={blurDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: prefersReduced ? 0 : 0.4, ease: "easeOut" }}
            >
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F56E0F]">
                {content.title}
              </p>
              <Typewriter
                key={shownTarget}
                text={content.description}
                start={blurDone}
                instant={!!prefersReduced}
              />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}