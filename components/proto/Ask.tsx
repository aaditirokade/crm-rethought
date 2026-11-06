"use client";

import { useEffect, useRef, useState } from "react";
import { answerFor, SUGGESTED, type Answer, type Stat } from "@/content/ask";
import { SourceChip } from "./Source";

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
    <section aria-labelledby="ask-h" className="ask-wrap proto-card p-4 sm:p-5">
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
                    <div key={st.label} className="rounded-[4px] bg-surface-2 p-3">
                      <dt className="font-mono text-meta tracking-wide text-ink-2">{st.label.toUpperCase()}</dt>
                      <dd className="mt-1 text-h2 font-semibold tabular-nums">
                        <Count stat={st} progress={statProgress} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {answer.next && done ? (
                <p className="ask-next mt-3 rounded-[4px] border border-line px-3 py-2 text-small">
                  <span className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED NEXT MOVE · </span>
                  {answer.next}
                </p>
              ) : null}

              {done ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-meta tracking-wide text-ink-2">
                    {sourceCount ? `DRAFTED FROM ${sourceCount} SOURCES · ` : ""}NOTHING IN THE RECORD CHANGED
                  </p>
                  <button
                    type="button"
                    className="sig-btn"
                    onClick={() => {
                      stopAll();
                      setPlaying(false);
                      setAnswer(null);
                      setInput("");
                      onFocus([]);
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {done && answer ? `Answer: ${answer.segments.map((s) => s.text).join("")} ${answer.next ? `Suggested next move: ${answer.next}` : ""}` : ""}
      </p>
    </section>
  );
}
