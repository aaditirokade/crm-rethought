/* Story blocks for the case study (decision 0105): the meeting loop before and after, the experiment I'd run on
   the approval step, and what I'd do differently. A plan, not a result: Groundwork has no users yet. */

const kick = "font-mono text-meta tracking-wide text-ink-2";

const BEFORE = ["Prep from five tabs", "Take notes on paper", "Type the call in later", "A promise slips", "The record goes stale"];
const AFTER = ["Read the brief", "Talk", "Approve the drafted log", "Follow ups land on Your tasks"];

function Steps({ items, after = false }: { items: string[]; after?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {items.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`rounded-full px-3.5 py-1.5 text-small ${after ? "bg-accent font-medium text-accent-ink" : "border border-[var(--rule)] text-ink-2"}`}>{s}</span>
          {i < items.length - 1 ? <span aria-hidden="true" className="text-ink-2">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

/** The meeting loop, before and after, under the problem chapter. */
export function LoopBeforeAfter() {
  return (
    <section aria-labelledby="loop-h" className="border-t border-[var(--rule)] py-14 lg:py-16">
      <h2 id="loop-h" className="max-w-[40ch] text-[1.5rem] font-medium leading-snug tracking-tight sm:text-[1.75rem]">
        Take the typing out of the week.
      </h2>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
        The meetings stay as they are. What changes is who writes them up: the AI drafts, the person approves, and the record is current by
        the end of the call.
      </p>
      <div className="mt-8 grid gap-5">
        <div className="rounded-2xl border border-[var(--rule)] p-5 sm:p-6">
          <p className={kick}>BEFORE · THE RECORD IS A CHORE</p>
          <div className="mt-4"><Steps items={BEFORE} /></div>
        </div>
        <div className="rounded-2xl border-2 border-accent p-5 sm:p-6">
          <p className={kick}>AFTER · THE RECORD IS A BY PRODUCT</p>
          <div className="mt-4"><Steps items={AFTER} after /></div>
        </div>
      </div>
    </section>
  );
}

/** A small log card for the experiment: line by line, or the meeting at once. */
function MiniLog({ v }: { v: "lines" | "meeting" }) {
  const lines = ["Fernhill will renew all 40 stores on Jan 25.", "Price the 12 new stores as a separate expansion.", "Late data refreshes are their main complaint."];
  return (
    <div className="rounded-xl border border-[var(--rule)] bg-surface p-4" aria-hidden="true">
      <p className="text-[12px] font-medium text-ink-2">Fernhill · today’s call · 6 lines drafted</p>
      {v === "lines" ? (
        <ul className="mt-3 space-y-2">
          {lines.map((l) => (
            <li key={l} className="rounded-lg bg-surface-2 px-3 py-2">
              <p className="text-[13px] leading-snug">{l}</p>
              <p className="mt-1.5 flex gap-3 text-[11.5px] font-medium"><span className="text-accent">Approve</span><span className="text-ink-2">Edit</span><span className="text-ink-2">Dismiss</span></p>
            </li>
          ))}
          <li className="pt-1 text-center text-[12px] text-ink-2">+ 3 more, then Save</li>
        </ul>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-accent px-3 py-2">
            <p className="text-[11.5px] font-medium text-accent">NEEDS A LOOK · LOW CONFIDENCE</p>
            <p className="mt-1 text-[13px] leading-snug">Price the 12 new stores as a separate expansion.</p>
          </div>
          <p className="rounded-lg bg-surface-2 px-3 py-2 text-[13px] leading-snug text-ink-2">5 lines with a source and high confidence</p>
          <p className="rounded-lg bg-accent px-3 py-2 text-center text-[13px] font-medium text-accent-ink">Approve the meeting</p>
        </div>
      )}
    </div>
  );
}

const PLAN: [string, string][] = [
  ["Hypothesis", "Approving a meeting at once, with only the doubtful lines held back, gets more meetings logged the same day without more mistakes in the record."],
  ["Who sees what", "Split by person, not by meeting: one account manager switching between both would learn one from the other."],
  ["Main number", "Meetings with an approved log on the same day."],
  ["Guardrails", "Lines edited or removed after saving, sources opened per meeting, and lines flagged by a manager later."],
  ["How long", "Four weeks, so each person has enough meetings to compare."],
  ["Decision rule", "Ship B only if same day logs rise and corrections after saving don’t. If corrections rise, B is teaching people to stop reading, and A stays."],
];

/** The test I'd run first: line by line approval, or the meeting at once. It tests the product's own core rule. */
export function ApprovalExperiment() {
  return (
    <section aria-labelledby="ch-07" className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="max-w-[60ch]">
        <p className="font-mono text-meta tracking-wide text-accent">07 · THE TEST I’D RUN FIRST</p>
        <h2 id="ch-07" className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
          Approve every line, or approve the meeting?
        </h2>
        <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-2">
          <p>
            Groundwork’s core rule is that nothing reaches the record without a person. Approving line by line keeps that rule strict, but six
            lines after every call is work, and work is what made CRMs go stale in the first place.
          </p>
          <p>So the first test would question the rule itself, with a guardrail that catches people approving without reading.</p>
        </div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {(["lines", "meeting"] as const).map((v) => (
          <figure key={v}>
            <figcaption className="mb-3 flex items-baseline justify-between gap-3">
              <span className="font-medium">{v === "lines" ? "A · One line at a time" : "B · The meeting at once"}</span>
              <span className="text-small text-ink-2">{v === "lines" ? "Today’s design" : "The challenger"}</span>
            </figcaption>
            <MiniLog v={v} />
          </figure>
        ))}
      </div>
      <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLAN.map(([t, d]) => (
          <div key={t} className="border-t border-[var(--rule)] pt-4">
            <dt className="font-medium">{t}</dt>
            <dd className="mt-1 text-small leading-relaxed text-ink-2">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** What I'd do differently, inside the Next chapter. */
export function NextTime() {
  return (
    <div className="border-t border-[var(--rule)] pt-5">
      <p className="font-medium text-ink">What I’d do differently</p>
      <p className="mt-2">
        Talk to account managers before writing the simulated interviews. Simulated ones were quick, but real ones would have tested the core
        bet, that people want to approve every line, before I built around it.
      </p>
    </div>
  );
}
