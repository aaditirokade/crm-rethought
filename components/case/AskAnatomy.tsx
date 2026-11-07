"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The four parts of an Ask answer, each with a small picture of it taken from the
 * prototype's real Fernhill answer (decision 0045): what it reads, a claim with its
 * source, the three numbers and next move, and the line that says nothing changed.
 * The pictures play once when the grid comes into view and stay still for reduced
 * motion. They are decoration; each tile's words carry the meaning.
 */
const PARTS = [
  { title: "Reads", body: "Emails, tickets, the last call and usage, showing each step as it goes." },
  { title: "Answers", body: "Plain words with a source after every claim, each one a click away." },
  { title: "Sums up", body: "The three numbers that matter for this question, and one next move." },
  { title: "Changes nothing", body: "Read only, and it says so. Nothing reaches the record." },
];

function Picture({ i }: { i: number }) {
  if (i === 0)
    return (
      <ul className="grid gap-1.5 font-mono text-meta tracking-wide text-ink-2">
        {["READING 3 EMAILS", "READING 2 TICKETS", "READING THE OCT 14 CALL", "CHECKING WEEKLY USAGE"].map((t, j) => (
          <li key={t} className="aa-in flex items-center gap-2" style={{ animationDelay: `${j * 180}ms` }}>
            <span className="aa-tick text-ink" style={{ animationDelay: `${j * 180 + 120}ms` }}>
              {"✓"}
            </span>
            {t}
          </li>
        ))}
      </ul>
    );
  if (i === 1)
    return (
      <p className="text-[0.8125rem] leading-[1.6]">
        <span className="aa-claim">Dashboard use fell about 40% after their Oct 20 reorg</span>{" "}
        <span className="sig-source aa-pop">
          <b>Usage</b> Nov 9
        </span>{" "}
        <span className="aa-claim aa-claim-2">Lena Ortiz left; Priya Nair took over</span>{" "}
        <span className="sig-source aa-pop aa-pop-2">
          <b>Email</b> Nov 3
        </span>
      </p>
    );
  if (i === 2)
    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["−38%", "Usage"],
            ["1", "Open ticket"],
            ["74", "Days left"],
          ].map(([v, l], j) => (
            <div key={l} className="aa-in" style={{ animationDelay: `${j * 140}ms` }}>
              <span className="block text-xl font-medium tabular-nums leading-none">{v}</span>
              <span className="mt-1 block text-meta text-ink-2">{l}</span>
            </div>
          ))}
        </div>
        <p className="aa-in mt-3 truncate text-meta text-ink-2" style={{ animationDelay: "480ms" }}>
          <span className="font-medium text-accent">Next:</span> bring a fix date to the 10:00
        </p>
      </div>
    );
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-1.5" aria-hidden="true">
        <span className="block h-2 w-4/5 rounded-full bg-[var(--line)]" />
        <span className="block h-2 w-3/5 rounded-full bg-[var(--line)]" />
      </div>
      <p className="aa-stamp inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full border border-[var(--line-strong)] px-2.5 py-0.5 font-mono text-meta tracking-wide">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        RECORD UNCHANGED
      </p>
      <p className="aa-in mt-2 text-meta text-ink-2" style={{ animationDelay: "520ms" }}>
        Drafted from 6 sources
      </p>
    </div>
  );
}

export function AskAnatomy() {
  const ref = useRef<HTMLUListElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className={`aa grid gap-3 sm:grid-cols-2 ${seen ? "is-seen" : ""}`}>
      {PARTS.map((p, i) => (
        <li key={p.title} className="ask-tile flex flex-col rounded-[18px] bg-surface-2 p-3 sm:p-3.5">
          <div aria-hidden="true" className="h-[8.25rem] overflow-hidden rounded-xl bg-surface p-3">
            <Picture i={i} />
          </div>
          <span className="mt-3 font-mono text-meta text-ink-2">{String(i + 1).padStart(2, "0")}</span>
          <span className="mt-0.5 block text-lg font-medium">{p.title}</span>
          <span className="mt-1 block text-small leading-snug text-ink-2">{p.body}</span>
        </li>
      ))}
    </ul>
  );
}
