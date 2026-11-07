/**
 * Small tabs above the case study's title for moving between the public case studies on aaditirokade.com
 * (decision 0054). Same order as the circles on the site's home page. Firstword lives on the site, outside
 * this app's /groundwork base path, so both are plain links.
 */
const TABS = [
  { key: "groundwork", label: "Case study I", name: "Groundwork", href: "/groundwork" },
  { key: "firstword", label: "Case study II", name: "Firstword", href: "/firstword" },
] as const;

export function CaseStudyTabs({ current }: { current: (typeof TABS)[number]["key"] }) {
  return (
    <nav aria-label="Case studies" className="mb-10 text-[12px] font-medium uppercase leading-[18px] tracking-[0.14em]">
      <ul className="flex items-center gap-4">
        {TABS.map((t, i) => (
          <li key={t.key} className="flex items-center gap-4">
            {i > 0 ? <span aria-hidden="true" className="h-3.5 w-px bg-[var(--line-strong)]" /> : null}
            <a href={t.href} aria-current={t.key === current ? "page" : undefined} className="site-nav-link case-tab">
              {t.label}
              <span className="sr-only">: {t.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
