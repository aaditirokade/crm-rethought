"use client";

import Link from "next/link";
import { MEETINGS } from "@/content/prototype";
import { Health, PageHead } from "../bits";
import { SourceChip } from "../Source";
import { liveAccount, pending, useProto } from "../store";

export function AccountView({ id }: { id: string }) {
  const s = useProto();
  const a = liveAccount(s, id);
  if (!a) return null;
  const waiting = pending(s, (x) => x.account === id);
  const logMeeting = MEETINGS.find((m) => m.account === id && m.hasLog);
  const names = a.people.map((p) => p.name);
  const dupes = new Set(names.filter((n, i) => names.indexOf(n) !== i));

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
            {a.segment} · {a.stores} stores · owner Daniel Okoro
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
        <p className="mt-4 rounded-[4px] bg-draft px-3 py-2 text-small">
          <span className="sig-draft-tag mr-2">DRAFT</span>
          {waiting.length} {waiting.length === 1 ? "line" : "lines"} for this account {waiting.length === 1 ? "is" : "are"} waiting for
          approval and {waiting.length === 1 ? "is" : "are"} not in the record yet.{" "}
          <Link href={logMeeting ? `/prototype/log/${logMeeting.id}` : "/prototype/review"} className="font-medium underline underline-offset-4">
            Review
          </Link>
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-labelledby="h-timeline">
          <h2 id="h-timeline" className="text-h3 font-semibold">
            Timeline
          </h2>
          <p className="text-small text-ink-2">Only what a person approved. Newest first.</p>
          <ol className="mt-3 space-y-3">
            {a.approvedLog.length ? (
              <li className="proto-card p-4">
                <p className="font-mono text-meta tracking-wide text-ink-2">NOV 12 · QUARTERLY REVIEW</p>
                <p className="mt-0.5 font-semibold">Call log · approved by Daniel</p>
                <ul className="mt-3 space-y-3">
                  {a.approvedLog.map((l) => (
                    <li key={l.sug.id}>
                      <span className="sig-approved-tag">
                        {"✓"} {l.at}
                      </span>
                      <p className="mt-0.5">{l.text}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {l.sug.sources.map((src) => (
                          <SourceChip key={src} id={src} />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
            {a.history.map((h) => (
              <li key={h.date + h.title} className="proto-card p-4">
                <p className="font-mono text-meta tracking-wide text-ink-2">{h.date.toUpperCase()}</p>
                <p className="mt-0.5 font-semibold">{h.title}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {h.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                {h.source ? (
                  <div className="mt-2">
                    <SourceChip id={h.source} />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="h-people" className="proto-card p-4">
            <h2 id="h-people" className="text-h3 font-semibold">
              People
            </h2>
            <ul className="mt-3 space-y-3">
              {a.people.map((p, i) => (
                <li key={p.name + i}>
                  <p className={`font-medium ${p.leftAt ? "text-ink-2 line-through" : ""}`}>{p.name}</p>
                  <p className="text-small text-ink-2">{p.role}</p>
                  {p.leftAt ? <p className="font-mono text-meta text-ink-2">LEFT · MARKED BY DANIEL {p.leftAt}</p> : null}
                  {p.added ? <p className="font-mono text-meta text-good">{"✓"} ADDED BY DANIEL {p.added}</p> : null}
                  {dupes.has(p.name) ? (
                    <p className="font-mono text-meta text-warn">{"▲"} POSSIBLE DUPLICATE · MERGE IS PEOPLE ONLY</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="h-deals" className="proto-card p-4">
            <h2 id="h-deals" className="text-h3 font-semibold">
              Deals
            </h2>
            <ul className="mt-3 space-y-2 text-small">
              {a.deals.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
