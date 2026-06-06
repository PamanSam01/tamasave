"use client";

import { RitualIdentity } from "@/lib/types";

const identityKey = "tamasave:ritual-identity";
const reservedNames = new Set(["ritual.ritual", "admin.ritual", "scheduler.ritual"]);

export function normalizeUsername(value: string) {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/\.ritual$/u, "")
    .replace(/[^a-z0-9-]/gu, "");

  return base ? `${base}.ritual` : "";
}

export function isValidRitualUsername(value: string) {
  return /^[a-z0-9][a-z0-9-]{2,15}\.ritual$/u.test(value);
}

export function getStoredIdentity(): RitualIdentity | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(identityKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RitualIdentity;
  } catch {
    return null;
  }
}

export function storeIdentity(identity: RitualIdentity) {
  window.localStorage.setItem(identityKey, JSON.stringify(identity));
  window.dispatchEvent(new CustomEvent("ritual-identity-updated", { detail: identity }));
}
