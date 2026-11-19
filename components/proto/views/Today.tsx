"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EVENTS } from "@/content/more";
import { account, MEETINGS, NOW } from "@/content/prototype";
import { Ask } from "../Ask";
import { Leaves } from "../Leaves";
import { DayStrip, PulseTiles } from "../Board";
import { groupByOrigin } from "../groups";
import { Num } from "../Num";
import { SourceChip } from "../Source";
import { allSugs, entryOf, me, pending, saved, tasks, useProto } from "../store";

export function Today() {
  const s = useProto();
  const [focus, setFocus] = useState<string[]>([]);
  const later = MEETINGS.filter((m) => m.day !== "Today");
  const waiting = pending(s);
  const myTasks = tasks(s);
  const groups = groupByOrigin(waiting);
  const unlogged = EVENTS.filter((e) => !allSugs(s).some((x) => x.meeting === `event:${e.id}` && entryOf(s, x.id).status === "saved"));

  return (
    <div>
      {/* The greeting sits on the leaves block, and Ask lifts over its lower edge (decision 0119). */}
      <section aria-label="Your morning" className="gw-block gw-hero">
        <Leaves seed={3} count={13} scale={1.2} />
        {/* A few shorter, fainter leaves wander toward the middle, under the line of text. */}
        <Leaves seed={11} count={9} scale={0.42} spread={[0.08, 0.95]} wide className="gw-leaves-low" />
      <p className="font-mono text-meta tracking-wide text-ink-2">
        {NOW.day.toUpperCase()} · {NOW.time}
      </p>
      <h1 className="mt-1 text-h1 font-semibold">Good morning, {me.short}</h1>
      <p className="mt-1 text-ink-2">
        {waiting.length ? (
          <>
            <Num value={waiting.length} /> lines are waiting for your approval.{" "}
          </>
        ) : (
          "Nothing is waiting for your approval. "
        )}
        Fernhill needs you most this week.
      </p>
      </section>
      <div className="ask-lift">
        <Ask onFocus={setFocus} />
      </div>

      <div className="mt-14 space-y-14">
        <DayStrip s={s} focus={focus} />

        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
          <PulseTiles s={s} focus={focus} />

          {/* One panel that turns, with arrows (decision 0127): Waiting for you, Ended without a recording, Later this
              week and Your tasks, each on the same leaves block. */}
          <SidePanel
            slides={[
              {
                id: "waiting",
                title: "Waiting for you",
                sub: "Nothing here reaches the record until you approve it.",
                body: (
                  <>
{groups.length ? (
                <ul className="proto-card mt-3 divide-y divide-line">
                  {groups.map(({ origin, items }) => (
                    <li key={origin.key} className="p-3">
                      <p className="text-small font-semibold">{origin.label}</p>
                      <p className="flex items-center justify-between gap-2 text-small text-ink-2">
                        <span>
                          {items.length} {items.length === 1 ? "line" : "lines"}
                        </span>
                        <Link href={origin.href} className="font-medium text-ink underline underline-offset-4">
                          Review<span className="sr-only"> {origin.label}</span>
                        </Link>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="proto-card mt-3 p-3 text-small text-ink-2">All clear.</p>
              )}
                  </>
                ),
              },
              ...(unlogged.length
                ? [
                    {
                      id: "unrecorded",
                      title: "Ended without a recording",
                      sub: "Log them from your notes while they are fresh.",
                      body: (
                        <>
                <ul className="proto-card mt-3 divide-y divide-line">
                  {unlogged.map((e) => (
                    <li key={e.id} className="p-3">
                      <p className="text-small font-semibold">{e.title}</p>
                      <p className="text-small text-ink-2">
                        {account(e.account)?.name} · {e.day}
                      </p>
                      <Link href={`/prototype/quick-log/${e.id}`} className="sig-btn mt-2">
                        Log it from notes
                      </Link>
                    </li>
                  ))}
                </ul>
              
                        </>
                      ),
                    },
                  ]
                : []),
              {
                id: "later",
                title: "Later this week",
                sub: "Briefs are ready the morning of each meeting.",
                body: (
                  <>
              <ul className="proto-card mt-3 divide-y divide-line">
                {later.map((m) => {
                  const ready = m.fromLog ? saved(s, (x) => x.meeting === m.fromLog && x.kind !== "fix").length > 0 : true;
                  return (
                    <li key={m.id} className="p-3">
                      <p className="text-small font-semibold">
                        <Link href={`/prototype/brief/${m.id}`} className="hover:underline">
                          {account(m.account)?.name} · {m.title}
                        </Link>
                      </p>
                      <p className="text-small text-ink-2">
                        {m.day}, {m.time}
                      </p>
                      <p className="mt-0.5 flex flex-wrap gap-x-2 font-mono text-meta tracking-wide">
                        {m.fromLog ? (
                          <span className={ready ? "text-good" : "text-ink-2"}>{ready ? "✓ BRIEF FROM YOUR LOG" : "WAITS FOR TODAY’S LOG"}</span>
                        ) : null}
                        {m.highStakes ? <span className="text-warn">{"▲"} HIGH STAKES</span> : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            
                  </>
                ),
              },
              {
                id: "tasks",
                title: "Your tasks",
                sub: "Yours to do; the AI never sends anything.",
                body: (
                  <>
              <ul className="proto-card mt-3 divide-y divide-line">
                {myTasks.map((t) => (
                  <li key={t.text} id={t.askId ? `task-${t.askId}` : undefined} tabIndex={t.askId ? -1 : undefined} className="task-row p-3">
                    <p className="text-small">{t.text}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {t.askId ? <span className="font-mono text-meta tracking-wide text-accent">FROM ASK</span> : null}
                      <span className="font-mono text-meta text-ink-2">DUE {t.due.toUpperCase()}</span>
                      {t.source ? <SourceChip id={t.source} /> : null}
                    </div>
                  </li>
                ))}
              </ul>
            
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

type Slide = { id: string; title: string; sub: string; body: React.ReactNode };

/**
 * Today's side panel as a carousel (decision 0127): one section at a time on the leaves block, with arrows and a
 * count. Turning to a section moves focus to its heading, so a screen reader hears where it landed.
 */
function SidePanel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const at = Math.min(i, slides.length - 1);
  const box = useRef<HTMLElement>(null);
  // The panel lines up with the first row of pulse tiles beside it: same top, same height, whatever it holds.
  const [fit, setFit] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    const el = box.current;
    const tile = document.querySelector<HTMLElement>(".pulse-glass");
    if (!el || !tile) return;
    const measure = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return setFit(null);
      const parent = el.parentElement!.getBoundingClientRect().top;
      const t = tile.getBoundingClientRect();
      setFit({ top: Math.round(t.top - parent), height: Math.round(t.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tile);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const cur = slides[at];
  useEffect(() => {
    const toTasks = () => setI(Math.max(0, slides.findIndex((x) => x.id === "tasks")));
    window.addEventListener("gw-show-tasks", toTasks);
    return () => window.removeEventListener("gw-show-tasks", toTasks);
  }, [slides]);
  const go = (d: number) => {
    setI((at + d + slides.length) % slides.length);
    window.setTimeout(() => document.getElementById("side-h")?.focus({ preventScroll: true }), 0);
  };
  return (
    <section
      ref={box}
      aria-roledescription="carousel"
      aria-label="Your day, more"
      className="gw-block side-panel lg:self-start"
      style={fit ? { marginTop: fit.top, height: fit.height, minHeight: 0 } : undefined}
    >
      <Leaves seed={7 + at} count={6} scale={0.7} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0" aria-live="polite">
          <p className="font-mono text-meta tracking-wide text-ink-2">
            {at + 1} OF {slides.length}
          </p>
          <h2 id="side-h" tabIndex={-1} className="mt-1 text-h3 font-semibold outline-none">
            {cur.title}
          </h2>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" className="sig-btn icon-act" aria-label={`Previous: ${slides[(at - 1 + slides.length) % slides.length].title}`} onClick={() => go(-1)}>
            <span aria-hidden="true">{"\u2190"}</span>
          </button>
          <button type="button" className="sig-btn icon-act" aria-label={`Next: ${slides[(at + 1) % slides.length].title}`} onClick={() => go(1)}>
            <span aria-hidden="true">{"\u2192"}</span>
          </button>
        </div>
      </div>
      <p className="mt-1 text-small text-ink-2">{cur.sub}</p>
      <div key={cur.id} className="side-slide">
        {cur.body}
      </div>
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {slides.map((x, k) => (
          <span key={x.id} className={`side-dot ${k === at ? "is-on" : ""}`} />
        ))}
      </div>
    </section>
  );
}
