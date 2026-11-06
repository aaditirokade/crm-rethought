/** Signal color tokens. Mirrors app/globals.css; the /tokens page checks contrast from these values. */
export type Mode = { bg: string; surface: string; surface2: string; draft: string } & Record<string, string>;

export type ColorToken = {
  name: string;
  role: string;
  light: string;
  dark: string;
  /** How the token is checked: text on every background, a 3:1 border, a label on the accent, or not checked. */
  check: "text" | "border" | "on-accent" | "background" | "decorative";
};

export const BACKGROUNDS = {
  light: { bg: "#f4f5f7", surface: "#ffffff", surface2: "#eceef2", draft: "#eef2ff", accent: "#2853f0" },
  dark: { bg: "#0d0f13", surface: "#151820", surface2: "#1c2029", draft: "#182038", accent: "#7d9bff" },
};

export const COLORS: ColorToken[] = [
  { name: "bg", role: "Page background", light: "#f4f5f7", dark: "#0d0f13", check: "background" },
  { name: "surface", role: "Cards, panels, controls", light: "#ffffff", dark: "#151820", check: "background" },
  { name: "surface-2", role: "Hover, sunken areas, gates", light: "#eceef2", dark: "#1c2029", check: "background" },
  { name: "draft", role: "Behind lines the AI drafted", light: "#eef2ff", dark: "#182038", check: "background" },
  { name: "ink", role: "Text people read", light: "#111318", dark: "#e8eaf0", check: "text" },
  { name: "ink-2", role: "Quiet text, metadata", light: "#535866", dark: "#9aa1b0", check: "text" },
  { name: "accent", role: "The one primary action; draft tags", light: "#2853f0", dark: "#7d9bff", check: "text" },
  { name: "accent-ink", role: "Label on the accent", light: "#ffffff", dark: "#0b1020", check: "on-accent" },
  { name: "good", role: "Approved, healthy", light: "#17784a", dark: "#5fd39b", check: "text" },
  { name: "warn", role: "Needs a look", light: "#8a5a00", dark: "#f2c062", check: "text" },
  { name: "risk", role: "At risk, overdue", light: "#c0362c", dark: "#ff8a80", check: "text" },
  { name: "line-strong", role: "Control borders", light: "#7f8594", dark: "#687080", check: "border" },
  { name: "line", role: "Dividers (decorative)", light: "#dde0e6", dark: "#262a34", check: "decorative" },
];
