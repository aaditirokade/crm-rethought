"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { actions, me, pending, useProto } from "./store";


export function Shell({ children }: { children: React.ReactNode }) {
  const s = useProto();
  const path = usePathname();
  const waiting = pending(s).length;
  const nav = [
    { href: "/prototype", label: "Today", current: path === "/prototype" || path.startsWith("/prototype/brief") || path.startsWith("/prototype/log") || path.startsWith("/prototype/quick-log") },
    { href: "/prototype/accounts", label: "Accounts", current: path.startsWith("/prototype/accounts") },
    { href: "/prototype/opportunities", label: "Opportunities", current: path.startsWith("/prototype/opportunities") },
    { href: "/prototype/review", label: "Review", current: path.startsWith("/prototype/review"), count: waiting },
    { href: "/prototype/imports", label: "Imports", current: path.startsWith("/prototype/imports") },
  ];
  return (
    <div className="sig min-h-svh lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)]">
      <a href="#main" className="proto-skip">
        Skip to content
      </a>
      <header className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-svh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-4 py-3 lg:block lg:px-5 lg:py-5">
          <Link href="/prototype" className="whitespace-nowrap font-semibold">
            CRM Rethought
          </Link>
          <p className="hidden font-mono text-meta text-ink-2 lg:mt-1 lg:block">
            {me.name.toUpperCase()} · AM
          </p>
        </div>
        <nav aria-label="Main" className="px-2 pb-2 lg:px-3 lg:pt-4">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={n.current ? "page" : undefined} className="proto-nav">
                  {n.label}
                  {n.count ? (
                    <span className="proto-count">
                      {n.count}
                      <span className="sr-only"> waiting for approval</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden px-5 lg:absolute lg:bottom-5 lg:block">
          <p className="font-mono text-meta text-ink-2">CONCEPT PROTOTYPE · SAMPLE DATA</p>
          <button type="button" className="sig-btn mt-2" onClick={() => actions.reset()}>
            Reset demo
          </button>
        </div>
      </header>
      <div className="min-w-0">
        <aside aria-label="Demo" className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-2 lg:hidden">
          <p className="font-mono text-meta text-ink-2">CONCEPT PROTOTYPE · SAMPLE DATA</p>
          <button type="button" className="sig-btn" onClick={() => actions.reset()}>
            Reset demo
          </button>
        </aside>
        <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 outline-none lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
      <p className="sr-only" aria-live="polite">
        {s.message}
      </p>
    </div>
  );
}
