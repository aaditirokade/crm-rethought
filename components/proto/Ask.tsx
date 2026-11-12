"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { answerFor, SUGGESTED, type Answer, type Stat, type SuggestedAction } from "@/content/ask";
import { SOURCES } from "@/content/prototype";
import { SourceChip } from "./Source";
import { actions as store, useProto } from "./store";

const STEP_MS = 420;
const WORD_MS = 32;
const TYPE_MS = 38;

type Token = { seg: number; text: string };

/** Wall clock for the animation. Timers (not animation frames) keep it moving even in a background tab. */
const clock = () => performance.now();
const FRAME = 16;

function tokens(a: Answer): Token[] {
  return a.segments.flatMap((s, seg) => s.text.split(/(\s+)/).filter(Boolean).map((text) => ({ seg, text })));
}

/** Timeline of one answer, in milliseconds from when the question was asked. */
function timeline(a: Answer) {
  const t = tokens(a);
  const writeStart = a.steps.length * STEP_MS + 250;
  const writeEnd = writeStart + t.filter((x) => x.text.trim()).length * WORD_MS;
  const statsEnd = writeEnd + 900;
  return { t, writeStart, writeEnd, statsEnd, total: statsEnd + 200 };
}

const KIND: Record<SuggestedAction["kind"], { tag: string; verb: string; done: string }> = {
  email: { tag: "EMAIL", verb: "Draft it", done: "Drafted" },
  task: { tag: "TASK", verb: "Add task", done: "Added to your tasks" },
  meeting: { tag: "INVITE", verb: "Draft invite", done: "Invite drafted" },
  open: { tag: "OPEN", verb: "Open", done: "" },
};

/**
 * Actions the AI suggests from its answer (Nov 2026). Each says what it would do; nothing happens until the person
 * chooses it, a draft waits in Review like any other line, and Undo takes it back.
 */
export function AskActions({ items, answer, onReview }: { items: SuggestedAction[]; answer: Answer; onReview?: () => void }) {
  const s = useProto();
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  // A drafted email or invite is a real line in Review (decision 0099), so its state comes from the store.
  const drafts = (a: SuggestedAction) => a.kind === "email" || a.kind === "meeting";
  const isDone = (a: SuggestedAction) => (drafts(a) ? s.custom.some((x) => x.id === `ask-${a.id}`) : !!taken[a.id]);
  const cited = [...new Set(answer.segments.flatMap((g) => g.cite ?? []))].filter((id) => SOURCES[id]).slice(0, 3);
  const take = (a: SuggestedAction, on: boolean) => {
    if (drafts(a)) {
      if (on) store.draftFromAsk(a, answer.accounts[0] ?? "", cited);
      else store.undraftFromAsk(a.id);
      return;
    }
    setTaken((t) => ({ ...t, [a.id]: on }));
    store.announce(on ? `${KIND[a.kind].done}: ${a.title}` : `Undone: ${a.title}`);
  };
  return (
    <section className="ask-actions mt-5" aria-label="Suggested actions">
      <p className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED ACTIONS · NOTHING HAPPENS UNTIL YOU CHOOSE ONE</p>
      <ul className="mt-2">
        {items.map((a, i) => {
          const k = KIND[a.kind];
          const done = isDone(a);
          return (
            <li key={a.id} className="ask-action flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3" style={{ animationDelay: `${i * 90}ms` }}>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-meta tracking-wide text-ink-2">{k.tag}</p>
                <p className="font-medium">{a.title}</p>
                <p className="text-small text-ink-2">{a.detail}</p>
              </div>
              {a.kind === "open" && a.href ? (
                <Link href={a.href} className="sig-btn shrink-0">
                  {k.verb}
                </Link>
              ) : done ? (
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-meta tracking-wide text-good">✓ {k.done.toUpperCase()}</span>
                  {drafts(a) ? (
                    onReview ? (
                      <button type="button" className="sig-btn" onClick={onReview}>
                        Review it<span className="sr-only">: {a.title}</span>
                      </button>
                    ) : (
                      <Link href="/prototype/review" className="sig-btn">
                        Review it<span className="sr-only">: {a.title}</span>
                      </Link>
                    )
                  ) : null}
                  <button type="button" className="sig-btn" onClick={() => take(a, false)}>
                    Undo<span className="sr-only"> {a.title}</span>
                  </button>
                </span>
              ) : (
                <button type="button" className="sig-btn shrink-0" onClick={() => take(a, true)}>
                  {k.verb}
                  <span className="sr-only">: {a.title}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Count({ stat, progress }: { stat: Stat; progress: number }) {
  const v = Math.round(stat.value * Math.min(1, Math.max(0, progress)));
  return (
    <span>
      {stat.prefix}
      {stat.value < 0 ? `−${Math.abs(v)}` : v}
      {stat.suffix}
    </span>
  );
}

/**
 * Ask about any account. The answer is read only: it cites a source for every claim and changes nothing.
 * Animated for the demo (reading steps, the answer writing itself, numbers counting up); respects reduced motion.
 */
export function Ask({ onFocus }: { onFocus: (ids: string[]) => void }) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef(0);
  const timers = useRef<number[]>([]);
  const focused = useRef(false);
  const box = useRef<HTMLElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const f = frame;
    const t = timers;
    return () => {
      window.clearTimeout(f.current);
      t.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const stopAll = () => {
    window.clearTimeout(frame.current);
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const run = (q: string, then?: () => void) => {
    window.clearTimeout(frame.current);
    const a = answerFor(q);
    const tl = timeline(a);
    setAnswer(a);
    onFocus([]);
    focused.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setElapsed(tl.total);
      onFocus(a.accounts);
      if (then) later(then, 4000);
      return;
    }
    const t0 = clock();
    setElapsed(0);
    const tick = () => {
      const e = clock() - t0;
      setElapsed(e);
      if (!focused.current && e >= tl.writeStart) {
        focused.current = true;
        onFocus(a.accounts);
      }
      if (e < tl.total) frame.current = window.setTimeout(tick, FRAME);
      else if (then) later(then, 3200);
    };
    frame.current = window.setTimeout(tick, FRAME);
  };

  /** Type the question in, then ask it, so a screen recording shows the whole moment. */
  const typeAndAsk = (q: string, then?: () => void) => {
    setInput("");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInput(q);
      run(q, then);
      return;
    }
    for (let i = 1; i <= q.length; i++) later(() => setInput(q.slice(0, i)), i * TYPE_MS);
    later(() => run(q, then), q.length * TYPE_MS + 350);
  };

  const playDemo = () => {
    stopAll();
    setPlaying(true);
    const step = (i: number) => {
      if (i >= SUGGESTED.length) {
        setPlaying(false);
        return;
      }
      typeAndAsk(SUGGESTED[i], () => step(i + 1));
    };
    step(0);
  };

  const stopDemo = () => {
    stopAll();
    setPlaying(false);
    if (answer) setElapsed(timeline(answer).total);
  };

  const tl = answer ? timeline(answer) : null;
  const done = !!tl && elapsed >= tl.total;
  const writing = !!tl && elapsed >= tl.writeStart;
  const shown = tl ? Math.max(0, Math.floor((elapsed - tl.writeStart) / WORD_MS)) : 0;
  const statProgress = tl ? (elapsed - tl.writeEnd) / 900 : 0;

  // How many words of each segment are visible, and whether the segment is complete (then its sources appear).
  const segView = (() => {
    if (!answer || !tl) return [];
    let words = 0;
    return answer.segments.map((_, i) => {
      const toks = tl.t.filter((x) => x.seg === i);
      let text = "";
      let complete = true;
      for (const tk of toks) {
        if (!tk.text.trim()) {
          if (words < shown) text += tk.text;
          continue;
        }
        if (words < shown) text += tk.text;
        else complete = false;
        words++;
      }
      return { text, complete };
    });
  })();

  const sourceCount = answer ? new Set(answer.segments.flatMap((s) => s.cite ?? [])).size : 0;

  return (
    <section ref={box} aria-labelledby="ask-h" className="ask-wrap proto-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ask-h" className="text-h3 font-semibold">
          Ask about any account
        </h2>
        <span className="font-mono text-meta tracking-wide text-ink-2">READ ONLY · EVERY CLAIM HAS A SOURCE</span>
      </div>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            stopAll();
            setPlaying(false);
            run(input.trim());
          }
        }}
      >
        <label htmlFor="ask-q" className="sr-only">
          Your question
        </label>
        <input
          ref={field}
          id="ask-q"
          className="proto-input ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Why is Fernhill slipping?"
          autoComplete="off"
        />
        <button type="submit" className="sig-btn sig-btn-primary shrink-0 justify-center" disabled={!input.trim()}>
          Ask
        </button>
      </form>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            type="button"
            className="sig-btn"
            onClick={() => {
              stopAll();
              setPlaying(false);
              typeAndAsk(q);
            }}
          >
            {q}
          </button>
        ))}
        <button type="button" className="sig-btn" aria-pressed={playing} onClick={playing ? stopDemo : playDemo}>
          {playing ? "Stop demo" : "▶ Play demo"}
        </button>
      </div>

      <div className={`ask-panel ${answer ? "is-open" : ""}`}>
        <div className="min-h-0">
          {answer && tl ? (
            <div className="mt-4 border-t border-line pt-4" aria-busy={!done}>
              <p className="font-mono text-meta tracking-wide text-ink-2">YOU ASKED</p>
              <p className="font-medium">{answer.question}</p>

              <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1" aria-hidden="true">
                {answer.steps.map((st, i) => {
                  const visible = elapsed >= i * STEP_MS;
                  const checked = elapsed >= (i + 1) * STEP_MS;
                  return (
                    <li key={st} className={`ask-step font-mono text-meta ${visible ? "is-in" : ""} ${checked ? "text-ink-2" : "text-accent"}`}>
                      <span className={checked ? "" : "ask-spin"}>{checked ? "✓" : "◌"}</span> {st.toUpperCase()}
                    </li>
                  );
                })}
              </ol>

              <div className="ask-answer mt-3 text-body leading-relaxed" aria-hidden={!done}>
                {answer.segments.map((seg, i) => (
                  <span key={i} className={seg.cite && segView[i]?.text ? "ask-claim" : ""}>
                    {segView[i]?.text}
                    {seg.cite && segView[i]?.complete && writing
                      ? seg.cite.map((c) => (
                          <span key={c} className="ask-cite">
                            {" "}
                            <SourceChip id={c} />
                          </span>
                        ))
                      : null}
                  </span>
                ))}
                {writing && !done && shown < tl.t.filter((x) => x.text.trim()).length ? <span className="ask-caret" aria-hidden="true" /> : null}
              </div>

              {answer.stats.length && elapsed >= tl.writeEnd ? (
                <dl className="ask-stats mt-4 grid grid-cols-3 gap-2">
                  {answer.stats.map((st) => (
                    <div key={st.label} className="border-l border-line pl-3">
                      <dt className="font-mono text-meta tracking-wide text-ink-2">{st.label.toUpperCase()}</dt>
                      <dd className="mt-1 text-h2 font-semibold tabular-nums">
                        <Count stat={st} progress={statProgress} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {answer.next && done ? (
                <p className="ask-next mt-4 border-l-2 border-accent pl-3 text-small">
                  <span className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED NEXT MOVE · </span>
                  {answer.next}
                </p>
              ) : null}

              {answer.actions?.length && done ? <AskActions key={answer.id} items={answer.actions} answer={answer} /> : null}

              {done ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-meta tracking-wide text-ink-2">
                    {sourceCount ? `DRAFTED FROM ${sourceCount} SOURCES · ` : ""}NOTHING IN THE RECORD CHANGED
                  </p>
                  <button
                    type="button"
                    className="ask-clear"
                    onClick={() => {
                      stopAll();
                      setPlaying(false);
                      setAnswer(null);
                      setInput("");
                      onFocus([]);
                      // Back up to the top once the answer is cleared, with focus on the question field (Nov 2026).
                      const el = box.current;
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY;
                        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                        window.scrollTo({ top: top < window.innerHeight ? 0 : top - 24, behavior: reduce ? "auto" : "smooth" });
                      }
                      field.current?.focus({ preventScroll: true });
                    }}
                  >
                    Clear
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {done && answer
          ? `Answer: ${answer.segments.map((s) => s.text).join("")} ${answer.next ? `Suggested next move: ${answer.next}` : ""} ${answer.actions?.length ? `${answer.actions.length} suggested actions follow.` : ""}`
          : ""}
      </p>
    </section>
  );
}
