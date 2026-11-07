"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "../proto/ThemeToggle";
import { BASE } from "@/lib/base";

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
            src={`${BASE}/case/${step.video}-${theme}.mp4`}
            poster={`${BASE}/case/${step.video}-${theme}.jpg`}
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

/**
 * The walkthrough as one step after another. On wide screens each step is a
 * row like the chapters around it: its title and text on the left (the first
 * also carries the introduction and the Pause button), its recording on the
 * right. Below 1024px the text sits above each recording. The chapter timeline beside the case
 * study already shows where you are, so this section has no stepper of its
 * own. Each recording plays while it is on screen; recordings start paused for
 * anyone who asks for reduced motion, and a Pause button stops them for
 * everyone else.
 */
export function ScrollSteps({ id, kicker, title, intro, steps }: { id: string; kicker: string; title: string; intro: string; steps: Step[] }) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  const [inView, setInView] = useState<boolean[]>(() => steps.map(() => false));
  const items = useRef<(HTMLDivElement | null)[]>([]);

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
      </div>

      <div className="mt-10 space-y-16 lg:mt-12 lg:space-y-24">
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-i={i}
            className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-16"
          >
            <div className="lg:col-span-5">
              {i === 0 ? (
                <div className="mb-10">
                  <p className="text-[17px] leading-relaxed text-ink-2">{intro}</p>
                  <div className="mt-6">{pause}</div>
                </div>
              ) : null}
              <h3 className="flex items-baseline gap-2.5 text-xl font-medium leading-snug">
                <span aria-hidden="true" className="relative -top-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-ink" />
                {s.title}
              </h3>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-ink-2">{s.body}</p>
            </div>
            <figure className="min-w-0 lg:col-span-7">
              <figcaption className="sr-only">{s.alt}</figcaption>
              <StepVideo step={s} playing={playing && inView[i]} />
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
