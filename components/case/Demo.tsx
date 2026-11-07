"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "../proto/ThemeToggle";

/**
 * A short, looping recording of the prototype at 2x, in the theme the page is showing.
 * Videos stay sharp where GIFs blur, and weigh a fraction as much. A Pause button stops it on a still frame,
 * and anyone who asks the system for reduced motion gets the still frame until they press Play.
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
  const theme = useTheme();
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  const video = useRef<HTMLVideoElement>(null);
  const id = `demo-${name}`;

  const toggle = () => {
    const v = video.current;
    if (v) {
      if (playing) v.pause();
      else void v.play();
    }
    setChoice(!playing);
  };

  return (
    <figure className={`case-demo ${phone ? "is-phone" : ""}`} aria-labelledby={id}>
      <figcaption id={id} className="sr-only">
        {alt}
      </figcaption>
      <div className="case-demo-frame" style={{ aspectRatio: `${width} / ${height}` }}>
        {theme ? (
          <video
            key={theme}
            ref={video}
            src={`/case/${name}-${theme}.mp4`}
            poster={`/case/${name}-${theme}.jpg`}
            width={width}
            height={height}
            muted
            loop
            playsInline
            autoPlay={playing}
            preload={playing ? "auto" : "none"}
            aria-hidden="true"
          />
        ) : null}
        <button type="button" className="case-demo-btn" aria-pressed={!playing} aria-label={`${playing ? "Pause" : "Play"} the recording`} onClick={toggle}>
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
          <span aria-hidden="true">{playing ? "Pause" : "Play"}</span>
        </button>
      </div>
    </figure>
  );
}
