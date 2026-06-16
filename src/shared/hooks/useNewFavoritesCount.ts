"use client";

import { useEffect, useState } from "react";

const KEY = "new_favorites_count";
const EVENT = "new-favorites-updated";

function get(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) ?? "0", 10);
}

export function incrementFavoritesCount(): void {
  const next = get() + 1;
  localStorage.setItem(KEY, String(next));
  window.dispatchEvent(new Event(EVENT));
}

export function decrementFavoritesCount(): void {
  const next = Math.max(0, get() - 1);
  if (next === 0) {
    localStorage.removeItem(KEY);
  } else {
    localStorage.setItem(KEY, String(next));
  }
  window.dispatchEvent(new Event(EVENT));
}

export function resetFavoritesCount(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useNewFavoritesCount(): number {
  const [count, setCount] = useState(() => get());

  useEffect(() => {
    const handler = () => setCount(get());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return count;
}
