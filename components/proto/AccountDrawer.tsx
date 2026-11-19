"use client";

import Link from "next/link";
import { MEETINGS } from "@/content/prototype";
import { Health } from "./bits";
import { Leaves } from "./Leaves";
import { trendOf } from "./PortfolioMap";
import { SourceChip } from "./Source";
import { liveAccount, liveOpps, pending, useProto } from "./store";

/**
 * An account at a glance, in a side panel over Accounts (decision 0124): picking a bubble on the portfolio map opens
 * it, so the map stays in view and closing it puts you back where you were. The full record is one link away.
 */
export function AccountDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const s = useProto();
  const a = liveAccount(s, id);
  if (!a) return null;
  const waiting = pending(s, (x) => x.account === id);
  const logMeeting = MEETINGS.find((m) => m.account === id && m.hasLog);
  const opps = liveOpps(s).filter((o) => o.account === id);
  const t = trendOf(id);
  const titleId = `acct-${id}`;
  const facts: [string, React.ReactNode][] = [
    ["RENEWAL", a.renewal],
    ["USAGE, 8 WEEKS", t.isNew ? "New, ramping up" : `${t.pct >= 0 ? "+" : "−"}${Math.abs(t.pct)}%`],
    ["LAST TOUCH", a.lastTouch],
    ["STORES", a.stores],
  ];

  return (
    <dialog
      ref={(el) => {
        if (el && !el.open) el.showModal();
      }}
      aria-labelledby={titleId}
      className="sig proto-drawer acct-drawer"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="flex min-h-full flex-col">
        {/* The head is a color block (decision 0124): night periwinkle with the leaves, the name and the numbers on it,
            curving off into the panel at its lower left corner. */}
        <header className="gw-night acct-head">
          <Leaves seed={[...id].reduce((n, c) => n + c.charCodeAt(0), 0)} count={8} scale={0.8} />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-meta tracking-wide text-ink-2">ACCOUNT · {a.segment.toUpperCase()}</p>
              <h2 id={titleId} className="mt-1 text-h2 font-semibold">
                {a.name}
              </h2>
              <p className="mt-2 text-small">
                <Health a={a} />
              </p>
            </div>
            <form method="dialog">
              <button className="sig-btn icon-act" aria-label="Close">
                <span aria-hidden="true">{"\u2715"}</span>
              </button>
            </form>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {facts.map(([k, v]) => (
              <div key={k} className="acct-fact">
                <dt className="font-mono text-meta tracking-wide text-ink-2">{k}</dt>
                <dd className="mt-0.5 text-[1.0625rem] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-small">
            <span className="font-mono text-meta tracking-wide text-ink-2">NEXT STEP · </span>
            {a.nextStep}
          </p>
        </header>

        <div className="flex flex-1 flex-col px-6 pb-6">
        {waiting.length ? (
          <p className="sig-row-draft mt-6 rounded-xl px-3 py-2 text-small">
            {waiting.length} {waiting.length === 1 ? "line waits" : "lines wait"} for your approval.{" "}
            <Link href={logMeeting ? `/prototype/log/${logMeeting.id}` : "/prototype/review"} className="font-medium underline underline-offset-4">
              Review
            </Link>
          </p>
        ) : null}

        <section aria-labelledby={`${titleId}-people`} className="mt-6">
          <h3 id={`${titleId}-people`} className="font-semibold">
            People
          </h3>
          <ul className="mt-2 space-y-2">
            {a.people.map((p, i) => (
              <li key={p.name + i} className="text-small">
                <span className={`font-medium ${p.leftAt ? "text-ink-2 line-through" : ""}`}>{p.name}</span>
                <span className="text-ink-2"> · {p.role}</span>
              </li>
            ))}
          </ul>
        </section>

        {opps.length ? (
          <section aria-labelledby={`${titleId}-opps`} className="mt-6">
            <h3 id={`${titleId}-opps`} className="font-semibold">
              Opportunities
            </h3>
            <ul className="mt-2 space-y-2 text-small">
              {opps.map((o) => (
                <li key={o.id}>
                  <span className="font-medium">{o.name}</span>
                  <span className="font-mono text-meta text-ink-2">
                    {" "}
                    · {o.stage.toUpperCase()} · CLOSE {o.close.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby={`${titleId}-recent`} className="mt-6">
          <h3 id={`${titleId}-recent`} className="font-semibold">
            Latest interactions
          </h3>
          <ol className="mt-2 space-y-3">
            {a.timeline.slice(0, 3).map((t) => (
              <li key={t.key} className="text-small">
                <p className="font-mono text-meta tracking-wide text-ink-2">
                  {t.date.toUpperCase()} · {t.type.toUpperCase()}
                </p>
                <p className="font-medium">{t.title}</p>
                {t.source ? (
                  <div className="mt-1">
                    <SourceChip id={t.source} />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-auto pt-8">
          <Link href={`/prototype/accounts/${id}`} className="sig-btn sig-btn-primary">
            Open the full record <span aria-hidden="true">{"→"}</span>
          </Link>
        </div>
        </div>
      </div>
    </dialog>
  );
}
