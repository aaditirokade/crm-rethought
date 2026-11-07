import type { Metadata } from "next";
import Link from "next/link";
import { Coverage } from "@/components/case/Coverage";
import { Demo } from "@/components/case/Demo";
import { ScrollSteps, type Step } from "@/components/case/ScrollSteps";
import { ChapterRail, type Chapter as RailChapter } from "@/components/case/ChapterRail";
import { ProblemReel } from "@/components/case/ProblemReel";
import { ThemeButton } from "@/components/case/ThemeButton";

export const metadata: Metadata = {
  title: "Groundwork · CRM, rethought",
  description:
    "Groundwork, a concept case study by Aaditi Rokade: a CRM for account teams where AI does the groundwork, shows a source for every line, and a person approves before anything reaches the record.",
};

const REPO = "https://github.com/aaditirokade/crm-rethought";

function Links({ big = false, center = false }: { big?: boolean; center?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-7 gap-y-4 ${center ? "justify-center" : ""}`}>
      <Link
        href="/prototype"
        className={`group inline-flex items-center gap-2 rounded-full bg-ink font-medium text-bg transition-transform active:scale-[0.98] ${
          big ? "px-7 py-4 text-body" : "px-5 py-3 text-small"
        }`}
      >
        Open the prototype
        <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </Link>
      <Link href="/mobile" className={`group inline-flex min-h-11 items-center gap-2 font-medium ${big ? "text-body" : "text-small"}`}>
        <span className="underline underline-offset-4">Mobile app</span>
        <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}

function Chapter({
  n,
  kicker,
  title,
  children,
  visual,
  flip = false,
}: {
  n: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section aria-labelledby={`ch-${n}`} className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <p className="font-mono text-meta tracking-wide text-accent">
            {n} · {kicker.toUpperCase()}
          </p>
          <h2 id={`ch-${n}`} className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
            {title}
          </h2>
          <div className="mt-5 max-w-[60ch] space-y-4 text-[17px] leading-relaxed text-ink-2">{children}</div>
        </div>
        <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>{visual}</div>
      </div>
    </section>
  );
}

const SWATCHES = [
  { name: "Page", light: "#fffbf4", dark: "#121211" },
  { name: "Sand", light: "#f4efe4", dark: "#242422" },
  { name: "Ink", light: "#2b2620", dark: "#f3efe7" },
  { name: "AI", light: "#4c50c9", dark: "#aeb6ff" },
  { name: "AI wash", light: "#edf1fc", dark: "#23242e" },
  { name: "Charts", light: "#4f97a8", dark: "#7fc4d4" },
];

const CHAPTERS: RailChapter[] = [
  { id: "ch-01", label: "The problem" },
  { id: "ch-02", label: "Research" },
  { id: "ch-03", label: "Ask" },
  { id: "how", label: "How it works" },
  { id: "ch-04", label: "Design system" },
  { id: "ch-05", label: "Built in the open" },
  { id: "try", label: "Try it" },
];

const WALKTHROUGH: Step[] = [
  {
    title: "Approve drafts where they sit",
    body: "Anything the AI writes arrives as a draft with its source and confidence. Open the source, then approve, edit or dismiss in place. Record fixes save at once; log lines wait to be saved together, so a meeting reaches the record as one decision.",
    video: "review",
    width: 1520,
    height: 960,
    alt: "Review: a person opens the source of a draft line, sees the email it came from, closes it, approves a record fix that saves right away, approves a log line, then saves it to the record.",
  },
  {
    title: "Say the list you want",
    body: "Instead of a filter builder, type what you want. Groundwork shows how it understood you as chips, and every account says why it is on the list. If it misread you, remove the wrong chip.",
    video: "lists",
    width: 1520,
    height: 960,
    alt: "Lists: a person types “quiet for 2 weeks with more than 10 stores”, the AI shows how it understood it as two filter chips with a reason beside each account, and removing one chip widens the list.",
  },
  {
    title: "Keep going between meetings",
    body: "The phone app is the three things people do on the way to and from a meeting: read what to know, approve drafts one card at a time, and turn a voice note into lines to approve. Nothing saves without you.",
    video: "mobile",
    width: 750,
    height: 1624,
    phone: true,
    alt: "Mobile app: from the next meeting, a person opens the drafts waiting for them, approves a record fix and a log line one card at a time, then saves the approved line.",
  },
];

export default function Home() {
  return (
    <div className="sig min-h-svh">
      <header className="flex w-full items-center justify-between gap-3 px-5 pt-5 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-2xl bg-ink font-mono text-meta text-bg">
            G
          </span>
          Groundwork
        </Link>
        <nav aria-label="Case study" className="flex items-center gap-4 text-small sm:gap-6">
          <Link href="/prototype" className="hidden font-medium underline-offset-4 hover:underline sm:inline">
            Prototype
          </Link>
          <a href={REPO} className="hidden font-medium underline-offset-4 hover:underline sm:inline">
            GitHub
          </a>
          <ThemeButton />
        </nav>
      </header>

      <main id="main" className="w-full px-5 pb-20 md:px-8 lg:px-16">
        <header className="grid items-center gap-12 pt-14 lg:grid-cols-12 lg:gap-16 lg:pt-20">
          <div className="lg:col-span-5">
            <p className="font-mono text-meta tracking-wide text-ink-2">CONCEPT CASE STUDY · 2026</p>
            <h1 className="mt-4 text-h1">Groundwork</h1>
            <p className="mt-3 text-xl leading-snug sm:text-2xl">CRM, rethought. The AI does the groundwork; your team makes every call.</p>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
              A CRM for account teams with AI in every workflow: it preps the meeting, drafts the log, spots the risk and answers
              questions about any account. Every line it writes shows its source, and nothing reaches the record until a person
              approves it. I took it from research to a coded prototype.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--rule)] pt-5 text-small">
              <div>
                <dt className="text-ink-2">Role</dt>
                <dd className="mt-1">Research, design, front end</dd>
              </div>
              <div>
                <dt className="text-ink-2">Platforms</dt>
                <dd className="mt-1">Desktop web and phone</dd>
              </div>
              <div>
                <dt className="text-ink-2">Built with</dt>
                <dd className="mt-1">Next.js, React, TypeScript</dd>
              </div>
            </dl>
            <div className="mt-8">
              <Links />
              <p className="mt-4 text-small text-ink-2">Concept prototype · every company, person and number is made up</p>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <Demo
              name="ask"
              width={1520}
              height={960}
              alt="Ask about any account: a person picks “Why is Fernhill slipping?”, the AI reads emails, tickets, the last call and usage, then answers with a source on every claim, three numbers and a suggested next move."
            />
          </div>
        </header>

        <div className="mt-20 xl:grid xl:grid-cols-[9.5rem_minmax(0,1fr)] xl:gap-14">
          <ChapterRail chapters={CHAPTERS} />
          <div className="min-w-0">
          <Chapter
            n="01"
            kicker="The problem"
            title="CRMs are built for reporting, not for the people who fill them in"
            visual={<ProblemReel />}
          >
            <p>
              Account managers spend their week typing calls into a system that mostly serves the dashboard above them. The data
              goes stale, so nobody trusts it, so the AI built on top of it can&rsquo;t be trusted either.
            </p>
            <p>I started from the people who keep the record, not the people who read the report.</p>
          </Chapter>

          <Chapter
            n="02"
            kicker="Research"
            title="Briefs and automatic logs are now expected. Trust isn&rsquo;t built in yet."
            flip
            visual={<Coverage />}
          >
            <p>
              I read thirteen products that already put AI around the meeting, from Salesforce and HubSpot to Gong, Attio and
              newer AI first CRMs, against the six things Groundwork set out to do.
            </p>
            <p>
              Briefs and call logs are everywhere. Approval is rare and usually a setting, and none of the thirteen shows a source
              on every AI line. So Groundwork competes on trust, not features.
            </p>
            <p className="text-small">Interviews so far are simulated and labeled SIMULATED in the repo; real ones are next.</p>
          </Chapter>

          <Chapter
            n="03"
            kicker="Ask"
            title="Ask anything about an account. Every claim brings its source."
            visual={
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Reads", "3 emails, 2 tickets, the Oct 14 call, weekly usage and the record, and shows each step as it goes"],
                  ["Answers", "In plain words, with a source chip after every claim, so any sentence can be checked in one click"],
                  ["Sums up", "Three numbers that matter for this question, and one suggested next move"],
                  ["Changes nothing", "Read only, and it says so: “drafted from 6 sources, nothing in the record changed”"],
                ].map(([t, d], i) => (
                  <li key={t} className="ask-tile flex flex-col rounded-[20px] bg-surface-2 p-5 sm:p-6">
                    <span className="font-mono text-meta text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-6 block text-xl font-medium">{t}</span>
                    <span className="mt-1.5 block leading-snug text-ink-2">{d}</span>
                  </li>
                ))}
              </ul>
            }
          >
            <p>
              Ask sits at the top of the day. It shows what it is reading while it works, then answers in plain words with a
              source after each claim: the email, the ticket, the call, the usage chart.
            </p>
            <p>The animation at the top of this page is the real prototype answering “Why is Fernhill slipping?”.</p>
          </Chapter>

          <ScrollSteps
            id="how"
            kicker="How it works"
            title="Approve, ask for a list, and keep going on the phone"
            intro="Recorded from the working prototype. Scroll to move through the steps, or pick one."
            steps={WALKTHROUGH}
          />

          <Chapter
            n="04"
            kicker="Design system"
            title="Calm to use all day, violet only where the AI speaks"
            flip
            visual={
              <div>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SWATCHES.map((s) => (
                    <li key={s.name} className="ask-tile flex flex-col rounded-[20px] bg-surface-2 p-4 sm:p-5">
                      <span className="flex h-9 w-14 overflow-hidden rounded-[10px] border border-[var(--line-strong)]" aria-hidden="true">
                        <span className="flex-1" style={{ background: s.light }} />
                        <span className="flex-1" style={{ background: s.dark }} />
                      </span>
                      <p className="mt-5 font-medium">{s.name}</p>
                      <p className="mt-0.5 font-mono text-meta text-ink-2">
                        {s.light} / {s.dark}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-small text-ink-2">Left half light, right half dark. Every text color passes WCAG AA on every background in both.</p>
              </div>
            }
          >
            <p>
              Most CRMs feel like a spreadsheet in uniform. Groundwork uses space and full width rules instead of boxes, one friendly
              typeface, cream and warm charcoal instead of white and black, and a light and dark switch.
            </p>
            <p>
              Violet belongs to the AI alone: drafts, Ask and the counts of what waits for you. Charts use a soft teal so they never
              read as the AI talking.
            </p>
            <p>
              <Link href="/tokens" className="font-medium text-ink underline underline-offset-4">
                See the tokens and contrast checks
              </Link>
            </p>
          </Chapter>

          <Chapter
            n="05"
            kicker="Built in the open"
            title="Every prompt, decision and commit is public"
            visual={
              <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {[
                  ["Decision records", "33 short records, from the clean room rule to slender account charts", `${REPO}/tree/main/decisions`],
                  ["Prompt log", "The prompts behind each step, what came back and what I chose", `${REPO}/tree/main/prompts`],
                  ["Research", "Desk research and the competitive read, every claim linked", `${REPO}/tree/main/research`],
                  ["Wireframes", "The grayscale meeting loop before any color", "/wireframes"],
                ].map(([t, d, href]) => (
                  <li key={t}>
                    <a href={href} className="group flex items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block font-medium">{t}</span>
                        <span className="block text-small text-ink-2">{d}</span>
                      </span>
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            }
          >
            <p>
              I built Groundwork by prompting AI in the editor and the terminal, and kept the receipts: each decision has a record,
              each step has its prompt, and each commit adds a line to the updates log.
            </p>
            <p>It is designed from scratch and uses nothing from any CRM I worked on before.</p>
          </Chapter>
        <section aria-labelledby="try" className="border-t border-[var(--rule)] py-20 text-center">
          {/* On wide screens, center on the gap between the chapters' 5 and 7 column split: (100% + gap) / 6 off the right. */}
          <div className="lg:mr-[calc((100%_+_4rem)/6)]">
            <h2 id="try" className="text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
              Try it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Ask about an account, approve a draft, make a list. The demo resets from the dock whenever you like. Next: real
              interviews and usability tests.
            </p>
            <div className="mt-8">
              <Links big center />
            </div>
          </div>
        </section>
          </div>
        </div>

      </main>
    </div>
  );
}
