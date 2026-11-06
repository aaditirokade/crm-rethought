/** Canvas color tokens (decision 0017). Mirrors app/globals.css; the /tokens page checks contrast from these values. */
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
  light: { bg: "#f6f4f0", surface: "#ffffff", surface2: "#efece6", draft: "#f3f0ff", accent: "#5b3fd9", ink: "#1d1b18" },
  dark: { bg: "#141312", surface: "#1d1c1a", surface2: "#262421", draft: "#221f33", accent: "#b3a1ff", ink: "#efece6" },
};

export const COLORS: ColorToken[] = [
  { name: "bg", role: "The canvas everything sits on", light: "#f6f4f0", dark: "#141312", check: "background" },
  { name: "surface", role: "Things that lift: cards you act on", light: "#ffffff", dark: "#1d1c1a", check: "background" },
  { name: "surface-2", role: "Quiet fills: chips, inputs, inner groups", light: "#efece6", dark: "#262421", check: "background" },
  { name: "draft", role: "Behind lines the AI drafted", light: "#f3f0ff", dark: "#221f33", check: "background" },
  { name: "ink", role: "Text people read; primary buttons", light: "#1d1b18", dark: "#efece6", check: "text" },
  { name: "ink-2", role: "Quiet text, labels", light: "#5c5850", dark: "#aca69b", check: "text" },
  { name: "accent", role: "The AI's color: drafts, Ask, waiting counts", light: "#5b3fd9", dark: "#b3a1ff", check: "text" },
  { name: "accent-ink", role: "Text on the accent", light: "#ffffff", dark: "#16132b", check: "on-accent" },
  { name: "good", role: "Approved, healthy", light: "#1d7348", dark: "#6fd3a0", check: "text" },
  { name: "warn", role: "Needs a look", light: "#8a5a00", dark: "#f0c062", check: "text" },
  { name: "risk", role: "At risk, overdue", light: "#b8352b", dark: "#ff8d82", check: "text" },
  { name: "line-strong", role: "Control borders", light: "#8c867c", dark: "#7a7469", check: "border" },
  { name: "line", role: "Hairlines, rarely used", light: "#e9e5de", dark: "#2b2926", check: "decorative" },
];
