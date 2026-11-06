"use client";

import Link from "next/link";
import { useState } from "react";
import { EVENTS } from "@/content/more";
import { account } from "@/content/prototype";
import { PageHead } from "../bits";
import { GateLine } from "../Lines";
import { actions, allSugs, entryOf, useProto } from "../store";

/** Log an interaction that had no recording: a booth chat, a dinner, a hallway conversation. */
export function QuickLog({ id }: { id: string }) {
  const s = useProto();
  const ev = EVENTS.find((e) => e.id === id);
  const [text, setText] = useState(s.notes[id]?.text ?? "");
  const [highStakes, setHighStakes] = useState(s.notes[id]?.highStakes ?? false);
  if (!ev) return null;
  const a = account(ev.account);
  const meetingId = `event:${id}`;
  const lines = allSugs(s).filter((x) => x.meeting === meetingId);
  const count = (st: string) => lines.filter((x) => entryOf(s, x.id).status === st).length;
  const approved = count("approved");
  const savedN = count("saved");

  return (
    <div className="max-w-3xl">
      <PageHead
        kicker={
          <>
            <Link href="/prototype" className="hover:underline">
              TODAY
            </Link>{" "}
            / LOG FROM YOUR NOTES
          </>
        }
        title={ev.title}
        sub={
          <>
            {a?.name} · {ev.day} · with {ev.with}
          </>
        }
      />
      <p className="mt-3 font-mono text-meta tracking-wide text-ink-2">NO RECORDING · THE AI DRAFTS ONLY FROM WHAT YOU WRITE</p>

      <form
        className="proto-card mt-6 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) actions.draftFromNotes(id, text.trim(), highStakes);
        }}
      >
        <label htmlFor="notes" className="font-semibold">
          What happened?
        </label>
        <p id="notes-hint" className="text-small text-ink-2">
          A few sentences is enough. Each sentence becomes one line you can approve, edit or dismiss.
        </p>
        <textarea
          id="notes"
          aria-describedby="notes-hint"
          className="proto-input mt-2"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" className="sig-btn mt-2" onClick={() => setText(ev.sample)}>
          Use sample notes
        </button>

        <fieldset className="mt-5">
          <legend className="font-semibold">Sensitivity</legend>
          <div className="mt-2 space-y-2">
            {[
              { v: false, label: "Standard", hint: "Lines go on the account timeline once you save them." },
              {
                v: true,
                label: "High stakes",
                hint: "Never recorded. Drafts come only from your notes, and lines the AI is unsure of stay hidden.",
              },
            ].map((o) => (
              <label key={o.label} className="flex cursor-pointer items-start gap-2">
                <input type="radio" name="sensitivity" className="mt-1" checked={highStakes === o.v} onChange={() => setHighStakes(o.v)} />
                <span>
                  <span className="font-medium">{o.label}</span>
                  <span className="block text-small text-ink-2">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="sig-btn sig-btn-primary mt-5" disabled={!text.trim()}>
          {lines.length ? "Draft lines again" : "Draft lines"}
        </button>
      </form>

      {lines.length ? (
        <section aria-labelledby="h-drafted" className="mt-8">
          <h2 id="h-drafted" className="text-h3 font-semibold">
            Drafted from your notes
          </h2>
          <ul className="proto-card mt-3 space-y-1 p-1.5">
            {lines.map((x) => (
              <GateLine key={x.id} sug={x} />
            ))}
          </ul>
          <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg py-4">
            <p className="font-mono text-meta tracking-wide">
              <span className="font-medium">{approved} APPROVED</span>
              {savedN ? <span className="text-good"> · {savedN} SAVED</span> : null}
            </p>
            <button type="button" className="sig-btn sig-btn-primary" disabled={approved === 0} onClick={() => actions.save(meetingId)}>
              Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
            </button>
          </div>
          {savedN ? (
            <p className="text-small">
              Saved to the{" "}
              <Link href={`/prototype/accounts/${ev.account}`} className="font-medium underline underline-offset-4">
                {a?.name} timeline
              </Link>
              .
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
