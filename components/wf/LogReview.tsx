"use client";

import { useState } from "react";
import type { LogItem } from "@/content/sample";
import { Meta } from "./Meta";

type Status = "pending" | "approved" | "dismissed" | "saved";
type LogSection = { id: string; title: string; hint?: string; items: LogItem[] };

/**
 * Every line here writes to the shared record, so each one waits for a person.
 * Nothing is saved until "Save approved lines"; the follow up email is never sent by the AI.
 */
export function LogReview({ sections, account, emailDraft }: { sections: LogSection[]; account: string; emailDraft: string }) {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [message, setMessage] = useState("");

  const gated = sections.flatMap((s) => s.items).filter((i) => i.kind !== "email");
  const of = (id: string): Status => status[id] ?? "pending";
  const approved = gated.filter((i) => of(i.id) === "approved").length;
  const waiting = gated.filter((i) => of(i.id) === "pending").length;
  const saved = gated.filter((i) => of(i.id) === "saved").length;
  const set = (id: string, s: Status) => setStatus((prev) => ({ ...prev, [id]: s }));

  const save = () => {
    setStatus((prev) => {
      const next = { ...prev };
      for (const i of gated) if (next[i.id] === "approved") next[i.id] = "saved";
      return next;
    });
    setMessage(`Saved ${approved} ${approved === 1 ? "line" : "lines"} to ${account}. Nothing else was changed.`);
  };

  return (
    <div>
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`h-${section.id}`}>
            <h2 id={`h-${section.id}`} className="text-lg font-semibold">
              {section.title}
            </h2>
            {section.hint ? <p className="mt-1 text-sm text-ink-2">{section.hint}</p> : null}
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {section.items.map((item) => {
                const s = of(item.id);
                const shown = text[item.id] ?? item.text;
                if (item.kind === "email") {
                  return (
                    <li key={item.id} className="py-4">
                      <p className="leading-relaxed">{shown}</p>
                      <Meta item={item} />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="wf-btn"
                          aria-expanded={showEmail}
                          aria-controls="email-draft"
                          onClick={() => setShowEmail(!showEmail)}
                        >
                          {showEmail ? "Hide draft" : "Open draft"}
                        </button>
                      </div>
                      {showEmail ? (
                        <div id="email-draft" className="wf-fix mt-3">
                          <p className="whitespace-pre-line text-sm leading-relaxed">{emailDraft}</p>
                          <p className="mt-3 text-sm text-ink-2">
                            You send this from your own inbox. The AI never sends email to a customer.
                          </p>
                        </div>
                      ) : null}
                    </li>
                  );
                }
                if (s === "dismissed") {
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm text-ink-2">
                      <span>Dismissed: {shown}</span>
                      <button type="button" className="wf-btn shrink-0" onClick={() => set(item.id, "pending")}>
                        Undo
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={item.id} className={`py-4 ${s === "approved" || s === "saved" ? "wf-pinned" : ""}`}>
                    {editing === item.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setText((prev) => ({ ...prev, [item.id]: draft }));
                          set(item.id, "approved");
                          setEditing(null);
                          setMessage("Edited and approved. Not saved yet.");
                        }}
                      >
                        <label htmlFor={`edit-${item.id}`} className="text-sm font-semibold">
                          Edit line
                        </label>
                        <textarea
                          id={`edit-${item.id}`}
                          className="wf-input mt-1"
                          rows={2}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                        />
                        <div className="mt-2 flex gap-2">
                          <button type="submit" className="wf-btn wf-btn-primary">
                            Save edit and approve
                          </button>
                          <button type="button" className="wf-btn" onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="min-w-0 flex-1">
                          <p className="leading-relaxed">{shown}</p>
                          <Meta item={item} />
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {s === "saved" ? (
                            <span className="text-sm font-semibold">Saved</span>
                          ) : s === "approved" ? (
                            <>
                              <span className="text-sm font-semibold">Approved</span>
                              <button type="button" className="wf-btn" onClick={() => set(item.id, "pending")}>
                                Undo
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="wf-btn wf-btn-primary"
                                onClick={() => {
                                  set(item.id, "approved");
                                  setMessage("Approved. Not saved yet.");
                                }}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="wf-btn"
                                onClick={() => {
                                  setDraft(shown);
                                  setEditing(item.id);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="wf-btn"
                                onClick={() => {
                                  set(item.id, "dismissed");
                                  setMessage("Dismissed. Undo is next to it.");
                                }}
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="wf-savebar sticky bottom-0 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line py-4">
        <p className="text-sm">
          <span className="font-semibold">{approved} approved</span> · {waiting} waiting
          {saved ? ` · ${saved} saved` : ""}
        </p>
        <button type="button" className="wf-btn wf-btn-primary" disabled={approved === 0} onClick={save}>
          Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
