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
  light: { bg: "#f7f8fc", surface: "#ffffff", surface2: "#e5e8f3", draft: "#edf1fc", accent: "#554bf5", ink: "#20222b" },
  dark: { bg: "#10111a", surface: "#181a25", surface2: "#212433", draft: "#23242e", accent: "#9a95ff", ink: "#e8eaf2" },
};

export const COLORS: ColorToken[] = [
  { name: "bg", role: "The page: cool white by day, deep navy charcoal at night", light: "#f7f8fc", dark: "#10111a", check: "background" },
  { name: "surface", role: "The few things that lift: Ask, triage, menus", light: "#ffffff", dark: "#181a25", check: "background" },
  { name: "surface-2", role: "Quiet fills: chips, inputs, tracks", light: "#e5e8f3", dark: "#212433", check: "background" },
  { name: "draft", role: "Periwinkle wash behind lines the AI drafted", light: "#edf1fc", dark: "#23242e", check: "background" },
  { name: "ink", role: "Text people read; primary buttons", light: "#20222b", dark: "#e8eaf2", check: "text" },
  { name: "ink-2", role: "Quiet text, labels", light: "#4f5466", dark: "#a2a6b4", check: "text" },
  { name: "accent", role: "The AI's color: drafts, Ask, waiting counts", light: "#554bf5", dark: "#9a95ff", check: "text" },
  { name: "accent-ink", role: "Text on the accent", light: "#ffffff", dark: "#1a1c3a", check: "on-accent" },
  { name: "good", role: "Approved, healthy", light: "#2b7550", dark: "#8ad9ae", check: "text" },
  { name: "warn", role: "Needs a look", light: "#b54708", dark: "#ffab70", check: "text" },
  { name: "risk", role: "At risk, overdue", light: "#b2443a", dark: "#ff9e92", check: "text" },
  { name: "line-strong", role: "Control borders", light: "#73798f", dark: "#6d707d", check: "border" },
  { name: "data", role: "Charts: sparklines, bars, the day strip", light: "#009aa3", dark: "#00E5E5", check: "decorative" },
  { name: "line", role: "Hairlines, rarely used", light: "#dadeed", dark: "#292a2c", check: "decorative" },
];
