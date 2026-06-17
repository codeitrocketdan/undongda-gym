"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  FAVORITES_STORAGE_KEY as KEY,
  FAVORITES_UPDATE_EVENT as EVENT,
} from "@/shared/constants/favorites";

function get(): number {
  return parseInt(localStorage.getItem(KEY) ?? "0", 10);
}

function getServerSnapshot(): number {
  return 0;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // cross-tab sync
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function incrementFavoritesCount(): void {
  localStorage.setItem(KEY, String(get() + 1));
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
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/favorite") {
      resetFavoritesCount();
    }
  }, [pathname]);

  return useSyncExternalStore(subscribe, get, getServerSnapshot);
}
