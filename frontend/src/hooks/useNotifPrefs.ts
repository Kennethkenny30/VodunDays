"use client";

import { useState, useCallback, useEffect } from "react";

const KEY_READ      = "vd_read_notifs";
const KEY_DISMISSED = "vd_dismissed_notifs";
// Limite pour eviter l'accumulation infinie d'UUIDs dans localStorage
const MAX_DISMISSED = 200;

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

interface NotifPrefsState {
  hydrated:           boolean;
  read:               Set<string>;
  dismissed:          Set<string>;
  isRead:             (uid: string) => boolean;
  isDismissed:        (uid: string) => boolean;
  markRead:           (uid: string) => void;
  markDismissed:      (uid: string) => void;
  markAllRead:        (uids: string[]) => void;
  permanentlyDismiss: (uid: string) => void;
}

export function useNotifPrefs(): NotifPrefsState {
  const [read,      setRead]      = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [hydrated,  setHydrated]  = useState(false);

  useEffect(() => {
    setRead(loadSet(KEY_READ));
    setDismissed(loadSet(KEY_DISMISSED));
    setHydrated(true);
  }, []);

  const isRead      = useCallback((uid: string) => read.has(uid),      [read]);
  const isDismissed = useCallback((uid: string) => dismissed.has(uid), [dismissed]);

  const markRead = useCallback((uid: string) => {
    setRead(prev => {
      if (prev.has(uid)) return prev;
      const next = new Set(prev);
      next.add(uid);
      saveSet(KEY_READ, next);
      return next;
    });
  }, []);

  // marque lue + archivee en un seul setState par set
  const markDismissed = useCallback((uid: string) => {
    setRead(prev => {
      const next = new Set(prev);
      next.add(uid);
      saveSet(KEY_READ, next);
      return next;
    });
    setDismissed(prev => {
      if (prev.has(uid)) return prev;
      const next = new Set(prev);
      next.add(uid);
      saveSet(KEY_DISMISSED, next);
      return next;
    });
  }, []);

  const markAllRead = useCallback((uids: string[]) => {
    if (uids.length === 0) return;
    setRead(prev => {
      const next = new Set(prev);
      uids.forEach(uid => next.add(uid));
      saveSet(KEY_READ, next);
      return next;
    });
  }, []);

  // Suppression definitive : ajoute a dismissed (+ cap a MAX_DISMISSED)
  // Ainsi le re-fetch API filtrera l'entree indefiniment
  const permanentlyDismiss = useCallback((uid: string) => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(uid);
      // Trimmer si depasse le plafond
      if (next.size > MAX_DISMISSED) {
        const arr    = [...next];
        const trimmed = arr.slice(arr.length - MAX_DISMISSED);
        const capped  = new Set(trimmed);
        saveSet(KEY_DISMISSED, capped);
        return capped;
      }
      saveSet(KEY_DISMISSED, next);
      return next;
    });
    // Marquer comme lue egalement
    setRead(prev => {
      if (prev.has(uid)) return prev;
      const next = new Set(prev);
      next.add(uid);
      saveSet(KEY_READ, next);
      return next;
    });
  }, []);

  return {
    hydrated,
    read,
    dismissed,
    isRead,
    isDismissed,
    markRead,
    markDismissed,
    markAllRead,
    permanentlyDismiss,
  };
}
