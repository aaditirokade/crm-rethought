"use client";

import { useState } from "react";
import type { Section } from "@/content/sample";
import { Meta } from "./Meta";

type FixState = "pending" | "approved" | "dismissed";

/**
 * The brief is a private draft, so its lines need no approval: pin, dismiss, undo.
 * A record fix inside it writes to the shared record, so it waits for Approve.
 */
export function BriefView({ sections }: { sections: Section[] }) {
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [fixes, setFixes] = useState<Record<string, FixState>>({});
  const [message, setMessage] = useState("");

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`h-${section.id}`}>
          <h2 id={`h-${section.id}`} className="text-lg font-semibold">
            {section.title}
          </h2>
          {section.hint ? <p className="mt-1 text-sm text-ink-2">{section.hint}</p> : null}
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {section.items.map((item) => {
              if (dismissed.has(item.id)) {
                return (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm text-ink-2">
                    <span>Dismissed: {item.text}</span>
                    <button
                      type="button"
                      className="wf-btn shrink-0"
                      onClick={() => {
                        setDismissed(toggle(dismissed, item.id));
                        setMessage("Line restored.");
                      }}
                    >
                      Undo
                    </button>
                  </li>
                );
              }
              const isPinned = pinned.has(item.id);
              const fix = fixes[item.id] ?? "pending";
              return (
                <li key={item.id} className={`py-4 ${isPinned ? "wf-pinned" : ""}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <p className="leading-relaxed">
                        {item.tag ? <span className="wf-tag">{item.tag}</span> : null}
                        {item.text}
                      </p>
                      <Meta item={item} />
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="wf-btn"
                        aria-pressed={isPinned}
                        onClick={() => {
                          setPinned(toggle(pinned, item.id));
                          setMessage(isPinned ? "Unpinned." : "Pinned to the top of your notes.");
                        }}
                      >
                        {isPinned ? "Pinned" : "Pin"}
                      </button>
                      <button
                        type="button"
                        className="wf-btn"
                        onClick={() => {
                          setDismissed(toggle(dismissed, item.id));
                          setMessage("Line dismissed. Undo is next to it.");
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  {item.fix ? (
                    <div className="wf-fix mt-3">
                      <p className="text-sm font-semibold">Suggested record fix</p>
                      {fix === "pending" ? (
                        <>
                          <p className="mt-1 text-sm leading-relaxed">{item.fix}</p>
                          <p className="mt-1 text-sm text-ink-2">Nothing changes in the record until you approve.</p>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              className="wf-btn wf-btn-primary"
                              onClick={() => {
                                setFixes({ ...fixes, [item.id]: "approved" });
                                setMessage("Record fix approved and saved.");
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="wf-btn"
                              onClick={() => {
                                setFixes({ ...fixes, [item.id]: "dismissed" });
                                setMessage("Record fix dismissed. The record is unchanged.");
                              }}
                            >
                              Not right
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="mt-1 flex items-center justify-between gap-4 text-sm">
                          <span>
                            {fix === "approved"
                              ? "Approved and saved to the record."
                              : "Dismissed. The record is unchanged."}
                          </span>
                          <button
                            type="button"
                            className="wf-btn shrink-0"
                            onClick={() => {
                              setFixes({ ...fixes, [item.id]: "pending" });
                              setMessage("Undone.");
                            }}
                          >
                            Undo
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
