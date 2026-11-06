"use client";

import Link from "next/link";
import { NEXT_MOVE } from "@/content/more";
import { account } from "@/content/prototype";
import { Health, PageHead } from "../bits";
import { GateLine } from "../Lines";
import { SourceChip } from "../Source";
import { actions, allSugs, entryOf, liveOpps, outreach, useProto } from "../store";

const TONE = { risk: ["text-risk", "■"], warn: ["text-warn", "▲"], good: ["text-good", "●"] } as const;

export function Opportunities() {
  const s = useProto();
  const ranked = outreach(s);
  const active = ranked.filter((r) => !s.snoozed.includes(r.account.id));
  const snoozed = ranked.filter((r) => s.snoozed.includes(r.account.id));
  const spotted = allSugs(s).filter((x) => (x.kind === "opp" || x.kind === "stage") && entryOf(s, x.id).status !== "saved");
  const opps = liveOpps(s);
  const STAGES = ["Committed", "Proposal", "Qualified", "Idea"];

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
        <ol className="mt-3 space-y-3">
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
                  <p className="mt-3 rounded-[4px] bg-surface-2 px-3 py-2 text-small">
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

      <section aria-labelledby="h-spotted" className="mt-10">
        <h2 id="h-spotted" className="text-h3 font-semibold">
          Spotted by AI
        </h2>
        <p className="text-small text-ink-2">New opportunities and stage changes found in emails and calls. Each one waits for you.</p>
        {spotted.length ? (
          <ul className="proto-card mt-3 space-y-1 p-1.5">
            {spotted.map((x) => (
              <GateLine key={x.id} sug={x} />
            ))}
          </ul>
        ) : (
          <p className="proto-card mt-3 p-4 text-small text-ink-2">Nothing waiting.</p>
        )}
      </section>

      <section aria-labelledby="h-open" className="mt-10">
        <h2 id="h-open" className="text-h3 font-semibold">
          Open opportunities
        </h2>
        <div className="proto-card relative mt-3 overflow-x-auto" role="region" aria-label="Open opportunities table" tabIndex={0}>
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">Open opportunities by stage</caption>
            <thead className="border-b border-line font-mono text-meta tracking-wide text-ink-2">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">ACCOUNT</th>
                <th scope="col" className="px-4 py-2 font-medium">OPPORTUNITY</th>
                <th scope="col" className="px-4 py-2 font-medium">STAGE</th>
                <th scope="col" className="px-4 py-2 font-medium">CLOSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...opps]
                .sort((x, y) => STAGES.indexOf(x.stage) - STAGES.indexOf(y.stage))
                .map((o) => (
                  <tr key={o.id}>
                    <th scope="row" className="px-4 py-3 align-top font-normal">
                      <Link href={`/prototype/accounts/${o.account}`} className="font-semibold hover:underline">
                        {account(o.account)?.name}
                      </Link>
                    </th>
                    <td className="px-4 py-3 align-top">
                      {o.name}
                      {o.addedAt ? <span className="mt-0.5 block font-mono text-meta text-good">{"✓"} ADDED BY DANIEL {o.addedAt}</span> : null}
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-meta">
                      {o.stage.toUpperCase()}
                      {o.changedAt ? <span className="mt-0.5 block text-good">{"✓"} SET {o.changedAt}</span> : null}
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-meta">{o.close.toUpperCase()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
