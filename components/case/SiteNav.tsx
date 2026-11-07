"use client";

import { useEffect, useState } from "react";

/**
 * The aaditirokade.com nav on the case study (decision 0052), so a reader can get back to the portfolio in one click.
 * Same shape as the site: "AR" on the left, Gallery and Resume on the right, and a floating pill once the page scrolls.
 * Groundwork is its own app served under /groundwork, so these are plain links that leave this app for the site's pages.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-40 px-4">
      <nav aria-label="Site" className={`site-nav-bar mx-auto flex items-center justify-between ${scrolled ? "is-pill" : ""}`}>
        <div className="group relative">
          {/* The site's home page lives outside this app's /groundwork base path, so next/link would point back into Groundwork. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="site-nav-home">
            AR<span className="sr-only">, Aaditi Rokade, home</span>
          </a>
          {/* The site's moon phases, unfurling on hover */}
          <div aria-hidden="true" className="site-nav-moons">
            {["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"].map((moon, i) => (
              <span key={moon} style={{ opacity: 1 - i * 0.06 }}>
                {moon}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-small font-medium sm:gap-6">
          <a href="/work" className="site-nav-link">
            Gallery
          </a>
          <a href="/resume" className="site-nav-link">
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
