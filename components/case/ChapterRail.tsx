"use client";

import { useEffect, useState } from "react";

export type Chapter = { id: string; label: string };

/**
 * A thin timeline beside the case study, one dot per chapter. The dot for the
 * chapter on screen fills in as the page scrolls, and each label jumps to its
 * chapter. `id` is the chapter heading's id; the rail watches the section
 * around it. Wide screens only; narrower screens read straight down.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [current, setCurrent] = useState(chapters[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).dataset.chapter ?? "");
      },
      // A chapter counts as current while it crosses a line 40% of the way down the screen.
      { rootMargin: "-40% 0px -59% 0px" },
    );
    for (const c of chapters) {
      const section = document.getElementById(c.id)?.closest("section");
      if (section) {
        section.dataset.chapter = c.id;
        io.observe(section);
      }
    }
    return () => io.disconnect();
  }, [chapters]);

  const at = chapters.findIndex((c) => c.id === current);

  return (
    <nav aria-label="Chapters" className="hidden xl:block">
      <ol className="sticky top-10 pt-16">
        {chapters.map((c, i) => {
          const on = i === at;
          return (
            <li key={c.id} className="relative pb-5 pl-5 last:pb-0">
              {i < chapters.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-[2.75px] top-[18px] w-[0.5px] transition-colors duration-500 ${i < at ? "bg-ink" : "bg-[var(--rule)]"}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[8px] h-[6px] w-[6px] rounded-full border-[0.5px] transition-[background-color,border-color,transform] duration-300 motion-reduce:transition-none ${
                  i <= at ? "border-ink bg-ink" : "border-[var(--line-strong)] bg-bg"
                } ${on ? "scale-[1.5]" : ""}`}
              />
              <a
                href={`#${c.id}`}
                aria-current={on ? "location" : undefined}
                className={`block text-small leading-snug transition-colors duration-300 ${on ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}`}
              >
                {c.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
