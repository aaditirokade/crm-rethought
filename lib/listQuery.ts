/**
 * Turns a plain words request ("renewing before March with an open ticket") into filter chips.
 * Deterministic on purpose: the prototype shows exactly what was understood, as chips a person can remove.
 * In a live product a language model would draft the same chips; the person still sees and edits them.
 */
export type Listable = {
  id: string;
  name: string;
  segment: string;
  stores: number;
  health: string;
  renewal: string;
  renewalDate: string;
  openTicket?: string;
  lastTouchDays: number;
};

export type Chip = {
  id: string;
  label: string;
  /** A reason in plain words when the account matches, or null. */
  test: (a: Listable) => { why: string; source?: string } | null;
};

const TODAY = Date.parse("2026-11-12");
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SEGMENTS = ["outdoor", "grocery", "home", "apparel", "books"];

export function parseList(q: string): Chip[] {
  const t = q.toLowerCase();
  const chips: Chip[] = [];

  const before = t.match(/renew\w*\s+(?:before|by)\s+([a-z]+)/);
  if (before) {
    const m = MONTHS.findIndex((x) => before[1].startsWith(x));
    if (m >= 0) {
      const year = m >= 10 ? 2026 : 2027;
      const cut = Date.UTC(year, m, 1);
      chips.push({
        id: `renew-before-${m}`,
        label: `Renewal before ${MONTH_NAMES[m]} 1`,
        test: (a) => (Date.parse(a.renewalDate) < cut ? { why: `Renews ${a.renewal}` } : null),
      });
    }
  }

  const within = t.match(/renew\w*\s+(?:in|within|in the next)\s+(\d+)\s+(day|week|month)/);
  if (within) {
    const n = Number(within[1]) * (within[2] === "week" ? 7 : within[2] === "month" ? 30 : 1);
    chips.push({
      id: `renew-within-${n}`,
      label: `Renewal within ${n} days`,
      test: (a) => {
        const days = Math.round((Date.parse(a.renewalDate) - TODAY) / 864e5);
        return days >= 0 && days <= n ? { why: `Renews in ${days} days` } : null;
      },
    });
  }

  if (/open ticket/.test(t)) {
    chips.push({ id: "ticket", label: "Has an open ticket", test: (a) => (a.openTicket ? { why: "Ticket open", source: a.openTicket } : null) });
  }

  for (const [re, h] of [
    [/at risk/, "At risk"],
    [/need\w* a look/, "Needs a look"],
    [/healthy/, "Healthy"],
  ] as const) {
    if (re.test(t)) chips.push({ id: `health-${h}`, label: `Health: ${h}`, test: (a) => (a.health === h ? { why: h } : null) });
  }

  for (const seg of SEGMENTS) {
    if (t.includes(seg)) {
      chips.push({
        id: `seg-${seg}`,
        label: `Segment: ${seg[0].toUpperCase()}${seg.slice(1)}`,
        test: (a) => (a.segment.toLowerCase().includes(seg) ? { why: a.segment } : null),
      });
    }
  }

  const more = t.match(/(?:more than|over|at least)\s+(\d+)\s+stores/);
  if (more) {
    const n = Number(more[1]);
    chips.push({ id: `stores-gt-${n}`, label: `More than ${n} stores`, test: (a) => (a.stores > n ? { why: `${a.stores} stores` } : null) });
  }
  const fewer = t.match(/(?:fewer than|under|less than)\s+(\d+)\s+stores/);
  if (fewer) {
    const n = Number(fewer[1]);
    chips.push({ id: `stores-lt-${n}`, label: `Fewer than ${n} stores`, test: (a) => (a.stores < n ? { why: `${a.stores} stores` } : null) });
  }

  const quiet = t.match(/(?:no (?:reply|touch|contact)|not (?:contacted|touched)|quiet)\s+(?:in|for)\s+(\d+)\s+(day|week)/);
  if (quiet) {
    const n = Number(quiet[1]) * (quiet[2] === "week" ? 7 : 1);
    chips.push({
      id: `quiet-${n}`,
      label: `No touch in ${n}+ days`,
      test: (a) => (a.lastTouchDays >= n ? { why: `Last touch ${a.lastTouchDays} days ago` } : null),
    });
  }

  return chips;
}

export function runList<T extends Listable>(accounts: T[], chips: Chip[]) {
  if (!chips.length) return [];
  return accounts
    .map((a) => ({ a, reasons: chips.map((c) => c.test(a)) }))
    .filter((r) => r.reasons.every(Boolean))
    .map((r) => ({ a: r.a, reasons: r.reasons as { why: string; source?: string }[] }));
}
