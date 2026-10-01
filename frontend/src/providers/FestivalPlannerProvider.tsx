"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react";
import type { Program } from "@/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AgendaItem extends Program {
  addedAt: number;
}

interface PlannerContextValue {
  agenda: AgendaItem[];
  agendaByDay: Record<number, AgendaItem[]>;
  totalCount: number;
  conflicts: string[];
  hydrated: boolean;
  addToAgenda: (program: Program) => void;
  removeFromAgenda: (id: string) => void;
  isInAgenda: (id: string) => boolean;
  clearAgenda: () => void;
}

// ── External store (localStorage) ────────────────────────────────────────────
//
// useSyncExternalStore au lieu de useState+useEffect.
//
// Pourquoi : useEffect(() => { setItems(loadFromStorage()); setHydrated(true) }, [])
// part du principe que l'effet ne s'execute qu'apres que toute l'hydratation
// soit terminee. C'est vrai en rendu synchrone, mais cette page est rendue en
// concurrent (visible dans la stack : renderRootConcurrent, a cause du
// <Suspense> parent) - React peut alors laisser un effet d'un sous-arbre deja
// hydrate se declencher PENDANT qu'il hydrate encore un autre sous-arbre du
// meme passage, surtout avec le double-effet de StrictMode en dev. Resultat :
// `hydrated`/`items` changent de valeur au beau milieu de la comparaison
// serveur/client - exactement le "Hydration failed" observe (totalCount 0 vs 3).
//
// useSyncExternalStore est l'API concue par React pour ce cas precis : il
// garantit que `getServerSnapshot` (toujours [] / non-hydrate) est utilise
// pour TOUTE la premiere passe de rendu client, hydratation comprise, et ne
// bascule sur `getSnapshot` (donnee reelle du localStorage) qu'une fois cette
// passe entierement validee - sans race condition possible, meme en concurrent.

const STORAGE_KEY = "vodun_festival_agenda";

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Reference constante et stable pour representer "aucun agenda" - jamais
// reassignee. Indispensable pour getServerSnapshot (voir plus bas) : un
// litteral `[]` cree un NOUVEAU tableau a chaque appel, ce que React
// detecte comme "la donnee a change" a chaque rendu (warning "should be
// cached to avoid an infinite loop"), ce qui destabilise
// useSyncExternalStore - c'etait la veritable cause du mismatch
// d'hydratation, pas seulement le timing du useEffect deja corrige avant.
const EMPTY_ITEMS: AgendaItem[] = [];

// Cache memoise : getSnapshot doit renvoyer la MEME reference tant que la
// donnee brute n'a pas change, sinon useSyncExternalStore re-render en boucle.
let cachedRaw: string | null = null;
let cachedItems: AgendaItem[] = EMPTY_ITEMS;

function readStorage(): AgendaItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? JSON.parse(raw) : EMPTY_ITEMS;
    } catch {
      cachedItems = EMPTY_ITEMS;
    }
  }
  return cachedItems;
}

function getSnapshot(): AgendaItem[] {
  return readStorage();
}

function getServerSnapshot(): AgendaItem[] {
  return EMPTY_ITEMS;
}

function saveToStorage(items: AgendaItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  // Garde le cache synchro immediatement, pour que le prochain getSnapshot()
  // (declenche par emitChange ci-dessous) renvoie deja la bonne valeur sans
  // dependre d'une relecture de localStorage.
  cachedRaw = JSON.stringify(items);
  cachedItems = items;
  emitChange();
}

// `hydrated` : simple detection cote-client, via le meme mecanisme -
// toujours `false` en snapshot serveur, `true` des que le client est pret.
function subscribeNever() {
  return () => {};
}
function getHydratedSnapshot() {
  return true;
}
function getHydratedServerSnapshot() {
  return false;
}

function computeConflicts(sorted: AgendaItem[]): string[] {
  const ids: string[] = [];
  const byDay: Record<number, AgendaItem[]> = {};
  for (const item of sorted) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }
  Object.values(byDay).forEach((dayItems) => {
    for (let i = 0; i < dayItems.length - 1; i++) {
      if (dayItems[i].endTime > dayItems[i + 1].startTime) {
        ids.push(dayItems[i].id, dayItems[i + 1].id);
      }
    }
  });
  return ids;
}

// ── Context ───────────────────────────────────────────────────────────────────

const PlannerContext = createContext<PlannerContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function FestivalPlannerProvider({ children }: { children: ReactNode }) {
  const items    = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeNever, getHydratedSnapshot, getHydratedServerSnapshot);

  // Derived values
  const sorted = [...items].sort((a, b) =>
    a.day !== b.day ? a.day - b.day : a.startTime.localeCompare(b.startTime)
  );

  const agendaByDay = sorted.reduce<Record<number, AgendaItem[]>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  const conflicts = computeConflicts(sorted);

  // Mutations - always sync to localStorage immediately
  const addToAgenda = useCallback((program: Program) => {
    const current = readStorage();
    if (current.some((p) => p.id === program.id)) return;
    saveToStorage([...current, { ...program, addedAt: Date.now() }]);
  }, []);

  const removeFromAgenda = useCallback((id: string) => {
    const current = readStorage();
    saveToStorage(current.filter((p) => p.id !== id));
  }, []);

  const isInAgenda = useCallback(
    (id: string) => items.some((p) => p.id === id),
    [items]
  );

  const clearAgenda = useCallback(() => {
    saveToStorage([]);
  }, []);

  const value: PlannerContextValue = {
    agenda: sorted,
    agendaByDay,
    totalCount: items.length,
    conflicts,
    hydrated,
    addToAgenda,
    removeFromAgenda,
    isInAgenda,
    clearAgenda,
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) {
    throw new Error("usePlanner must be used inside <FestivalPlannerProvider>");
  }
  return ctx;
}