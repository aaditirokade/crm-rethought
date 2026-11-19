import type { Metadata } from "next";
import Link from "next/link";
import { Coverage } from "@/components/case/Coverage";
import { Demo } from "@/components/case/Demo";
import { ScrollSteps, type Step } from "@/components/case/ScrollSteps";
import { ChapterRail, type Chapter as RailChapter } from "@/components/case/ChapterRail";
import { ProblemReel } from "@/components/case/ProblemReel";
import { ThemeButton } from "@/components/case/ThemeButton";
import { BASE } from "@/lib/base";
import { MobileApp } from "@/components/mobile/MobileApp";
import { AskAnatomy } from "@/components/case/AskAnatomy";
import { SiteNav } from "@/components/case/SiteNav";
import { BuiltInCode } from "@/components/case/BuiltInCode";
import { ApprovalExperiment, DirectionsNotTaken, LoopBeforeAfter, NextTime, WhenWrong } from "@/components/case/Story";

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
  top = false,
  narrow = false,
}: {
  n: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  flip?: boolean;
  /** Top align the text and the visual instead of centering them. */
  top?: boolean;
  /** A small visual: it takes 5 columns and the text moves up beside it. */
  narrow?: boolean;
}) {
  return (
    <section aria-labelledby={`ch-${n}`} className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className={`grid gap-10 lg:grid-cols-12 lg:gap-16 ${top ? "items-start" : "items-center"}`}>
        <div className={`${narrow ? "lg:col-span-7" : "lg:col-span-5"} ${flip ? "lg:order-2" : ""}`}>
          <p className="font-mono text-meta tracking-wide text-accent">
            {n} · {kicker.toUpperCase()}
          </p>
          <h2 id={`ch-${n}`} className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
            {title}
          </h2>
          <div className="mt-5 max-w-[60ch] space-y-4 text-[17px] leading-relaxed text-ink-2">{children}</div>
        </div>
        <div className={`min-w-0 ${narrow ? "lg:col-span-5" : "lg:col-span-7"} ${flip ? "lg:order-1" : ""}`}>{visual}</div>
      </div>
    </section>
  );
}

const SWATCHES = [
  { name: "Page", light: "#f9f8fc", dark: "#11111c" },
  { name: "Mist", light: "#ece9f5", dark: "#24243a" },
  { name: "Ink", light: "#1e2140", dark: "#eceefa" },
  { name: "Rose: AI, actions", light: "#b03c77", dark: "#f394c4" },
  { name: "Draft wash", light: "#f0f2fd", dark: "#1f2140" },
  { name: "Charts", light: "#6576d4", dark: "#8f9cf0" },
];

const CHAPTERS: RailChapter[] = [
  { id: "ch-01", label: "The problem" },
  { id: "ch-02", label: "Research" },
  { id: "ch-03", label: "Ask" },
  { id: "how", label: "How it works" },
  { id: "ch-04", label: "Design system" },
  { id: "ch-05", label: "Built in the open" },
  { id: "ch-06", label: "Built in code" },
  { id: "ch-07", label: "The test" },
  { id: "ch-08", label: "Next" },
  { id: "try", label: "Try it" },
];

const WALKTHROUGH: Step[] = [
  {
    title: "Approve drafts where they sit",
    body: "AI writes drafts with a source. Approve, edit or dismiss in place.",
    video: "review",
    width: 1520,
    height: 960,
    alt: "Review: a person approves a record fix, which saves at once, and the next card turns indigo under the pointer; then they approve an opportunity Spotted by AI, whose cards always sit on the indigo.",
  },
  {
    title: "Say the list you want",
    body: "Type what you want. It shows how it understood you, as chips you can remove.",
    video: "lists",
    width: 1520,
    height: 960,
    alt: "Lists: a person picks “quiet for 2 weeks with more than 10 stores”, the AI shows how it understood it as two filter chips with a reason beside each account, and removing one chip widens the list.",
  },
  {
    title: "Keep going between meetings",
    body: "On the way to a meeting: read, approve drafts, ask. Nothing saves without you.",
    video: "mobile",
    width: 750,
    height: 1484,
    phone: true,
    alt: "Mobile app: from Next up, a person opens the drafts waiting for them and approves one card, then opens Ask, picks “Why is Fernhill slipping?” reads the answer with its sources, three numbers and suggested actions, and chooses “Draft it”, which offers “Review it”.",
  },
];

export default function Home() {
  return (
    <div className="sig case-home min-h-svh">
      {/* The portfolio's own nav, so the way back to aaditirokade.com is always at the top (decision 0052). */}
      <SiteNav />

      <ThemeButton />

      {/* Same container, top padding and type as the Firstword case study, so the nav and title sit
          exactly in place on both (decision 0055). The tabs above the title were removed (decision 0056). */}
      <main id="main" className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28 xl:max-w-7xl">
        <header className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[14px] leading-5 tracking-wide text-ink-2">Concept case study · 2026</p>
            {/* Title and line slide up from behind a clipped edge, as on aaditirokade.com (decision 0041). */}
            <h1 className="cs-title mt-4">
              <span className="mask-line">
                <span style={{ animationDelay: "150ms" }}>Groundwork</span>
              </span>
            </h1>
            <p className="mt-3 text-lg leading-snug text-ink-2 sm:text-xl">
              <span className="mask-line">
                <span style={{ animationDelay: "300ms" }}>CRM, rethought. The AI does the groundwork; your team makes every call.</span>
              </span>
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
              A CRM where AI preps, drafts and answers, every line shows its source, and nothing saves until a person approves.
              From research to a coded prototype.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--rule)] pt-5 text-[14px] leading-5">
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
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:self-center">
            <Demo
              priority
              name="ask"
              width={1520}
              height={960}
              alt="Ask about any account: a person picks “Why is Fernhill slipping?”, the AI reads emails, tickets, the last call and usage, then answers in three bullets with a source on every claim, three numbers, a suggested next move and suggested actions. Choosing “Draft it” drafts a note, and “Review it” opens Review, where the note waits under Drafted from Ask, ready to approve."
            />
          </div>
        </header>

        {/* Nov 2026: the story in six lines sits in its own section just below the top (decisions 0114, 0115). */}
        <section aria-label="The case at a glance" className="mt-16 grid gap-10 border-t border-[var(--rule)] pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          {/* Nov 2026: the whole case in six lines, in the order hiring teams read: goal to result. Numbered tiles,
              three across on a wide screen (decision 0116). */}
          <div className="lg:col-span-12">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2">The story in six lines</h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {([
                ["Goal", "A CRM that account managers keep current without the typing."],
                ["Problem", "68% of sellers say note taking and data entry take the most time (Salesforce State of Sales)."],
                ["Approach", "AI drafts the record from meetings, every line shows its source, and a person approves."],
                ["Decision", "Every AI line waits for a person, over saving on its own. None of 13 similar products shows a source on every line."],
                ["Launch", "A concept: a working web and phone app, about 8,500 lines of TypeScript, with tests."],
                ["Result", "What I’d measure: drafts approved without edits, and meetings logged within a day."],
              ] as const).map(([step, text], i) => (
                <li key={step} className="flex flex-col rounded-xl border border-line bg-surface p-5 sm:p-6">
                  <span className="font-mono text-[13px] tracking-wide text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 text-[17px] font-medium leading-snug">{step}</span>
                  <span className="mt-2 text-[15px] leading-relaxed text-ink-2 [text-wrap:pretty]">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Nov 2026 (decision 0118): the working phone app, right after the story, so a reader can use it before the
            chapters. The same app as /mobile, live, in the phone frame. */}
        <section aria-labelledby="phone-h" className="mt-16 grid items-center gap-10 border-t border-[var(--rule)] pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="lg:col-span-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2">Try it on the phone</p>
            <h2 id="phone-h" className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">For the minutes between meetings</h2>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
              On the way to a meeting, the phone shows what to know, not a dashboard. After it, a minute logs it. Same rule as
              the desktop: the AI drafts, a person approves.
            </p>
            <ul className="mt-5 space-y-2 text-[15px] leading-relaxed">
              <li><span className="font-medium">Next up:</span> <span className="text-ink-2">the next meeting and what changed, each line with its source.</span></li>
              <li><span className="font-medium">Approve:</span> <span className="text-ink-2">swipe right to approve, left to dismiss.</span></li>
              <li><span className="font-medium">Ask:</span> <span className="text-ink-2">the same sourced answers as the desktop.</span></li>
              <li><span className="font-medium">Voice note:</span> <span className="text-ink-2">each sentence becomes a line to approve.</span></li>
            </ul>
            <p className="mt-6 text-small text-ink-2">
              The working app, with sample data. <Link href="/mobile" className="font-medium text-ink underline underline-offset-4">Open it full screen</Link>.
            </p>
          </div>
          <div className="flex justify-center lg:col-span-6">
            <div className="mob-frame" aria-label="Groundwork on a phone, working" role="region">
              <MobileApp />
            </div>
          </div>
        </section>

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
              Account managers type for a dashboard above them. The data goes stale, so the AI on top can&rsquo;t be trusted.
            </p>
            <p>I started from the people who keep the record.</p>
          </Chapter>

          <LoopBeforeAfter />

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
              None of thirteen products shows a source on every AI line. So Groundwork competes on trust.
            </p>
            <p className="text-small">Interviews so far are simulated; real ones are next.</p>
          </Chapter>

          <Chapter
            n="03"
            kicker="Ask"
            title="Ask anything about an account. Every claim brings its source."
            top
            visual={
              <div className="max-w-[32rem]">
                <AskAnatomy />
              </div>
            }
          >
            <p>
              Ask answers in plain words, with a source after each claim.
            </p>
            
          </Chapter>

          <ScrollSteps
            id="how"
            kicker="How it works"
            title="Approve, ask for a list, and keep going on the phone"
            intro="Recorded from the working prototype, in three steps."
            steps={WALKTHROUGH}
          />

          <WhenWrong />

          <Chapter
            n="04"
            kicker="Design system"
            title="Calm to use all day, rose where the AI asks you to act"
            flip
            narrow
            visual={
              <div className="max-w-[26rem]">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SWATCHES.map((s) => (
                    <li key={s.name} className="ask-tile ds-swatch flex flex-col rounded-[14px] p-3">
                      <span className="flex h-6 w-10 overflow-hidden rounded-[7px] border border-[var(--line-strong)]" aria-hidden="true">
                        <span className="flex-1" style={{ background: s.light }} />
                        <span className="flex-1" style={{ background: s.dark }} />
                      </span>
                      <p className="mt-3 text-small font-medium">{s.name}</p>
                      <p className="mt-0.5 font-mono text-meta text-ink-2">
                        {s.light} / {s.dark}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-small text-ink-2">Left half light, right half dark. Every text color passes WCAG AA on every background in both.</p>
              </div>
            }
          >
            <p>
              Space and rules instead of boxes, one friendly typeface, and one material: soft periwinkle blocks with glass leaves, night periwinkle in the dark.
            </p>
            <p>
              Rose is the one warm color, for the AI and the actions it asks for. Periwinkle carries the data.
            </p>
            <p>
              <Link href="/tokens" className="font-medium text-ink underline underline-offset-4">
                See the tokens and contrast checks
              </Link>
            </p>
          </Chapter>

          <DirectionsNotTaken />

          <Chapter
            n="05"
            kicker="Built in the open"
            title="Every prompt, decision and commit is public"
            visual={
              <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {[
                  ["Decision records", "Short records of every call, from the clean room rule to the colors", `${REPO}/tree/main/decisions`],
                  ["Prompt log", "The prompts behind each step, what came back and what I chose", `${REPO}/tree/main/prompts`],
                  ["Research", "Desk research and the competitive read, every claim linked", `${REPO}/tree/main/research`],
                  ["Wireframes", "The grayscale meeting loop before any color", "/wireframes"],
                ].map(([t, d, href]) => (
                  <li key={t}>
                    <a href={href.startsWith("/") ? BASE + href : href} className="open-row group flex items-center justify-between gap-4 py-4">
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
              Built by prompting AI, with a record for every decision and prompt.
            </p>
            <p>It is designed from scratch and uses nothing from any CRM I worked on before.</p>
          </Chapter>

          <BuiltInCode />

          <ApprovalExperiment />

          <Chapter
            n="08"
            kicker="Next"
            title="What I’d want to learn next, and how I’d measure it"
            visual={
              <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {[
                  ["Do people approve drafts as they are?", "Drafts approved without edits."],
                  ["Is the record more complete?", "Meetings logged within a day."],
                  ["Do people trust Ask?", "Answers opened to their source."],
                ].map(([t, d]) => (
                  <li key={t} className="open-row py-4">
                    <span className="block font-medium">{t}</span>
                    <span className="block text-small text-ink-2">{d}</span>
                  </li>
                ))}
              </ul>
            }
          >
            <p>A concept, so no outcomes yet. What I’d measure:</p>
            <NextTime />
          </Chapter>
        <section aria-labelledby="try" className="border-t border-[var(--rule)] py-20 text-center">
          {/* On wide screens, center on the gap between the chapters' 5 and 7 column split: (100% + gap) / 6 off the right. */}
          <div className="lg:mr-[calc((100%_+_4rem)/6)]">
            <h2 id="try" className="text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
              Try it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Ask, approve, make a list. Next: real interviews.
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
