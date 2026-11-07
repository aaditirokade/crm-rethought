"use client";

import Link from "next/link";
import { useState } from "react";
import { ACCOUNTS } from "@/content/prototype";
import { parseList, runList } from "@/lib/listQuery";
import { SourceChip } from "../Source";
import { actions, liveAccount, useProto, type LiveAccount } from "../store";

const EXAMPLES = ["renewing before March with an open ticket", "quiet for 2 weeks with more than 10 stores", "renewing in 120 days"];

/** Lists in plain words: type what you want, see exactly what was understood, then save it. */
export function Lists() {
  const s = useProto();
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);
  const [name, setName] = useState("");
  const live = ACCOUNTS.map((a) => liveAccount(s, a.id)).filter(Boolean) as LiveAccount[];

  const chips = parseList(asked).filter((c) => !removed.includes(c.id));
  const results = runList(live, chips);

  const open = (q: string, keep?: string[]) => {
    setQuery(q);
    setAsked(q);
    setName(q[0]?.toUpperCase() + q.slice(1));
    const all = parseList(q).map((c) => c.id);
    setRemoved(keep ? all.filter((id) => !keep.includes(id)) : []);
  };

  return (
    <section aria-labelledby="h-lists" className="tone-ai mt-6">
      <h2 id="h-lists" className="text-h3 font-semibold">
        Lists
      </h2>
      {s.lists.length ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-meta tracking-wide text-ink-2">SAVED:</span>
          {s.lists.map((l) => {
            const n = runList(live, parseList(l.query).filter((c) => l.chips.includes(c.id))).length;
            return (
              <span key={l.id} className="inline-flex items-center gap-1">
                <button type="button" className="sig-btn" onClick={() => open(l.query, l.chips)}>
                  {l.name} <span className="font-mono text-meta text-ink-2">{n}</span>
                </button>
                <button type="button" className="sig-btn" onClick={() => actions.deleteList(l.id)}>
                  Remove<span className="sr-only"> list {l.name}</span>
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          open(query.trim());
        }}
      >
        <label htmlFor="list-q" className="font-medium">
          Make a list in plain words
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="list-q"
            className="proto-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="accounts renewing before March with an open ticket"
          />
          <button type="submit" className="sig-btn sig-btn-primary shrink-0" disabled={!query.trim()}>
            Make list
          </button>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-small text-ink-2">
          Try:
          {EXAMPLES.map((x) => (
            <button key={x} type="button" className="sig-btn" onClick={() => open(x)}>
              {x}
            </button>
          ))}
        </p>
      </form>

      {asked ? (
        <div className="mt-4 border-t border-line pt-4" aria-live="polite">
          {parseList(asked).length === 0 ? (
            <p className="text-small">
              I couldn&rsquo;t turn that into a filter. Try renewal dates, health, segment, store count, an open ticket, or
              how long since the last touch.
            </p>
          ) : (
            <>
              <p className="font-mono text-meta tracking-wide text-ink-2">UNDERSTOOD AS · REMOVE ANY CHIP THAT’S WRONG</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="sig-source" onClick={() => setRemoved([...removed, c.id])}>
                      <b>{c.label.toUpperCase()}</b> {"×"}
                      <span className="sr-only"> remove this filter</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold">
                {results.length} {results.length === 1 ? "account matches" : "accounts match"}
              </p>
              <ul className="mt-2 divide-y divide-line">
                {results.map(({ a, reasons }) => (
                  <li key={a.id} className="py-2">
                    <Link href={`/prototype/accounts/${a.id}`} className="font-medium hover:underline">
                      {a.name}
                    </Link>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-small text-ink-2">
                      <span className="font-mono text-meta tracking-wide">WHY IT’S HERE:</span>
                      {reasons.map((r, i) => (
                        <span key={r.why} className="inline-flex items-center gap-1">
                          {i ? <span aria-hidden="true">·</span> : null}
                          {r.why}
                          {r.source ? <SourceChip id={r.source} /> : null}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
              {chips.length ? (
                <form
                  className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end"
                  onSubmit={(e) => {
                    e.preventDefault();
                    actions.saveList({ name: name.trim() || asked, query: asked, chips: chips.map((c) => c.id) });
                  }}
                >
                  <div className="flex-1">
                    <label htmlFor="list-name" className="text-small font-medium">
                      List name
                    </label>
                    <input id="list-name" className="proto-input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <button type="submit" className="sig-btn shrink-0">
                    Save list
                  </button>
                </form>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
