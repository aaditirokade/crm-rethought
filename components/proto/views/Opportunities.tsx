"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NEXT_MOVE } from "@/content/more";
import { Health, PageHead } from "../bits";
import { Pipeline } from "../Pipeline";
import { SourceChip } from "../Source";
import { actions, outreach, useProto } from "../store";

const TONE = { risk: ["text-risk", "■"], warn: ["text-warn", "▲"], good: ["text-good", "●"] } as const;

export function Opportunities() {
  const s = useProto();
  const ranked = outreach(s);
  const active = ranked.filter((r) => !s.snoozed.includes(r.account.id));
  const snoozed = ranked.filter((r) => s.snoozed.includes(r.account.id));
  const [open, setOpen] = useState<string[]>([]);
  const rail = useRef<HTMLOListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active.length]);
  const page = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  const scrolls = !(edge.start && edge.end);

  return (
    <div>
      <PageHead title="Opportunities" sub="Who to reach out to this week, and why. Then every open opportunity." />

      {/* Reach out: a row of cards that scrolls sideways, each showing just enough until opened (decision 0120). */}
      <section aria-labelledby="h-reach" className="mt-8 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="h-reach" className="text-h3 font-semibold">
              Reach out this week
            </h2>
            <p className="text-small text-ink-2">
              Ranked by the reasons under each account. Reorder or snooze freely. The AI never contacts a client.
            </p>
          </div>
          {scrolls ? (
            <div className="flex gap-1.5">
              <button type="button" className="sig-btn icon-act" aria-label="Earlier accounts" disabled={edge.start} onClick={() => page(-1)}>
                <span aria-hidden="true">{"\u2190"}</span>
              </button>
              <button type="button" className="sig-btn icon-act" aria-label="More accounts" disabled={edge.end} onClick={() => page(1)}>
                <span aria-hidden="true">{"\u2192"}</span>
              </button>
            </div>
          ) : null}
        </div>
        <ol ref={rail} className={`card-rail reach-rail mt-3 ${edge.start ? "" : "fade-start"} ${edge.end ? "" : "fade-end"}`}>
          {active.map((r, i) => {
            const isOpen = open.includes(r.account.id);
            const [first, ...rest] = r.signals;
            const bodyId = `reach-${r.account.id}`;
            return (
              <li key={r.account.id} className={`reach-card pulse-glass ${isOpen ? "is-open" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-meta text-ink-2" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-semibold">
                      <span className="sr-only">Number {i + 1}: </span>
                      <Link href={`/prototype/accounts/${r.account.id}`} className="hover:underline">
                        {r.account.name}
                      </Link>
                    </h3>
                  </div>
                  <span className="shrink-0 font-mono text-meta tracking-wide text-ink-2">
                    {r.signals.length} {r.signals.length === 1 ? "REASON" : "REASONS"}
                  </span>
                </div>
                <p className="mt-1 text-small">
                  <Health a={r.account} />
                </p>
                {first ? <Signal sig={first} /> : null}

                <div id={bodyId} hidden={!isOpen}>
                  {rest.length ? (
                    <ul className="mt-2 space-y-1.5">
                      {rest.map((sig) => (
                        <li key={sig.text}>
                          <Signal sig={sig} bare />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="mt-3 border-l-2 border-accent pl-3 text-small">
                    <span className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED NEXT MOVE · </span>
                    {NEXT_MOVE[r.account.id]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="sig-btn" disabled={i === 0} onClick={() => actions.move(r.account.id, -1)}>
                      Move earlier<span className="sr-only">: {r.account.name}</span>
                    </button>
                    <button type="button" className="sig-btn" disabled={i === active.length - 1} onClick={() => actions.move(r.account.id, 1)}>
                      Move later<span className="sr-only">: {r.account.name}</span>
                    </button>
                    <button type="button" className="sig-btn" onClick={() => actions.snooze(r.account.id)}>
                      Snooze a week<span className="sr-only">: {r.account.name}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="reach-toggle mt-3"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== r.account.id) : [...o, r.account.id]))}
                >
                  {isOpen ? "Show less" : "Why, and the next move"}
                  <span className="sr-only">: {r.account.name}</span>
                  <span aria-hidden="true" className="reach-chev">
                    {"\u2304"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {snoozed.length ? (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-small text-ink-2">
            <span className="font-mono text-meta tracking-wide">SNOOZED UNTIL NEXT WEEK:</span>
            {snoozed.map((r) => (
              <button key={r.account.id} type="button" className="sig-btn" onClick={() => actions.snooze(r.account.id)}>
                Bring back {r.account.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {/* The pipeline gets the full width below. */}
      <div className="mt-12">
        <Pipeline />
      </div>
    </div>
  );
}

type Sig = ReturnType<typeof outreach>[number]["signals"][number];

function Signal({ sig, bare = false }: { sig: Sig; bare?: boolean }) {
  const [cls, icon] = sig.tone ? TONE[sig.tone] : ["text-ink-2", "\u2022"];
  return (
    <p className={`${bare ? "" : "mt-2 "}flex items-baseline gap-2 text-small`}>
      <span className={`shrink-0 ${cls}`} aria-hidden="true">
        {icon}
      </span>
      <span>
        {sig.text} <SourceChip id={sig.source} />
      </span>
    </p>
  );
}
