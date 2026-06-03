"use client";

import { useState, useCallback, useEffect } from "react";
import type { Program } from "@/lib/types";

export interface AgendaItem extends Program {
  addedAt: number; // timestamp
}

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

export function useFestivalPlanner() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setAgenda(loadFromStorage());
    setHydrated(true);
  }, []);

  const addToAgenda = useCallback((program: Program) => {
    setAgenda((prev) => {
      if (prev.some((p) => p.id === program.id)) return prev;
      const next: AgendaItem[] = [
        ...prev,
        { ...program, addedAt: Date.now() },
      ];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFromAgenda = useCallback((id: string) => {
    setAgenda((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const isInAgenda = useCallback(
    (id: string) => agenda.some((p) => p.id === id),
    [agenda]
  );

  const clearAgenda = useCallback(() => {
    setAgenda([]);
    saveToStorage([]);
  }, []);

  // Sorted by day then startTime
  const sortedAgenda = [...agenda].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startTime.localeCompare(b.startTime);
  });

  // Group by day
  const agendaByDay = sortedAgenda.reduce<Record<number, AgendaItem[]>>(
    (acc, item) => {
      if (!acc[item.day]) acc[item.day] = [];
      acc[item.day].push(item);
      return acc;
    },
    {}
  );

  // Detect time conflicts
  const conflicts: string[] = [];
  Object.values(agendaByDay).forEach((dayItems) => {
    for (let i = 0; i < dayItems.length - 1; i++) {
      const a = dayItems[i];
      const b = dayItems[i + 1];
      if (a.endTime > b.startTime) {
        conflicts.push(a.id, b.id);
      }
    }
  });

  return {
    agenda: sortedAgenda,
    agendaByDay,
    hydrated,
    totalCount: agenda.length,
    conflicts,
    addToAgenda,
    removeFromAgenda,
    isInAgenda,
    clearAgenda,
  };
}
