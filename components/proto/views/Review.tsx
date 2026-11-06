"use client";

import Link from "next/link";
import { account, MEETINGS, SUGGESTIONS } from "@/content/prototype";
import { PageHead } from "../bits";
import { GateLine } from "../Lines";
import { actions, entryOf, isGated, useProto } from "../store";

export function Review() {
  const s = useProto();
  const open = SUGGESTIONS.filter((x) => isGated(x) && entryOf(s, x.id).status !== "saved");
  const approved = open.filter((x) => entryOf(s, x.id).status === "approved").length;
  const groups = MEETINGS.map((m) => ({ m, items: open.filter((x) => x.meeting === m.id) })).filter((g) => g.items.length);

  return (
    <div>
      <PageHead title="Review" sub="Every line waiting for you, across accounts. Approving here is the same as approving in place." />
      {groups.length === 0 ? (
        <div className="proto-card mt-8 p-5">
          <p className="font-semibold">Nothing waiting</p>
          <p className="mt-1 text-ink-2">Everything the AI drafted has been approved, edited or dismissed.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map(({ m, items }) => (
            <section key={m.id} aria-labelledby={`h-${m.id}`}>
              <h2 id={`h-${m.id}`} className="text-h3 font-semibold">
                {account(m.account)?.name} · {m.title}
              </h2>
              <p className="text-small text-ink-2">
                {m.day}, {m.time} ·{" "}
                <Link href={items.some((x) => x.kind !== "fix") ? `/prototype/log/${m.id}` : `/prototype/brief/${m.id}`} className="underline underline-offset-4">
                  Open in context
                </Link>
              </p>
              <ul className="proto-card mt-3 space-y-1 p-1.5">
                {items.map((x) => (
                  <GateLine key={x.id} sug={x} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg py-4">
        <p className="font-mono text-meta tracking-wide">
          <span className="font-medium">{approved} APPROVED</span>
          <span className="text-ink-2"> · RECORD FIXES SAVE AS SOON AS YOU APPROVE THEM</span>
        </p>
        <button
          type="button"
          className="sig-btn sig-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={approved === 0}
          onClick={() => actions.save()}
        >
          Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
        </button>
      </div>
    </div>
  );
}
