"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * A looping GIF of the prototype, in the theme the page is showing. A pause button swaps it for a still frame,
 * and anyone who asks the system for reduced motion gets the still frame first.
 */
const reduceQuery = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(reduceQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export function Demo({
  name,
  alt,
  width,
  height,
  phone = false,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  phone?: boolean;
}) {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  const ext = playing ? "gif" : "png";

  return (
    <figure className={`case-demo ${phone ? "is-phone" : ""}`}>
      <div className="case-demo-frame">
        {/* Only the image for the theme on screen is shown, and lazy images that aren't shown aren't fetched. */}
        {/* Plain img on purpose: next/image would serve these GIFs unoptimized anyway, and must not swap the animation for a still. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="only-light" src={`/case/${name}-light.${ext}`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="only-dark" src={`/case/${name}-dark.${ext}`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        <button type="button" className="case-demo-btn" aria-pressed={!playing} onClick={() => setChoice(!playing)}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect x="2" y="1.5" width="3.5" height="11" rx="1" fill="currentColor" />
              <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.4-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" fill="currentColor" />
            </svg>
          )}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>
    </figure>
  );
}
