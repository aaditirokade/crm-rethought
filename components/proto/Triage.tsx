"use client";

import { useRef, useState } from "react";
import { originOf } from "./groups";
import { Meta } from "./Source";
import { actions, allSugs, entryOf, isGated, textOf, useProto } from "./store";

/** One line at a time, with keys: A approve, E edit, D dismiss, arrows to move. Counts down to zero. */
export function Triage() {
  const s = useProto();
  const queue = allSugs(s).filter((x) => isGated(x) && entryOf(s, x.id).status === "pending");
  const [decided, setDecided] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const focusedOnce = useRef(false);
  const i = Math.min(index, Math.max(queue.length - 1, 0));
  const cur = queue[i];
  const total = decided.length + queue.length;
  const done = decided.length;
  const R = 26;
  const C = 2 * Math.PI * R;

  const decide = (fn: () => void) => {
    if (!cur) return;
    fn();
    setDecided((d) => [...d, cur.id]);
    setEditing(false);
  };
  const go = (d: number) => {
    if (!queue.length) return;
    setIndex((i + d + queue.length) % queue.length);
    setEditing(false);
  };

  return (
    <section
      aria-labelledby="h-triage"
      tabIndex={0}
      ref={(el) => {
        if (el && !focusedOnce.current) {
          focusedOnce.current = true;
          el.focus({ preventScroll: true });
        }
      }}
      className="proto-card is-surface mt-6 p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-6"
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("textarea, input, select")) return;
        const k = e.key.toLowerCase();
        if (k === "a") decide(() => actions.approve(cur.id));
        else if (k === "d") decide(() => actions.dismiss(cur.id));
        else if (k === "e" && cur) {
          e.preventDefault();
          setDraft(textOf(s, cur));
          setEditing(true);
        } else if (k === "arrowright" || k === "j") go(1);
        else if (k === "arrowleft" || k === "k") go(-1);
        else return;
        e.preventDefault();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="h-triage" className="text-h3 font-semibold">
            Triage
          </h2>
          <p className="font-mono text-meta tracking-wide text-ink-2">A APPROVE · E EDIT · D DISMISS · {"←"} {"→"} MOVE</p>
        </div>
        <div className="flex items-center gap-3">
          <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`${queue.length} left of ${total}`}>
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - (total ? done / total : 1))}
              transform="rotate(-90 32 32)"
              className="triage-ring"
            />
            <text x="32" y="37" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--ink)" className="font-mono">
              {queue.length}
            </text>
          </svg>
          <p className="text-small text-ink-2">
            {queue.length} left
            <span className="block">{done} done</span>
          </p>
        </div>
      </div>

      {cur ? (
        <div key={cur.id} className="triage-card mt-5 rounded-2xl bg-draft p-5">
          <p className="font-mono text-meta tracking-wide text-ink-2">
            {i + 1} OF {queue.length} · {originOf(cur).label.toUpperCase()}
          </p>
          <span className="sig-draft-tag mt-2">DRAFT · {cur.kind === "stage" ? "STAGE CHANGE" : cur.kind === "opp" ? "NEW OPPORTUNITY" : cur.kind.toUpperCase()}</span>
          {editing ? (
            <form
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                decide(() => actions.edit(cur.id, draft.trim() || cur.text));
              }}
            >
              <label htmlFor="triage-edit" className="text-small font-semibold">
                Edit line
              </label>
              <textarea id="triage-edit" className="proto-input mt-1 text-h3" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
              <div className="mt-2 flex gap-2">
                <button type="submit" className="sig-btn sig-btn-primary">
                  Save edit and approve
                </button>
                <button type="button" className="sig-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-2 text-h2 font-medium leading-snug">{textOf(s, cur)}</p>
          )}
          <Meta sources={cur.sources} confidence={cur.confidence} />
          {!editing ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="sig-btn sig-btn-primary" onClick={() => decide(() => actions.approve(cur.id))}>
                Approve <kbd className="font-mono text-meta opacity-80">A</kbd>
              </button>
              <button
                type="button"
                className="sig-btn"
                onClick={() => {
                  setDraft(textOf(s, cur));
                  setEditing(true);
                }}
              >
                Edit <kbd className="font-mono text-meta text-ink-2">E</kbd>
              </button>
              <button type="button" className="sig-btn" onClick={() => decide(() => actions.dismiss(cur.id))}>
                Dismiss <kbd className="font-mono text-meta text-ink-2">D</kbd>
              </button>
              <span className="mx-1 hidden w-px bg-line sm:block" aria-hidden="true" />
              <button type="button" className="sig-btn" onClick={() => go(-1)} disabled={queue.length < 2}>
                {"←"} Back
              </button>
              <button type="button" className="sig-btn" onClick={() => go(1)} disabled={queue.length < 2}>
                Skip {"→"}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="triage-card mt-5 rounded-2xl border border-line p-6 text-center">
          <p className="relative text-h2 font-semibold">
            <span className="burst" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</span>
            Inbox zero
          </p>
          <p className="mt-1 text-ink-2">
            You decided {done} {done === 1 ? "line" : "lines"}. Approved log lines still need Save below; record fixes and
            opportunity changes are already saved.
          </p>
        </div>
      )}
    </section>
  );
}
