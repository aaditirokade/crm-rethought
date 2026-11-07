"use client";

import { setTheme, useTheme } from "../proto/ThemeToggle";

/**
 * The light and dark switch, matched to the one on aaditirokade.com: a small
 * round button pinned to the bottom right corner. It shows where a click
 * leads, not where you are: a crescent moon in light mode, a sun in dark.
 */
export function ThemeButton() {
  const theme = useTheme();
  const dark = theme === "dark";
  const next = dark ? "light" : "dark";
  return (
    <button type="button" className="theme-fab" onClick={() => setTheme(next)} aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}>
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4.2" />
            <line x1="12" y1="19.8" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="4.2" y2="12" />
            <line x1="19.8" y1="12" x2="22.5" y2="12" />
            <line x1="4.4" y1="4.4" x2="6.3" y2="6.3" />
            <line x1="17.7" y1="17.7" x2="19.6" y2="19.6" />
            <line x1="4.4" y1="19.6" x2="6.3" y2="17.7" />
            <line x1="17.7" y1="6.3" x2="19.6" y2="4.4" />
          </g>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
