/** Canvas color tokens (decision 0017), Daylight palette (decision 0020). Mirrors app/globals.css; the /tokens page checks contrast from these values. */
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
  light: { bg: "#fffbf4", surface: "#ffffff", surface2: "#f4efe4", draft: "#edf1fc", accent: "#4c50c9", ink: "#2b2620" },
  dark: { bg: "#1f1e2c", surface: "#282738", surface2: "#302f43", draft: "#2b2f4f", accent: "#aeb6ff", ink: "#f6f1e7" },
};

export const COLORS: ColorToken[] = [
  { name: "bg", role: "The page: cream by day, dusk indigo at night", light: "#fffbf4", dark: "#1f1e2c", check: "background" },
  { name: "surface", role: "The few things that lift: Ask, triage, menus", light: "#ffffff", dark: "#282738", check: "background" },
  { name: "surface-2", role: "Quiet fills: chips, inputs, tracks", light: "#f4efe4", dark: "#302f43", check: "background" },
  { name: "draft", role: "Periwinkle wash behind lines the AI drafted", light: "#edf1fc", dark: "#2b2f4f", check: "background" },
  { name: "ink", role: "Text people read; primary buttons", light: "#2b2620", dark: "#f6f1e7", check: "text" },
  { name: "ink-2", role: "Quiet text, labels", light: "#665b4f", dark: "#bcb5c6", check: "text" },
  { name: "accent", role: "The AI's color: drafts, Ask, waiting counts", light: "#4c50c9", dark: "#aeb6ff", check: "text" },
  { name: "accent-ink", role: "Text on the accent", light: "#ffffff", dark: "#1a1c3a", check: "on-accent" },
  { name: "good", role: "Approved, healthy", light: "#2b7550", dark: "#8ad9ae", check: "text" },
  { name: "warn", role: "Needs a look", light: "#8a5a00", dark: "#f2c879", check: "text" },
  { name: "risk", role: "At risk, overdue", light: "#b2443a", dark: "#ff9e92", check: "text" },
  { name: "line-strong", role: "Control borders", light: "#8f8373", dark: "#807b96", check: "border" },
  { name: "data", role: "Charts: sparklines, bars, the day strip", light: "#7d8be0", dark: "#97a3f2", check: "decorative" },
  { name: "line", role: "Hairlines, rarely used", light: "#efe7d8", dark: "#353449", check: "decorative" },
];
