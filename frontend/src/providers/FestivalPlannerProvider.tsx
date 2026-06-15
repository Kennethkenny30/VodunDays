"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
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

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = "vodun_festival_agenda";

function loadFromStorage(): AgendaItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: AgendaItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
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
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once on mount
  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

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
    setItems((prev) => {
      if (prev.some((p) => p.id === program.id)) return prev;
      const next = [...prev, { ...program, addedAt: Date.now() }];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFromAgenda = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const isInAgenda = useCallback(
    (id: string) => items.some((p) => p.id === id),
    [items]
  );

  const clearAgenda = useCallback(() => {
    setItems([]);
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
