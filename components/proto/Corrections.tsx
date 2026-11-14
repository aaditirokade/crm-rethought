"use client";

import { SOURCES } from "@/content/prototype";
import { corrections, useProto } from "./store";

/**
 * What people corrected (decision 0107): the team's view of every AI line dismissed with a reason and every Ask
 * answer flagged as wrong, counted by reason and by the source behind them, so a bad source shows up fast.
 * In a live product this would feed the people who tune the model; here it is the same browser's own corrections.
 */
export function Corrections() {
  const s = useProto();
  const c = corrections(s);
  const top = Object.entries(c.bySource).sort((a, b) => b[1] - a[1])[0];
  return (
    <section aria-labelledby="corr-h" className="proto-card mt-10 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="corr-h" className="text-h3 font-semibold">
          What people corrected
        </h2>
        <span className="font-mono text-meta tracking-wide text-ink-2">FOR THE TEAM · FEEDS THE AI’S NEXT ROUND</span>
      </div>
      {c.all.length === 0 ? (
        <p className="mt-2 text-small text-ink-2">
          Nothing yet. When you dismiss a line or flag an Ask answer, say why, and it shows up here.
        </p>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {c.byReason.map((r) => (
              <div key={r.reason} className="border-l border-line pl-3">
                <dt className="font-mono text-meta tracking-wide text-ink-2">{r.reason.toUpperCase()}</dt>
                <dd className="mt-1 text-h2 font-semibold tabular-nums">{r.count}</dd>
              </div>
            ))}
          </dl>
          {top && top[1] > 1 ? (
            <p className="mt-4 border-l-2 border-accent pl-3 text-small">
              <span className="font-mono text-meta tracking-wide text-ink-2">PATTERN · </span>
              {top[1]} corrections trace back to {SOURCES[top[0]]?.title ?? top[0]}. Worth checking that source first.
            </p>
          ) : null}
          <ul className="mt-4 divide-y divide-[var(--rule)] border-y border-[var(--rule)] text-small">
            {c.all.map((x) => (
              <li key={`${x.kind}-${x.id}`} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-meta tracking-wide text-ink-2">{x.kind === "answer" ? "ASK ANSWER · " : "LINE · "}</span>
                  {x.text}
                </span>
                <span className="font-mono text-meta tracking-wide text-accent">{x.reason.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
