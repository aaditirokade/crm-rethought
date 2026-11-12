"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "../proto/ThemeToggle";
import { BASE } from "@/lib/base";

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
  priority = false,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  phone?: boolean;
  /** The page's first visual: its still loads first and eagerly. */
  priority?: boolean;
}) {
  const theme = useTheme();
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(reduceQuery).matches, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  const video = useRef<HTMLVideoElement>(null);
  const id = `demo-${name}`;
  // The recording fades in over its still once it has a frame to show, so the frame is never an empty or black box.
  const [ready, setReady] = useState<string | null>(null);

  // Autoplay is decided after hydration (reduced motion and the theme are only known in the browser), so start it here.
  useEffect(() => {
    const v = video.current;
    if (v && playing) void v.play().catch(() => {});
  }, [playing, theme]);

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
        {/* Both stills are in the first HTML; the page's theme (set before paint) shows the right one at once. */}
        {(["light", "dark"] as const).map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t}
            src={`${BASE}/case/${name}-${t}.jpg`}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            className={`case-demo-still is-${t}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        ))}
        {theme ? (
          <video
            key={theme}
            ref={video}
            src={`${BASE}/case/${name}-${theme}.mp4`}
            width={width}
            height={height}
            muted
            loop
            playsInline
            autoPlay={playing}
            preload={playing || priority ? "auto" : "metadata"}
            className={ready === theme ? "is-ready" : ""}
            onLoadedData={() => setReady(theme)}
            onPlaying={() => setReady(theme)}
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
