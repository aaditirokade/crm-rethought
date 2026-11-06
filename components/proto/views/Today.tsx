"use client";

import Link from "next/link";
import { EVENTS } from "@/content/more";
import { account, forMeeting, MEETINGS, NOW } from "@/content/prototype";
import { groupByOrigin } from "../groups";
import { SourceChip } from "../Source";
import { allSugs, entryOf, me, pending, saved, tasks, useProto } from "../store";

export function Today() {
  const s = useProto();
  const today = MEETINGS.filter((m) => m.day === "Today");
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
        {today.length} meetings today.{" "}
        {waiting.length ? `${waiting.length} lines are waiting for your approval.` : "Nothing is waiting for your approval."}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-8">
          <section aria-labelledby="h-today">
            <h2 id="h-today" className="text-h3 font-semibold">
              Today&rsquo;s meetings
            </h2>
            <ol className="proto-card mt-3 divide-y divide-line">
              {today.map((m, i) => {
                const a = account(m.account);
                const sugs = forMeeting(m.id);
                const fixes = sugs.filter((x) => x.kind === "fix" && entryOf(s, x.id).status === "pending").length;
                const logPending = sugs.filter((x) => ["log", "task", "record"].includes(x.kind) && entryOf(s, x.id).status === "pending").length;
                const logSaved = sugs.some((x) => ["log", "task", "record"].includes(x.kind) && entryOf(s, x.id).status === "saved");
                return (
                  <li key={m.id} className="grid gap-3 p-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center">
                    <p className="font-mono text-body font-medium">{m.time}</p>
                    <div className="min-w-0">
                      <p className="font-semibold">
                        <Link href={`/prototype/accounts/${m.account}`} className="hover:underline">
                          {a?.name}
                        </Link>
                      </p>
                      <p className="text-small text-ink-2">
                        {m.title} · {m.context}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-meta tracking-wide">
                        <span className="text-ink-2">BRIEF READY</span>
                        {fixes ? <span className="text-accent">{fixes} RECORD FIX TO APPROVE</span> : null}
                        {m.hasLog && logPending ? (
                          <span className="text-accent">LOG · {logPending} TO APPROVE</span>
                        ) : m.hasLog && logSaved ? (
                          <span className="text-good">{"✓"} LOG SAVED</span>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/prototype/brief/${m.id}`} className={`sig-btn ${i === 0 ? "sig-btn-primary" : ""}`}>
                        Open brief<span className="sr-only"> for {a?.name}</span>
                      </Link>
                      {m.hasLog ? (
                        <Link href={`/prototype/log/${m.id}`} className="sig-btn">
                          Review log<span className="sr-only"> for {a?.name}</span>
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-small text-ink-2">The 10:00 call is shown as already finished, so you can try the log.</p>
          </section>

          <section aria-labelledby="h-next">
            <h2 id="h-next" className="text-h3 font-semibold">
              Coming up
            </h2>
            <ul className="proto-card mt-3 divide-y divide-line">
              {later.map((m) => {
                const a = account(m.account);
                const ready = m.fromLog ? saved(s, (x) => x.meeting === m.fromLog && x.kind !== "fix").length > 0 : true;
                const label = m.fromLog ? (ready ? "✓ BRIEF BUILT FROM YOUR APPROVED LOG" : "WAITING FOR TODAY’S LOG TO BE APPROVED") : "BRIEF READY";
                return (
                  <li key={m.id} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <p className="font-semibold">
                        {a?.name} · {m.title}
                      </p>
                      <p className="text-small text-ink-2">
                        {m.day}, {m.time} · {m.context}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-meta tracking-wide">
                        <span className={m.fromLog && ready ? "text-good" : "text-ink-2"}>{label}</span>
                        {m.highStakes ? <span className="text-warn">▲ HIGH STAKES · NOT RECORDED</span> : null}
                      </p>
                    </div>
                    <Link href={`/prototype/brief/${m.id}`} className="sig-btn">
                      Open brief<span className="sr-only"> for {a?.name}, {m.day}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="h-waiting">
            <h2 id="h-waiting" className="text-h3 font-semibold">
              Waiting for you
            </h2>
            <p className="mt-1 text-small text-ink-2">Nothing here reaches the record until you approve it.</p>
            {groups.length ? (
              <ul className="proto-card mt-3 divide-y divide-line">
                {groups.map(({ origin, items }) => (
                  <li key={origin.key} className="p-4">
                    <p className="font-semibold">{origin.label}</p>
                    <p className="text-small text-ink-2">
                      {items.length} {items.length === 1 ? "line" : "lines"} to approve
                    </p>
                    <Link href={origin.href} className="mt-2 inline-block text-small font-medium underline underline-offset-4">
                      Review<span className="sr-only"> {origin.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="proto-card mt-3 p-4 text-small text-ink-2">All clear.</p>
            )}
          </section>

          {unlogged.length ? (
            <section aria-labelledby="h-unrecorded">
              <h2 id="h-unrecorded" className="text-h3 font-semibold">
                Ended without a recording
              </h2>
              <p className="mt-1 text-small text-ink-2">From your calendar. Anything worth logging?</p>
              <ul className="proto-card mt-3 divide-y divide-line">
                {unlogged.map((e) => (
                  <li key={e.id} className="p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-small text-ink-2">
                      {account(e.account)?.name} · {e.day} · with {e.with}
                    </p>
                    <Link href={`/prototype/quick-log/${e.id}`} className="sig-btn mt-2">
                      Log it from notes
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="h-tasks">
            <h2 id="h-tasks" className="text-h3 font-semibold">
              Your tasks
            </h2>
            <ul className="proto-card mt-3 divide-y divide-line">
              {myTasks.map((t) => (
                <li key={t.text} className="p-4">
                  <p>{t.text}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-meta text-ink-2">DUE {t.due.toUpperCase()}</span>
                    {t.source ? <SourceChip id={t.source} /> : null}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-small text-ink-2">Tasks you approve in a log appear here.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
