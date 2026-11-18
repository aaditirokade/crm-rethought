import { useId } from "react";

/**
 * The glass leaves (decision 0119): broad, see-through blades fanning up from a corner, in periwinkle, lavender,
 * rose quartz pink and peach, each with a white rib and two fine veins. Pure decoration, hidden from assistive tech.
 *
 * Drawn from a seed, so the server and the browser draw the same picture, and each place in the app gets its own
 * arrangement while the whole app reads as one material. Sits behind content: give the parent `relative isolate`
 * and `overflow-hidden`.
 */
type Props = {
  /** Which arrangement to draw; any number. */
  seed?: number;
  /** How many leaves. */
  count?: number;
  /** The corner they grow from. */
  from?: "bottom-right" | "bottom-left" | "top-right";
  /** Leaf size relative to the default. */
  scale?: number;
  className?: string;
};

const W = 600;
const H = 240;

function rng(seed: number) {
  let s = (seed * 16807 + 11) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const PAIRS: [string, string][] = [
  ["var(--leaf-tip)", "#abc0f6"],
  ["#abc0f6", "#c8b6ff"],
  ["var(--leaf-tip)", "#fbb7cf"],
  ["#fbb7cf", "#fedcd2"],
  ["#c8b6ff", "#fedcd2"],
];

const f = (n: number) => Math.round(n * 10) / 10;

export function Leaves({ seed = 1, count = 11, from = "bottom-right", scale = 1, className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const r = rng(seed);
  const leaves = Array.from({ length: count }, () => ({
    bx: W * 0.7 + r() * W * 0.34,
    len: (160 + r() * 150) * scale,
    wid: (30 + r() * 22) * scale,
    lean: -0.55 + r() * 1.0,
    bend: (r() - 0.35) * 120 * scale,
    fill: Math.floor(r() * PAIRS.length),
    op: 0.78 + r() * 0.2,
  })).sort((a, b) => b.len - a.len);
  const sparks = Array.from({ length: 22 }, () => ({ x: W * 0.5 + r() * W * 0.5, y: r() * H, r: r() * 1.5 + 0.3 }));
  const flip = from === "bottom-left" ? "scale(-1 1) translate(-600 0)" : from === "top-right" ? "scale(1 -1) translate(0 -240)" : undefined;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMax meet"
      style={{ aspectRatio: `${W} / ${H}` }}
      className={`gw-leaves pointer-events-none absolute bottom-0 -z-10 h-full w-auto max-w-none ${from === "bottom-left" ? "left-0" : "right-0"} ${from === "top-right" ? "top-0" : ""} ${className}`}
    >
      <defs>
        {PAIRS.map(([tip, base], i) => (
          <linearGradient key={i} id={`${id}g${i}`} x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0" stopColor={base} stopOpacity="0.95" />
            <stop offset="0.7" stopColor={tip} stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--leaf-tip)" stopOpacity="0.9" />
          </linearGradient>
        ))}
      </defs>
      <g transform={flip}>
        {leaves.map((l, i) => {
          const by = H + 10;
          const tx = l.bx + Math.sin(l.lean) * l.len + l.bend;
          const ty = by - Math.cos(l.lean) * l.len * 0.85;
          const mx = l.bx + Math.sin(l.lean) * l.len * 0.5 + l.bend * 0.15;
          const my = by - Math.cos(l.lean) * l.len * 0.5;
          const nx = -(ty - by);
          const ny = tx - l.bx;
          const nl = Math.hypot(nx, ny) || 1;
          const ux = nx / nl;
          const uy = ny / nl;
          const L = [l.bx - ux * l.wid * 0.5, by - uy * l.wid * 0.5];
          const R = [l.bx + ux * l.wid * 0.5, by + uy * l.wid * 0.5];
          const c1 = [mx - ux * l.wid, my - uy * l.wid];
          const c2 = [mx + ux * l.wid, my + uy * l.wid];
          const vein = (k: number) =>
            `M${f(l.bx + ux * l.wid * k * 0.6)},${f(by + uy * l.wid * k * 0.6)} Q${f(mx + ux * l.wid * k)},${f(my + uy * l.wid * k)} ${f(tx)},${f(ty)}`;
          return (
            <g key={i}>
              <path
                d={`M${f(L[0])},${f(L[1])} Q${f(c1[0])},${f(c1[1])} ${f(tx)},${f(ty)} Q${f(c2[0])},${f(c2[1])} ${f(R[0])},${f(R[1])} Z`}
                fill={`url(#${id}g${l.fill})`}
                fillOpacity={f(l.op * 100) / 100}
                stroke="var(--leaf-edge)"
                strokeOpacity="0.9"
                strokeWidth="1"
              />
              <path d={`M${f(l.bx)},${f(by)} Q${f(mx)},${f(my)} ${f(tx)},${f(ty)}`} fill="none" stroke="var(--leaf-edge)" strokeOpacity="0.75" strokeWidth="1.1" />
              <path d={vein(-0.45)} fill="none" stroke="var(--leaf-edge)" strokeOpacity="0.35" strokeWidth="0.6" />
              <path d={vein(0.45)} fill="none" stroke="var(--leaf-edge)" strokeOpacity="0.35" strokeWidth="0.6" />
            </g>
          );
        })}
      </g>
      {sparks.map((p, i) => (
        <circle key={i} cx={f(p.x)} cy={f(p.y)} r={f(p.r)} fill="var(--leaf-edge)" fillOpacity="0.85" />
      ))}
    </svg>
  );
}
