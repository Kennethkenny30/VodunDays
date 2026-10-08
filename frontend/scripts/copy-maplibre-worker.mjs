// Copie le worker MapLibre (v6, modules ES) dans /public pour qu'il soit servi
// comme fichier statique. Le worker importe ./maplibre-gl-shared.mjs : les deux
// fichiers doivent rester dans le même dossier. Compatible Windows / macOS / Linux.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// Pendant `npm install`, un échec ne doit pas faire annuler l'installation par npm.
const fail = () => process.exit(process.env.npm_lifecycle_event === "postinstall" ? 0 : 1)

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)

let pkgDir
try {
  pkgDir = dirname(require.resolve("maplibre-gl/package.json", { paths: [root] }))
} catch {
  console.error("[maplibre] ERREUR : maplibre-gl introuvable. Lance `npm install` dans", root)
  fail()
}

const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]
const publicDir = resolve(root, "public")
mkdirSync(publicDir, { recursive: true })

for (const name of files) {
  const src = resolve(pkgDir, "dist", name)
  if (!existsSync(src)) {
    const version = JSON.parse(readFileSync(resolve(pkgDir, "package.json"), "utf8")).version
    console.error("[maplibre] ERREUR : fichier introuvable :", src)
    console.error("[maplibre] maplibre-gl version installée :", version)
    console.error("[maplibre] contenu de dist :", existsSync(resolve(pkgDir, "dist")) ? readdirSync(resolve(pkgDir, "dist")).join(", ") : "(dossier dist absent)")
    console.error("[maplibre] Il faut maplibre-gl v6 : lance `npm install maplibre-gl@^6.11.2`.")
    fail()
  }
  copyFileSync(src, resolve(publicDir, name))
  console.log("[maplibre] copié :", name, "->", publicDir)
}
