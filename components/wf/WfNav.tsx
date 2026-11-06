"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LATER = ["Accounts", "Review"];

export function WfNav() {
  const path = usePathname();
  const current = path === "/wireframes/today" || path === "/wireframes/brief" || path === "/wireframes/log";
  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-5 text-sm">
        <li>
          <Link href="/wireframes/today" aria-current={current ? "page" : undefined} className="wf-navlink">
            Today
          </Link>
        </li>
        {LATER.map((name) => (
          <li key={name} className="text-ink-2">
            {name}
            <span className="sr-only"> (not built yet)</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
