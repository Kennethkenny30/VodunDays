import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Mode « modele » : le logo (marqueur) declenche l'apparition d'une figure 3D
// qui se verrouille ensuite dans le monde (SLAM) et y reste, meme quand le
// marqueur sort du champ. Aucun tissu ni souffle : seule l'aura est animee.

// --- Reglages ---------------------------------------------------------------
// Une cible = une image de reference : la version blanc sur noir et la version
// noir sur blanc du logo sont deux cibles distinctes (fichiers de
// public/8thwall/image-targets/), qui declenchent la meme figure.
export const MODEL_TARGET_NAMES = ["kondo", "kondo_clair"];
export const isModelTarget = (name: string) => MODEL_TARGET_NAMES.includes(name);
const MODEL_URL = "/models/figure.glb";
const MODEL_HEIGHT_M = 0.3; // hauteur fixe (echelle absolue = metres), quelle que soit la taille du marqueur
const AURA_LEVEL = 0.25; // 25 % du niveau de reference
const PARTICLE_COUNT = 160;
const PARTICLE_SIZE = 2.7; // calibre pour une figure de 30 cm vue a 0,5 - 1 m

const STABLE_FRAMES = 10; // detections consecutives moyennees avant de verrouiller
const FLAT_THRESHOLD = 0.7; // |normale . vertical| au-dessus : marqueur considere a plat
const WALL_OFFSET_M = 0.02; // marqueur vertical : decalage vers le spectateur
const RESNAP_DISTANCE_M = 0.05; // ecart toleré entre la figure et le marqueur revu
const RESNAP_FRAMES = 12; // frames consecutives avant de recaler
const RESNAP_ALPHA = 0.1; // lissage du recalage (par frame)
const TELEPORT_DISTANCE_M = 0.4; // au-dela : la figure reapparait ailleurs
const APPEAR_MS = 700;
const DISAPPEAR_MS = 250;

export interface TargetDetail {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
}

export interface ModelAnchor {
  pipelineModule: () => Record<string, unknown>;
  found: (detail: TargetDetail) => void;
  update: (detail: TargetDetail) => void;
  lost: () => void;
  setEnabled: (enabled: boolean) => void;
  dispose: () => void;
}

// --- Shaders de l'aura --------------------------------------------------------
const AURA_VERTEX = `
uniform float uTime;
uniform float uOff;
varying vec3 vN;
varying vec3 vV;
varying vec3 vP;
void main() {
  vec3 q = position + normal * uOff * (1.0 + 0.25 * sin(uTime * 1.7 + position.y * 0.8 + position.x));
  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  vP = position;
  gl_Position = projectionMatrix * mv;
}`;

const AURA_FRAGMENT = `
uniform float uTime;
uniform float uH;
uniform float uAura;
uniform float uK;
uniform vec3 uCol;
varying vec3 vN;
varying vec3 vV;
varying vec3 vP;
void main() {
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uK);
  float yn = vP.y / uH;
  float flick = 0.65 + 0.35 * sin(uTime * 2.1 + vP.y * 0.7 + sin(vP.x * 1.3 + uTime));
  float rise = 0.5 + 0.5 * sin(vP.y * 0.8 - uTime * 2.4 + vP.x * 0.3);
  float a = f * flick * (0.5 + 0.5 * rise) * uAura * (0.55 + 0.45 * (1.0 - yn) + 0.25 * smoothstep(0.8, 1.0, yn));
  gl_FragColor = vec4(uCol, a * 0.2);
}`;

const PARTICLE_VERTEX = `
attribute vec4 seed;
uniform float uTime;
uniform float uH;
uniform float uPx;
uniform float uAura;
uniform float uSize;
uniform vec2 uC;
varying float vA;
void main() {
  float t = fract(seed.x + uTime * (0.035 + 0.05 * seed.y));
  float ang = seed.z * 6.2832 + uTime * 0.35 * (seed.y - 0.5) + t * 2.0;
  float r = 2.8 + seed.w * 2.5 + t * 1.2;
  vec3 p = vec3(uC.x + cos(ang) * r, t * uH * 1.15, uC.y + sin(ang) * r);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vA = sin(3.1416 * t) * (0.4 + 0.6 * seed.y) * uAura;
  gl_PointSize = (0.5 + seed.y) * uPx * uSize / -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const PARTICLE_FRAGMENT = `
varying float vA;
void main() {
  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.85, 0.5), vA), a);
}`;

const AURA_SHELLS: Array<{ offset: number; color: [number, number, number]; k: number }> = [
  { offset: 0.4, color: [1, 0.62, 0.15], k: 2.2 },
  { offset: 0.9, color: [0.9, 0.15, 0.2], k: 3 },
  { offset: 1.5, color: [1, 0.35, 0.1], k: 4 },
];

const EDGE_DIRS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// Vecteurs reutilises (aucune allocation par frame)
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const tmpV = new THREE.Vector3();
const tmpCam = new THREE.Vector3();

// Position des pieds selon l'orientation du marqueur (quel que soit le sens) :
//  - a plat (table, comptoir, sol) : au centre du logo
//  - vertical ou incline (mur, carte tenue) : milieu de l'arete la plus basse,
//    legerement decale vers la camera
// Renvoie true si le marqueur est a plat.
function computeFoot(d: TargetDetail, camPos: THREE.Vector3, out: THREE.Vector3): boolean {
  tmpQ.set(d.rotation.x, d.rotation.y, d.rotation.z, d.rotation.w);
  tmpP.set(d.position.x, d.position.y, d.position.z);
  tmpN.set(0, 0, 1).applyQuaternion(tmpQ);

  if (Math.abs(tmpN.dot(WORLD_UP)) > FLAT_THRESHOLD) {
    out.copy(tmpP);
    return true;
  }

  if (tmpN.dot(tmpV.copy(camPos).sub(tmpP)) < 0) tmpN.negate();
  const halfW = (d.scaledWidth * d.scale) / 2;
  const halfH = (d.scaledHeight * d.scale) / 2;
  let lowest = Infinity;
  for (const [sx, sy] of EDGE_DIRS) {
    tmpV.set(sx * halfW, sy * halfH, 0).applyQuaternion(tmpQ).add(tmpP);
    if (tmpV.y < lowest) {
      lowest = tmpV.y;
      out.copy(tmpV);
    }
  }
  out.addScaledVector(tmpN, WALL_OFFSET_M);
  return false;
}

function makeShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.9)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.4)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

type State = "idle" | "collecting" | "locked";

export function createModelAnchor(onVisibleChange: (visible: boolean) => void): ModelAnchor {
  const uniforms = {
    uTime: { value: 0 },
    uAura: { value: 0 },
    uH: { value: 1 },
  };

  let scene: THREE.Scene | null = null;
  let camera: THREE.Camera | null = null;
  let root: THREE.Group | null = null;
  let shadow: THREE.Mesh | null = null;
  const lights: THREE.Light[] = [];
  let ready = false;
  let disposed = false;
  let enabled = true;

  let state: State = "idle";
  let lastDetail: TargetDetail | null = null;

  // Moyenne des premieres detections (lisse le bruit avant de verrouiller)
  let count = 0;
  const accPos = new THREE.Vector3();
  const accQuat = new THREE.Quaternion();

  // Recalage progressif si le marqueur est revu a un autre endroit
  let driftFrames = 0;
  let hasGoal = false;
  const goal = new THREE.Vector3();
  const candidate = new THREE.Vector3();

  // Animation d'apparition / disparition (echelle, depuis les pieds)
  let shown = false;
  let currentScale = 0;
  let anim = { from: 0, to: 0, start: 0, dur: 1 };

  const startAnim = (to: number, dur: number) => {
    anim = { from: currentScale, to, start: performance.now(), dur };
  };

  const setShown = (next: boolean) => {
    if (next === shown) return;
    shown = next;
    startAnim(next ? 1 : 0, next ? APPEAR_MS : DISAPPEAR_MS);
    onVisibleChange(next);
  };

  const lockAt = (d: TargetDetail) => {
    if (!root || !camera) return;
    camera.getWorldPosition(tmpCam);
    const flat = computeFoot(d, tmpCam, candidate);
    root.position.copy(candidate);
    // Face a la camera au moment du verrouillage (le modele regarde vers +Z)
    root.rotation.set(0, Math.atan2(tmpCam.x - candidate.x, tmpCam.z - candidate.z), 0);
    if (shadow) shadow.visible = flat;
    state = "locked";
    driftFrames = 0;
    hasGoal = false;
    setShown(true);
  };

  const collect = (d: TargetDetail) => {
    state = "collecting";
    tmpP.set(d.position.x, d.position.y, d.position.z);
    tmpQ.set(d.rotation.x, d.rotation.y, d.rotation.z, d.rotation.w);
    count += 1;
    if (count === 1) {
      accPos.copy(tmpP);
      accQuat.copy(tmpQ);
    } else {
      accPos.lerp(tmpP, 1 / count);
      accQuat.slerp(tmpQ, 1 / count);
    }
    if (count >= STABLE_FRAMES) {
      lockAt({
        position: { x: accPos.x, y: accPos.y, z: accPos.z },
        rotation: { x: accQuat.x, y: accQuat.y, z: accQuat.z, w: accQuat.w },
        scale: d.scale,
        scaledWidth: d.scaledWidth,
        scaledHeight: d.scaledHeight,
      });
    }
  };

  const checkResnap = (d: TargetDetail) => {
    if (!root || !camera) return;
    camera.getWorldPosition(tmpCam);
    const flat = computeFoot(d, tmpCam, candidate);
    const dist = candidate.distanceTo(hasGoal ? goal : root.position);
    driftFrames = dist > RESNAP_DISTANCE_M ? driftFrames + 1 : 0;
    if (driftFrames < RESNAP_FRAMES) return;

    driftFrames = 0;
    if (shadow) shadow.visible = flat;
    if (dist > TELEPORT_DISTANCE_M) {
      // Marqueur retrouve loin de la figure : elle reapparait sur le marqueur
      root.position.copy(candidate);
      hasGoal = false;
      currentScale = 0;
      startAnim(1, APPEAR_MS);
    } else {
      goal.copy(candidate);
      hasGoal = true;
    }
  };

  const handle = (d: TargetDetail) => {
    lastDetail = d;
    if (!enabled || !ready) return;
    if (state === "locked") checkResnap(d);
    else collect(d);
  };

  const build = (model: THREE.Group) => {
    let mesh: THREE.Mesh | null = null;
    model.traverse((o) => {
      if (!mesh && (o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh;
    });
    if (!mesh) throw new Error("Aucun mesh dans le modele 3D");
    const body: THREE.Mesh = mesh;

    const geo = body.geometry;
    geo.computeBoundingBox();
    const bbox = geo.boundingBox;
    if (!bbox) throw new Error("Boite englobante du modele indisponible");
    uniforms.uH.value = bbox.max.y > 0 ? bbox.max.y : 1;

    // Normalisation : hauteur monde fixe, pieds en y = 0, centre sur les pieds
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    model.scale.multiplyScalar(MODEL_HEIGHT_M / (box.max.y - box.min.y));
    model.updateMatrixWorld(true);
    const scaled = new THREE.Box3().setFromObject(model);
    const feetLimit = scaled.min.y + (scaled.max.y - scaled.min.y) * 0.06;
    const positions = geo.attributes.position;
    let sx = 0;
    let sz = 0;
    let n = 0;
    for (let i = 0; i < positions.count; i++) {
      tmpV.fromBufferAttribute(positions, i).applyMatrix4(body.matrixWorld);
      if (tmpV.y <= feetLimit) {
        sx += tmpV.x;
        sz += tmpV.z;
        n += 1;
      }
    }
    const cx = n > 0 ? sx / n : (scaled.min.x + scaled.max.x) / 2;
    const cz = n > 0 ? sz / n : (scaled.min.z + scaled.max.z) / 2;
    model.position.set(-cx, -scaled.min.y, -cz);

    // L'export contient une texture emissive quasi noire : on la neutralise
    const material = body.material as THREE.MeshStandardMaterial;
    material.emissiveMap = null;
    material.emissive.set(0x000000);
    material.needsUpdate = true;

    // Aura : coques additives fresnel + particules ascendantes (enfants du
    // mesh : elles heritent de sa transformation)
    for (const shell of AURA_SHELLS) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          ...uniforms,
          uOff: { value: shell.offset },
          uK: { value: shell.k },
          uCol: { value: new THREE.Vector3(...shell.color) },
        },
        vertexShader: AURA_VERTEX,
        fragmentShader: AURA_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const aura = new THREE.Mesh(body.geometry, mat);
      aura.frustumCulled = false;
      body.add(aura);
    }

    let cxLocal = 0;
    let czLocal = 0;
    for (let i = 0; i < positions.count; i++) {
      cxLocal += positions.getX(i);
      czLocal += positions.getZ(i);
    }
    cxLocal /= positions.count;
    czLocal /= positions.count;

    const seed = new Float32Array(PARTICLE_COUNT * 4);
    for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    pg.setAttribute("seed", new THREE.BufferAttribute(seed, 4));
    const pm = new THREE.ShaderMaterial({
      uniforms: {
        ...uniforms,
        uC: { value: new THREE.Vector2(cxLocal, czLocal) },
        uPx: { value: window.devicePixelRatio || 1 },
        uSize: { value: PARTICLE_SIZE },
      },
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pg, pm);
    points.frustumCulled = false;
    body.add(points);

    root = new THREE.Group();
    root.visible = false;
    root.scale.setScalar(1e-4);
    root.add(model);

    // Ombre de contact : ancre visuellement la figure sur le support
    shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.22),
      new THREE.MeshBasicMaterial({
        map: makeShadowTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.4,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    root.add(shadow);

    scene?.add(root);
  };

  const onStart = () => {
    try {
      const xr = (window as any).XR8.Threejs.xrScene();
      scene = xr.scene as THREE.Scene;
      camera = xr.camera as THREE.Camera;
      const renderer = xr.renderer as THREE.WebGLRenderer;

      // three recent : sRGB par defaut. Ancien three : a forcer pour des couleurs justes.
      if (!("outputColorSpace" in renderer)) {
        (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;
      }

      // Depuis three r155 les intensites de lumiere ne sont plus multipliees par PI
      const k = Number(THREE.REVISION) >= 155 ? Math.PI : 1;
      const hemi = new THREE.HemisphereLight(0xffffff, 0x555555, 0.9 * k);
      const key = new THREE.DirectionalLight(0xffffff, 1.4 * k);
      key.position.set(1, 2, 1.5);
      lights.push(hemi, key);
      scene.add(hemi, key);

      new GLTFLoader()
        .loadAsync(MODEL_URL)
        .then((gltf) => {
          if (disposed) {
            disposeTree(gltf.scene);
            return;
          }
          build(gltf.scene);
          ready = true;
          // Logo deja visible pendant le chargement : on demarre la collecte
          if (lastDetail && enabled) handle(lastDetail);
        })
        .catch((err) => console.error("[AR] Chargement du modele 3D echoue :", err));
    } catch (err) {
      // Un module ne doit jamais lever dans onStart (le moteur s'arreterait)
      console.error("[AR] Initialisation du modele 3D echouee :", err);
    }
  };

  const onUpdate = () => {
    const now = performance.now();
    uniforms.uTime.value = now / 1000;
    if (!root) return;

    const t = Math.min(1, (now - anim.start) / anim.dur);
    currentScale = anim.from + (anim.to - anim.from) * (1 - Math.pow(1 - t, 3));
    root.visible = currentScale > 0.002;
    root.scale.setScalar(Math.max(currentScale, 1e-4));
    uniforms.uAura.value = AURA_LEVEL * currentScale;

    if (hasGoal) {
      root.position.lerp(goal, RESNAP_ALPHA);
      if (root.position.distanceTo(goal) < 0.002) {
        root.position.copy(goal);
        hasGoal = false;
      }
    }
  };

  return {
    pipelineModule: () => ({ name: "model-anchor", onStart, onUpdate }),

    found: (d) => {
      // Nouvelle detection : on repart d'une moyenne propre tant que rien n'est verrouille
      if (state !== "locked") {
        state = "idle";
        count = 0;
      }
      handle(d);
    },

    update: handle,

    // Marqueur perdu : une collecte en cours est abandonnee, une figure
    // verrouillee reste en place dans le monde
    lost: () => {
      if (state === "collecting") {
        state = "idle";
        count = 0;
      }
    },

    // Exclusivite avec le mode descriptif : masque la figure (elle garde sa
    // place dans le monde) ou la reaffiche
    setEnabled: (next) => {
      if (next === enabled) return;
      enabled = next;
      if (!next) {
        if (state === "collecting") {
          state = "idle";
          count = 0;
        }
        setShown(false);
      } else if (state === "locked") {
        setShown(true);
      }
    },

    dispose: () => {
      disposed = true;
      if (scene) {
        if (root) scene.remove(root);
        for (const light of lights) scene.remove(light);
      }
      if (root) disposeTree(root);
      for (const light of lights) light.dispose?.();
      root = null;
      shadow = null;
      scene = null;
      camera = null;
    },
  };
}

// Libere geometries, materiaux et textures d'un arbre d'objets
function disposeTree(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  object.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const m of mats) {
      for (const value of Object.values(m as unknown as Record<string, unknown>)) {
        if (value && (value as THREE.Texture).isTexture) (value as THREE.Texture).dispose();
      }
      m.dispose();
    }
  });
  geometries.forEach((g) => g.dispose());
}
