import type { Metadata } from "next";
import Link from "next/link";
import { BACKGROUNDS, COLORS, type ColorToken } from "@/content/tokens";
import { contrast } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Design tokens · CRM Rethought",
  description: "Canvas, the design system for CRM Rethought: color with contrast checks, type, space, shape and the signature components.",
};

const PRINCIPLES = [
  ["Space, not boxes", "Sections are grouped by space and type on one canvas. Only things you act on lift off the page."],
  ["The AI has a material", "Anything the AI drafted carries a soft violet tint and edge. Approval turns it into plain ink, stamped with who and when."],
  ["Ink means decide", "Approve and other decisions are solid ink buttons. Violet belongs to the AI; ink belongs to the person."],
  ["Never color alone", "Every status pairs color with a word. A risk is red and says why."],
];

const TYPE = [
  { name: "h1", spec: "34 / 40 · Geist 600", cls: "text-h1 font-semibold", sample: "Fernhill Outfitters" },
  { name: "h2", spec: "22 / 30 · Geist 600", cls: "text-h2 font-semibold", sample: "What changed since Oct 14" },
  { name: "h3", spec: "17 / 24 · Geist 600", cls: "text-h3 font-semibold", sample: "Promises still open" },
  { name: "body", spec: "15 / 24 · Geist 400", cls: "text-body", sample: "Sam Reyes asked for pricing on 12 new stores opening in the spring." },
  { name: "small", spec: "13.5 / 21 · Geist 400", cls: "text-small text-ink-2", sample: "Quarterly review · Today, 10:00 · 45 min" },
  { name: "label", spec: "12 / 18 · Geist 500, tabular", cls: "font-mono text-meta tracking-wide text-ink-2", sample: "EMAIL · NOV 3 · CONFIDENCE MEDIUM" },
];

const SPACE = [4, 8, 12, 16, 24, 32, 48];

function worst(t: ColorToken, mode: "light" | "dark") {
  const b = BACKGROUNDS[mode];
  const v = mode === "light" ? t.light : t.dark;
  if (t.check === "on-accent") return { ratio: contrast(v, b.accent), need: 4.5, what: "on accent" };
  if (t.check === "border") {
    const r = Math.min(contrast(v, b.bg), contrast(v, b.surface), contrast(v, b.surface2));
    return { ratio: r, need: 3, what: "lowest of bg, surface, surface-2" };
  }
  if (t.check === "text") {
    const r = Math.min(contrast(v, b.bg), contrast(v, b.surface), contrast(v, b.surface2), contrast(v, b.draft));
    return { ratio: r, need: 4.5, what: "lowest of all four backgrounds" };
  }
  return null;
}

function Cell({ t, mode }: { t: ColorToken; mode: "light" | "dark" }) {
  const v = mode === "light" ? t.light : t.dark;
  const w = worst(t, mode);
  return (
    <td className="px-3 py-2 align-top">
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded border border-line" style={{ background: v }} />
        <span className="font-mono text-meta">{v}</span>
      </span>
      {w ? (
        <span className={`mt-1 block font-mono text-meta ${w.ratio >= w.need ? "text-ink-2" : "text-risk"}`}>
          {w.ratio}:1 {w.ratio >= w.need ? "pass" : "FAIL"} <span className="sr-only">({w.what}, needs {w.need}:1)</span>
        </span>
      ) : null}
    </td>
  );
}

export default function Tokens() {
  return (
    <main className="sig mx-auto max-w-5xl px-4 py-10">
      <p className="text-small text-ink-2">
        <Link href="/directions" className="underline underline-offset-4">
          Visual directions
        </Link>{" "}
        / Tokens
      </p>
      <h1 className="mt-2 text-h1 font-semibold">Canvas</h1>
      <p className="mt-2 max-w-2xl text-ink-2">
        The design system for CRM Rethought (decision 0017), replacing Signal&rsquo;s boxed look. A warm canvas, one
        friendly face (Geist), soft lifted cards only where you act, and a violet material for anything the AI drafted.
        Every ratio on this page is computed from the token values.
      </p>

      <section aria-labelledby="h-principles" className="mt-10">
        <h2 id="h-principles" className="text-h2 font-semibold">
          Principles
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="mt-1 text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="h-color" className="mt-12">
        <h2 id="h-color" className="text-h2 font-semibold">
          Color
        </h2>
        <p className="mt-1 text-small text-ink-2">
          Text tokens show their lowest ratio across bg, surface, surface-2 and draft. AA needs 4.5:1 for text and 3:1
          for control borders.
        </p>
        <div
          className="relative mt-4 overflow-x-auto rounded-2xl border border-line bg-surface"
          role="region"
          aria-label="Color tokens table"
          tabIndex={0}
        >
          <table className="w-full min-w-[40rem] text-left text-small">
            <caption className="sr-only">Color tokens with light and dark values and contrast</caption>
            <thead className="border-b border-line">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Token</th>
                <th scope="col" className="px-3 py-2 font-semibold">Role</th>
                <th scope="col" className="px-3 py-2 font-semibold">Light</th>
                <th scope="col" className="px-3 py-2 font-semibold">Dark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COLORS.map((t) => (
                <tr key={t.name}>
                  <th scope="row" className="px-3 py-2 align-top font-mono text-meta font-medium">
                    {t.name}
                  </th>
                  <td className="px-3 py-2 align-top text-ink-2">{t.role}</td>
                  <Cell t={t} mode="light" />
                  <Cell t={t} mode="dark" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-type" className="mt-12">
        <h2 id="h-type" className="text-h2 font-semibold">
          Type
        </h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {TYPE.map((t) => (
            <li key={t.name} className="grid gap-1 py-3 sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-baseline">
              <span className="font-mono text-meta text-ink-2">
                {t.name} · {t.spec}
              </span>
              <span className={t.cls}>{t.sample}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-space" className="mt-12">
        <h2 id="h-space" className="text-h2 font-semibold">
          Space and shape
        </h2>
        <p className="mt-1 text-small text-ink-2">A 4px grid. Corners: pills for controls and chips, 12 to 20px for cards. Soft shadows lift what you act on; hairlines are rare.</p>
        <ul className="mt-4 flex flex-wrap items-end gap-5">
          {SPACE.map((n) => (
            <li key={n} className="flex flex-col items-center gap-1">
              <span aria-hidden="true" className="block bg-ink-2" style={{ width: n, height: n }} />
              <span className="font-mono text-meta text-ink-2">{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-components" className="mt-12">
        <h2 id="h-components" className="text-h2 font-semibold">
          Signature components
        </h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="text-h3 font-semibold">Source chip and tags</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="sig-source">
                <b>EMAIL</b> Nov 3
              </span>
              <span className="sig-source">
                <b>CALL</b> 12:05
              </span>
              <span className="sig-source">
                <b>TICKET</b> 4821
              </span>
              <span className="sig-draft-tag">DRAFT</span>
              <span className="sig-approved-tag">{"✓"} APPROVED 10:44</span>
            </div>
            <h3 className="mt-6 text-h3 font-semibold">Buttons</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="sig-btn sig-btn-primary">
                Approve
              </button>
              <button type="button" className="sig-btn">
                Edit
              </button>
              <button type="button" className="sig-btn">
                Not right
              </button>
            </div>
            <h3 className="mt-6 text-h3 font-semibold">Status, never color alone</h3>
            <ul className="mt-3 space-y-1 text-small">
              <li className="text-good">{"●"} Healthy · usage steady</li>
              <li className="text-warn">{"▲"} Needs a look · champion left</li>
              <li className="text-risk">{"■"} At risk · no reply in 21 days</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="text-h3 font-semibold">Draft, then approved</h3>
            <div className="sig-row-draft mt-3 rounded-xl p-3">
              <span className="sig-draft-tag">DRAFT</span>
              <p className="mt-1.5">Lena Ortiz, your day to day contact, has left Fernhill.</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="sig-source">
                  <b>EMAIL</b> Nov 3
                </span>
                <span className="font-mono text-meta text-ink-2">CONFIDENCE MEDIUM</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" className="sig-btn sig-btn-primary">
                  Approve
                </button>
                <button type="button" className="sig-btn">
                  Not right
                </button>
              </div>
            </div>
            <div className="mt-3 rounded-xl p-3">
              <span className="sig-approved-tag">{"✓"} APPROVED BY DANIEL · NOV 12 10:44</span>
              <p className="mt-1.5">Fernhill will renew all 40 stores on Jan 25.</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="sig-source">
                  <b>CALL</b> 12:05
                </span>
                <span className="font-mono text-meta text-ink-2">CONFIDENCE HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
