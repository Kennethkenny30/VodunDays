// Génère les icônes PWA manquantes (192x192 et variante maskable 512x512)
// à partir du logo source public/icon.png. À relancer manuellement si le logo change.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const sourceIcon = path.join(publicDir, "icon.png");

const MASKABLE_SIZE = 512;
// Zone de sécurité recommandée pour les icônes maskable : le contenu utile
// doit rester dans les ~80% centraux, le reste pouvant être rogné par le masque OS.
const SAFE_ZONE_RATIO = 0.8;

async function generateStandardIcon() {
  const dest = path.join(publicDir, "icon-192.png");
  await sharp(sourceIcon).resize(192, 192).png().toFile(dest);
  console.log("Généré :", dest);
}

async function generateMaskableIcon() {
  const dest = path.join(publicDir, "icon-512-maskable.png");
  const innerSize = Math.round(MASKABLE_SIZE * SAFE_ZONE_RATIO);

  // Logo redimensionné dans la zone de sécurité, fond transparent temporaire
  const resizedLogo = await sharp(sourceIcon)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  // Canvas plein 512x512, fond blanc opaque (cohérent avec le fond du logo source),
  // logo composité au centre puis aplati pour supprimer toute transparence
  // (une icône maskable ne doit jamais avoir de zones transparentes).
  await sharp({
    create: {
      width: MASKABLE_SIZE,
      height: MASKABLE_SIZE,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resizedLogo, gravity: "center" }])
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(dest);

  console.log("Généré :", dest);
}

await generateStandardIcon();
await generateMaskableIcon();
