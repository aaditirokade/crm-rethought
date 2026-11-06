import Link from "next/link";
import { BriefView } from "@/components/wf/BriefView";
import { BRIEF } from "@/content/sample";

export default function Brief() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-ink-2">
        <Link href="/wireframes/today" className="underline underline-offset-4">
          Today
        </Link>{" "}
        / Brief
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{BRIEF.account}</h1>
      <p className="mt-1 text-ink-2">
        {BRIEF.meeting} · {BRIEF.lastTouch}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <BriefView sections={BRIEF.sections} />
        <aside aria-labelledby="h-people" className="lg:border-l lg:border-line lg:pl-8">
          <h2 id="h-people" className="text-lg font-semibold">
            In this meeting
          </h2>
          <ul className="mt-3 space-y-4">
            {BRIEF.attendees.map((p) => (
              <li key={p.name}>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-ink-2">{p.role}</p>
                <p className="text-sm text-ink-2">{p.note}</p>
              </li>
            ))}
          </ul>
          <div className="wf-fix mt-8">
            <p className="text-sm font-semibold">How to read this brief</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              Every line links to where it came from. The brief is your private draft: pin or dismiss freely. Only a
              record fix changes shared data, and it waits for you.
            </p>
          </div>
          <Link href="/wireframes/log" className="wf-btn mt-8">
            After the call: review the log
          </Link>
        </aside>
      </div>
    </main>
  );
}
