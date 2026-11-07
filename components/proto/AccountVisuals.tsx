"use client";

import { useState } from "react";
import { PULSE } from "@/content/ask";
import { MOMENTS } from "@/content/more";
import type { InteractionType } from "@/content/prototype";
import { PULSE_EARLIER, TOUCHES_EARLIER } from "@/content/usage-history";
import { SourceChip } from "./Source";
import type { LiveAccount } from "./store";

const TODAY = Date.parse("2026-11-12");
const dateOf = (d: string) => Date.parse(`${d} 2026`);

/** Who on our side talks to whom on theirs. Thicker = more touches; dashed = quiet for 3 weeks or more. */
export function RelationshipWeb({ a }: { a: LiveAccount }) {
  type Edge = { ours: string; theirs: string; count: number; last: number };
  const edges = new Map<string, Edge>();
  for (const t of a.timeline) {
    for (const name of t.with?.split(", ") ?? []) {
      const key = `${t.ours}|${name}`;
      const e = edges.get(key) ?? { ours: t.ours, theirs: name, count: 0, last: 0 };
      e.count++;
      e.last = Math.max(e.last, dateOf(t.date));
      edges.set(key, e);
    }
  }
  const ours = [...new Set([...edges.values()].map((e) => e.ours))];
  const recordNames = [...new Set(a.people.map((p) => p.name))];
  const extra = [...new Set([...edges.values()].map((e) => e.theirs))].filter((n) => !recordNames.includes(n));
  const theirs = [...recordNames, ...extra];
  const person = (n: string) => a.people.find((p) => p.name === n);

  // Drawn at its real size (600 wide) so the type stays small and the lines stay fine.
  const ROW = 42;
  const TOP = 30;
  const H = Math.max(ours.length, theirs.length) * ROW + TOP;
  const LX = 160;
  const RX = 440;
  const yo = (i: number) => TOP + i * ROW + ((theirs.length - ours.length) * ROW) / 2 * (ours.length < theirs.length ? 1 : 0);
  const yt = (i: number) => TOP + i * ROW + ((ours.length - theirs.length) * ROW) / 2 * (theirs.length < ours.length ? 1 : 0);

  const list = [...edges.values()];
  const strongest = list.sort((x, y) => y.count - x.count)[0];
  const strongestLeft = strongest && person(strongest.theirs)?.leftAt !== undefined;
  const leftByRecord = strongest ? a.people.some((p) => p.name === strongest.theirs && p.leftAt) : false;
  const untouched = theirs.filter((n) => ![...edges.values()].some((e) => e.theirs === n) && !person(n)?.leftAt);

  return (
    <section aria-labelledby="h-web" className="proto-card p-4 sm:p-5">
      <h2 id="h-web" className="text-h3 font-semibold">
        Who talks to whom
      </h2>
      <p className="text-small text-ink-2">
        {strongest ? `Your strongest line is ${strongest.ours.split(" (")[0]} to ${strongest.theirs}, with ${strongest.count} touches. ` : ""}
        {strongest && (strongestLeft || leftByRecord) ? `${strongest.theirs} has left, so that relationship needs rebuilding. ` : ""}
        {untouched.length ? `Nobody on our side has spoken with ${untouched.join(" or ")} yet.` : ""}
      </p>
      <svg viewBox={`0 0 600 ${H}`} className="mx-auto mt-4 block w-full max-w-[640px]" role="img" aria-label={`Relationship web for ${a.name}. ${list.map((e) => `${e.ours} to ${e.theirs}: ${e.count} touches`).join("; ")}.`}>
        <text x={LX + 3} y={10} textAnchor="end" fontSize="10" letterSpacing="0.06em" fill="var(--ink-2)" className="font-mono">
          LARKSPUR
        </text>
        <text x={RX - 3} y={10} fontSize="10" letterSpacing="0.06em" fill="var(--ink-2)" className="font-mono">
          {a.name.toUpperCase()}
        </text>
        {list.map((e) => {
          const i = ours.indexOf(e.ours);
          const j = theirs.indexOf(e.theirs);
          const left = !!person(e.theirs)?.leftAt;
          const stale = TODAY - e.last > 21 * 864e5;
          const y1 = yo(i) + 8;
          const y2 = yt(j) + 8;
          return (
            <path
              key={e.ours + e.theirs}
              d={`M${LX + 7} ${y1} C ${(LX + RX) / 2} ${y1}, ${(LX + RX) / 2} ${y2}, ${RX - 7} ${y2}`}
              fill="none"
              stroke={left ? "var(--risk)" : "var(--ink-2)"}
              strokeOpacity={left ? 0.8 : 0.85}
              strokeWidth={Math.min(3.5, 0.75 + e.count * 0.7)}
              strokeLinecap="round"
              strokeDasharray={left || stale ? "2 4" : undefined}
            />
          );
        })}
        {ours.map((n, i) => (
          <g key={n}>
            <circle cx={LX + 3} cy={yo(i) + 8} r="3" fill="var(--ink)" />
            <text x={LX - 7} y={yo(i) + 12} textAnchor="end" fontSize="12.5" fontWeight="500" fill="var(--ink)">
              {n.split(" (")[0]}
            </text>
            <text x={LX - 7} y={yo(i) + 25} textAnchor="end" fontSize="10.5" fill="var(--ink-2)">
              {n.includes("(") ? n.split("(")[1].replace(")", "") : n === "Support" ? "Support team" : "Account Manager"}
            </text>
          </g>
        ))}
        {theirs.map((n, j) => {
          const p = person(n);
          const touched = [...edges.values()].some((e) => e.theirs === n);
          return (
            <g key={n + j}>
              <circle cx={RX - 3} cy={yt(j) + 8} r="3" fill={p?.leftAt ? "var(--risk)" : touched ? "var(--ink)" : "none"} stroke={p?.leftAt ? "var(--risk)" : "var(--ink)"} strokeWidth="1" />
              <text x={RX + 7} y={yt(j) + 12} fontSize="12.5" fontWeight="500" fill={p?.leftAt ? "var(--ink-2)" : "var(--ink)"} textDecoration={p?.leftAt ? "line-through" : undefined}>
                {n}
              </text>
              <text x={RX + 7} y={yt(j) + 25} fontSize="10" letterSpacing="0.04em" fill={p?.leftAt ? "var(--risk)" : !p ? "var(--warn)" : !touched ? "var(--warn)" : "var(--ink-2)"} className="font-mono">
                {p?.leftAt ? "LEFT" : !p ? "NOT IN THE RECORD YET" : !touched ? "NO CONTACT YET" : p.role.split(",")[0].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3 font-mono text-meta tracking-wide text-ink-2">THICKER = MORE TOUCHES · DASHED = QUIET 3+ WEEKS OR LEFT</p>
    </section>
  );
}

const SHAPE: Record<InteractionType, string> = {
  Call: "circle",
  Video: "circle",
  "In person": "diamond",
  Event: "diamond",
  Email: "square",
  Ticket: "triangle",
};

const WEEK = 7 * 864e5;
const LAST_WEEK = Date.parse("2026-11-09");
const RANGES = [
  { weeks: 4, label: "4 weeks", title: "last 4 weeks" },
  { weeks: 8, label: "8 weeks", title: "last 8 weeks" },
  { weeks: 26, label: "6 months", title: "last 6 months" },
  { weeks: 52, label: "1 year", title: "past year" },
] as const;

/** Usage with every interaction placed on it, and the moments that explain the line, over a range the person picks. */
export function InteractionStrip({ a }: { a: LiveAccount }) {
  const [weeksShown, setWeeksShown] = useState<number>(8);
  const range = RANGES.find((r) => r.weeks === weeksShown) ?? RANGES[1];
  // Drawn at its real size (600 wide): a slim line over a single row of marks.
  const W = 600;
  const H = 150;
  const L = 34;
  const R = 14;
  const ROW = 140;
  const start = LAST_WEEK - (range.weeks - 1) * WEEK;
  const end = Date.parse("2026-11-15");
  const x = (t: number) => L + ((t - start) / (end - start)) * (W - L - R);
  const fmt = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const series = [...(PULSE_EARLIER[a.id] ?? []), ...(PULSE[a.id] ?? [])].slice(-range.weeks);
  const offset = range.weeks - series.length;
  const max = Math.max(...series, 1);
  const y = (v: number) => 96 - (v / max) * 64;
  const d = series.map((v, i) => `${i ? "L" : "M"}${x(start + (i + offset) * WEEK).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const touches = [
    ...(TOUCHES_EARLIER[a.id] ?? []).map((t) => ({ key: `earlier-${t.date}`, at: Date.parse(t.date), type: t.type, label: `${fmt(Date.parse(t.date))} · ${t.type} · ${t.title}` })),
    ...a.timeline.map((t) => ({ key: t.key, at: dateOf(t.date), type: t.type, label: `${t.date} · ${t.type} · ${t.title}` })),
  ].filter((t) => t.at >= start);
  const moments = (MOMENTS[a.id] ?? []).filter((m) => Date.parse(m.date) >= start);
  // Weekly ticks for the short ranges; the first of each month for the long ones, with the year on January.
  const ticks: { t: number; label: string }[] = [];
  if (range.weeks <= 8) {
    for (let i = 0; i < range.weeks; i++) ticks.push({ t: start + i * WEEK, label: fmt(start + i * WEEK).toUpperCase() });
  } else {
    const s0 = new Date(start);
    for (let m = new Date(Date.UTC(s0.getUTCFullYear(), s0.getUTCMonth() + 1, 1)); m.getTime() < end; m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1))) {
      const mon = m.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
      ticks.push({ t: m.getTime(), label: m.getUTCMonth() === 0 ? `${mon} ’${String(m.getUTCFullYear()).slice(2)}` : mon });
    }
  }
  const firstWeek = start + offset * WEEK;
  // Moment labels: flip to the left of their line near the right edge, and drop to a second row when two would touch.
  const placed: { text: string; x: number; y: number; end: boolean }[] = [];
  for (const m of [...moments].sort((p, q) => Date.parse(p.date) - Date.parse(q.date))) {
    const mx = x(Date.parse(m.date));
    const w = m.text.length * 6.6;
    const end = mx + 4 + w > W - R;
    const from = end ? mx - 4 - w : mx + 4;
    const prev = placed.at(-1);
    const prevTo = prev ? (prev.end ? prev.x - 4 : prev.x + 4 + prev.text.length * 6.6) : -Infinity;
    const clash = prev && prev.y === 12 && from < prevTo + 8;
    placed.push({ text: m.text, x: mx, y: clash ? 24 : 12, end });
  }

  const mark = (type: InteractionType, cx: number, cy: number) => {
    const s = SHAPE[type];
    if (s === "circle") return <circle cx={cx} cy={cy} r="3.25" fill="var(--ink)" />;
    if (s === "square") return <rect x={cx - 3} y={cy - 3} width="6" height="6" fill="var(--ink)" />;
    if (s === "diamond") return <path d={`M${cx} ${cy - 4.25}L${cx + 4.25} ${cy}L${cx} ${cy + 4.25}L${cx - 4.25} ${cy}Z`} fill="var(--ink)" />;
    return <path d={`M${cx} ${cy - 4}L${cx + 4.25} ${cy + 3.5}L${cx - 4.25} ${cy + 3.5}Z`} fill="var(--ink)" />;
  };

  return (
    <section aria-labelledby="h-strip" className="proto-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id="h-strip" className="text-h3 font-semibold">
          Usage and every touch, {range.title}
        </h2>
        <div role="group" aria-label="Time range" className="seg">
          {RANGES.map((r) => (
            <button key={r.weeks} type="button" className="seg-btn" aria-pressed={r.weeks === range.weeks} onClick={() => setWeeksShown(r.weeks)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 block w-full max-w-[640px]" role="img" aria-label={`Weekly dashboard views for ${a.name} from ${fmt(firstWeek)} to Nov 9, from ${series[0]} to ${series.at(-1)}, with ${touches.length} interactions marked${moments.length ? ` and these moments: ${moments.map((m) => m.text).join(", ")}` : ""}.`}>
        {ticks.map(({ t, label }) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={26} y2={104} stroke="var(--line)" strokeOpacity="0.7" />
            <text x={x(t)} y={120} textAnchor="middle" fontSize="10" letterSpacing="0.04em" fill="var(--ink-2)" className="font-mono">
              {label}
            </text>
          </g>
        ))}
        <text x={L - 7} y={y(max) + 3.5} textAnchor="end" fontSize="10" fill="var(--ink-2)" className="font-mono">
          {max}
        </text>
        <text x={L - 7} y={y(0) + 3.5} textAnchor="end" fontSize="10" fill="var(--ink-2)" className="font-mono">
          0
        </text>
        {placed.map((m) => (
          <g key={m.text}>
            <line x1={m.x} x2={m.x} y1={m.y + 4} y2={104} stroke="var(--risk)" strokeDasharray="2 3" />
            <text x={m.end ? m.x - 4 : m.x + 4} y={m.y} textAnchor={m.end ? "end" : "start"} fontSize="10" letterSpacing="0.04em" fill="var(--risk)" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke" className="font-mono">
              {m.text.toUpperCase()}
            </text>
          </g>
        ))}
        <path key={range.weeks} d={d} pathLength={1} className="spark-draw" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <line x1={L} x2={W - R} y1={ROW} y2={ROW} stroke="var(--line)" />
        {touches.map((t) => (
          <g key={t.key}>
            {mark(t.type, x(t.at), ROW)}
            <title>{t.label}</title>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-meta text-ink-2">
        <span>
          <span aria-hidden="true" className="text-accent">
            ━
          </span>{" "}
          WEEKLY DASHBOARD VIEWS
        </span>
        <span>{"●"} CALL OR VIDEO</span>
        <span>{"◆"} IN PERSON OR EVENT</span>
        <span>{"■"} EMAIL</span>
        <span>{"▲"} TICKET</span>
        {moments.map((m) => (
          <span key={m.text} className="inline-flex items-center gap-1">
            {m.text.toUpperCase()}: <SourceChip id={m.source} />
          </span>
        ))}
      </div>
    </section>
  );
}
