"use client";

import Link from "next/link";
import { useState } from "react";
import { account, type Stage } from "@/content/prototype";
import { Meta } from "./Source";
import { actions, allSugs, entryOf, liveOpps, useProto } from "./store";

const STAGES: Stage[] = ["Idea", "Qualified", "Proposal", "Committed"];

/**
 * The pipeline as columns. A person can drag a card or use its menu: their own move needs no approval.
 * When the AI thinks a deal should move, a dashed ghost card waits in the target column with its reason;
 * approving it moves the real card.
 */
export function Pipeline() {
  const s = useProto();
  const [over, setOver] = useState<Stage | null>(null);
  const opps = liveOpps(s);
  const ghosts = allSugs(s).filter((x) => {
    if (entryOf(s, x.id).status !== "pending") return false;
    if (x.effect?.type === "stage") {
      const eff = x.effect;
      return opps.find((o) => o.id === eff.opp)?.stage !== eff.to;
    }
    return x.kind === "opp" && x.effect?.type === "addOpp";
  });
  const ghostStage = (x: (typeof ghosts)[number]): Stage =>
    x.effect?.type === "stage" ? x.effect.to : x.effect?.type === "addOpp" ? x.effect.opp.stage : "Idea";
  const pendingFor = (oppId: string) => ghosts.find((g) => g.effect?.type === "stage" && g.effect.opp === oppId);

  return (
    <section aria-labelledby="h-pipe" className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-pipe" className="text-h3 font-semibold">
          Pipeline
        </h2>
        <p className="font-mono text-meta tracking-wide text-ink-2">DRAG A CARD OR USE ITS MENU · DASHED CARDS ARE AI SUGGESTIONS</p>
      </div>
      <div className="relative mt-3 overflow-x-auto pb-2" role="region" aria-label="Pipeline columns" tabIndex={0}>
        <ol className="grid min-w-[52rem] grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const cards = opps.filter((o) => o.stage === stage);
            const gs = ghosts.filter((g) => ghostStage(g) === stage);
            return (
              <li
                key={stage}
                aria-labelledby={`col-${stage}`}
                className={`pipe-col rounded-2xl border p-2 ${over === stage ? "border-accent bg-draft" : "border-line bg-surface-2"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage);
                }}
                onDragLeave={() => setOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  setOver(null);
                  if (id && opps.find((o) => o.id === id)?.stage !== stage) actions.moveOpp(id, stage);
                }}
              >
                <h3 id={`col-${stage}`} className="flex items-center justify-between px-1 font-mono text-meta tracking-wide">
                  <span>{stage.toUpperCase()}</span>
                  <span className="text-ink-2">{cards.length}</span>
                </h3>
                <ul className="mt-2 space-y-2">
                  {cards.map((o) => {
                    const p = pendingFor(o.id);
                    return (
                      <li
                        key={`${o.id}-${o.stage}`}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", o.id)}
                        className="pipe-card cursor-grab rounded-xl border border-line bg-surface p-3 active:cursor-grabbing"
                      >
                        <p className="text-small font-semibold">
                          <Link href={`/prototype/accounts/${o.account}`} className="hover:underline">
                            {account(o.account)?.name}
                          </Link>
                        </p>
                        <p className="text-small">{o.name}</p>
                        <p className="mt-1 font-mono text-meta text-ink-2">CLOSE {o.close.toUpperCase()}</p>
                        {o.addedAt ? <p className="font-mono text-meta text-good">{"✓"} ADDED BY DANIEL {o.addedAt}</p> : null}
                        {o.movedAt ? (
                          <p className="font-mono text-meta text-good">{"✓"} MOVED BY DANIEL {o.movedAt}</p>
                        ) : o.changedAt ? (
                          <p className="font-mono text-meta text-good">{"✓"} APPROVED BY DANIEL {o.changedAt}</p>
                        ) : null}
                        {p && p.effect?.type === "stage" ? (
                          <p className="mt-1 font-mono text-meta text-accent">AI SUGGESTS {"→"} {p.effect.to.toUpperCase()}</p>
                        ) : null}
                        <label className="mt-2 block">
                          <span className="sr-only">
                            Move {account(o.account)?.name} {o.name} to
                          </span>
                          <select
                            className="proto-input py-1 text-small"
                            value={o.stage}
                            onChange={(e) => actions.moveOpp(o.id, e.target.value as Stage)}
                          >
                            {STAGES.map((st) => (
                              <option key={st} value={st}>
                                {st === o.stage ? `In ${st}` : `Move to ${st}`}
                              </option>
                            ))}
                          </select>
                        </label>
                      </li>
                    );
                  })}
                  {gs.map((g) => (
                    <li key={g.id} className="pipe-ghost rounded-xl border border-dashed border-accent bg-draft p-3">
                      <span className="sig-draft-tag">{g.kind === "opp" ? "SUGGESTED NEW" : "SUGGESTED MOVE"}</span>
                      <p className="mt-1 text-small font-semibold">{account(g.account)?.name}</p>
                      <p className="text-small">{g.text}</p>
                      <Meta sources={g.sources} confidence={g.confidence} />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" className="sig-btn sig-btn-primary" onClick={() => actions.approve(g.id)}>
                          Approve
                        </button>
                        <button type="button" className="sig-btn" onClick={() => actions.dismiss(g.id)}>
                          Not right
                        </button>
                      </div>
                    </li>
                  ))}
                  {!cards.length && !gs.length ? <li className="px-1 py-3 text-small text-ink-2">Nothing here. Drop a card to move it.</li> : null}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
