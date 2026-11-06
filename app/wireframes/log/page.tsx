import Link from "next/link";
import { LogReview } from "@/components/wf/LogReview";
import { LOG } from "@/content/sample";

export default function Log() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-ink-2">
        <Link href="/wireframes/today" className="underline underline-offset-4">
          Today
        </Link>{" "}
        / Log a call
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{LOG.account}</h1>
      <p className="mt-1 text-ink-2">{LOG.meeting} · drafted from the transcript, waiting for you</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside aria-labelledby="h-transcript" className="lg:border-r lg:border-line lg:pr-8">
          <h2 id="h-transcript" className="text-lg font-semibold">
            Transcript moments
          </h2>
          <p className="mt-1 text-sm text-ink-2">Recorded with everyone&rsquo;s agreement. Excerpt.</p>
          <ol className="mt-3 space-y-4">
            {LOG.transcript.map((m) => (
              <li key={m.t} className="text-sm leading-relaxed">
                <span className="font-semibold tabular-nums">{m.t}</span> · {m.who}
                <br />
                <span className="text-ink-2">{m.text}</span>
              </li>
            ))}
          </ol>
        </aside>
        <LogReview sections={LOG.sections} account={LOG.account} emailDraft={LOG.emailDraft} />
      </div>
    </main>
  );
}
