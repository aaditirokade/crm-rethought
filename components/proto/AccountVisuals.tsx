"use client";

import { PULSE } from "@/content/ask";
import { MOMENTS } from "@/content/more";
import type { InteractionType } from "@/content/prototype";
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

  const ROW = 56;
  const H = Math.max(ours.length, theirs.length) * ROW + 24;
  const LX = 210;
  const RX = 550;
  const yo = (i: number) => 28 + i * ROW + ((theirs.length - ours.length) * ROW) / 2 * (ours.length < theirs.length ? 1 : 0);
  const yt = (i: number) => 28 + i * ROW + ((ours.length - theirs.length) * ROW) / 2 * (theirs.length < ours.length ? 1 : 0);

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
      <svg viewBox={`0 0 760 ${H}`} className="mt-3 w-full" role="img" aria-label={`Relationship web for ${a.name}. ${list.map((e) => `${e.ours} to ${e.theirs}: ${e.count} touches`).join("; ")}.`}>
        <text x={LX} y={14} textAnchor="end" fontSize="11" fill="var(--ink-2)" className="font-mono">
          LARKSPUR
        </text>
        <text x={RX} y={14} fontSize="11" fill="var(--ink-2)" className="font-mono">
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
              d={`M${LX + 10} ${y1} C ${(LX + RX) / 2} ${y1}, ${(LX + RX) / 2} ${y2}, ${RX - 10} ${y2}`}
              fill="none"
              stroke={left ? "var(--risk)" : "var(--ink-2)"}
              strokeOpacity={left ? 0.7 : 0.8}
              strokeWidth={Math.min(7, 1 + e.count * 1.3)}
              strokeDasharray={left || stale ? "5 5" : undefined}
            />
          );
        })}
        {ours.map((n, i) => (
          <g key={n}>
            <circle cx={LX + 4} cy={yo(i) + 8} r="5" fill="var(--ink)" />
            <text x={LX - 8} y={yo(i) + 12} textAnchor="end" fontSize="13" fontWeight="600" fill="var(--ink)">
              {n.split(" (")[0]}
            </text>
            <text x={LX - 8} y={yo(i) + 27} textAnchor="end" fontSize="11" fill="var(--ink-2)">
              {n.includes("(") ? n.split("(")[1].replace(")", "") : n === "Support" ? "Support team" : "Account Manager"}
            </text>
          </g>
        ))}
        {theirs.map((n, j) => {
          const p = person(n);
          const touched = [...edges.values()].some((e) => e.theirs === n);
          return (
            <g key={n + j}>
              <circle cx={RX - 4} cy={yt(j) + 8} r="5" fill={p?.leftAt ? "var(--risk)" : touched ? "var(--ink)" : "none"} stroke="var(--ink)" />
              <text x={RX + 8} y={yt(j) + 12} fontSize="13" fontWeight="600" fill={p?.leftAt ? "var(--ink-2)" : "var(--ink)"} textDecoration={p?.leftAt ? "line-through" : undefined}>
                {n}
              </text>
              <text x={RX + 8} y={yt(j) + 27} fontSize="11" fill={p?.leftAt ? "var(--risk)" : !p ? "var(--warn)" : !touched ? "var(--warn)" : "var(--ink-2)"} className="font-mono">
                {p?.leftAt ? "LEFT" : !p ? "NOT IN THE RECORD YET" : !touched ? "NO CONTACT YET" : p.role.split(",")[0].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 font-mono text-meta tracking-wide text-ink-2">THICKER = MORE TOUCHES · DASHED = QUIET 3+ WEEKS OR LEFT</p>
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

/** Eight weeks of usage with every interaction placed on it, and the moments that explain the line. */
export function InteractionStrip({ a }: { a: LiveAccount }) {
  const W = 760;
  const H = 210;
  const L = 48;
  const R = 20;
  const start = Date.parse("2026-09-21");
  const end = Date.parse("2026-11-15");
  const x = (t: number) => L + ((t - start) / (end - start)) * (W - L - R);
  const series = PULSE[a.id] ?? [];
  const max = Math.max(...series, 1);
  const y = (v: number) => 130 - (v / max) * 90;
  const d = series.map((v, i) => `${i ? "L" : "M"}${x(start + i * 7 * 864e5).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const touches = a.timeline.filter((t) => dateOf(t.date) >= start);
  const moments = MOMENTS[a.id] ?? [];
  const weeks = Array.from({ length: 8 }, (_, i) => start + i * 7 * 864e5);
  const fmt = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  const mark = (type: InteractionType, cx: number, cy: number) => {
    const s = SHAPE[type];
    if (s === "circle") return <circle cx={cx} cy={cy} r="5" fill="var(--ink)" />;
    if (s === "square") return <rect x={cx - 4.5} y={cy - 4.5} width="9" height="9" fill="var(--ink)" />;
    if (s === "diamond") return <path d={`M${cx} ${cy - 6}L${cx + 6} ${cy}L${cx} ${cy + 6}L${cx - 6} ${cy}Z`} fill="var(--ink)" />;
    return <path d={`M${cx} ${cy - 6}L${cx + 6} ${cy + 5}L${cx - 6} ${cy + 5}Z`} fill="var(--ink)" />;
  };

  return (
    <section aria-labelledby="h-strip" className="proto-card p-4 sm:p-5">
      <h2 id="h-strip" className="text-h3 font-semibold">
        Usage and every touch, last 8 weeks
      </h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`Weekly dashboard views for ${a.name} from Sep 21 to Nov 9, from ${series[0]} to ${series.at(-1)}, with ${touches.length} interactions marked${moments.length ? ` and these moments: ${moments.map((m) => m.text).join(", ")}` : ""}.`}>
        {weeks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={30} y2={150} stroke="var(--line)" />
            <text x={x(t)} y={168} textAnchor="middle" fontSize="11" fill="var(--ink-2)" className="font-mono">
              {fmt(t).toUpperCase()}
            </text>
          </g>
        ))}
        <text x={L - 8} y={y(max) + 4} textAnchor="end" fontSize="11" fill="var(--ink-2)" className="font-mono">
          {max}
        </text>
        <text x={L - 8} y={y(0) + 4} textAnchor="end" fontSize="11" fill="var(--ink-2)" className="font-mono">
          0
        </text>
        {moments.map((m) => (
          <g key={m.text}>
            <line x1={x(Date.parse(m.date))} x2={x(Date.parse(m.date))} y1={22} y2={150} stroke="var(--risk)" strokeDasharray="3 3" />
            <text x={x(Date.parse(m.date)) + 4} y={20} fontSize="11.5" fill="var(--risk)" className="font-mono">
              {m.text.toUpperCase()}
            </text>
          </g>
        ))}
        <path d={d} pathLength={1} className="spark-draw" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <line x1={L} x2={W - R} y1={190} y2={190} stroke="var(--line)" />
        {touches.map((t) => (
          <g key={t.key}>
            {mark(t.type, x(dateOf(t.date)), 190)}
            <title>{`${t.date} · ${t.type} · ${t.title}`}</title>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-meta text-ink-2">
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
