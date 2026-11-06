import Link from "next/link";
import { MEETINGS, NOW } from "@/content/sample";

export default function Today() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-ink-2">{NOW}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Good morning, Daniel</h1>
      <p className="mt-2 leading-relaxed text-ink-2">3 meetings today. 1 brief is ready; 2 things are waiting for you.</p>

      <section aria-labelledby="h-meetings" className="mt-10">
        <h2 id="h-meetings" className="text-lg font-semibold">
          Today&rsquo;s meetings
        </h2>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {MEETINGS.map((m) => (
            <li key={m.id} className="grid grid-cols-[4rem_1fr] gap-4 py-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
              <p className="font-semibold tabular-nums">{m.time}</p>
              <div>
                <p className="font-semibold">{m.account}</p>
                <p className="text-sm text-ink-2">
                  {m.title} · {m.context}
                </p>
              </div>
              <div className="col-start-2 sm:col-start-auto">
                {m.href ? (
                  <Link href={m.href} className="wf-btn wf-btn-primary">
                    Open brief<span className="sr-only"> for {m.account}</span>
                  </Link>
                ) : (
                  <span className="text-sm text-ink-2">{m.status}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="h-waiting" className="mt-10">
        <h2 id="h-waiting" className="text-lg font-semibold">
          Waiting for you
        </h2>
        <p className="mt-1 text-sm text-ink-2">Nothing here reaches the record until you approve it.</p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Record fix · Fernhill Outfitters</p>
              <p className="text-sm text-ink-2">Lena Ortiz may have left. It&rsquo;s in the brief, where you&rsquo;ll see why.</p>
            </div>
            <Link href="/wireframes/brief" className="wf-btn">
              Review in brief
            </Link>
          </li>
          <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Log a call · Fernhill Outfitters</p>
              <p className="text-sm text-ink-2">9 lines drafted from the 10:00 call (shown as if the call has ended).</p>
            </div>
            <Link href="/wireframes/log" className="wf-btn">
              Review log
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
