"use client";

import { useState } from "react";
import type { Suggestion } from "@/content/prototype";
import { Meta } from "./Source";
import { actions, entryOf, textOf, useProto } from "./store";

/** A line in a brief: a private draft, so no gate. Pin or dismiss, with undo. */
export function BriefLine({ sug }: { sug: Suggestion }) {
  const s = useProto();
  const e = entryOf(s, sug.id);
  const pinned = s.pinned.includes(sug.id);
  if (e.status === "dismissed") {
    return (
      <li className="row-out flex items-center justify-between gap-4 py-3 text-small text-ink-2">
        <span>Dismissed: {sug.text}</span>
        <button type="button" className="sig-btn shrink-0" onClick={() => actions.undo(sug.id)}>
          Undo
        </button>
      </li>
    );
  }
  return (
    <li className={`@container py-4 ${pinned ? "proto-pinned" : ""}`}>
      <div className="flex flex-col gap-3 @lg:flex-row @lg:items-start">
        <div className="min-w-0 flex-1">
          <p>
            {sug.tag ? <span className="proto-tag">{sug.tag}</span> : null}
            {sug.text}
          </p>
          <Meta sources={sug.sources} confidence={sug.confidence} />
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="sig-btn" aria-pressed={pinned} onClick={() => actions.pin(sug.id)}>
            {pinned ? "Pinned" : "Pin"}
          </button>
          <button type="button" className="sig-btn" onClick={() => actions.dismiss(sug.id)}>
            Dismiss
          </button>
        </div>
      </div>
    </li>
  );
}

/** A record fix shown under a brief line. Writes to the shared record, so it waits for Approve. */
export function FixBox({ sug }: { sug: Suggestion }) {
  const s = useProto();
  const e = entryOf(s, sug.id);
  return (
    <div className={`mt-3 rounded-xl border p-3 ${e.status === "pending" ? "sig-row-draft border-transparent" : "border-line"}`}>
      {e.status === "pending" ? (
        <>
          <span className="sig-draft-tag">DRAFT · RECORD FIX</span>
          <p className="mt-1.5">{sug.text}</p>
          <p className="mt-1 text-small text-ink-2">Nothing changes in the record until you approve.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="sig-btn sig-btn-primary" onClick={() => actions.approve(sug.id)}>
              Approve
            </button>
            <button type="button" className="sig-btn" onClick={() => actions.dismiss(sug.id)}>
              Not right
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            {e.status === "saved" ? (
              <span className="sig-approved-tag">{"✓"} SAVED BY DANIEL · {e.at}</span>
            ) : (
              <span className="font-mono text-meta text-ink-2">DISMISSED · RECORD UNCHANGED</span>
            )}
            <span className="mt-1 block text-small">{sug.text}</span>
          </span>
          <button type="button" className="sig-btn" onClick={() => actions.undo(sug.id)}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

/** Something only a person may act on. The AI names it and stops. */
export function FlagBox() {
  return (
    <div className="mt-3 rounded-xl border border-line-strong p-3">
      <span className="font-mono text-meta tracking-wide text-warn">{"▲"} PEOPLE ONLY</span>
      <p className="mt-1.5 text-small">
        Merging records stays with people. Check both contacts on the account page and merge them yourself if they are
        the same person.
      </p>
    </div>
  );
}

/** A gated line: drafted by the AI, waiting for a person. Approve, edit, dismiss; saved together later. */
export function GateLine({ sug }: { sug: Suggestion }) {
  const s = useProto();
  const e = entryOf(s, sug.id);
  const text = textOf(s, sug);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  if (e.status === "dismissed") {
    return (
      <li className="row-out flex items-center justify-between gap-4 px-3 py-3 text-small text-ink-2">
        <span>Dismissed: {text}</span>
        <button type="button" className="sig-btn shrink-0" onClick={() => actions.undo(sug.id)}>
          Undo
        </button>
      </li>
    );
  }

  return (
    <li className={`gate-row @container rounded-xl px-3 py-3 ${e.status === "pending" ? "sig-row-draft" : "is-decided"}`}>
      {editing ? (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            actions.edit(sug.id, draft.trim() || sug.text);
            setEditing(false);
          }}
        >
          <label htmlFor={`edit-${sug.id}`} className="text-small font-semibold">
            Edit line
          </label>
          <textarea
            id={`edit-${sug.id}`}
            className="proto-input mt-1"
            rows={2}
            value={draft}
            onChange={(ev) => setDraft(ev.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="sig-btn sig-btn-primary">
              Save edit and approve
            </button>
            <button type="button" className="sig-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 @lg:flex-row @lg:items-start">
          <div className="min-w-0 flex-1">
            {e.status === "pending" ? (
              <span className="sig-draft-tag">DRAFT</span>
            ) : e.status === "approved" ? (
              <span className="sig-approved-tag">{"✓"} APPROVED {e.at} · NOT SAVED YET</span>
            ) : (
              <span className="sig-approved-tag">{"✓"} SAVED BY DANIEL · {e.at}</span>
            )}
            <p className="mt-1">{text}</p>
            <Meta sources={sug.sources} confidence={sug.confidence} />
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {e.status === "pending" ? (
              <>
                <button type="button" className="sig-btn sig-btn-primary" onClick={() => actions.approve(sug.id)}>
                  Approve
                </button>
                <button
                  type="button"
                  className="sig-btn"
                  onClick={() => {
                    setDraft(text);
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
                <button type="button" className="sig-btn" onClick={() => actions.dismiss(sug.id)}>
                  Dismiss
                </button>
              </>
            ) : e.status === "approved" ? (
              <button type="button" className="sig-btn" onClick={() => actions.undo(sug.id)}>
                Undo
              </button>
            ) : null}
          </div>
        </div>
      )}
    </li>
  );
}

/** The follow up email: a draft the person copies and sends. There is no send button. */
export function EmailDraft({ sug, body }: { sug: Suggestion; body: string }) {
  const [open, setOpen] = useState(false);
  const panel = `email-${sug.id}`;
  return (
    <li className="rounded-xl px-3 py-3">
      <span className="font-mono text-meta tracking-wide text-ink-2">EMAIL DRAFT · YOU SEND IT</span>
      <p className="mt-1">{sug.text}</p>
      <Meta sources={sug.sources} confidence={sug.confidence} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="sig-btn" aria-expanded={open} aria-controls={panel} onClick={() => setOpen(!open)}>
          {open ? "Hide draft" : "Open draft"}
        </button>
        {open ? (
          <button
            type="button"
            className="sig-btn"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(body);
                actions.announce("Draft copied. Paste it into your email.");
              } catch {
                actions.announce("Copy didn’t work here. Select the text and copy it.");
              }
            }}
          >
            Copy text
          </button>
        ) : null}
      </div>
      {open ? (
        <div id={panel} className="mt-3 rounded-xl border border-line bg-surface-2 p-3">
          <p className="whitespace-pre-line text-small leading-relaxed">{body}</p>
          <p className="mt-3 font-mono text-meta text-ink-2">THE AI NEVER SENDS EMAIL TO A CUSTOMER.</p>
        </div>
      ) : null}
    </li>
  );
}
