"use client";

import { useRef } from "react";
import { SOURCES } from "@/content/sample";

/** A source link on an AI line. Opens a side drawer with the excerpt the line rests on. */
export function SourceChip({ id }: { id: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const s = SOURCES[id];
  if (!s) return null;
  const titleId = `src-${id}-title`;
  return (
    <>
      <button type="button" className="wf-chip" onClick={() => ref.current?.showModal()}>
        {s.kind} · {s.date}
        <span className="sr-only">, open source</span>
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        className="wf-drawer"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex h-full flex-col p-6">
          <p className="text-sm text-ink-2">
            Source · {s.kind} · {s.date}
          </p>
          <h2 id={titleId} className="mt-1 text-lg font-semibold">
            {s.label}
          </h2>
          <blockquote className="mt-5 border-l-2 border-ink-2 pl-4 leading-relaxed">{s.excerpt}</blockquote>
          <p className="mt-6 text-sm leading-relaxed text-ink-2">
            In the product, this opens the email, ticket or call at this exact moment.
          </p>
          <form method="dialog" className="mt-auto pt-6">
            <button className="wf-btn">Close</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
