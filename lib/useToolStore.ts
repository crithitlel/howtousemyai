"use client";

import { useCallback, useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────
   Shared client store for PINNED NODES (favorites) + COMPARE.
   Persisted to localStorage, synced across components via custom
   window events (same pattern as the `open-cmdk` event) and across
   browser tabs via the native `storage` event.
   Tools are stored by their stable `name`.
   ────────────────────────────────────────────────────────── */

const PIN_KEY = "htm-pins";
const CMP_KEY = "htm-compare";
const PIN_EVT = "htm-pins-change";
const CMP_EVT = "htm-compare-change";
export const MAX_COMPARE = 3;

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, arr: string[], evt: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(arr));
  } catch {
    /* ignore quota / private-mode errors */
  }
  window.dispatchEvent(new Event(evt));
}

function useStore(key: string, evt: string) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(read(key));
    const sync = () => setItems(read(key));
    window.addEventListener(evt, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(evt, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key, evt]);

  return [items, setItems] as const;
}

/* ── PINS (favorites) ── */
export function usePins() {
  const [pins] = useStore(PIN_KEY, PIN_EVT);

  const isPinned = useCallback((name: string) => pins.includes(name), [pins]);

  const toggle = useCallback((name: string) => {
    const cur = read(PIN_KEY);
    const next = cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name];
    write(PIN_KEY, next, PIN_EVT);
  }, []);

  const clear = useCallback(() => write(PIN_KEY, [], PIN_EVT), []);

  return { pins, isPinned, toggle, clear };
}

/* ── COMPARE (max 3) ── */
export function useCompare() {
  const [compare] = useStore(CMP_KEY, CMP_EVT);

  const inCompare = useCallback((name: string) => compare.includes(name), [compare]);

  const toggle = useCallback((name: string) => {
    const cur = read(CMP_KEY);
    if (cur.includes(name)) {
      write(CMP_KEY, cur.filter((n) => n !== name), CMP_EVT);
    } else if (cur.length < MAX_COMPARE) {
      write(CMP_KEY, [...cur, name], CMP_EVT);
    }
    // silently ignore when at capacity
  }, []);

  const remove = useCallback((name: string) => {
    write(CMP_KEY, read(CMP_KEY).filter((n) => n !== name), CMP_EVT);
  }, []);

  const clear = useCallback(() => write(CMP_KEY, [], CMP_EVT), []);

  const isFull = compare.length >= MAX_COMPARE;

  return { compare, inCompare, toggle, remove, clear, isFull };
}
