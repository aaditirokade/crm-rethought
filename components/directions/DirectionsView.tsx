"use client";

import { useState } from "react";

export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  ink2: string;
  line: string;
  accent: string;
  accentInk: string;
  draft: string;
};

export type Direction = {
  id: string;
  name: string;
  idea: string;
  mood: string[];
  type: { display: string; body: string; mono: string; note: string };
  base: number;
  radius: number;
  draftStyle: "margin" | "badge" | "note";
  draftNote: string;
  light: Palette;
  dark: Palette;
};

/** WCAG 2 contrast ratio between two hex colors, rounded to one decimal. */
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [r, g, bl] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10;
}

function Swatch({ color, name, ratio }: { color: string; name: string; ratio?: string }) {
  return (
    <li className="flex items-center gap-3">
      <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-md border border-line" style={{ background: color }} />
      <span className="text-sm">
        {name} <span className="text-ink-2">{color}</span>
        {ratio ? <span className="block text-xs text-ink-2">{ratio}</span> : null}
      </span>
    </li>
  );
}

function Preview({ d, p }: { d: Direction; p: Palette }) {
  const [approved, setApproved] = useState(false);
  const vars = {
    "--bg": p.bg,
    "--surface": p.surface,
    "--ink": p.ink,
    "--ink2": p.ink2,
    "--line": p.line,
    "--accent": p.accent,
    "--accentInk": p.accentInk,
    "--draft": p.draft,
    "--r": `${d.radius}px`,
    fontFamily: d.type.body,
    fontSize: `${d.base}px`,
  } as React.CSSProperties;

  const block = (isDraft: boolean) => {
    if (d.draftStyle === "margin") return isDraft ? "border-l-2 border-[var(--ink2)] pl-3.5 italic" : "border-l-2 border-transparent pl-3.5";
    if (d.draftStyle === "badge") return `rounded-[var(--r)] px-3 py-2.5 ${isDraft ? "bg-[var(--draft)]" : ""}`;
    return `rounded-[var(--r)] border p-3.5 ${isDraft ? "border-dashed border-[var(--ink2)] bg-[var(--draft)]" : "border-[var(--line)]"}`;
  };

  const label = (isDraft: boolean, when?: string) => {
    if (d.draftStyle === "badge")
      return (
        <span
          className="rounded-sm border px-1 text-[11px] tracking-wide"
          style={{ fontFamily: d.type.mono, borderColor: isDraft ? "var(--accent)" : "transparent", color: "var(--accent)" }}
        >
          {isDraft ? "DRAFT" : `✓ APPROVED ${when ?? ""}`}
        </span>
      );
    if (d.draftStyle === "margin")
      return (
        <span className={`text-xs uppercase tracking-[0.12em] not-italic ${isDraft ? "text-[var(--ink2)]" : "text-[var(--accent)]"}`}>
          {isDraft ? "Draft" : `Approved ${when ?? ""}`}
        </span>
      );
    return (
      <span className={`text-xs font-semibold ${isDraft ? "text-[var(--ink2)]" : "text-[var(--accent)]"}`}>
        {isDraft ? "Suggested" : `✓ Approved by you ${when ?? ""}`}
      </span>
    );
  };

  const chip = (text: string) => (
    <span
      className="inline-flex items-center rounded-full border border-[var(--ink2)] px-2 text-[0.8em] text-[var(--ink2)]"
      style={d.draftStyle === "badge" ? { fontFamily: d.type.mono } : undefined}
    >
      {text}
    </span>
  );

  return (
    <div style={vars} className="self-start rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 text-[var(--ink)] sm:p-6">
      <p className="text-[0.85em] text-[var(--ink2)]">Quarterly review · Today, 10:00 · last spoke Oct 14</p>
      <p className="mt-1 text-[1.9em] leading-tight" style={{ fontFamily: d.type.display }}>
        Fernhill Outfitters
      </p>
      <div className="mt-5 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-4">
        <p className="font-semibold">What changed since Oct 14</p>
        <div className={`mt-3 ${block(!approved)}`}>
          {label(!approved, "10:44")}
          <p className="mt-1 leading-relaxed">Lena Ortiz, your day to day contact, has left Fernhill.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.85em] text-[var(--ink2)] not-italic">
            {chip("Email · Nov 3")}
            <span>Confidence: medium</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 not-italic">
            {approved ? (
              <button
                type="button"
                className="rounded-[var(--r)] border border-[var(--ink2)] px-3 py-1 text-[0.9em]"
                onClick={() => setApproved(false)}
              >
                Undo
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-[var(--r)] bg-[var(--accent)] px-3 py-1 text-[0.9em] font-semibold text-[var(--accentInk)]"
                  onClick={() => setApproved(true)}
                >
                  Approve: mark as left
                </button>
                <button type="button" className="rounded-[var(--r)] border border-[var(--ink2)] px-3 py-1 text-[0.9em]">
                  Not right
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`mt-3 ${block(false)}`}>
          {label(false, "Nov 12")}
          <p className="mt-1 leading-relaxed">Fernhill will renew all 40 stores on Jan 25.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.85em] text-[var(--ink2)]">
            {chip("Call · 12:05")}
            <span>Confidence: high</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DirectionsView({ directions }: { directions: Direction[] }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Preview theme">
        <span className="text-sm text-ink-2">Preview in</span>
        {(["light", "dark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md border px-3 py-1 text-sm ${mode === m ? "border-ink bg-ink text-paper" : "border-ink-2"}`}
          >
            {m === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>

      <ol className="mt-10 space-y-16">
        {directions.map((d, i) => {
          const p = mode === "dark" ? d.dark : d.light;
          return (
            <li key={d.id} aria-labelledby={`dir-${d.id}`}>
              <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
                <div>
                  <p className="text-sm text-ink-2">Direction {String.fromCharCode(65 + i)}</p>
                  <h2 id={`dir-${d.id}`} className="mt-1 text-2xl font-semibold">
                    {d.name}
                  </h2>
                  <p className="mt-2 leading-relaxed">{d.idea}</p>
                  <p className="mt-2 text-sm text-ink-2">{d.mood.join(" · ")}</p>
                  <h3 className="mt-5 text-sm font-semibold">Type</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{d.type.note}</p>
                  <h3 className="mt-5 text-sm font-semibold">Draft or approved</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{d.draftNote}</p>
                  <h3 className="mt-5 text-sm font-semibold">Color ({mode})</h3>
                  <ul className="mt-2 space-y-2">
                    <Swatch color={p.bg} name="Paper" ratio={`Ink on paper ${contrast(p.ink, p.bg)}:1`} />
                    <Swatch color={p.ink2} name="Quiet ink" ratio={`On paper ${contrast(p.ink2, p.bg)}:1 · on draft ${contrast(p.ink2, p.draft)}:1`} />
                    <Swatch color={p.accent} name="Accent" ratio={`On paper ${contrast(p.accent, p.bg)}:1 · label on it ${contrast(p.accentInk, p.accent)}:1`} />
                    <Swatch color={p.draft} name="Draft" ratio={`Ink on draft ${contrast(p.ink, p.draft)}:1`} />
                  </ul>
                </div>
                <Preview d={d} p={p} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
