"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAccounts, IconImport, IconPhone, IconPipeline, IconReset, IconReview, IconToday } from "./Icons";
import { actions, allSugs, entryOf, me, pending, useProto } from "./store";
import { ScrollNext } from "./ScrollNext";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Navigation as a floating dock: the day's work as steps (prep, know, pursue, decide, import).
 * Each step shows what is waiting there. Vertical on the left on wide screens, a bar at the bottom on phones.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const s = useProto();
  const path = usePathname();
  const waiting = pending(s).length;
  const ghosts = allSugs(s).filter((x) => (x.kind === "opp" || x.kind === "stage") && entryOf(s, x.id).status === "pending").length;
  const steps = [
    {
      href: "/prototype",
      label: "Today",
      verb: "PREP",
      status: "3 meetings, 10:00 next",
      icon: <IconToday />,
      current: path === "/prototype" || ["/prototype/brief", "/prototype/log", "/prototype/quick-log"].some((p) => path.startsWith(p)),
    },
    { href: "/prototype/accounts", label: "Accounts", verb: "KNOW", status: "5 accounts", icon: <IconAccounts />, current: path.startsWith("/prototype/accounts") },
    {
      href: "/prototype/opportunities",
      label: "Opportunities",
      verb: "PURSUE",
      status: ghosts ? `${ghosts} AI suggestions` : "Pipeline up to date",
      icon: <IconPipeline />,
      current: path.startsWith("/prototype/opportunities"),
      count: ghosts,
    },
    {
      href: "/prototype/review",
      label: "Review",
      verb: "DECIDE",
      status: waiting ? `${waiting} waiting for you` : "Nothing waiting",
      icon: <IconReview />,
      current: path.startsWith("/prototype/review"),
      count: waiting,
    },
    { href: "/prototype/imports", label: "Imports", verb: "IMPORT", status: s.imp.doneAt ? "Expo list imported" : "1 list to import", icon: <IconImport />, current: path.startsWith("/prototype/imports") },
  ];
  // On a tab's own page (not a brief, log or account inside it), scrolling past the end opens the next tab.
  const at = steps.findIndex((st) => st.href === path);
  const next = at >= 0 && at < steps.length - 1 ? { href: steps[at + 1].href, label: steps[at + 1].label } : null;

  return (
    <div className="sig min-h-svh">
      <a href="#main" className="proto-skip">
        Skip to content
      </a>

      <header className="w-full px-5 md:px-8 lg:pl-32 lg:pr-8 flex items-center justify-between gap-3 pt-5">
        <Link href="/prototype" className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-2xl bg-ink font-mono text-meta text-bg">
            G
          </span>
          Groundwork
        </Link>
        <p className="font-mono text-meta tracking-wide text-ink-2">
          <span className="hidden sm:inline">{me.name.toUpperCase()} · AM · </span>CONCEPT PROTOTYPE · SAMPLE DATA
        </p>
      </header>

      <nav aria-label="Main" className="dock">
        <ol className="dock-list">
          {steps.map((st, i) => (
            <li key={st.href} className="dock-step">
              {i > 0 ? <span aria-hidden="true" className="dock-line" /> : null}
              <Link href={st.href} aria-current={st.current ? "page" : undefined} className="dock-btn group">
                <span className="dock-icon">
                  {st.icon}
                  {st.count ? (
                    <span key={st.count} className="dock-badge" aria-hidden="true">
                      {st.count}
                    </span>
                  ) : null}
                </span>
                <span className="dock-verb" aria-hidden="true">
                  {st.verb}
                </span>
                <span className="sr-only">
                  {st.label}, {st.status}
                </span>
                <span className="dock-tip" aria-hidden="true">
                  <span className="font-semibold">{st.label}</span>
                  <span className="block font-mono text-meta text-ink-2">{st.status}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="dock-tools">
          <ThemeToggle />
          <Link href="/mobile" className="dock-tool group" aria-label="Open the mobile app">
            <IconPhone />
            <span className="dock-tip" aria-hidden="true">
              <span className="font-semibold">Mobile app</span>
            </span>
          </Link>
          <button type="button" className="dock-tool group" aria-label="Reset demo" onClick={() => actions.reset()}>
            <IconReset />
            <span className="dock-tip" aria-hidden="true">
              <span className="font-semibold">Reset demo</span>
              <span className="block font-mono text-meta text-ink-2">Back to 9:05 AM</span>
            </span>
          </button>
        </div>
      </nav>

      <main id="main" tabIndex={-1} className="w-full px-5 md:px-8 lg:pl-32 lg:pr-8 pt-10 pb-32 outline-none lg:pb-12">
        {children}
        <ScrollNext key={path} next={next} />
      </main>
      {s.message && s.seq ? (
        <div key={s.seq} className="toast" aria-hidden="true">
          <span className="toast-dot" />
          {s.message}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {s.message}
      </p>
    </div>
  );
}
