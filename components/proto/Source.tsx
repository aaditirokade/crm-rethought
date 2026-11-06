"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { EVENTS } from "@/content/more";
import { SOURCES, SUGGESTIONS, type Source } from "@/content/prototype";
import { entryOf, textOf, useProto } from "./store";

/** Resolve a source id. "log:<line id>" points at a line a person approved in an earlier log. */
export function useSource(id: string): Source | undefined {
  const s = useProto();
  if (id.startsWith("log:")) {
    const sug = SUGGESTIONS.find((x) => x.id === id.slice(4));
    if (!sug) return undefined;
    const e = entryOf(s, sug.id);
    return {
      id,
      kind: "LOG",
      when: "Nov 12",
      title: `Approved log line · ${e.at ?? "Nov 12"}`,
      excerpt: `“${textOf(s, sug)}” Approved by Daniel. It came from the call at ${SOURCES[sug.sources[0]]?.when ?? "the call"}.`,
    };
  }
  if (id.startsWith("note:")) {
    const evId = id.slice(5);
    const ev = EVENTS.find((e) => e.id === evId);
    const note = s.notes[evId];
    if (!ev || !note) return undefined;
    return { id, kind: "NOTE", when: "Your words", title: `Your notes · ${ev.title}`, excerpt: note.text };
  }
  return SOURCES[id];
}

/**
 * The signature source chip. Opens a drawer with the excerpt the line rests on.
 * The drawer is portaled to the body only while open, so a chip can sit inside any text.
 */
export function SourceChip({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const src = useSource(id);
  if (!src) return null;
  const titleId = `src-${id.replace(/[^a-z0-9]/gi, "")}-${Math.abs(hash(id))}`;
  return (
    <>
      <button type="button" className="sig-source" onClick={() => setOpen(true)}>
        <b>{src.kind}</b> {src.when}
        <span className="sr-only">, open source</span>
      </button>
      {open
        ? createPortal(
            <dialog
              ref={(el) => {
                if (el && !el.open) el.showModal();
              }}
              aria-labelledby={titleId}
              className="sig proto-drawer"
              onClose={() => setOpen(false)}
              onClick={(e) => {
                if (e.target === e.currentTarget) e.currentTarget.close();
              }}
            >
              <div className="flex h-full flex-col p-6">
                <p className="font-mono text-meta tracking-wide text-ink-2">
                  SOURCE · {src.kind} · {src.when}
                </p>
                <h2 id={titleId} className="mt-1 text-h3 font-semibold">
                  {src.title}
                </h2>
                <blockquote className="mt-5 border-l-2 border-line-strong pl-4 leading-relaxed">{src.excerpt}</blockquote>
                <p className="mt-6 text-small text-ink-2">
                  In a live product this opens the email, ticket, record or call recording at this exact moment.
                </p>
                <form method="dialog" className="mt-auto pt-6">
                  <button className="sig-btn">Close</button>
                </form>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export function Meta({ sources, confidence }: { sources: string[]; confidence: string }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {sources.map((id) => (
        <SourceChip key={id} id={id} />
      ))}
      <span className="font-mono text-meta text-ink-2">
        CONFIDENCE {confidence.toUpperCase()}
        {confidence === "Medium" ? " · CHECK THIS" : ""}
      </span>
    </div>
  );
}
