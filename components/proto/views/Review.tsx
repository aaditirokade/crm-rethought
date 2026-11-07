"use client";

import Link from "next/link";
import { useState } from "react";
import { Triage } from "../Triage";
import { PageHead } from "../bits";
import { groupByOrigin } from "../groups";
import { GateLine } from "../Lines";
import { actions, allSugs, entryOf, isGated, useProto } from "../store";

export function Review() {
  const s = useProto();
  const open = allSugs(s).filter((x) => isGated(x) && entryOf(s, x.id).status !== "saved");
  const approved = open.filter((x) => entryOf(s, x.id).status === "approved").length;
  const groups = groupByOrigin(open);
  const [mode, setMode] = useState<"list" | "triage">("list");

  return (
    <div>
      <PageHead title="Review" sub="Every line waiting for you, across accounts. Approving here is the same as approving in place." />
      <div className="mt-4 flex gap-2" role="group" aria-label="Review mode">
        <button type="button" className="sig-btn" aria-pressed={mode === "list"} onClick={() => setMode("list")}>
          List
        </button>
        <button type="button" className="sig-btn" aria-pressed={mode === "triage"} onClick={() => setMode("triage")}>
          Triage, one at a time
        </button>
      </div>
      {mode === "triage" ? (
        <Triage />
      ) : groups.length === 0 ? (
        <div className="proto-card mt-8 p-5">
          <p className="font-semibold">Nothing waiting</p>
          <p className="mt-1 text-ink-2">Everything the AI drafted has been approved, edited or dismissed.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map(({ origin, items }) => (
            <section key={origin.key} aria-labelledby={`h-${origin.key.replace(/[^a-z0-9]/gi, "")}`}>
              <h2 id={`h-${origin.key.replace(/[^a-z0-9]/gi, "")}`} className="text-h3 font-semibold">
                {origin.label}
              </h2>
              <p className="text-small text-ink-2">
                {origin.when ? `${origin.when} · ` : ""}
                <Link href={origin.href} className="underline underline-offset-4">
                  Open in context
                </Link>
              </p>
              <ul className="proto-card mt-3 grid items-start gap-3 pt-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((x) => (
                  <GateLine key={x.id} sug={x} icons />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg py-4">
        <p className="font-mono text-meta tracking-wide">
          <span className="font-medium">{approved} APPROVED</span>
          <span className="text-ink-2"> · RECORD FIXES AND OPPORTUNITY CHANGES SAVE AS SOON AS YOU APPROVE THEM</span>
        </p>
        <button type="button" className="sig-btn sig-btn-primary" disabled={approved === 0} onClick={() => actions.save()}>
          Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
        </button>
      </div>
    </div>
  );
}
