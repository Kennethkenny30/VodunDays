// Vérifie en une passe tous les imports du dossier src/ :
//  [1] paquets importés mais NON déclarés dans package.json
//  [2] paquets déclarés mais NON installés dans node_modules
//  [3] fichiers locaux (alias @/ ou chemins relatifs) introuvables
//  [4] imports "type" seulement dont les types (@types/...) sont absents
// Ignorés : src/generated (code généré), next-env.d.ts, imports "#..." (Node).
// Usage (depuis la racine du projet) : node scripts/check-deps.mjs
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { builtinModules } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = join(root, "src")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const declared = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
])
const builtins = new Set(builtinModules)
const EXT = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"]
const IGNORED = [/[\\/]generated[\\/]/, /next-env\.d\.ts$/]

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue
    const p = join(dir, name)
    if (IGNORED.some(r => r.test(p))) continue
    statSync(p).isDirectory() ? walk(p, out) : /\.(tsx?|jsx?|mjs)$/.test(name) && out.push(p)
  }
  return out
}

function localExists(base) {
  if (existsSync(base) && statSync(base).isFile()) return true
  if (EXT.some(e => existsSync(base + e))) return true
  return EXT.some(e => existsSync(join(base, "index" + e)))
}

const pkgName = spec => {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}
const typesName = name => "@types/" + name.replace(/^@/, "").replace("/", "__")
const installed = name => existsSync(join(root, "node_modules", name, "package.json"))

const re = /(?:from\s*|import\s*\(\s*|import\s+|require\s*\(\s*)(["'])([^"'`\n]+)\1/g
const typeRe = /(?:import|export)\s+type\b[^;]*?from\s*(["'])([^"'`\n]+)\1/g
const missingPkgs = new Map()   // paquet -> Set(fichiers)
const missingTypes = new Map()  // paquet (types seuls) -> Set(fichiers)
const missingFiles = []         // [fichier, import]

for (const file of walk(srcDir)) {
  const code = readFileSync(file, "utf8")
  const rel = file.slice(root.length + 1)
  const typeOnly = new Set([...code.matchAll(typeRe)].map(m => m[2]))
  const valueSpecs = new Set()
  for (const m of code.matchAll(re)) valueSpecs.add(m[2])
  // spec « type seulement » = présent dans typeRe et jamais importé autrement
  const strictTypeOnly = spec =>
    typeOnly.has(spec) &&
    ![...code.matchAll(re)].some(m => m[2] === spec && !new RegExp(`(?:import|export)\\s+type\\b[^;]*?from\\s*["']${spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(code))

  for (const spec of valueSpecs) {
    if (spec.startsWith("@/")) {
      if (!localExists(join(srcDir, spec.slice(2)))) missingFiles.push([rel, spec])
    } else if (spec.startsWith(".")) {
      if (!localExists(resolve(dirname(file), spec))) missingFiles.push([rel, spec])
    } else if (spec.startsWith("#") || spec.startsWith("node:") || builtins.has(spec.split("/")[0])) {
      continue
    } else {
      const name = pkgName(spec)
      if (declared.has(name)) continue
      if (strictTypeOnly(spec)) {
        if (!declared.has(typesName(name)) && !installed(typesName(name))) {
          if (!missingTypes.has(name)) missingTypes.set(name, new Set())
          missingTypes.get(name).add(rel)
        }
      } else {
        if (!missingPkgs.has(name)) missingPkgs.set(name, new Set())
        missingPkgs.get(name).add(rel)
      }
    }
  }
}

const notInstalled = [...declared].filter(n => !installed(n))

let problems = 0
if (missingPkgs.size) {
  problems++
  console.log("\n[1] Importés mais NON déclarés dans package.json :")
  for (const [n, files] of missingPkgs) console.log(`  - ${n}   (ex. ${[...files][0]}, ${files.size} fichier(s))`)
  console.log(`\n  -> npm install ${[...missingPkgs.keys()].join(" ")}`)
}
if (notInstalled.length) {
  problems++
  console.log("\n[2] Déclarés mais ABSENTS de node_modules :")
  notInstalled.forEach(n => console.log("  - " + n))
  console.log("\n  -> npm install")
}
if (missingFiles.length) {
  problems++
  console.log("\n[3] Fichiers locaux importés mais introuvables :")
  missingFiles.forEach(([f, s]) => console.log(`  - ${s}   (dans ${f})`))
}
if (missingTypes.size) {
  problems++
  console.log("\n[4] Imports de types seulement (aucun effet à l'exécution, mais `next build` les vérifie) :")
  for (const [n, files] of missingTypes) console.log(`  - ${n}   (ex. ${[...files][0]})`)
  console.log(`\n  -> npm install -D ${[...missingTypes.keys()].map(n => typesName(n)).join(" ")}`)
}
console.log(problems ? "\nProblèmes trouvés : corrige-les tous avant de relancer le serveur." : "Aucun problème détecté dans src/.")
process.exit(problems ? 1 : 0)
