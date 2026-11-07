"use client";

import { useSyncExternalStore } from "react";

/**
 * Light or dark, shared with aaditirokade.com. Groundwork is served on the same domain
 * (decision 0038), so it reads and writes the portfolio site's own key: dark on the site opens
 * Groundwork dark, and a switch made here carries back to the site. Like the site, it is light
 * unless dark was chosen. Set on <html data-theme> before the first paint (see app/layout.tsx).
 */
const KEY = "theme";
type Theme = "light" | "dark";

const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return media().matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const m = media();
  m.addEventListener("change", onChange);
  window.addEventListener("crm-theme", onChange);
  return () => {
    m.removeEventListener("change", onChange);
    window.removeEventListener("crm-theme", onChange);
  };
}

export function useTheme() {
  return useSyncExternalStore<Theme | null>(subscribe, current, () => null);
}

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event("crm-theme"));
}

/** Runs before the first paint so a saved choice never flashes the other theme. */
export const THEME_SCRIPT = `try{document.documentElement.dataset.theme=localStorage.getItem("${KEY}")==="dark"?"dark":"light"}catch(e){}`;

const Sun = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

export function ThemeToggle() {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="dock-tool group"
      aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}
      onClick={() => setTheme(next)}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      <span className="dock-tip" aria-hidden="true">
        <span className="font-semibold">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </span>
    </button>
  );
}
