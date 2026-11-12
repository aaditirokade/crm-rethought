"use client";

import Link from "next/link";
import { PULSE } from "@/content/ask";
import { SIGNALS } from "@/content/more";
import { account, forMeeting, MEETINGS } from "@/content/prototype";
import { Health } from "./bits";
import { Num } from "./Num";
import { SourceChip } from "./Source";
import { entryOf, liveAccount, outreach, pending, type State } from "./store";

const START = 8;
const END = 18;
const NOW_H = 9 + 5 / 60;
const pct = (h: number) => `${((h - START) / (END - START)) * 100}%`;
const toHours = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h < 8 ? h + 12 : h) + m / 60;
};
const minutes = (len: string) => Number(len.split(" ")[0]);

function meetingStatus(s: State, id: string) {
  const sugs = forMeeting(id);
  const fixes = sugs.filter((x) => x.kind === "fix" && entryOf(s, x.id).status === "pending").length;
  const log = sugs.filter((x) => ["log", "task", "record"].includes(x.kind));
  const logPending = log.filter((x) => entryOf(s, x.id).status === "pending").length;
  const logSaved = log.some((x) => entryOf(s, x.id).status === "saved");
  return { fixes, logPending, logSaved, hasLog: log.length > 0 };
}

/** Today as a strip of time: where you are now, what's next, and what each meeting still needs. */
export function DayStrip({ s, focus }: { s: State; focus: string[] }) {
  const today = MEETINGS.filter((m) => m.day === "Today");
  const hours = Array.from({ length: END - START + 1 }, (_, i) => START + i);
  const label = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

  const card = (m: (typeof today)[number], i: number) => {
    const a = account(m.account);
    const st = meetingStatus(s, m.id);
    const dim = focus.length > 0 && !focus.includes(m.account);
    const hit = focus.includes(m.account);
    return (
      <div className={`board-item day-item ${dim ? "is-dim" : ""} ${hit ? "is-hit" : ""}`}>
        <p className="font-mono text-meta tracking-wide text-ink-2">
          {m.time} · {m.length.toUpperCase()}
        </p>
        <p className="font-semibold leading-snug">{a?.name}</p>
        <p className="text-small text-ink-2">{m.title}</p>
        <p className="mt-1 flex flex-wrap gap-x-2 font-mono text-meta tracking-wide">
          {st.fixes ? <span className="text-accent">{st.fixes} FIX</span> : null}
          {st.logPending ? (
            <span className="text-accent">LOG · {st.logPending} TO APPROVE</span>
          ) : st.logSaved ? (
            <span className="text-good">{"✓"} LOG SAVED</span>
          ) : null}
          {!st.fixes && !st.hasLog ? <span className="text-ink-2">BRIEF READY</span> : null}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href={`/prototype/brief/${m.id}`} className={`sig-btn ${i === 0 ? "sig-btn-primary" : ""}`}>
            Brief<span className="sr-only"> for {a?.name}</span>
          </Link>
          {st.hasLog ? (
            <Link href={`/prototype/log/${m.id}`} className="sig-btn">
              Log<span className="sr-only"> for {a?.name}</span>
            </Link>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby="h-day" className="tone-block">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-day" className="text-h3 font-semibold">
          Your day
        </h2>
        <p className="font-mono text-meta tracking-wide text-ink-2">3 MEETINGS · 1 HOUR 45 MIN · THE 10:00 IS SHOWN AS FINISHED SO YOU CAN TRY THE LOG</p>
      </div>

      {/* Wide screens: a time strip with cards under each meeting. */}
      <div className="relative mt-4 hidden md:block">
        <div className="relative h-14" aria-hidden="true">
          {hours.map((h) => (
            <span key={h} className="absolute top-0 -translate-x-1/2 font-mono text-meta text-ink-2" style={{ left: pct(h) }}>
              {label(h)}
            </span>
          ))}
          <div className="day-track absolute inset-x-0 top-7 h-6" />
          {today.map((m) => {
            const st = toHours(m.time);
            const hit = focus.includes(m.account);
            return (
              <span
                key={m.id}
                className={`board-block absolute top-7 h-6 rounded-xl ${hit ? "is-hit" : ""}`}
                style={{ left: pct(st), width: `${(minutes(m.length) / 60 / (END - START)) * 100}%` }}
              />
            );
          })}
          <span className="board-now absolute top-5 h-10 w-0.5" style={{ left: pct(NOW_H) }} />
          <span className="absolute top-[3.25rem] -translate-x-1/2 font-mono text-meta font-medium" style={{ left: pct(NOW_H) }}>
            NOW
          </span>
        </div>
        <ol className="relative mt-4 h-[9.5rem]">
          {today.map((m, i) => (
            <li key={m.id} className="absolute w-[24%] min-w-[11rem]" style={{ left: `min(${pct(toHours(m.time))}, 76%)` }}>
              {card(m, i)}
            </li>
          ))}
        </ol>
      </div>

      {/* Narrow screens: the same meetings as a list. */}
      <ol className="mt-3 space-y-3 md:hidden">
        {today.map((m, i) => (
          <li key={m.id}>{card(m, i)}</li>
        ))}
      </ol>
    </section>
  );
}

function Spark({ values, label }: { values: number[]; label: string }) {
  const w = 160;
  const h = 36;
  const max = Math.max(...values, 1);
  const min = 0;
  const x = (i: number) => (i / (values.length - 1)) * (w - 4) + 2;
  const y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" role="img" aria-label={label} preserveAspectRatio="none">
      <path d={d} pathLength={1} className="spark-draw" fill="none" stroke="var(--data)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
      {/* The last point is a round cap on a zero length line, so it stays a circle when the tile stretches the
          sparkline sideways on a phone (a circle would turn into an oval). */}
      <path className="spark-dot" d={`M${x(values.length - 1).toFixed(1)} ${y(values.at(-1) ?? 0).toFixed(1)}h0`} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** One tile per account: usage trend, renewal countdown, the top reason to act, and drafts waiting. */
export function PulseTiles({ s, focus }: { s: State; focus: string[] }) {
  const ranked = outreach(s).filter((r) => !s.snoozed.includes(r.account.id));
  return (
    <section aria-labelledby="h-pulse">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-pulse" className="text-h3 font-semibold">
          Account pulse
        </h2>
        <Link href="/prototype/opportunities" className="text-small font-medium underline underline-offset-4">
          Ranked by who needs you this week
        </Link>
      </div>
      <ol className="mt-4 grid gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {ranked.map((r, i) => {
          const a = liveAccount(s, r.account.id) ?? r.account;
          const series = PULSE[a.id] ?? [];
          const first = series.find((v) => v > 0) ?? 0;
          const last = series.at(-1) ?? 0;
          const change = first ? Math.round(((last - first) / first) * 100) : 0;
          const isNew = series[0] === 0;
          const days = Math.round((Date.parse(a.renewalDate) - Date.parse("2026-11-12")) / 864e5);
          const top = (SIGNALS[a.id] ?? [])[0];
          const waiting = pending(s, (x) => x.account === a.id).length;
          const dim = focus.length > 0 && !focus.includes(a.id);
          const hit = focus.includes(a.id);
          const trend = isNew ? "New this quarter, ramping up" : `${change >= 0 ? "Up" : "Down"} ${Math.abs(change)}% in 8 weeks`;
          return (
            <li key={a.id} className={`board-item proto-card p-4 ${dim ? "is-dim" : ""} ${hit ? "is-hit" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-meta text-ink-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-semibold">
                    <Link href={`/prototype/accounts/${a.id}`} className="hover:underline">
                      {a.name}
                    </Link>
                  </h3>
                  <p className="text-small">
                    <Health a={a} />
                  </p>
                </div>
                {waiting ? (
                  <Link href="/prototype/review" className="sig-draft-tag shrink-0">
                    {waiting} DRAFT{waiting > 1 ? "S" : ""}
                    <span className="sr-only"> waiting for approval</span>
                  </Link>
                ) : null}
              </div>

              <div className="mt-3">
                <p className="flex justify-between font-mono text-meta tracking-wide text-ink-2">
                  <span>WEEKLY DASHBOARD VIEWS</span>
                  <span className={isNew ? "text-ink-2" : change <= -20 ? "text-risk" : change >= 10 ? "text-good" : "text-ink-2"}>
                    {isNew ? "NEW" : <>{change >= 0 ? "▲" : "▼"} <Num value={Math.abs(change)} suffix="%" /></>}
                  </span>
                </p>
                <Spark values={series} label={`Weekly dashboard views, 8 weeks: ${trend}. Latest week ${last}.`} />
              </div>

              <div className="mt-2">
                <p className="flex justify-between font-mono text-meta tracking-wide text-ink-2">
                  <span>RENEWS {a.renewal.toUpperCase()}</span>
                  <span className={days <= 90 ? "text-ink" : ""}><Num value={days} /> DAYS</span>
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                  <div className="bar-grow h-full rounded-full bg-data" style={{ width: `${Math.max(4, 100 - (days / 365) * 100)}%` }} />
                </div>
              </div>

              {top ? (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-small">
                  <span>{top.text}</span>
                  <SourceChip id={top.source} />
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
