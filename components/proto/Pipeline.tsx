"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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
    <section aria-labelledby="h-pipe" className="min-w-0 xl:sticky xl:top-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-pipe" className="text-h3 font-semibold">
          Pipeline
        </h2>
        <p className="font-mono text-meta tracking-wide text-ink-2">DRAG A CARD OR USE ITS MENU · DASHED CARDS ARE AI SUGGESTIONS</p>
      </div>
      <div className="relative mt-3 overflow-x-auto pb-2" role="region" aria-label="Pipeline columns" tabIndex={0}>
        <ol className="grid min-w-[44rem] grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const cards = opps.filter((o) => o.stage === stage);
            const gs = ghosts.filter((g) => ghostStage(g) === stage);
            return (
              <li
                key={stage}
                aria-labelledby={`col-${stage}`}
                data-stage={stage}
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
                        className="pipe-card relative cursor-grab rounded-xl border border-line bg-surface p-3 active:cursor-grabbing"
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
                        <StageMenu
                          stage={o.stage}
                          label={`Move ${account(o.account)?.name} ${o.name}`}
                          onPick={(st) => actions.moveOpp(o.id, st)}
                        />
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

/**
 * The stage menu on a pipeline card (decision 0125): a field in the cards' own style that opens a small panel right
 * below it, instead of the system's native menu, which jumped over the card. A listbox: arrow keys move, Enter picks,
 * Escape or a click outside closes, and focus returns to the field.
 */
function StageMenu({ stage, label, onPick }: { stage: Stage; label: string; onPick: (s: Stage) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(STAGES.indexOf(stage));
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!list.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    btn.current?.focus();
  };
  const pick = (st: Stage) => {
    if (st !== stage) onPick(st);
    close();
  };

  return (
    <div className="stage-menu mt-2" draggable={false} onDragStart={(e) => e.preventDefault()}>
      <button
        ref={btn}
        type="button"
        className="stage-field"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`${label}: in ${stage}`}
        onClick={() => {
          setActive(STAGES.indexOf(stage));
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setActive(STAGES.indexOf(stage));
            setOpen(true);
          }
        }}
      >
        <span>In {stage}</span>
        <span aria-hidden="true" className={`stage-chev ${open ? "is-open" : ""}`}>
          {"\u2304"}
        </span>
      </button>
      {open ? (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          className="stage-panel"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(STAGES.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              pick(STAGES[active]);
            } else if (e.key === "Escape" || e.key === "Tab") {
              e.preventDefault();
              close();
            }
          }}
        >
          {STAGES.map((st, i) => (
            <li
              key={st}
              id={`${id}-${i}`}
              role="option"
              aria-selected={st === stage}
              className={`stage-opt ${i === active ? "is-active" : ""}`}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(st)}
            >
              <span>{st === stage ? `In ${st}` : `Move to ${st}`}</span>
              {st === stage ? <span aria-hidden="true">{"\u2713"}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
