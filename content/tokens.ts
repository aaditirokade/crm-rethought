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
  light: { bg: "#f9f8fc", surface: "#ffffff", surface2: "#ece9f5", draft: "#f0f2fd", accent: "#b03c77", ink: "#1e2140" },
  dark: { bg: "#11111c", surface: "#1a1a2b", surface2: "#24243a", draft: "#1f2140", accent: "#f394c4", ink: "#eceefa" },
};

export const COLORS: ColorToken[] = [
  { name: "bg", role: "The page: lavender white by day, night periwinkle at night", light: "#f9f8fc", dark: "#11111c", check: "background" },
  { name: "surface", role: "The few things that lift: Ask, triage, menus", light: "#ffffff", dark: "#1a1a2b", check: "background" },
  { name: "surface-2", role: "Quiet fills: chips, inputs, tracks", light: "#ece9f5", dark: "#24243a", check: "background" },
  { name: "draft", role: "Very light periwinkle behind lines the AI drafted", light: "#f0f2fd", dark: "#1f2140", check: "background" },
  { name: "ink", role: "Text people read; primary buttons", light: "#1e2140", dark: "#eceefa", check: "text" },
  { name: "ink-2", role: "Quiet text, labels", light: "#52566f", dark: "#a6a9c2", check: "text" },
  { name: "accent", role: "Rose: the AI and the actions it asks for (drafts, Ask, approve, waiting counts)", light: "#b03c77", dark: "#f394c4", check: "text" },
  { name: "accent-ink", role: "Text on the accent", light: "#ffffff", dark: "#2b0d1d", check: "on-accent" },
  { name: "good", role: "Approved, healthy", light: "#2b7550", dark: "#8ad9ae", check: "text" },
  { name: "warn", role: "Needs a look", light: "#b54708", dark: "#ffab70", check: "text" },
  { name: "risk", role: "At risk, overdue", light: "#b2443a", dark: "#ff9e92", check: "text" },
  { name: "line-strong", role: "Control borders", light: "#787b93", dark: "#6f7290", check: "border" },
  { name: "data", role: "Charts in periwinkle: sparklines, bars, the day strip", light: "#6576d4", dark: "#8f9cf0", check: "decorative" },
  { name: "line", role: "Hairlines, rarely used", light: "#e4e2ee", dark: "#2a2a40", check: "decorative" },
];
