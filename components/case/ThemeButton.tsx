"use client";

import { setTheme, useTheme } from "../proto/ThemeToggle";

/** The same light and dark switch as the app's dock, as a small pill for the case study header. */
export function ThemeButton() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className="sig-btn" onClick={() => setTheme(next)} aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}>
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
