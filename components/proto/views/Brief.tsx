"use client";

import Link from "next/link";
import { useState } from "react";
import { forMeeting, meeting, type Suggestion } from "@/content/prototype";
import { PageHead } from "../bits";
import { BriefLine, FixBox, FlagBox } from "../Lines";
import { Meta } from "../Source";
import { actions, entryOf, liveAccount, pending, saved, textOf, useProto, type State } from "../store";

/** Lines for a brief built only from another meeting's approved log. */
function fromApprovedLog(s: State, sourceMeeting: string): { section: string; items: Suggestion[] }[] {
  const lines = saved(s, (x) => x.meeting === sourceMeeting && x.kind !== "fix");
  const make = (x: Suggestion, section: string): Suggestion => ({
    ...x,
    id: `n-${x.id}`,
    kind: "brief",
    section,
    text: textOf(s, x),
    sources: [`log:${x.id}`],
    confidence: "High",
    effect: undefined,
  });
  return [
    { section: "What you agreed on Nov 12", items: lines.filter((x) => x.kind === "log").map((x) => make(x, "agreed")) },
    { section: "Promises you made", items: lines.filter((x) => x.kind === "task").map((x) => make(x, "promises")) },
    { section: "What changed in the record", items: lines.filter((x) => x.kind === "record").map((x) => make(x, "record")) },
  ].filter((g) => g.items.length);
}

export function Brief({ id }: { id: string }) {
  const s = useProto();
  const [showHidden, setShowHidden] = useState(false);
  const m = meeting(id);
  const a = m ? liveAccount(s, m.account) : undefined;
  if (!m || !a) return null;

  const groups: { section: string; items: Suggestion[] }[] = m.fromLog
    ? fromApprovedLog(s, m.fromLog)
    : forMeeting(m.id)
        .filter((x) => ["brief", "fix", "flag"].includes(x.kind))
        .reduce<{ section: string; items: Suggestion[] }[]>((acc, x) => {
          const g = acc.find((y) => y.section === x.section);
          if (g) g.items.push(x);
          else acc.push({ section: x.section, items: [x] });
          return acc;
        }, []);

  // High stakes: lines the AI is unsure of stay hidden unless the person asks to see them.
  const hidden = m.highStakes ? groups.flatMap((g) => g.items).filter((x) => x.confidence === "Medium").length : 0;
  if (m.highStakes && !showHidden) {
    for (const g of groups) g.items = g.items.filter((x) => x.confidence !== "Medium");
  }

  const pins = groups.flatMap((g) => g.items).filter((x) => s.pinned.includes(x.id) && entryOf(s, x.id).status !== "dismissed");
  const waitingFromLog = m.fromLog ? pending(s, (x) => x.meeting === m.fromLog).length : 0;
  const total = groups.reduce((n, g) => n + g.items.filter((x) => x.kind !== "fix").length, 0);

  return (
    <div>
      <PageHead
        kicker={
          <>
            <Link href="/prototype" className="hover:underline">
              TODAY
            </Link>{" "}
            / BRIEF
          </>
        }
        title={a.name}
        sub={
          <>
            {m.title} · {m.day}, {m.time} · {m.length} · {m.lastTouch}
          </>
        }
      />
      <p className="mt-3 font-mono text-meta tracking-wide text-ink-2">
        {m.highStakes
          ? "HIGH STAKES · NOT RECORDED · DRAFTS ONLY FROM YOUR NOTES · LINES THE AI IS UNSURE OF ARE HIDDEN"
          : m.fromLog
          ? `BUILT ONLY FROM LINES APPROVED IN THE NOV 12 LOG · ${total} LINES`
          : `DRAFTED BY AI FROM ${new Set(groups.flatMap((g) => g.items.flatMap((x) => x.sources))).size} SOURCES · A PRIVATE DRAFT, NOTHING HERE SAVES`}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-8">
          {groups.length === 0 ? (
            <div className="proto-card p-5">
              <p className="font-semibold">Nothing approved from Nov 12 yet</p>
              <p className="mt-1 text-ink-2">
                This brief only uses lines a person approved. {waitingFromLog} lines from today&rsquo;s review are
                waiting for you.
              </p>
              <Link href={`/prototype/log/${m.fromLog}`} className="sig-btn sig-btn-primary mt-4">
                Review the Nov 12 log
              </Link>
            </div>
          ) : null}
          {groups.map((g) => (
            <section key={g.section} aria-labelledby={`h-${g.items[0].id}`}>
              <h2 id={`h-${g.items[0].id}`} className="text-h3 font-semibold">
                {g.section}
              </h2>
              <ul className="proto-card mt-3 divide-y divide-line px-4">
                {g.items.map((x) =>
                  x.kind === "fix" ? (
                    <li key={x.id} className="pb-4 pt-1">
                      <FixBox sug={x} />
                    </li>
                  ) : x.kind === "flag" ? (
                    <FlagLine key={x.id} sug={x} />
                  ) : (
                    <BriefLine key={x.id} sug={x} />
                  ),
                )}
              </ul>
            </section>
          ))}
          {hidden ? (
            <p className="flex flex-wrap items-center gap-3 text-small text-ink-2">
              {showHidden
                ? `Showing ${hidden} medium confidence ${hidden === 1 ? "line" : "lines"} for this high stakes meeting.`
                : `${hidden} medium confidence ${hidden === 1 ? "line is" : "lines are"} hidden for this high stakes meeting.`}
              <button type="button" className="sig-btn" aria-pressed={showHidden} onClick={() => setShowHidden(!showHidden)}>
                {showHidden ? "Hide again" : "Show anyway"}
              </button>
            </p>
          ) : null}
          {m.fromLog && groups.length && waitingFromLog ? (
            <p className="text-small text-ink-2">
              {waitingFromLog} more lines from Nov 12 are still waiting for approval, so they are not in this brief.{" "}
              <Link href={`/prototype/log/${m.fromLog}`} className="underline underline-offset-4">
                Review them
              </Link>
            </p>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="h-people" className="proto-card p-4">
            <h2 id="h-people" className="text-h3 font-semibold">
              In this meeting
            </h2>
            <ul className="mt-3 space-y-3">
              {m.attendees.map((name) => {
                const p = a.people.find((x) => x.name === name);
                return (
                  <li key={name}>
                    <p className="font-medium">{name}</p>
                    <p className="text-small text-ink-2">{p ? p.role : "Not in the record yet"}</p>
                  </li>
                );
              })}
            </ul>
            <Link href={`/prototype/accounts/${a.id}`} className="mt-4 inline-block text-small font-medium underline underline-offset-4">
              Open the {a.name} record
            </Link>
          </section>

          {pins.length ? (
            <section aria-labelledby="h-pins" className="proto-card p-4">
              <h2 id="h-pins" className="text-h3 font-semibold">
                Your pins
              </h2>
              <ul className="mt-2 space-y-2 text-small">
                {pins.map((x) => (
                  <li key={x.id} className="flex items-start justify-between gap-2">
                    <span>{x.text}</span>
                    <button type="button" className="sig-btn shrink-0" onClick={() => actions.pin(x.id)}>
                      Unpin
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-dashed border-line-strong p-4">
            <h2 className="font-mono text-meta tracking-wide text-ink-2">HOW TO READ THIS BRIEF</h2>
            <p className="mt-2 text-small text-ink-2">
              Every line links to where it came from. Pin or dismiss freely; only a record fix changes shared data, and
              it waits for you.
            </p>
          </section>

          {m.hasLog ? (
            <Link href={`/prototype/log/${m.id}`} className="sig-btn">
              After the call: review the log
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function FlagLine({ sug }: { sug: Suggestion }) {
  const s = useProto();
  if (entryOf(s, sug.id).status === "dismissed") {
    return (
      <li className="flex items-center justify-between gap-4 py-3 text-small text-ink-2">
        <span>Dismissed: {sug.text}</span>
        <button type="button" className="sig-btn shrink-0" onClick={() => actions.undo(sug.id)}>
          Undo
        </button>
      </li>
    );
  }
  return (
    <li className="py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <p>{sug.text}</p>
          <Meta sources={sug.sources} confidence={sug.confidence} />
        </div>
        <button type="button" className="sig-btn shrink-0 self-start" onClick={() => actions.dismiss(sug.id)}>
          Dismiss
        </button>
      </div>
      <FlagBox />
    </li>
  );
}
