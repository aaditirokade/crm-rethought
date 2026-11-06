import Link from "next/link";

const REPO = "https://github.com/aaditirokade/crm-rethought";

/** Placeholder home until Phase 4: links to the wireframes and the open repo. */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm text-ink-2">Concept prototype · sample data</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">CRM Rethought</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        A B2B CRM for account teams, redesigned with AI inside every workflow. AI prepares the meeting, logs the call
        and flags the deal at risk; a person always makes the call.
      </p>
      <p className="mt-4 leading-relaxed text-ink-2">
        Built in the open: every prompt, decision and commit lives in the repo.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li>
          <Link className="text-action underline underline-offset-4" href="/prototype">
            Working prototype
          </Link>
        </li>
        <li>
          <Link className="text-action underline underline-offset-4" href="/wireframes">
            Wireframes
          </Link>
        </li>
        <li>
          <Link className="text-action underline underline-offset-4" href="/tokens">
            Design tokens
          </Link>
        </li>
        <li>
          <a className="text-action underline underline-offset-4" href={`${REPO}/tree/main/prompts`}>
            Prompt log
          </a>
        </li>
        <li>
          <a className="text-action underline underline-offset-4" href={`${REPO}/tree/main/decisions`}>
            Decisions
          </a>
        </li>
        <li>
          <a className="text-action underline underline-offset-4" href={`${REPO}/tree/main/research`}>
            Research
          </a>
        </li>
      </ul>
    </main>
  );
}
