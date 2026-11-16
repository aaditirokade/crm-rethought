/* Built in code (decision 0103): how Groundwork is put together, why this stack, the changes worth walking through
   in an interview, and the tests on the approval rules. Every claim here can be checked in the repo. */

const REPO = "https://github.com/aaditirokade/crm-rethought";

const STACK: [string, string][] = [
  ["Next.js and React", "Web and phone from one codebase."],
  ["TypeScript, strict", "A line without sources fails the build."],
  ["Tailwind CSS", "Tokens for light and dark, contrast checked."],
  ["No component library", "Focus and labels designed, not inherited."],
];

const CHANGES: { t: string; problem: string; change: string }[] = [
  {
    t: "One gate for everything the AI writes",
    problem: "Every new path to the record was a chance to skip review.",
    change: "One gate for every line, with a test that proves it.",
  },
  {
    t: "Phone and web share one store",
    problem: "Phone and web had to agree.",
    change: "One store and one commit function for both.",
  },
  {
    t: "“Drafted”, but where?",
    problem: "A confirmation pointed to a draft with no way to reach it.",
    change: "Review it now opens the draft, with focus moved there.",
  },
];

const TESTS = [
  "Saving with nothing approved saves nothing",
  "Approving a log line doesn’t save it; Save does",
  "A record fix saves as soon as it is approved",
  "An edit counts as an approval and keeps the words",
  "A draft from Ask waits in Review until approved",
  "A task from Ask goes to the top of Your tasks, once",
  "A dismissed line can say why, and the team sees it",
  "A flagged Ask answer reaches the team; flagging again takes it back",
];

export function BuiltInCode() {
  return (
    <section aria-labelledby="ch-06" className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="max-w-[60ch]">
        <p className="font-mono text-meta tracking-wide text-accent">06 · BUILT IN CODE</p>
        <h2 id="ch-06" className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
          How it works, and why it is built this way
        </h2>
        <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-2">
          <p>
            An AI CRM is mostly rules about trust, and they only feel real when you can approve a line and watch the record change.
          </p>
          <p>About 8,500 lines of TypeScript, over 100 commits.</p>
        </div>
      </div>

      <h3 className="mt-12 font-mono text-meta tracking-wide text-ink-2">WHY THIS STACK</h3>
      <ul className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STACK.map(([t, d]) => (
          <li key={t} className="border-t border-[var(--rule)] pt-4">
            <p className="font-medium">{t}</p>
            <p className="mt-1 text-small leading-relaxed text-ink-2">{d}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 font-mono text-meta tracking-wide text-ink-2">THREE CHANGES I’D WALK THROUGH</h3>
      <ol className="mt-3 grid gap-8 lg:grid-cols-3">
        {CHANGES.map((c, i) => (
          <li key={c.t} className="border-t border-[var(--rule)] pt-4">
            <p className="text-[1.15rem] font-medium leading-snug">
              <span className="text-ink-2">{i + 1}.</span> {c.t}
            </p>
            <p className="mt-3 text-small leading-relaxed text-ink-2">
              <span className="font-medium text-ink">Problem. </span>
              {c.problem}
            </p>
            <p className="mt-2 text-small leading-relaxed text-ink-2">
              <span className="font-medium text-ink">What I changed. </span>
              {c.change}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h3 className="font-mono text-meta tracking-wide text-ink-2">THE RULES, CHECKED IN CODE</h3>
          <p className="mt-3 text-small leading-relaxed text-ink-2">
            Nothing saves without you, and tests prove it.
          </p>
          {/* The code is public (Nov 2026, decision 0106): the store and its tests, one click from the claims above. */}
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-small font-medium">
            {[
              ["See the tests", `${REPO}/blob/main/test/store.test.ts`],
              ["See the store", `${REPO}/blob/main/components/proto/store.ts`],
              ["All the code", REPO],
            ].map(([t, href]) => (
              <a key={t} href={href} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                {t}
                <span className="sr-only"> (opens GitHub in a new tab)</span>
              </a>
            ))}
          </p>
          <h3 className="mt-8 font-mono text-meta tracking-wide text-ink-2">WORKING WITH AI</h3>
          <p className="mt-3 text-small leading-relaxed text-ink-2">
            AI drafted components and tests. I read every change and made every call.
          </p>
        </div>
        <ul className="space-y-2 rounded-lg bg-surface-2 p-5 font-mono text-[13px] leading-relaxed text-ink-2 lg:col-span-7">
          {TESTS.map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden="true">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
