"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Tab = { href: string; label: string };
type Flow = "down" | "up";

/** How far someone keeps scrolling past either end of a page before the neighboring tab opens, in px. */
const PULL = 200;
/** How far the page travels while it hands over to the next one, as a share of the viewport. */
const SHIFT = "14vh";
const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const OUT_MS = 220;
const IN_MS = 460;

/** Set just before a scroll driven switch, read by the next page as it mounts. */
let flow: Flow | null = null;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const main = () => document.getElementById("main");

/**
 * Lets the main tabs read as one long page. At the end of a tab, scrolling on
 * fills a hairline and the next tab slides up into place; at the top, scrolling
 * up does the same for the previous tab, which arrives scrolled to its end. The
 * footer is also a plain link, so keyboard and screen reader users get the same
 * step without scrolling. A switch never chains: the new page waits for the
 * current gesture (and any trackpad momentum) to stop before it listens.
 */
export function ScrollNext({ next, prev = null }: { next: Tab | null; prev?: Tab | null }) {
  const router = useRouter();
  const [down, setDown] = useState(0);
  const [up, setUp] = useState(0);
  const acc = useRef({ down: 0, up: 0 });
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaving = useRef(false);
  const touchY = useRef<number | null>(null);

  // Arriving from a scroll driven switch: start at the matching end and glide in from that side.
  useLayoutEffect(() => {
    const el = main();
    const dir = flow;
    flow = null;
    if (!el || !dir) return;
    window.scrollTo({ top: dir === "down" ? 0 : document.documentElement.scrollHeight, behavior: "instant" });
    // Keep this page's staggered rise off for good (the page moves as one), then free main for the next switch.
    el.querySelector<HTMLElement>(":scope > .page-in")?.setAttribute("data-still", "");
    delete el.dataset.flow;
    const old = el.getAnimations();
    if (reduced()) {
      old.forEach((a) => a.cancel());
      return;
    }
    el.animate(
      [
        { transform: `translateY(${dir === "down" ? SHIFT : `-${SHIFT}`})`, opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: IN_MS, easing: EASE_OUT },
    );
    old.forEach((a) => a.cancel());
  }, []);

  useEffect(() => {
    if (!next && !prev) return;
    if (next) router.prefetch(next.href);
    if (prev) router.prefetch(prev.href);
    leaving.current = false;
    acc.current = { down: 0, up: 0 };
    const mountedAt = performance.now();
    let last = 0;
    let armed = false;

    const atEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const atTop = () => window.scrollY <= 0;
    const show = () => {
      setDown(acc.current.down / PULL);
      setUp(acc.current.up / PULL);
    };
    const clear = () => {
      if (!acc.current.down && !acc.current.up) return;
      acc.current = { down: 0, up: 0 };
      show();
    };
    const settle = () => {
      if (idle.current) clearTimeout(idle.current);
      idle.current = setTimeout(clear, 600);
    };
    const go = (to: Tab, dir: Flow) => {
      leaving.current = true;
      flow = dir;
      const el = main();
      if (!el || reduced()) {
        router.push(to.href, { scroll: false });
        return;
      }
      el.dataset.flow = dir;
      el.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: `translateY(${dir === "down" ? `-${SHIFT}` : SHIFT})`, opacity: 0 },
        ],
        { duration: OUT_MS, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
      );
      // Timed rather than chained to the animation, so a paused timeline (a background tab) can't strand the switch.
      setTimeout(() => router.push(to.href, { scroll: false }), OUT_MS);
    };
    const push = (d: number) => {
      if (leaving.current) return;
      const now = performance.now();
      // Ignore the gesture that brought us here: arm once input pauses for a beat.
      if (!armed) {
        const quiet = now - last > 220 && now - mountedAt > 450;
        last = now;
        if (!quiet) return;
        armed = true;
      }
      last = now;
      if (d > 0 && next && atEnd()) {
        acc.current = { down: Math.min(PULL, acc.current.down + d), up: 0 };
        show();
        settle();
        if (acc.current.down >= PULL) go(next, "down");
      } else if (d < 0 && prev && atTop()) {
        acc.current = { down: 0, up: Math.min(PULL, acc.current.up - d) };
        show();
        settle();
        if (acc.current.up >= PULL) go(prev, "up");
      } else {
        clear();
      }
    };
    const onWheel = (e: WheelEvent) => push(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
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
  }, [next, prev, router]);

  return (
    <>
      {prev ? (
        <div
          aria-hidden="true"
          className={`scroll-prev pointer-events-none fixed left-1/2 top-3 z-40 -translate-x-1/2 rounded-full bg-surface-2 px-4 pb-2 pt-1.5 text-small text-ink-2 shadow-[var(--shadow)] transition-opacity duration-200 motion-reduce:transition-none ${
            up > 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>
            ↑ Keep scrolling for <span className="font-medium text-ink">{prev.label}</span>
          </span>
          <span className="mt-1.5 block h-px w-full bg-[var(--rule)]">
            <span className="block h-px bg-ink transition-[width] duration-150 ease-out motion-reduce:transition-none" style={{ width: `${up * 100}%` }} />
          </span>
        </div>
      ) : null}
      {next ? (
        <div className="scroll-next mt-20 border-t border-[var(--rule)] pt-6">
          <Link href={next.href} className="group flex items-center justify-between gap-4 text-small text-ink-2">
            <span>
              {down > 0 ? "Keep scrolling for " : "Next: "}
              <span className="font-medium text-ink">{next.label}</span>
            </span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </Link>
          <div aria-hidden="true" className="mt-3 h-px w-full bg-[var(--rule)]">
            <div className="h-px bg-ink transition-[width] duration-150 ease-out motion-reduce:transition-none" style={{ width: `${down * 100}%` }} />
          </div>
        </div>
      ) : null}
    </>
  );
}
