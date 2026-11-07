"use client";

import Link from "next/link";
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

  return (
    <div>
      <PageHead title="Opportunities" sub="Who to reach out to this week, and why. Then every open opportunity." />

      <section aria-labelledby="h-reach" className="mt-8">
        <h2 id="h-reach" className="text-h3 font-semibold">
          Reach out this week
        </h2>
        <p className="text-small text-ink-2">
          Ranked by the reasons under each account. Reorder or snooze freely. The AI never contacts a client.
        </p>
        <ol className="mt-3 grid gap-3 2xl:grid-cols-2">
          {active.map((r, i) => (
            <li key={r.account.id} className="proto-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <p className="font-mono text-h3 font-medium text-ink-2" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    <span className="sr-only">Number {i + 1}: </span>
                    <Link href={`/prototype/accounts/${r.account.id}`} className="hover:underline">
                      {r.account.name}
                    </Link>
                  </h3>
                  <p className="text-small">
                    <Health a={r.account} />
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {r.signals.map((sig) => {
                      const [cls, icon] = sig.tone ? TONE[sig.tone] : ["text-ink-2", "•"];
                      return (
                        <li key={sig.text} className="flex flex-wrap items-center gap-2 text-small">
                          <span className={cls} aria-hidden="true">
                            {icon}
                          </span>
                          <span>{sig.text}</span>
                          <SourceChip id={sig.source} />
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-small">
                    <span className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED NEXT MOVE · </span>
                    {NEXT_MOVE[r.account.id]}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                  <button type="button" className="sig-btn" disabled={i === 0} onClick={() => actions.move(r.account.id, -1)}>
                    Move up<span className="sr-only">: {r.account.name}</span>
                  </button>
                  <button type="button" className="sig-btn" disabled={i === active.length - 1} onClick={() => actions.move(r.account.id, 1)}>
                    Move down<span className="sr-only">: {r.account.name}</span>
                  </button>
                  <button type="button" className="sig-btn" onClick={() => actions.snooze(r.account.id)}>
                    Snooze a week<span className="sr-only">: {r.account.name}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {snoozed.length ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-small text-ink-2">
            <span className="font-mono text-meta tracking-wide">SNOOZED UNTIL NEXT WEEK:</span>
            {snoozed.map((r) => (
              <button key={r.account.id} type="button" className="sig-btn" onClick={() => actions.snooze(r.account.id)}>
                Bring back {r.account.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <Pipeline />
    </div>
  );
}
