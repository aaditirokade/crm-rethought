import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Sans, Instrument_Serif, Inter, Newsreader } from "next/font/google";
import Link from "next/link";
import { DirectionsView, type Direction } from "@/components/directions/DirectionsView";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--f-newsreader", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--f-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-plex-mono", display: "swap" });
const instSans = Instrument_Sans({ subsets: ["latin"], variable: "--f-inst-sans", display: "swap" });
const instSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--f-inst-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Visual directions · CRM Rethought",
  description: "Three visual directions for CRM Rethought, each applied to the same piece of a meeting brief.",
};

/* Every text pair below passes WCAG AA (4.5:1); the page prints the ratios it computes. */
const DIRECTIONS: Direction[] = [
  {
    id: "ledger",
    name: "Ledger",
    idea: "Calm and editorial, like a well kept notebook. Quiet paper, one deep green, generous space.",
    mood: ["calm", "trustworthy", "unhurried"],
    type: {
      display: "var(--f-newsreader)",
      body: "var(--f-inter)",
      mono: "var(--f-inter)",
      note: "Newsreader for account names and headings, Inter for everything you read and click. 15px base.",
    },
    base: 15,
    radius: 6,
    draftStyle: "margin",
    draftNote:
      "Drafts sit in italic behind a margin rule, like an editor's note. Approval turns them upright and drops the rule.",
    light: { bg: "#f6f4ef", surface: "#fffdf8", ink: "#1d1b16", ink2: "#5b574d", line: "#ddd8cc", accent: "#1f5c4a", accentInk: "#ffffff", draft: "#efeadf" },
    dark: { bg: "#14130f", surface: "#1c1b16", ink: "#ede9df", ink2: "#aaa496", line: "#34322a", accent: "#7cc4a9", accentInk: "#10201a", draft: "#24231c" },
  },
  {
    id: "signal",
    name: "Signal",
    idea: "A dense, fast work tool. Cool grays, an electric blue, more on screen at once.",
    mood: ["precise", "fast", "technical"],
    type: {
      display: "var(--f-plex-sans)",
      body: "var(--f-plex-sans)",
      mono: "var(--f-plex-mono)",
      note: "IBM Plex Sans throughout, Plex Mono for sources, times and status. 13px base for density.",
    },
    base: 13,
    radius: 4,
    draftStyle: "badge",
    draftNote: "Drafts carry a DRAFT tag and a tinted row. Approval swaps the tag for a check and a timestamp.",
    light: { bg: "#f4f5f7", surface: "#ffffff", ink: "#111318", ink2: "#535866", line: "#dde0e6", accent: "#2d5bff", accentInk: "#ffffff", draft: "#eef2ff" },
    dark: { bg: "#0d0f13", surface: "#151820", ink: "#e8eaf0", ink2: "#9aa1b0", line: "#262a34", accent: "#7d9bff", accentInk: "#0b1020", draft: "#182038" },
  },
  {
    id: "notebook",
    name: "Margin note",
    idea: "Warm and human. Soft paper, a clay accent, rounder shapes. The AI feels like a colleague's sticky note.",
    mood: ["warm", "friendly", "approachable"],
    type: {
      display: "var(--f-inst-serif)",
      body: "var(--f-inst-sans)",
      mono: "var(--f-inst-sans)",
      note: "Instrument Serif for names and headings, Instrument Sans for the rest. 15px base.",
    },
    base: 15,
    radius: 10,
    draftStyle: "note",
    draftNote: "Drafts sit on a pale yellow note with a dashed edge. Approved lines become plain paper.",
    light: { bg: "#fbf8f3", surface: "#ffffff", ink: "#2a2420", ink2: "#6b5f57", line: "#e7ded3", accent: "#b4532a", accentInk: "#ffffff", draft: "#fdf1d8" },
    dark: { bg: "#1a1613", surface: "#231e1a", ink: "#f3ece4", ink2: "#b8aca0", line: "#3a322b", accent: "#f0a07a", accentInk: "#2a1407", draft: "#3a3020" },
  },
];

export default function Directions() {
  const fonts = [newsreader, inter, plexSans, plexMono, instSans, instSerif].map((f) => f.variable).join(" ");
  return (
    <main className={`mx-auto max-w-6xl px-4 py-10 ${fonts}`}>
      <p className="text-sm text-ink-2">
        <Link href="/wireframes" className="underline underline-offset-4">
          Wireframes
        </Link>{" "}
        / Visual directions
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Three visual directions</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">
        The same piece of a meeting brief in three looks. Each also answers the question the whole product rests on:
        how do you tell, at a glance, a line the AI drafted from a fact a person approved? Try Approve in each, and
        switch to dark. One gets picked, then becomes the token set.
      </p>
      <div className="mt-8">
        <DirectionsView directions={DIRECTIONS} />
      </div>
    </main>
  );
}
