"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * The signature source chip. Opens a small popover beside the chip with the excerpt the line rests on, sized to its
 * content and pointing at the chip (decision 0121; it was a full height side drawer). It sits below the chip, or
 * above when there is no room, and closes with Escape, a click outside or its Close button, returning focus to the
 * chip. Portaled to the body only while open, so a chip can sit inside any text.
 */
export function SourceChip({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; arrow: number; above: boolean } | null>(null);
  const chip = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const src = useSource(id);
  const titleId = `src-${id.replace(/[^a-z0-9]/gi, "")}-${Math.abs(hash(id))}`;

  const place = useCallback(() => {
    const c = chip.current?.getBoundingClientRect();
    const p = pop.current;
    if (!c || !p) return;
    const w = p.offsetWidth;
    const h = p.offsetHeight;
    const gap = 10;
    const margin = 12;
    const above = c.bottom + gap + h > window.innerHeight - margin && c.top - gap - h > margin;
    const center = c.left + c.width / 2;
    const left = Math.min(Math.max(center - w / 2, margin), window.innerWidth - w - margin);
    setPos({ top: above ? c.top - gap - h : c.bottom + gap, left, arrow: Math.min(Math.max(center - left, 18), w - 18), above });
  }, []);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    setPos(null);
    if (refocus) chip.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!pop.current?.contains(t) && !chip.current?.contains(t)) close(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place, close]);

  // Focus moves into the popover once it is placed (it is hidden until then, and hidden things cannot take focus).
  const placed = pos !== null;
  useEffect(() => {
    if (open && placed) pop.current?.focus();
  }, [open, placed]);

  if (!src) return null;
  return (
    <>
      <button
        ref={chip}
        type="button"
        className="sig-source"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <b>{src.kind}</b> {src.when}
        <span className="sr-only">, open source</span>
      </button>
      {open
        ? createPortal(
            <div
              ref={pop}
              role="dialog"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={`sig src-pop ${pos?.above ? "is-above" : ""}`}
              style={pos ? { top: pos.top, left: pos.left, ["--arrow" as string]: `${pos.arrow}px` } : { visibility: "hidden", top: 0, left: 0 }}
            >
              <p className="font-mono text-meta tracking-wide text-ink-2">
                SOURCE · {src.kind} · {src.when}
              </p>
              <h2 id={titleId} className="mt-1 font-semibold">
                {src.title}
              </h2>
              <blockquote className="mt-3 border-l-2 border-accent pl-3 text-small leading-relaxed">{src.excerpt}</blockquote>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-meta text-ink-2">A live product opens the email, ticket or call at this moment.</p>
                <button type="button" className="sig-btn shrink-0" onClick={() => close()}>
                  Close
                </button>
              </div>
            </div>,
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
