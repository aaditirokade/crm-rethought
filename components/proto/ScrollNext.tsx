"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** How far someone keeps scrolling past the end of a page before the next tab opens, in px. */
const PULL = 360;

/**
 * At the end of each main tab, a quiet footer that names the next tab. Once
 * the page has been scrolled to the bottom, scrolling on (wheel or touch)
 * fills a hairline, and when it is full the next tab opens at its top. The
 * footer is also a plain link, so keyboard and screen reader users get the
 * same step without scrolling, and nothing changes until someone has reached
 * the end and keeps going.
 */
export function ScrollNext({ next }: { next: { href: string; label: string } | null }) {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const acc = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaving = useRef(false);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    if (!next) return;
    leaving.current = false;
    acc.current = 0;
    const atEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const settle = () => {
      if (idle.current) clearTimeout(idle.current);
      idle.current = setTimeout(() => {
        acc.current = 0;
        setPull(0);
      }, 700);
    };
    const push = (d: number) => {
      if (leaving.current) return;
      if (d <= 0 || !atEnd()) {
        if (acc.current) {
          acc.current = 0;
          setPull(0);
        }
        return;
      }
      acc.current = Math.min(PULL, acc.current + d);
      setPull(acc.current / PULL);
      settle();
      if (acc.current >= PULL) {
        leaving.current = true;
        router.push(next.href);
      }
    };
    const onWheel = (e: WheelEvent) => push(e.deltaY);
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY.current === null || y === undefined) return;
      push((touchY.current - y) * 1.4);
      touchY.current = y;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [next, router]);

  if (!next) return null;
  return (
    <div className="scroll-next mt-20 border-t border-[var(--rule)] pt-6">
      <Link href={next.href} className="group flex items-center justify-between gap-4 text-small text-ink-2">
        <span>
          {pull > 0 ? "Keep scrolling for " : "Next: "}
          <span className="font-medium text-ink">{next.label}</span>
        </span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
          ↓
        </span>
      </Link>
      <div aria-hidden="true" className="mt-3 h-px w-full bg-[var(--rule)]">
        <div className="h-px bg-ink transition-[width] duration-150 ease-out motion-reduce:transition-none" style={{ width: `${pull * 100}%` }} />
      </div>
    </div>
  );
}
