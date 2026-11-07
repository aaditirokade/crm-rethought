"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const reduceQuery = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(reduceQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/** Counts from 0 to `to` over `ms` each time `run` changes, or shows `to` at once when motion is reduced. */
function useCount(to: number, run: number, still: boolean, ms = 1100) {
  const [n, setN] = useState(still ? to : 0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = still ? 1 : Math.min(1, (t - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, still, ms]);
  return n;
}

const BEATS = [
  {
    tab: "A seller's week",
    n: 40,
    text: "of a seller's time goes to selling.",
    src: "Salesforce State of Sales 2026, survey of 4,050 sales pros",
  },
  {
    tab: "Typing up the call",
    n: 68,
    text: "of sellers say note taking and data entry take the most time.",
    src: "Salesforce State of Sales, via Attention (secondary)",
  },
  {
    tab: "Trusting the record",
    n: 76,
    text: "of CRM users say less than half their CRM data is accurate.",
    src: "Validity 2025 survey, via Cirrus Insight (secondary)",
  },
] as const;

const BEAT_MS = 5600;

function Week() {
  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`pr-rise h-14 rounded-lg ${i < 4 ? "bg-data" : "border border-[var(--line-strong)] bg-surface-2"}`}
            style={{ animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-10 gap-1.5 font-mono text-meta text-ink-2">
        <span className="col-span-4 border-t border-ink pt-1.5">SELLING</span>
        <span className="col-span-6 border-t border-[var(--line-strong)] pt-1.5">LOGGING, ADMIN, INTERNAL MEETINGS</span>
      </div>
    </div>
  );
}

function Typing({ run, still }: { run: number; still: boolean }) {
  const min = useCount(18, run, still, 2600);
  const fields = [
    ["Next step", "Send a fix date for the refreshes by Friday"],
    ["Notes", "Lena left; Priya now owns the account. Usage down since Oct 20"],
    ["Stage", "Renewal · at risk"],
  ];
  return (
    <div className="rounded-xl border border-[var(--line-strong)] bg-surface p-4">
      <div className="flex items-center justify-between font-mono text-meta text-ink-2">
        <span>LOG A CALL · FERNHILL OUTFITTERS</span>
        <span className="tabular-nums text-ink">{min} MIN</span>
      </div>
      <dl className="mt-3 space-y-2.5">
        {fields.map(([k, v], i) => (
          <div key={k} className="grid grid-cols-[6rem_1fr] items-baseline gap-3 text-small">
            <dt className="text-ink-2">{k}</dt>
            <dd className="min-w-0 truncate border-b border-[var(--line)] pb-1">
              <span className="pr-type inline-block max-w-full" style={{ animationDelay: `${300 + i * 1300}ms` }}>
                {v}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Stale() {
  const rows = [
    ["Fernhill Outfitters", "94 days ago", true],
    ["Brightwater Grocers", "2 days ago", false],
    ["Larkspur Market", "61 days ago", true],
    ["Harbor Lane Books", "120 days ago", true],
    ["Juniper & Co", "47 days ago", true],
    ["Oakridge Pantry", "5 days ago", false],
    ["Northgate Supply", "88 days ago", true],
    ["Cedar Row Hardware", "73 days ago", true],
  ] as const;
  return (
    <ul className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line-strong)] bg-surface text-small">
      {rows.map(([name, when, stale], i) => (
        <li key={name} className="flex items-center justify-between gap-3 px-4 py-1">
          <span>{name}</span>
          <span className="flex items-center gap-2 font-mono text-meta">
            <span className="text-ink-2">UPDATED {when.toUpperCase()}</span>
            {stale ? (
              <span className="pr-flag rounded-full bg-[var(--warn-wash)] px-2 py-0.5 text-warn" style={{ animationDelay: `${400 + i * 260}ms` }}>
                STALE
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The problem, told as a short loop instead of three big numbers: a seller's
 * week where only 4 of 10 blocks are selling, a call being typed into the CRM
 * while the minutes run, and a list of accounts going stale one by one. Each
 * beat brings its number and source. It moves on by itself every few seconds,
 * can be paused or stepped through, and stays still for reduced motion. The
 * three figures are also written out for screen readers.
 */
export function ProblemReel() {
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !still;
  const [beat, setBeat] = useState(0);
  const [run, setRun] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(() => {
      setBeat((b) => (b + 1) % BEATS.length);
      setRun((r) => r + 1);
    }, BEAT_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, beat, run]);

  const b = BEATS[beat];
  const n = useCount(b.n, run, still);

  return (
    <figure>
      <figcaption className="sr-only">
        Three findings, shown in turn: 40% of a seller&apos;s time goes to selling; 68% of sellers say note taking and data entry take the most time;
        76% of CRM users say less than half their CRM data is accurate.
      </figcaption>
      <div className="rounded-[20px] bg-surface-2 p-5 sm:p-7">
        <div aria-hidden="true" key={run} className="min-h-[23rem] sm:min-h-[21.5rem]">
          <p className="flex items-baseline gap-3">
            <span className="text-[3.25rem] font-medium leading-none tracking-tight tabular-nums">{n}%</span>
            <span className="max-w-[30ch] leading-snug">{b.text}</span>
          </p>
          <div className="mt-6">{beat === 0 ? <Week /> : beat === 1 ? <Typing run={run} still={still} /> : <Stale />}</div>
          <p className="mt-4 text-meta text-ink-2">{b.src}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {BEATS.map((x, i) => (
            <button
              key={x.tab}
              type="button"
              aria-current={i === beat ? "true" : undefined}
              onClick={() => {
                setBeat(i);
                setRun((r) => r + 1);
              }}
              className={`sig-btn inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-small ${i === beat ? "bg-surface-2 font-medium" : "text-ink-2 hover:text-ink"}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${i === beat ? "bg-ink" : "bg-[var(--line-strong)]"}`} />
              {x.tab}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setChoice(!playing)} className="sig-btn inline-flex min-h-9 items-center gap-2 text-small font-medium">
          <span aria-hidden="true" className="text-[10px]">
            {playing ? "❚❚" : "▶"}
          </span>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
