/* Story blocks for the case study (decision 0105): the meeting loop before and after, the experiment I'd run on
   the approval step, and what I'd do differently. A plan, not a result: Groundwork has no users yet. */

import { BASE } from "@/lib/base";

const kick = "font-mono text-meta tracking-wide text-ink-2";

const BEFORE = ["Prep from five tabs", "Take notes on paper", "Type the call in later", "A promise slips", "The record goes stale"];
const AFTER = ["Read the brief", "Talk", "Approve the drafted log", "Follow ups land on Your tasks"];

function Steps({ items, after = false }: { items: string[]; after?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {items.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`rounded-full px-3.5 py-1.5 text-small ${after ? "bg-accent font-medium text-accent-ink" : "border border-[var(--rule)] text-ink-2"}`}>{s}</span>
          {i < items.length - 1 ? <span aria-hidden="true" className="text-ink-2">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

/** The meeting loop, before and after, under the problem chapter. */
export function LoopBeforeAfter() {
  return (
    <section aria-labelledby="loop-h" className="border-t border-[var(--rule)] py-14 lg:py-16">
      <h2 id="loop-h" className="max-w-[40ch] text-[1.5rem] font-medium leading-snug tracking-tight sm:text-[1.75rem]">
        Take the typing out of the week.
      </h2>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
        The AI drafts, the person approves, and the record is current by the end of the call.
      </p>
      <div className="mt-8 grid gap-5">
        <div className="rounded-2xl border border-[var(--rule)] p-5 sm:p-6">
          <p className={kick}>BEFORE · THE RECORD IS A CHORE</p>
          <div className="mt-4"><Steps items={BEFORE} /></div>
        </div>
        <div className="rounded-2xl border-2 border-accent p-5 sm:p-6">
          <p className={kick}>AFTER · THE RECORD IS A BY PRODUCT</p>
          <div className="mt-4"><Steps items={AFTER} after /></div>
        </div>
      </div>
    </section>
  );
}

/** A small log card for the experiment: line by line, or the meeting at once. */
function MiniLog({ v }: { v: "lines" | "meeting" }) {
  const lines = ["Fernhill will renew all 40 stores on Jan 25.", "Price the 12 new stores as a separate expansion.", "Late data refreshes are their main complaint."];
  return (
    <div className="rounded-xl border border-[var(--rule)] bg-surface p-4" aria-hidden="true">
      <p className="text-[12px] font-medium text-ink-2">Fernhill · today’s call · 6 lines drafted</p>
      {v === "lines" ? (
        <ul className="mt-3 space-y-2">
          {lines.map((l) => (
            <li key={l} className="rounded-lg bg-surface-2 px-3 py-2">
              <p className="text-[13px] leading-snug">{l}</p>
              <p className="mt-1.5 flex gap-3 text-[12px] font-medium"><span className="text-accent">Approve</span><span className="text-ink-2">Edit</span><span className="text-ink-2">Dismiss</span></p>
            </li>
          ))}
          <li className="pt-1 text-center text-[12px] text-ink-2">+ 3 more, then Save</li>
        </ul>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-accent px-3 py-2">
            <p className="text-[12px] font-medium text-accent">NEEDS A LOOK · LOW CONFIDENCE</p>
            <p className="mt-1 text-[13px] leading-snug">Price the 12 new stores as a separate expansion.</p>
          </div>
          <p className="rounded-lg bg-surface-2 px-3 py-2 text-[13px] leading-snug text-ink-2">5 lines with a source and high confidence</p>
          <p className="rounded-lg bg-accent px-3 py-2 text-center text-[13px] font-medium text-accent-ink">Approve the meeting</p>
        </div>
      )}
    </div>
  );
}

const PLAN: [string, string][] = [
  ["Hypothesis", "Approving a meeting at once logs more meetings the same day, without more mistakes."],
  ["Who sees what", "Split by person, not by meeting."],
  ["Main number", "Meetings with an approved log on the same day."],
  ["Guardrails", "Edits after saving, sources opened, lines flagged later."],
  ["How long", "Four weeks, so each person has enough meetings to compare."],
  ["Decision rule", "Ship B only if same day logs rise and corrections don’t."],
];

/** The test I'd run first: line by line approval, or the meeting at once. It tests the product's own core rule. */
export function ApprovalExperiment() {
  return (
    <section aria-labelledby="ch-08" className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="max-w-[60ch]">
        <p className="font-mono text-meta tracking-wide text-accent">08 · THE TEST I’D RUN FIRST</p>
        <h2 id="ch-08" className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
          Approve every line, or approve the meeting?
        </h2>
        <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-2">
          <p>
            Approving line by line keeps the core rule strict, but it’s work, and work made CRMs go stale.
          </p>
          <p>So the first test questions the rule itself.</p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {(["lines", "meeting"] as const).map((v) => (
          <figure key={v}>
            <figcaption className="mb-3 flex items-baseline justify-between gap-3">
              <span className="font-medium">{v === "lines" ? "A · One line at a time" : "B · The meeting at once"}</span>
              <span className="text-small text-ink-2">{v === "lines" ? "Today’s design" : "The challenger"}</span>
            </figcaption>
            <MiniLog v={v} />
          </figure>
        ))}
      </div>
      <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLAN.map(([t, d]) => (
          <div key={t} className="border-t border-[var(--rule)] pt-4">
            <dt className="font-medium">{t}</dt>
            <dd className="mt-1 text-small leading-relaxed text-ink-2">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** What I'd do differently, inside the Next chapter. */
export function NextTime() {
  return (
    <div className="border-t border-[var(--rule)] pt-5">
      <p className="font-medium text-ink">What I’d do differently</p>
      <p className="mt-2">
        Talk to account managers first. Real interviews would have tested the core bet sooner.
      </p>
    </div>
  );
}

/* The three visual directions from decision 0010, drawn from their own tokens: two not taken, and why. */
type Dir = { name: string; idea: string; bg: string; surface: string; ink: string; ink2: string; line: string; accent: string; draft: string; style: "margin" | "badge" | "note"; verdict: string; kept?: boolean; dark: { bg: string; surface: string; ink: string; ink2: string; line: string; accent: string; draft: string } };
const DIRS: Dir[] = [
  { name: "Ledger", idea: "Calm and editorial, one deep green", bg: "#f6f4ef", surface: "#fffdf8", ink: "#1d1b16", ink2: "#5b574d", line: "#ddd8cc", accent: "#1f5c4a", draft: "#efeadf", style: "margin", verdict: "Drafts were marked by italics alone, which a screen reader can’t hear and low vision can miss.", dark: { bg: "#171612", surface: "#201e19", ink: "#ece8de", ink2: "#b3ad9f", line: "#36332b", accent: "#6fc2a6", draft: "#2a2720" } },
  { name: "Signal", idea: "Dense and precise, one electric blue", bg: "#f4f5f7", surface: "#ffffff", ink: "#111318", ink2: "#535866", line: "#dde0e6", accent: "#2d5bff", draft: "#eef2ff", style: "badge", verdict: "Chosen: DRAFT is a word, so everyone gets it, and density suits a tool open all day. Its blue later became today’s violet.", kept: true, dark: { bg: "#111318", surface: "#191c23", ink: "#eceef3", ink2: "#a8adba", line: "#2c303a", accent: "#8aa4ff", draft: "#1f2640" } },
  { name: "Margin note", idea: "Warm and human, a clay accent", bg: "#fbf8f3", surface: "#ffffff", ink: "#2a2420", ink2: "#6b5f57", line: "#e7ded3", accent: "#b4532a", draft: "#fdf1d8", style: "note", verdict: "The clay sat too close to the warning colors a risk flag needs, and drafts relied on a tint.", dark: { bg: "#1a1714", surface: "#221e1a", ink: "#efe7df", ink2: "#b9aca1", line: "#3a332c", accent: "#e08a62", draft: "#3a2f1c" } },
];

/* Each direction in the site's theme (Nov 2026, decision 0117): its light palette, or a dark one drawn from the same
   hues, set as CSS variables and picked by .dir-card in globals.css. */
function DirCard({ d }: { d: Dir }) {
  const line = "Fernhill will renew all 40 stores on Jan 25.";
  const vars = Object.fromEntries(
    (["bg", "surface", "ink", "ink2", "line", "accent", "draft"] as const).flatMap((k) => [[`--${k}-l`, d[k]], [`--${k}-d`, d.dark[k]]]),
  ) as React.CSSProperties;
  return (
    <div className="dir-card rounded-xl p-4" style={{ ...vars, background: "var(--d-bg)", color: "var(--d-ink)", border: "1px solid var(--d-line)" }} aria-hidden="true">
      <div className="flex gap-1.5">
        {(["ink", "accent", "draft", "line"] as const).map((c) => (
          <span key={c} className="h-4 w-4 rounded-full" style={{ background: `var(--d-${c})`, border: "1px solid var(--d-line)" }} />
        ))}
      </div>
      <div className="mt-3 rounded-lg p-3" style={{ background: "var(--d-surface)", border: "1px solid var(--d-line)" }}>
        {d.style === "badge" ? (
          <p className="text-[12.5px] leading-snug">
            <span className="mr-1.5 rounded px-1.5 py-0.5 font-mono text-[12px] font-semibold" style={{ background: "var(--d-draft)", color: "var(--d-accent)" }}>DRAFT</span>
            {line}
          </p>
        ) : d.style === "margin" ? (
          <p className="border-l-2 pl-2 text-[12.5px] italic leading-snug" style={{ borderColor: "var(--d-line)", color: "var(--d-ink2)" }}>{line}</p>
        ) : (
          <p className="rounded-md px-2 py-1.5 text-[12.5px] leading-snug" style={{ background: "var(--d-draft)" }}>{line}</p>
        )}
        <p className="mt-2 text-[12px] font-semibold" style={{ color: "var(--d-accent)" }}>Approve</p>
      </div>
    </div>
  );
}

/** Directions I didn't take: the three visual directions side by side, with the reason each was kept or dropped. */
export function DirectionsNotTaken() {
  return (
    <section aria-labelledby="dirs-h" className="border-t border-[var(--rule)] py-14 lg:py-16">
      <h2 id="dirs-h" className="max-w-[40ch] text-[1.5rem] font-medium leading-snug tracking-tight sm:text-[1.75rem]">
        Three directions, one kept
      </h2>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
        Three directions, judged on one question: does someone who can’t see color still know a line is a draft?
      </p>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {DIRS.map((d) => (
          <li key={d.name}>
            <DirCard d={d} />
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-medium">{d.name}</span>
              <span className={`font-mono text-meta ${d.kept ? "text-accent" : "text-ink-2"}`}>{d.kept ? "KEPT" : "DROPPED"}</span>
            </p>
            <p className="text-small text-ink-2">{d.idea}</p>
            <p className="mt-2 text-small leading-relaxed text-ink-2">{d.verdict}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-ink-2">
        The three, as they were judged:{" "}
        <a href={`${BASE}/directions`} className="font-medium text-ink underline underline-offset-4">see the directions page</a>.
      </p>
    </section>
  );
}

/** When the AI is wrong (decision 0107): how sure it is, how a person says it was wrong, and what the team sees. */
export function WhenWrong() {
  const chip = (t: string, on = false) => (
    <span className={`rounded-full border px-2 py-0.5 text-[12px] ${on ? "border-accent bg-accent text-accent-ink" : "border-[var(--rule)] text-ink-2"}`}>{t}</span>
  );
  const panels: { title: string; body: string; ui: React.ReactNode }[] = [
    {
      title: "It says how sure it is",
      body: "Every AI line carries its confidence. Medium means check this.",
      ui: (
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-[13px] leading-snug">Price the 12 new stores as a separate expansion.</p>
          <p className="mt-2 font-mono text-[12px] tracking-wide text-ink-2">CONFIDENCE MEDIUM · CHECK THIS</p>
        </div>
      ),
    },
    {
      title: "Saying no takes one tap, and says why",
      body: "Dismiss a line and tap why. Undo is always there.",
      ui: (
        <div className="rounded-lg border border-[var(--rule)] p-3">
          <p className="text-[13px] text-ink-2">Dismissed: Late data refreshes are their main complaint.</p>
          <p className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[12px] tracking-wide text-ink-2">SENT TO THE TEAM ·</span>
            {chip("Wrong")}
            {chip("Out of date", true)}
            {chip("Wrong source")}
          </p>
        </div>
      ),
    },
    {
      title: "The team sees the pattern",
      body: "Corrections gather by source, so a bad source gets checked first.",
      ui: (
        <div className="rounded-lg border border-[var(--rule)] p-3">
          <p className="flex justify-between font-mono text-[12px] tracking-wide text-ink-2">
            <span>WRONG 1</span>
            <span>OUT OF DATE 2</span>
            <span>SOURCE 1</span>
          </p>
          <p className="mt-2 border-l-2 border-accent pl-2 text-[12.5px] leading-snug">3 corrections trace back to Ticket 4821. Worth checking that source first.</p>
        </div>
      ),
    },
  ];
  return (
    <section aria-labelledby="wrong-h" className="border-t border-[var(--rule)] py-14 lg:py-16">
      <h2 id="wrong-h" className="max-w-[40ch] text-[1.5rem] font-medium leading-snug tracking-tight sm:text-[1.75rem]">
        Designed for the moment the AI is wrong
      </h2>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
        One bad suggestion breeds doubt, so how sure the AI is and how people correct it were designed first.
      </p>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {panels.map((p, i) => (
          <li key={p.title}>
            {p.ui}
            <p className="mt-3 font-medium">
              <span className="text-ink-2">{i + 1}.</span> {p.title}
            </p>
            <p className="mt-1 text-small leading-relaxed text-ink-2">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-small text-ink-2">Try it: dismiss any line or flag an Ask answer in the prototype, then open Review.</p>
    </section>
  );
}
