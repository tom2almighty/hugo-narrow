/**
 * Shared browser helpers and cross-module event names.
 */
import { REDUCED_MOTION_QUERY } from "./layout.js";

export const EVENTS = {
  searchOpen: "search:open",
  tocToggle: "toc:toggle",
  themeChanged: "themeChanged",
};

export const STORAGE_KEYS = {
  theme: "theme",
  colorScheme: "colorScheme",
  contentWidth: "contentWidth",
  backdropBlur: "backdropBlur",
  grainSize: "grainSize",
  tocPinned: "tocPinned",
};

export function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // localStorage may be unavailable in private browsing modes.
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {
    // localStorage may be unavailable in private browsing modes.
  }
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function readJSONConfig(id) {
  const element = document.getElementById(id);
  if (!element?.textContent) return null;

  try {
    const parsed = JSON.parse(element.textContent);
    return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
  } catch (_) {
    return null;
  }
}

export function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
