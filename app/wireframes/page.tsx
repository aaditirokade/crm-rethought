import Link from "next/link";

const REPO = "https://github.com/aaditirokade/crm-rethought/blob/main";

const SCREENS = [
  {
    href: "/wireframes/today",
    name: "Today",
    tests: "Can Daniel see, in one glance, which meeting needs prep and what is waiting for his approval?",
  },
  {
    href: "/wireframes/brief",
    name: "Meeting brief",
    tests: "Does leading with what changed, with a source on every line, make prep take minutes instead of half an hour?",
  },
  {
    href: "/wireframes/log",
    name: "Log a call",
    tests: "Is approving line by line fast enough that people do it, instead of skipping the log?",
  },
];

export default function WireframesIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Wireframes: the meeting loop</h1>
      <p className="mt-3 leading-relaxed text-ink-2">
        Three screens that follow one account manager, Daniel, through a quarterly review: the morning list, the brief
        before the call, and the log after it. Grayscale on purpose: this round is about structure and the approve in
        place pattern. The visual direction comes next.
      </p>
      <ol className="mt-8 divide-y divide-line border-y border-line">
        {SCREENS.map((s, i) => (
          <li key={s.href} className="py-5">
            <p className="text-sm text-ink-2">Step {i + 1}</p>
            <h2 className="mt-1 text-lg font-semibold">
              <Link href={s.href} className="underline underline-offset-4">
                {s.name}
              </Link>
            </h2>
            <p className="mt-1 leading-relaxed text-ink-2">Tests: {s.tests}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm leading-relaxed text-ink-2">
        Why it works this way:{" "}
        <a className="underline underline-offset-4" href={`${REPO}/design/where-ai-belongs.md`}>
          where AI belongs
        </a>{" "}
        ·{" "}
        <a className="underline underline-offset-4" href={`${REPO}/design/information-architecture.md`}>
          information architecture
        </a>{" "}
        ·{" "}
        <a className="underline underline-offset-4" href={`${REPO}/decisions/0008-ai-drafts-people-decide.md`}>
          decision 0008
        </a>
      </p>
    </main>
  );
}
