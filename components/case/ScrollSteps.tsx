"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "../proto/ThemeToggle";

export type Step = {
  title: string;
  body: string;
  /** Recording name in /public/case, without the theme suffix. */
  video: string;
  width: number;
  height: number;
  /** What the recording shows, for screen readers. */
  alt: string;
  phone?: boolean;
};

const reduceQuery = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(reduceQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/** A muted, looping recording in the current theme that plays only while `playing`. */
function StepVideo({ step, playing, rewindOn }: { step: Step; playing: boolean; rewindOn?: number }) {
  const theme = useTheme();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing, theme]);
  useEffect(() => {
    const v = ref.current;
    if (v && rewindOn !== undefined) v.currentTime = 0;
  }, [rewindOn]);
  return (
    <div className={`case-demo ${step.phone ? "is-phone" : ""}`}>
      <div className="case-demo-frame" style={{ aspectRatio: `${step.width} / ${step.height}` }}>
        {theme ? (
          <video
            key={theme}
            ref={ref}
            src={`/case/${step.video}-${theme}.mp4`}
            poster={`/case/${step.video}-${theme}.jpg`}
            width={step.width}
            height={step.height}
            muted
            loop
            playsInline
            preload={playing ? "auto" : "metadata"}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}

/** How much page scroll each step gets while the walkthrough is pinned. */
const STEP_SVH = 75;

/**
 * A walkthrough pinned to the screen while the page scrolls: the stepper on
 * the left moves to the next step as you scroll, and the recording on the
 * right switches with it. Steps can also be picked directly. Below 1024px it
 * becomes a plain list, each recording playing while it is in view.
 * Recordings start paused for anyone who asks for reduced motion, and a
 * Pause button stops them for everyone else.
 */
export function ScrollSteps({ id, kicker, title, intro, steps }: { id: string; kicker: string; title: string; intro: string; steps: Step[] }) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState<boolean[]>(() => steps.map(() => false));
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  // The step whose slice of the pinned scroll crosses the middle of the screen is the current one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sentinels.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);

  // On narrow screens each recording plays while it is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        setInView((prev) => {
          const next = [...prev];
          for (const e of entries) next[Number((e.target as HTMLElement).dataset.i)] = e.isIntersecting;
          return next;
        }),
      { threshold: 0.5 },
    );
    items.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);

  function go(i: number) {
    const el = sentinels.current[i];
    if (!el) return;
    setActive(i);
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5 + 8;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  const pause = (
    <button type="button" onClick={() => setChoice(!playing)} className="sig-btn inline-flex min-h-11 items-center gap-2 text-small font-medium">
      <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full border border-[var(--rule)] text-[10px]">
        {playing ? "❚❚" : "▶"}
      </span>
      {playing ? "Pause the recordings" : "Play the recordings"}
    </button>
  );

  return (
    <section aria-labelledby={id} className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-meta tracking-wide text-accent">{kicker.toUpperCase()}</p>
        <h2 id={id} className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
          {title}
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-2">{intro}</p>
      </div>

      {/* Wide screens: pinned while the page scrolls past one slice per step */}
      <div className="relative mt-10 hidden lg:block" style={{ height: `${steps.length * STEP_SVH + 30}svh` }}>
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
            data-i={i}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0"
            style={{ top: `${i * STEP_SVH}svh`, height: `${STEP_SVH}svh` }}
          />
        ))}
        <div className="sticky top-6 grid h-[calc(100svh-3rem)] grid-cols-12 items-center gap-16">
          <div className="col-span-4">
            <ol>
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.title} className="relative pb-5 pl-6 last:pb-0">
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-0 left-[2.75px] top-[22px] w-[0.5px] transition-colors duration-500 ${i < active ? "bg-ink" : "bg-[var(--rule)]"}`}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-[11px] h-[6px] w-[6px] rounded-full border-[0.5px] transition-[background-color,border-color,transform] duration-300 ${
                        i <= active ? "border-ink bg-ink" : "border-[var(--line-strong)] bg-bg"
                      } ${on ? "scale-[1.5]" : ""}`}
                    />
                    <button type="button" onClick={() => go(i)} aria-current={on ? "step" : undefined} className="group block text-left">
                      <span className={`block text-xl font-medium leading-snug transition-colors duration-300 ${on ? "" : "text-ink-2 group-hover:text-ink"}`}>
                        {s.title}
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none ${
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="max-w-[36ch] overflow-hidden pt-2 leading-relaxed text-ink-2">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-8">{pause}</div>
          </div>
          <div className="col-span-8 grid min-w-0 items-center">
            {steps.map((s, i) => (
              <figure
                key={s.title}
                aria-hidden={i !== active}
                className={`min-w-0 transition-opacity duration-500 [grid-area:1/1] motion-reduce:transition-none ${
                  i === active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <figcaption className="sr-only">{s.alt}</figcaption>
                <StepVideo step={s} playing={playing && i === active} rewindOn={i === active ? i : -1} />
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Phones and tablets: one step after another */}
      <div className="mt-8 lg:hidden">{pause}</div>
      <ol className="mt-8 space-y-14 lg:hidden">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-i={i}
          >
            <h3 className="flex items-baseline gap-2.5 text-xl font-medium leading-snug">
              <span aria-hidden="true" className="relative -top-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-ink" />
              {s.title}
            </h3>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-ink-2">{s.body}</p>
            <figure className="mt-5">
              <figcaption className="sr-only">{s.alt}</figcaption>
              <StepVideo step={s} playing={playing && inView[i]} />
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
