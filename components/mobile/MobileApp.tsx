"use client";

import { useRef, useState } from "react";
import { answerFor, SUGGESTED, type Answer } from "@/content/ask";
import { EVENTS } from "@/content/more";
import { account, forMeeting, MEETINGS, NOW } from "@/content/prototype";
import { AskActions } from "@/components/proto/Ask";
import { originOf } from "@/components/proto/groups";
import { FixBox, GateLine } from "@/components/proto/Lines";
import { Meta, SourceChip } from "@/components/proto/Source";
import { actions, allSugs, entryOf, isGated, me, textOf, useProto } from "@/components/proto/store";

type Screen = "home" | "brief" | "approve" | "ask" | "note";

/**
 * Groundwork on a phone: built for the minutes between meetings.
 * Same data and the same rules as the desktop prototype: the AI drafts, a person approves.
 */
export function MobileApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const s = useProto();
  const queue = allSugs(s).filter((x) => isGated(x) && entryOf(s, x.id).status === "pending");
  const tabs: { id: Screen; label: string; count?: number }[] = [
    { id: "home", label: "Next up" },
    { id: "approve", label: "Approve", count: queue.length },
    { id: "ask", label: "Ask" },
    { id: "note", label: "Voice note" },
  ];

  return (
    <div className="sig mob relative flex h-full flex-col bg-bg text-ink">
      <div className="mob-scroll flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <div key={screen} className="screen-in">
        {screen === "home" ? <Home go={setScreen} waiting={queue.length} /> : null}
        {screen === "brief" ? <Brief back={() => setScreen("home")} /> : null}
        {screen === "approve" ? <Approve /> : null}
        {screen === "ask" ? <AskScreen go={setScreen} /> : null}
        {screen === "note" ? <VoiceNote /> : null}
        </div>
      </div>
      <nav aria-label="App" className="mob-tabs">
        {tabs.map((t) => (
          <button key={t.id} type="button" aria-current={screen === t.id || (t.id === "home" && screen === "brief") ? "page" : undefined} onClick={() => setScreen(t.id)}>
            <span className="mob-tab-dot" aria-hidden="true">
              {t.count ? <span key={t.count} className="dock-badge">{t.count}</span> : null}
            </span>
            {t.label}
            {t.count ? <span className="sr-only">, {t.count} waiting</span> : null}
          </button>
        ))}
      </nav>
      <p className="sr-only" aria-live="polite">
        {s.message}
      </p>
    </div>
  );
}

function Home({ go, waiting }: { go: (s: Screen) => void; waiting: number }) {
  const s = useProto();
  const next = MEETINGS[0];
  const a = account(next.account);
  const know = ["b1", "b5", "b2"].map((id) => forMeeting(next.id).find((x) => x.id === id)!).filter(Boolean);
  const later = MEETINGS.filter((m) => m.day === "Today").slice(1);
  return (
    <div>
      <p className="font-mono text-meta tracking-wide text-ink-2">
        {NOW.day.toUpperCase()} · {NOW.time}
      </p>
      <h1 className="text-h2 font-semibold">Hi {me.short}</h1>

      <section aria-labelledby="m-next" className="mt-5">
        <p className="font-mono text-meta tracking-wide text-ink-2">NEXT UP · IN 55 MIN</p>
        <h2 id="m-next" className="mt-1 text-h3 font-semibold">
          {next.time} · {a?.name}
        </h2>
        <p className="text-small text-ink-2">
          {next.title} · {next.lastTouch}
        </p>
        <p className="mt-3 font-mono text-meta tracking-wide text-ink-2">KNOW BEFORE YOU GO</p>
        <ul className="mt-1 space-y-3">
          {know.map((x) => (
            <li key={x.id} className="text-small">
              {x.tag ? <span className="proto-tag">{x.tag}</span> : null}
              {textOf(s, x)}
              <div className="mt-1">
                <SourceChip id={x.sources[0]} />
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className="sig-btn sig-btn-primary mt-4 w-full justify-center py-2" onClick={() => go("brief")}>
          Open the full brief
        </button>
      </section>

      <button type="button" className="ai-wash mt-3 flex w-full items-center justify-between text-left" onClick={() => go("approve")}>
        <span>
          <span className="sig-draft-tag">DRAFT</span>
          <span className="mt-1 block font-semibold">{waiting ? `${waiting} lines wait for you` : "Nothing waiting"}</span>
          <span className="block text-small text-ink-2">Swipe through them in a minute</span>
        </span>
        <span aria-hidden="true" className="text-h2">
          {"›"}
        </span>
      </button>

      <button type="button" className="ask-wrap proto-card mob-ask-entry mt-3 block w-full p-4 text-left" onClick={() => go("ask")}>
        <span className="block text-h3 font-semibold">Ask about any account</span>
        <span className="mt-3 flex items-center justify-between gap-3">
          <span className="mob-ask-line min-w-0 flex-1 text-ink-2">Why is Fernhill slipping?</span>
          <span aria-hidden="true" className="mob-ask-go">
            Ask
          </span>
        </span>
      </button>

      <section aria-labelledby="m-later" className="mt-5">
        <h2 id="m-later" className="font-mono text-meta tracking-wide text-ink-2">
          LATER TODAY
        </h2>
        <ul className="mt-1 divide-y divide-line">
          {later.map((m) => (
            <li key={m.id} className="flex items-baseline gap-3 py-3">
              <span className="font-mono text-small">{m.time}</span>
              <span className="min-w-0">
                <span className="block font-medium">{account(m.account)?.name}</span>
                <span className="block text-small text-ink-2">{m.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Brief({ back }: { back: () => void }) {
  const s = useProto();
  const m = MEETINGS[0];
  const items = forMeeting(m.id).filter((x) => ["brief", "fix"].includes(x.kind));
  const sections = [...new Set(items.map((x) => x.section))];
  return (
    <div>
      <button type="button" className="sig-btn" onClick={back}>
        {"‹"} Next up
      </button>
      <h1 className="mt-3 text-h2 font-semibold">{account(m.account)?.name}</h1>
      <p className="text-small text-ink-2">
        {m.title} · {m.time} · {m.lastTouch}
      </p>
      {sections.map((sec) => (
        <section key={sec} className="mt-5" aria-label={sec}>
          <h2 className="font-mono text-meta tracking-wide text-ink-2">{sec.toUpperCase()}</h2>
          <ul className="mt-2 space-y-3">
            {items
              .filter((x) => x.section === sec)
              .map((x) =>
                x.kind === "fix" ? (
                  <li key={x.id}>
                    <FixBox sug={x} />
                  </li>
                ) : (
                  <li key={x.id} className="border-t border-line pt-3">
                    <p>
                      {x.tag ? <span className="proto-tag">{x.tag}</span> : null}
                      {textOf(s, x)}
                    </p>
                    <Meta sources={x.sources} confidence={x.confidence} />
                  </li>
                ),
              )}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** One card at a time. Swipe right to approve, left to dismiss; the buttons do the same. */
function Approve() {
  const s = useProto();
  const queue = allSugs(s).filter((x) => isGated(x) && entryOf(s, x.id).status === "pending");
  const approved = allSugs(s).filter((x) => entryOf(s, x.id).status === "approved").length;
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const cur = queue[0];

  const decide = (dir: 1 | -1) => {
    if (!cur || leaving) return;
    setLeaving(dir);
    window.setTimeout(() => {
      if (dir === 1) actions.approve(cur.id);
      else actions.dismiss(cur.id);
      setLeaving(0);
      setDx(0);
    }, 220);
  };

  return (
    <div>
      <h1 className="text-h2 font-semibold">Approve</h1>
      <p className="text-small text-ink-2">Swipe right to approve, left to dismiss. Nothing saves without you.</p>

      {cur ? (
        <>
          <p className="mt-4 font-mono text-meta tracking-wide text-ink-2">
            {queue.length} LEFT · {originOf(cur).label.toUpperCase()}
          </p>
          <div className="relative mt-2">
            {queue[1] ? <div aria-hidden="true" className="absolute inset-x-3 -bottom-2 h-full rounded-[20px] border border-line bg-surface" /> : null}
            <article
              aria-roledescription="card"
              aria-label="Line to approve"
              className={`mob-card relative p-4 ${originOf(cur).key === "opps" ? "mob-ai" : "mob-wash"}`}
              style={{
                transform: `translateX(${leaving ? leaving * 420 : dx}px) rotate(${(leaving ? leaving * 420 : dx) / 30}deg)`,
                transition: dragging ? "none" : "transform 220ms ease",
              }}
              onPointerDown={(e) => {
                start.current = e.clientX;
                setDragging(true);
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (start.current !== null) setDx(e.clientX - start.current);
              }}
              onPointerUp={() => {
                const d = dx;
                start.current = null;
                setDragging(false);
                if (d > 90) decide(1);
                else if (d < -90) decide(-1);
                else setDx(0);
              }}
              onPointerCancel={() => {
                start.current = null;
                setDragging(false);
                setDx(0);
              }}
            >
              {dx > 40 ? <span className="mob-stamp text-good">APPROVE</span> : dx < -40 ? <span className="mob-stamp text-ink-2">DISMISS</span> : null}
              <span className="sig-draft-tag">DRAFT · {cur.kind === "stage" ? "STAGE CHANGE" : cur.kind === "opp" ? "NEW OPPORTUNITY" : cur.kind.toUpperCase()}</span>
              <p className="mt-2 text-h3 font-medium leading-snug">{textOf(s, cur)}</p>
              <Meta sources={cur.sources} confidence={cur.confidence} />
            </article>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6">
            <button type="button" className="mob-round" onClick={() => decide(-1)}>
              <span aria-hidden="true">{"✕"}</span>
              <span className="sr-only">Dismiss</span>
            </button>
            <button type="button" className="mob-round mob-round-yes" onClick={() => decide(1)}>
              <span aria-hidden="true">{"✓"}</span>
              <span className="sr-only">Approve</span>
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-3xl border border-line p-6 text-center">
          <p className="relative text-h2 font-semibold">
            <span className="burst" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} />)}</span>
            All clear
          </p>
          <p className="mt-1 text-ink-2">Every draft has been approved or dismissed.</p>
        </div>
      )}

      {approved ? (
        <div className="mt-6 border-t border-line pt-4">
          <p className="text-small">
            <span className="font-semibold">{approved} approved</span> and waiting to be saved to the record.
          </p>
          <button type="button" className="sig-btn sig-btn-primary mt-2 w-full justify-center py-2" onClick={() => actions.save()}>
            Save {approved} approved {approved === 1 ? "line" : "lines"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AskScreen({ go }: { go: (s: Screen) => void }) {
  const box = useRef<HTMLElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const ask = (text: string) => {
    setQ(text);
    setAnswer(answerFor(text));
  };
  const sources = answer ? new Set(answer.segments.flatMap((x) => x.cite ?? [])).size : 0;
  return (
    <section ref={box} aria-labelledby="m-ask-h" className="ask-wrap proto-card p-4">
      <h1 id="m-ask-h" className="text-h2 font-semibold">
        Ask
      </h1>
      <p className="text-small text-ink-2">Read only. Every claim has a source.</p>
      <form
        className="mt-3 flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) ask(q.trim());
        }}
      >
        <label htmlFor="m-ask" className="sr-only">
          Your question
        </label>
        <input ref={field} id="m-ask" className="proto-input ask-input min-w-0 flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Why is Fernhill slipping?" autoComplete="off" />
        <button type="submit" className="sig-btn sig-btn-primary shrink-0" disabled={!q.trim()}>
          Ask
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED.map((x) => (
          <button key={x} type="button" className="sig-btn text-left" onClick={() => ask(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className={`ask-panel ${answer ? "is-open" : ""}`}>
        <div className="min-h-0">
          {answer ? (
            <div key={answer.question} aria-label="Answer" role="region" className="mt-4 border-t border-line pt-4">
              <p className="font-mono text-meta tracking-wide text-ink-2">YOU ASKED</p>
              <p className="font-medium">{answer.question}</p>
              <p className="mt-3 leading-relaxed">
                {answer.segments.map((seg, i) => (
                  <span key={i} className="mob-seg" style={{ animationDelay: `${i * 90}ms` }}>
                    {seg.text}
                    {seg.cite?.map((c) => (
                      <span key={c}>
                        {" "}
                        <SourceChip id={c} />
                      </span>
                    ))}
                  </span>
                ))}
              </p>
              {answer.stats.length ? (
                <dl className="ask-stats mt-4 grid grid-cols-3 gap-2">
                  {answer.stats.map((st) => (
                    <div key={st.label}>
                      <dt className="font-mono text-[0.625rem] leading-tight tracking-wide text-ink-2">{st.label.toUpperCase()}</dt>
                      <dd className="tabular-nums">
                        {st.value < 0 ? `−${Math.abs(st.value)}` : st.value}
                        {st.suffix}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {answer.next ? (
                <p className="ask-next mt-4 border-l-2 border-accent pl-3 text-small">
                  <span className="font-mono text-meta tracking-wide text-ink-2">SUGGESTED NEXT MOVE · </span>
                  {answer.next}
                </p>
              ) : null}
              {answer.actions?.length ? <AskActions key={answer.id} items={answer.actions} answer={answer} onReview={() => go("approve")} /> : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-meta tracking-wide text-ink-2">
                  {sources ? `${sources} SOURCES · ` : ""}NOTHING IN THE RECORD CHANGED
                </p>
                <button
                  type="button"
                  className="ask-clear"
                  onClick={() => {
                    setAnswer(null);
                    setQ("");
                    // Back up to the top of the screen, with focus on the question field.
                    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    box.current?.closest(".mob-scroll")?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
                    field.current?.focus({ preventScroll: true });
                  }}
                >
                  Clear
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Record a voice note after a conversation; the AI drafts lines from the transcript, a person approves. */
function VoiceNote() {
  const s = useProto();
  const ev = EVENTS[0];
  const [phase, setPhase] = useState<"idle" | "recording" | "transcribing" | "done">(s.notes[ev.id] ? "done" : "idle");
  const [text, setText] = useState(s.notes[ev.id]?.text ?? "");
  const [secs, setSecs] = useState(0);
  const timers = useRef<number[]>([]);
  const lines = allSugs(s).filter((x) => x.meeting === `event:${ev.id}`);
  const approved = lines.filter((x) => entryOf(s, x.id).status === "approved").length;

  const record = () => {
    setPhase("recording");
    setSecs(0);
    for (let i = 1; i <= 4; i++) timers.current.push(window.setTimeout(() => setSecs(i), i * 700));
    timers.current.push(
      window.setTimeout(() => {
        setPhase("transcribing");
        const words = ev.sample.split(" ");
        words.forEach((_, i) => timers.current.push(window.setTimeout(() => setText(words.slice(0, i + 1).join(" ")), i * 45)));
        timers.current.push(window.setTimeout(() => setPhase("done"), words.length * 45 + 200));
      }, 3000),
    );
  };

  return (
    <div>
      <h1 className="text-h2 font-semibold">Voice note</h1>
      <p className="text-small text-ink-2">
        {ev.title} with {ev.with}, {ev.day}. No recording of the conversation; just your words afterwards.
      </p>

      <div className="mt-5 grid place-items-center">
        <button
          type="button"
          className={`mob-mic ${phase === "recording" ? "is-on" : ""}`}
          onClick={record}
          disabled={phase === "recording" || phase === "transcribing"}
          aria-describedby="mic-state"
        >
          <span aria-hidden="true">{"●"}</span>
          <span className="sr-only">Record a voice note</span>
        </button>
        <p id="mic-state" className="mt-2 font-mono text-meta tracking-wide text-ink-2" aria-live="polite">
          {phase === "recording" ? `RECORDING 0:0${secs}` : phase === "transcribing" ? "TRANSCRIBING" : phase === "done" ? "TRANSCRIBED · EDIT IF NEEDED" : "TAP TO RECORD (SAMPLE)"}
        </p>
        {phase === "recording" ? (
          <div className="mob-wave mt-2" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} style={{ animationDelay: `${i * 70}ms` }} />
            ))}
          </div>
        ) : null}
      </div>

      <label htmlFor="m-note" className="mt-4 block text-small font-semibold">
        Transcript
      </label>
      <textarea id="m-note" className="proto-input mt-1" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Or type your note here" />
      <button
        type="button"
        className="sig-btn sig-btn-primary mt-2 w-full justify-center py-2"
        disabled={!text.trim() || phase === "recording" || phase === "transcribing"}
        onClick={() => actions.draftFromNotes(ev.id, text.trim(), false)}
      >
        {lines.length ? "Draft lines again" : "Draft log lines"}
      </button>

      {lines.length ? (
        <>
          <ul className="mt-4 space-y-1">
            {lines.map((x) => (
              <GateLine key={x.id} sug={x} />
            ))}
          </ul>
          <button type="button" className="sig-btn mt-3 w-full justify-center py-2" disabled={!approved} onClick={() => actions.save(`event:${ev.id}`)}>
            Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
          </button>
        </>
      ) : null}
    </div>
  );
}
