"use client";

import Link from "next/link";
import { PULSE } from "@/content/ask";
import type { LiveAccount } from "./store";

const W = 760;
const H = 420;
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
  const today = Date.parse("2026-11-12");
  const pts = accounts.map((a) => {
    const days = Math.round((Date.parse(a.renewalDate) - today) / 864e5);
    const t = trendOf(a.id);
    return { a, days, t, x: X(days), y: Y(t.isNew ? 55 : t.pct), r: 6 + Math.sqrt(a.stores) * 1.6 };
  });
  const tone = (h: string) => (h === "At risk" ? "var(--risk)" : h === "Needs a look" ? "var(--warn)" : "var(--good)");
  const icon = (h: string) => (h === "At risk" ? "\u25A0" : h === "Needs a look" ? "\u25B2" : "\u25CF");
  const xTicks = [0, 90, 180, 270, 365];
  const yTicks = [60, 30, 0, -30, -60];
  const watch = pts.filter((p) => p.days <= 120 && !p.t.isNew && p.t.pct < 0);

  return (
    <section aria-labelledby="h-map" className="proto-card mt-6 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-map" className="text-h3 font-semibold">
          {watch.length} {watch.length === 1 ? "account renews" : "accounts renew"} soon while usage falls
        </h2>
        <p className="font-mono text-meta tracking-wide text-ink-2">RENEWAL × 8 WEEK USAGE TREND · SIZE = STORES</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="group" aria-label="Portfolio map: days to renewal against usage trend">
        <rect x={L} y={Y(0)} width={X(120) - L} height={Y(-60) - Y(0)} fill="var(--risk)" fillOpacity="0.07" />
        <text x={L + 8} y={Y(0) + 18} fontSize="11.5" fill="var(--risk)" className="font-mono">
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
        {pts.map((p) => {
          const right = p.x < W - 200;
          const label = `${p.a.name}: ${p.a.health}, renews in ${p.days} days, usage ${p.t.isNew ? "new and ramping" : `${p.t.pct >= 0 ? "up" : "down"} ${Math.abs(p.t.pct)}%`}, ${p.a.stores} stores`;
          return (
            <Link key={p.a.id} href={`/prototype/accounts/${p.a.id}`} aria-label={label} className="map-dot">
              <circle className="bubble-in" style={{ animationDelay: `${pts.indexOf(p) * 90}ms` }} cx={p.x} cy={p.y} r={p.r} fill={tone(p.a.health)} fillOpacity="0.18" stroke={tone(p.a.health)} strokeWidth="1.5" />
              <text x={right ? p.x + p.r + 6 : p.x - p.r - 6} y={p.y - 2} textAnchor={right ? "start" : "end"} fontSize="12.5" fontWeight="600" fill="var(--ink)">
                {p.a.name}
              </text>
              <text x={right ? p.x + p.r + 6 : p.x - p.r - 6} y={p.y + 13} textAnchor={right ? "start" : "end"} fontSize="11" fill="var(--ink-2)" className="font-mono">
                {icon(p.a.health)} {p.a.health.toUpperCase()} · {p.t.isNew ? "NEW" : `${p.t.pct >= 0 ? "+" : "\u2212"}${Math.abs(p.t.pct)}%`}
              </text>
              <title>{label}</title>
            </Link>
          );
        })}
      </svg>
      <p className="mt-2 text-small text-ink-2">
        New accounts sit at the top while they ramp up. Select a bubble to open the account. The same data is in the table below.
      </p>
    </section>
  );
}
