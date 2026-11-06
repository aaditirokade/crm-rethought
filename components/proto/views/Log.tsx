"use client";

import Link from "next/link";
import { account, EMAIL_DRAFT, forMeeting, MEETINGS, meeting, TRANSCRIPT } from "@/content/prototype";
import { PageHead } from "../bits";
import { EmailDraft, GateLine } from "../Lines";
import { actions, entryOf, isGated, useProto } from "../store";

const SECTIONS = [
  { name: "Log", hint: "Goes on the account timeline once saved." },
  { name: "Follow ups", hint: "Tasks go to your list. The email is yours to send." },
  { name: "Record updates", hint: "Changes to the shared record." },
];

export function Log({ id }: { id: string }) {
  const s = useProto();
  const m = meeting(id);
  const a = m ? account(m.account) : undefined;
  const t = TRANSCRIPT[id];
  if (!m || !a || !t) return null;

  const sugs = forMeeting(id).filter((x) => isGated(x) || x.kind === "email").filter((x) => x.kind !== "fix");
  const gated = sugs.filter(isGated);
  const count = (st: string) => gated.filter((x) => entryOf(s, x.id).status === st).length;
  const approved = count("approved");
  const waiting = count("pending");
  const savedN = count("saved");
  const next = MEETINGS.find((x) => x.fromLog === id);

  return (
    <div>
      <PageHead
        kicker={
          <>
            <Link href="/prototype" className="hover:underline">
              TODAY
            </Link>{" "}
            / LOG A CALL
          </>
        }
        title={a.name}
        sub={
          <>
            {m.title} · {m.day}, {m.time} · {t.ended}
          </>
        }
      />
      <p className="mt-3 font-mono text-meta tracking-wide text-ink-2">
        DRAFTED BY AI FROM THE TRANSCRIPT · NOTHING IS SAVED UNTIL YOU APPROVE AND SAVE
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-labelledby="h-transcript" className="order-2 lg:order-1">
          <div className="proto-card p-4 lg:sticky lg:top-6">
            <h2 id="h-transcript" className="text-h3 font-semibold">
              Transcript moments
            </h2>
            <p className="mt-1 text-small text-ink-2">Recorded with everyone&rsquo;s agreement. Excerpt.</p>
            <ol className="mt-3 space-y-3">
              {t.moments.map((x) => (
                <li key={x.t} className="text-small">
                  <span className="font-mono text-meta font-medium">{x.t}</span>{" "}
                  <span className="font-medium">{x.who}</span>
                  <span className="mt-0.5 block text-ink-2">{x.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="order-1 min-w-0 lg:order-2">
          <div className="space-y-8">
            {SECTIONS.map((sec) => {
              const items = sugs.filter((x) => x.section === sec.name);
              return (
                <section key={sec.name} aria-labelledby={`h-${sec.name.replace(/\s/g, "")}`}>
                  <h2 id={`h-${sec.name.replace(/\s/g, "")}`} className="text-h3 font-semibold">
                    {sec.name}
                  </h2>
                  <p className="text-small text-ink-2">{sec.hint}</p>
                  <ul className="proto-card mt-3 space-y-1 p-1.5">
                    {items.map((x) =>
                      x.kind === "email" ? <EmailDraft key={x.id} sug={x} body={EMAIL_DRAFT[id] ?? ""} /> : <GateLine key={x.id} sug={x} />,
                    )}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="sticky bottom-0 mt-8 border-t border-line bg-bg py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-meta tracking-wide">
                <span className="font-medium">{approved} APPROVED</span>
                <span className="text-ink-2"> · {waiting} WAITING</span>
                {savedN ? <span className="text-good"> · {savedN} SAVED</span> : null}
              </p>
              <button
                type="button"
                className="sig-btn sig-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={approved === 0}
                onClick={() => actions.save(id)}
              >
                Save {approved || ""} approved {approved === 1 ? "line" : "lines"}
              </button>
            </div>
            {savedN ? (
              <p className="mt-3 text-small">
                Saved lines are on the{" "}
                <Link href={`/prototype/accounts/${a.id}`} className="font-medium underline underline-offset-4">
                  {a.name} timeline
                </Link>
                {next ? (
                  <>
                    {" "}
                    and in{" "}
                    <Link href={`/prototype/brief/${next.id}`} className="font-medium underline underline-offset-4">
                      {next.day}&rsquo;s brief
                    </Link>
                  </>
                ) : null}
                .
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
