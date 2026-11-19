"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PULSE } from "@/content/ask";
import { AccountDrawer } from "./AccountDrawer";
import type { LiveAccount } from "./store";

const W = 760;
const H = 380;
const L = 64;
const R = 24;
const T = 24;
const B = 52;
const X = (days: number) => L + (Math.min(days, 365) / 365) * (W - L - R);
const Y = (pct: number) => T + ((60 - Math.max(-60, Math.min(60, pct))) / 120) * (H - T - B);

export function trendOf(id: string) {
  const s = PULSE[id] ?? [];
  const first = s.find((v) => v > 0) ?? 0;
  const last = s.at(-1) ?? 0;
  return { isNew: s[0] === 0, pct: first ? Math.round(((last - first) / first) * 100) : 0 };
}

/**
 * The portfolio at a glance: how soon each account renews against where its usage is heading.
 * Renewing soon and falling is the corner to watch. Bubble size is store count.
 */
export function PortfolioMap({ accounts }: { accounts: LiveAccount[] }) {
  const svg = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const today = Date.parse("2026-11-12");
  const pts = accounts.map((a) => {
    const days = Math.round((Date.parse(a.renewalDate) - today) / 864e5);
    const t = trendOf(a.id);
    return { a, days, t, x: X(days), y: Y(t.isNew ? 55 : t.pct), r: 6 + Math.sqrt(a.stores) * 1.6 };
  });
  // Solid, bright health colors for the marks (decision 0119); text stays in ink, so the labels carry the meaning too.
  const tone = (h: string) => (h === "At risk" ? "var(--viz-risk)" : h === "Needs a look" ? "var(--viz-warn)" : "var(--viz-good)");
  const icon = (h: string) => (h === "At risk" ? "\u25A0" : h === "Needs a look" ? "\u25B2" : "\u25CF");
  const xTicks = [0, 90, 180, 270, 365];
  const yTicks = [60, 30, 0, -30, -60];
  const watch = pts.filter((p) => p.days <= 120 && !p.t.isNew && p.t.pct < 0);

  return (
    <section aria-labelledby="h-map" className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-map" className="text-h3 font-semibold">
          {watch.length} {watch.length === 1 ? "account renews" : "accounts renew"} soon while usage falls
        </h2>
        <p className="font-mono text-meta tracking-wide text-ink-2">RENEWAL × 8 WEEK USAGE TREND · SIZE = STORES</p>
      </div>
      <div className="relative mt-3 w-full max-w-[920px]">
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="group"
        aria-label="Portfolio map: days to renewal against usage trend"
        onPointerMove={(e) => {
          const el = svg.current;
          const m = el?.getScreenCTM();
          if (!el || !m) return;
          const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
          setCursor(pt.x >= L && pt.x <= W - R && pt.y >= T && pt.y <= H - B ? pt.x : null);
        }}
        onPointerLeave={() => setCursor(null)}
      >
        <rect x={L} y={Y(0)} width={X(120) - L} height={Y(-60) - Y(0)} rx="10" fill="var(--accent)" fillOpacity="0.08" />
        <text x={L + 8} y={Y(0) + 18} fontSize="11.5" fill="var(--accent)" className="font-mono">
          RENEWING SOON AND FALLING
        </text>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke={v === 0 ? "var(--line-strong)" : "var(--line)"} />
            <text x={L - 8} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-2)" className="font-mono">
              {v > 0 ? `+${v}%` : `${v}%`}
            </text>
          </g>
        ))}
        {xTicks.map((d) => (
          <text key={d} x={X(d)} y={H - B + 18} textAnchor="middle" fontSize="11" fill="var(--ink-2)" className="font-mono">
            {d === 0 ? "TODAY" : `${d}D`}
          </text>
        ))}
        <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize="11.5" fill="var(--ink-2)">
          Days until renewal
        </text>
        <text x={14} y={(T + H - B) / 2} textAnchor="middle" fontSize="11.5" fill="var(--ink-2)" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>
          Usage, last 8 weeks
        </text>
        {/* A dotted line follows the pointer across the plot, with the day it marks (decision 0122). */}
        {cursor !== null ? (
          <g aria-hidden="true" className="pointer-events-none">
            <line x1={cursor} x2={cursor} y1={T} y2={H - B} stroke="var(--ink-2)" strokeWidth="1" strokeDasharray="2 4" />
            <rect x={cursor - 22} y={H - B - 20} width="44" height="17" rx="8.5" fill="var(--surface)" stroke="var(--line)" />
            <text x={cursor} y={H - B - 8} textAnchor="middle" fontSize="11" fill="var(--ink)" className="font-mono">
              {Math.round(((cursor - L) / (W - L - R)) * 365)}D
            </text>
          </g>
        ) : null}
        {pts.map((p) => {
          const right = p.x < W - 200;
          const label = `${p.a.name}: ${p.a.health}, renews in ${p.days} days, usage ${p.t.isNew ? "new and ramping" : `${p.t.pct >= 0 ? "up" : "down"} ${Math.abs(p.t.pct)}%`}, ${p.a.stores} stores`;
          return (
            <Link
              key={p.a.id}
              href={`/prototype/accounts/${p.a.id}`}
              aria-label={label}
              className="map-dot"
              onPointerEnter={() => setTip(p.a.id)}
              onPointerLeave={() => setTip(null)}
              onFocus={() => setTip(p.a.id)}
              onBlur={() => setTip(null)}
              onClick={(e) => {
                // A plain click opens the side panel; a click that asks for a new tab still follows the link.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                setTip(null);
                setOpen(p.a.id);
              }}
            >
              <circle className="bubble-in" style={{ animationDelay: `${pts.indexOf(p) * 90}ms` }} cx={p.x} cy={p.y} r={p.r} fill={tone(p.a.health)} stroke="var(--bg)" strokeWidth="2" />
              <text x={right ? p.x + p.r + 6 : p.x - p.r - 6} y={p.y - 2} textAnchor={right ? "start" : "end"} fontSize="12.5" fontWeight="600" fill="var(--ink)">
                {p.a.name}
              </text>
              <text x={right ? p.x + p.r + 6 : p.x - p.r - 6} y={p.y + 13} textAnchor={right ? "start" : "end"} fontSize="11" fill="var(--ink-2)" className="font-mono">
                <tspan fill={tone(p.a.health)}>{icon(p.a.health)}</tspan> {p.a.health.toUpperCase()} · {p.t.isNew ? "NEW" : `${p.t.pct >= 0 ? "+" : "\u2212"}${Math.abs(p.t.pct)}%`}
              </text>
            </Link>
          );
        })}
      </svg>
      {/* The numbers behind a bubble, on hover or focus (decision 0122). The link's own label already says them. */}
      {(() => {
        const p = pts.find((q) => q.a.id === tip);
        if (!p) return null;
        const left = (p.x / W) * 100;
        // Above the bubble, or below it when the bubble sits near the top of the chart.
        const below = p.y < H * 0.45;
        const top = ((below ? p.y + p.r : p.y - p.r) / H) * 100;
        return (
          <div
            aria-hidden="true"
            className={`map-tip ${below ? "is-below" : ""}`}
            style={{ left: `${left}%`, top: `${top}%`, ["--shift" as string]: left > 70 ? "-92%" : left < 25 ? "-8%" : "-50%" }}
          >
            <p className="font-semibold">{p.a.name}</p>
            <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5">
              <dt className="text-ink-2">Health</dt>
              <dd>{p.a.health}</dd>
              <dt className="text-ink-2">Renews</dt>
              <dd>
                {p.a.renewal} · in {p.days} days
              </dd>
              <dt className="text-ink-2">Usage, 8 weeks</dt>
              <dd>{p.t.isNew ? "New, ramping up" : `${p.t.pct >= 0 ? "+" : "\u2212"}${Math.abs(p.t.pct)}%`}</dd>
              <dt className="text-ink-2">Stores</dt>
              <dd>{p.a.stores}</dd>
            </dl>
          </div>
        );
      })()}
      </div>
      {open ? <AccountDrawer id={open} onClose={() => setOpen(null)} /> : null}
      <p className="mt-2 text-small text-ink-2">
        New accounts sit at the top while they ramp up. Select a bubble to see the account. The same data is in the table below.
      </p>
    </section>
  );
}
