"use client";

import Link from "next/link";
import { useState } from "react";
import { MEETINGS, type InteractionType } from "@/content/prototype";
import { Health, PageHead } from "../bits";
import { InteractionStrip, RelationshipWeb } from "../AccountVisuals";
import { SourceChip } from "../Source";
import { liveAccount, liveOpps, pending, useProto } from "../store";

const FILTERS: { name: string; types: InteractionType[] }[] = [
  { name: "All", types: [] },
  { name: "Calls and video", types: ["Call", "Video"] },
  { name: "In person and events", types: ["In person", "Event"] },
  { name: "Email", types: ["Email"] },
  { name: "Tickets", types: ["Ticket"] },
];

export function AccountView({ id }: { id: string }) {
  const s = useProto();
  const [filter, setFilter] = useState("All");
  const a = liveAccount(s, id);
  if (!a) return null;
  const waiting = pending(s, (x) => x.account === id);
  const logMeeting = MEETINGS.find((m) => m.account === id && m.hasLog);
  const names = a.people.map((p) => p.name);
  const dupes = new Set(names.filter((n, i) => names.indexOf(n) !== i));
  const types = FILTERS.find((f) => f.name === filter)?.types ?? [];
  const shown = a.timeline.filter((t) => !types.length || types.includes(t.type));
  const opps = liveOpps(s).filter((o) => o.account === id);
  const lastWith = (name: string) => a.timeline.find((t) => t.with?.split(", ").includes(name));

  return (
    <div>
      <PageHead
        kicker={
          <>
            <Link href="/prototype/accounts" className="hover:underline">
              ACCOUNTS
            </Link>{" "}
            / RECORD
          </>
        }
        title={a.name}
        sub={
          <>
            {a.segment} · {a.stores} stores · owner Daniel Orro
          </>
        }
      />

      <dl className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["HEALTH", <Health key="h" a={a} />],
          ["RENEWAL", a.renewal],
          ["LAST TOUCH", a.lastTouch],
          ["NEXT STEP", a.nextStep],
        ].map(([k, v]) => (
          <div key={k as string} className="proto-card p-3">
            <dt className="font-mono text-meta tracking-wide text-ink-2">{k}</dt>
            <dd className="mt-1 text-small">{v}</dd>
          </div>
        ))}
      </dl>

      {waiting.length ? (
        <p className="mt-4 rounded-xl bg-draft px-3 py-2 text-small">
          <span className="sig-draft-tag mr-2">DRAFT</span>
          {waiting.length} {waiting.length === 1 ? "line" : "lines"} for this account {waiting.length === 1 ? "is" : "are"} waiting for
          approval and not in the record yet.{" "}
          <Link href={logMeeting ? `/prototype/log/${logMeeting.id}` : "/prototype/review"} className="font-medium underline underline-offset-4">
            Review
          </Link>
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 2xl:grid-cols-2">
        <RelationshipWeb a={a} />
        <InteractionStrip a={a} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="h-timeline">
          <h2 id="h-timeline" className="text-h3 font-semibold">
            Interactions
          </h2>
          <p className="text-small text-ink-2">Only what a person approved or logged. Newest first.</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter interactions by type">
            {FILTERS.map((f) => (
              <button key={f.name} type="button" className="sig-btn" aria-pressed={filter === f.name} onClick={() => setFilter(f.name)}>
                {f.name}
              </button>
            ))}
          </div>
          <ol className="mt-3 space-y-3">
            {shown.length === 0 ? <li className="proto-card p-4 text-small text-ink-2">No interactions of this type.</li> : null}
            {shown.map((t) => (
              <li key={t.key} className="proto-card p-4">
                <p className="flex flex-wrap gap-x-2 font-mono text-meta tracking-wide text-ink-2">
                  <span>{t.date.toUpperCase()}</span>
                  <span>· {t.type.toUpperCase()}</span>
                  <span>· {t.ours.toUpperCase()}</span>
                  {t.highStakes ? <span className="text-warn">· HIGH STAKES</span> : null}
                </p>
                <p className="mt-0.5 font-semibold">{t.title}</p>
                {t.with ? <p className="text-small text-ink-2">With {t.with}</p> : null}
                <ul className="mt-2 space-y-2">
                  {t.lines.map((l) => (
                    <li key={l.text}>
                      {l.at ? <span className="sig-approved-tag">{"✓"} {l.at}</span> : null}
                      <p>{l.text}</p>
                      {l.sources.length ? (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {l.sources.map((src) => (
                            <SourceChip key={src} id={src} />
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {t.source ? (
                  <div className="mt-2">
                    <SourceChip id={t.source} />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="h-people" className="proto-card p-4">
            <h2 id="h-people" className="text-h3 font-semibold">
              People and coverage
            </h2>
            <p className="text-small text-ink-2">Who on our side last spoke to each person.</p>
            <ul className="mt-3 space-y-3">
              {a.people.map((p, i) => {
                const last = lastWith(p.name);
                return (
                  <li key={p.name + i}>
                    <p className={`font-medium ${p.leftAt ? "text-ink-2 line-through" : ""}`}>{p.name}</p>
                    <p className="text-small text-ink-2">{p.role}</p>
                    <p className="font-mono text-meta text-ink-2">
                      {last ? `LAST: ${last.ours.toUpperCase()} · ${last.date.toUpperCase()} · ${last.type.toUpperCase()}` : "NO CONTACT LOGGED"}
                    </p>
                    {p.leftAt ? <p className="font-mono text-meta text-ink-2">LEFT · MARKED BY DANIEL {p.leftAt}</p> : null}
                    {p.added ? <p className="font-mono text-meta text-good">{"✓"} ADDED BY DANIEL {p.added}</p> : null}
                    {dupes.has(p.name) ? <p className="font-mono text-meta text-warn">{"▲"} POSSIBLE DUPLICATE · MERGE IS PEOPLE ONLY</p> : null}
                  </li>
                );
              })}
            </ul>
          </section>
          <section aria-labelledby="h-opps" className="proto-card p-4">
            <h2 id="h-opps" className="text-h3 font-semibold">
              Opportunities
            </h2>
            <ul className="mt-3 space-y-3 text-small">
              {opps.map((o) => (
                <li key={o.id}>
                  <p className="font-medium">{o.name}</p>
                  <p className="font-mono text-meta text-ink-2">
                    {o.stage.toUpperCase()} · CLOSE {o.close.toUpperCase()}
                  </p>
                  {o.addedAt ? <p className="font-mono text-meta text-good">{"✓"} ADDED BY DANIEL {o.addedAt}</p> : null}
                  {o.changedAt ? <p className="font-mono text-meta text-good">{"✓"} STAGE SET BY DANIEL {o.changedAt}</p> : null}
                </li>
              ))}
            </ul>
            <Link href="/prototype/opportunities" className="mt-3 inline-block text-small font-medium underline underline-offset-4">
              All opportunities
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
