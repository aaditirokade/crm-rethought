"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAccounts, IconImport, IconPhone, IconPipeline, IconReset, IconReview, IconToday } from "./Icons";
import { actions, allSugs, entryOf, me, pending, useProto } from "./store";

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

  return (
    <div className="sig min-h-svh">
      <a href="#main" className="proto-skip">
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-4 lg:pl-32 lg:pr-8">
        <Link href="/prototype" className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-[6px] bg-ink font-mono text-meta text-bg">
            CR
          </span>
          CRM Rethought
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
                    <span className="dock-badge" aria-hidden="true">
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

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-32 outline-none lg:pb-12 lg:pl-32 lg:pr-8">
        {children}
      </main>
      <p className="sr-only" aria-live="polite">
        {s.message}
      </p>
    </div>
  );
}
