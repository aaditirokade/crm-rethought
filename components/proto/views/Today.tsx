"use client";

import Link from "next/link";
import { useState } from "react";
import { EVENTS } from "@/content/more";
import { account, MEETINGS, NOW } from "@/content/prototype";
import { Ask } from "../Ask";
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

      <div className="mt-10 space-y-14">
        <Ask onFocus={setFocus} />
        <DayStrip s={s} focus={focus} />

        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
          <PulseTiles s={s} focus={focus} />

          <aside className="tone-block space-y-10 lg:self-start">
            <section aria-labelledby="h-waiting" className="ai-wash">
              <h2 id="h-waiting" className="text-h3 font-semibold">
                Waiting for you
              </h2>
              <p className="mt-1 text-small text-ink-2">Nothing here reaches the record until you approve it.</p>
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
            </section>

            {unlogged.length ? (
              <section aria-labelledby="h-unrecorded">
                <h2 id="h-unrecorded" className="text-h3 font-semibold">
                  Ended without a recording
                </h2>
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
              </section>
            ) : null}

            <section aria-labelledby="h-next">
              <h2 id="h-next" className="text-h3 font-semibold">
                Later this week
              </h2>
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
            </section>

            <section aria-labelledby="h-tasks">
              <h2 id="h-tasks" className="text-h3 font-semibold">
                Your tasks
              </h2>
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
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
