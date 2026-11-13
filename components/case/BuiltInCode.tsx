/* Built in code (decision 0103): how Groundwork is put together, why this stack, the changes worth walking through
   in an interview, and the tests on the approval rules. Every claim here can be checked in the repo. */

const STACK: [string, string][] = [
  ["Next.js and React", "The tools a product team would ship with. The web prototype and the phone app are one app, served from one codebase."],
  ["TypeScript, strict", "Accounts, AI lines, sources and approvals all have types, so a line that leaves out its sources fails the build."],
  ["Tailwind CSS", "Colors, type and spacing come from the design tokens, in light and dark, with contrast checked on the tokens page."],
  ["No component library", "Every control is built here, so focus, keyboard use and screen reader labels are designed, not inherited."],
];

const CHANGES: { t: string; problem: string; change: string }[] = [
  {
    t: "One gate for everything the AI writes",
    problem: "AI lines could reach the record from a meeting, from notes and later from Ask. Each path was a new chance to skip review.",
    change: "Every line goes through one check, isGated, and one list of kinds that need approval. When Ask learned to draft emails, joining the gate was one line, and a test now proves an Ask draft waits in Review.",
  },
  {
    t: "Phone and web share one store",
    problem: "Approve a line on the phone and the web prototype has to know, or the demo stops making sense.",
    change: "Both read one store through React’s useSyncExternalStore, kept in the browser so it survives page changes and reloads. Every change goes through a single commit function, which also writes the message a screen reader announces.",
  },
  {
    t: "“Drafted”, but where?",
    problem: "After choosing an action in Ask, the confirmation said a draft was waiting, with no way to get to it.",
    change: "The confirmation now has Review it, which opens the draft in Review, and View task, which scrolls to the new task and moves focus to it, so keyboard and screen reader users land in the same place.",
  },
];

const TESTS = [
  "Saving with nothing approved saves nothing",
  "Approving a log line doesn’t save it; Save does",
  "A record fix saves as soon as it is approved",
  "An edit counts as an approval and keeps the words",
  "A draft from Ask waits in Review until approved",
  "A task from Ask goes to the top of Your tasks, once",
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
            Groundwork is a working app, not a mockup. An AI tool for a CRM is mostly rules about trust: what can save on
            its own, what has to wait for a person, what has to cite a source. Those rules only feel real when you can
            approve a line and watch the record change.
          </p>
          <p>It is about 8,500 lines of TypeScript across 73 files, built over more than 100 commits, each with a line in the updates log.</p>
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
            The promise that nothing saves without you is the one that matters most, so it has tests. They run with
            Node’s own test runner, with nothing extra to install, and I run them before every commit.
          </p>
          <h3 className="mt-8 font-mono text-meta tracking-wide text-ink-2">WORKING WITH AI</h3>
          <p className="mt-3 text-small leading-relaxed text-ink-2">
            AI wrote first drafts of components and tests. I read every change, made the calls recorded in the decision
            records, and kept the prompt behind each step in the prompt log.
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
