"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, OPPS, SIGNALS } from "@/content/more";
import { SAMPLE } from "@/content/imports";
import {
  ACCOUNTS,
  BASE_TASKS,
  GATED,
  ME,
  MEETINGS,
  NOW,
  SUGGESTIONS,
  type Account,
  type InteractionType,
  type Opp,
  type Person,
  type Stage,
  type Suggestion,
} from "@/content/prototype";

/**
 * The prototype's whole state: what happened to each AI line, pins, outreach order,
 * notes typed for unrecorded events, the lines drafted from them, and saved lists.
 * Kept in this browser only (localStorage), so the demo survives page changes and reloads.
 */
export type Status = "pending" | "approved" | "dismissed" | "saved";
export type Entry = { status: Status; text?: string; at?: string };
export type SavedList = { id: string; name: string; query: string; chips: string[] };
export type State = {
  entries: Record<string, Entry>;
  pinned: string[];
  clock: number;
  message: string;
  /** Bumps with every message, so the visible toast replays even when the words repeat. */
  seq: number;
  custom: Suggestion[];
  notes: Record<string, { text: string; highStakes: boolean }>;
  order: string[];
  snoozed: string[];
  lists: SavedList[];
  /** Stage moves a person made directly (drag or menu). A person's own move needs no approval. */
  moves: Record<string, { stage: Stage; at: string }>;
  /** The import: the mapping a person confirmed, each rule's decision, and when it ran. */
  imp: { mapping: Record<string, string>; mappingOk: boolean; rules: Record<string, string>; doneAt?: string };
};

const KEY = "crm-rethought-prototype-v2";
const INITIAL: State = { entries: {}, pinned: [], clock: 0, message: "", seq: 0, custom: [], notes: {}, order: [], snoozed: [], lists: [], moves: {}, imp: { mapping: {}, mappingOk: false, rules: {} } };

let state: State = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...INITIAL, ...JSON.parse(raw), message: "" };
  } catch {
    /* storage blocked: the demo still works for this visit */
  }
}

function commit(next: State) {
  state = next.message ? { ...next, seq: (state.seq ?? 0) + 1 } : next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, message: "" }));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProto() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => INITIAL,
  );
}

/** A clock for approval stamps: the call ended 10:41, approvals start at 10:44. */
function stamp(clock: number) {
  const m = 44 + clock;
  return `${NOW.stamp} ${10 + Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}

/** Every AI line: the fixed sample ones plus lines drafted from notes in this session. */
export const allSugs = (s: State) => [...SUGGESTIONS, ...s.custom];
const byId = (id: string) => allSugs(state).find((x) => x.id === id);

export const entryOf = (s: State, id: string): Entry => s.entries[id] ?? { status: "pending" };
export const textOf = (s: State, sug: Suggestion) => entryOf(s, sug.id).text ?? sug.text;

function set(id: string, entry: Entry, message: string) {
  commit({ ...state, entries: { ...state.entries, [id]: entry }, message });
}

/** Instant gates: a record fix or an opportunity change saves as soon as it is approved. */
const INSTANT = ["fix", "opp", "stage"];

export const actions = {
  approve(id: string) {
    const sug = byId(id);
    const at = stamp(state.clock);
    const status: Status = sug && INSTANT.includes(sug.kind) ? "saved" : "approved";
    commit({
      ...state,
      clock: state.clock + 1,
      entries: { ...state.entries, [id]: { ...state.entries[id], status, at } },
      message: status === "saved" ? "Approved and saved to the record." : "Approved. Not saved yet.",
    });
  },
  edit(id: string, text: string) {
    const at = stamp(state.clock);
    commit({
      ...state,
      clock: state.clock + 1,
      entries: { ...state.entries, [id]: { status: "approved", text, at } },
      message: "Edited and approved. Not saved yet.",
    });
  },
  dismiss(id: string) {
    set(id, { ...state.entries[id], status: "dismissed" }, "Dismissed. Undo is next to it.");
  },
  undo(id: string) {
    set(id, { ...state.entries[id], status: "pending" }, "Undone.");
  },
  /** Save every approved line, in one meeting or everywhere. */
  save(meetingId?: string) {
    const entries = { ...state.entries };
    let n = 0;
    for (const sug of allSugs(state)) {
      if (meetingId && sug.meeting !== meetingId) continue;
      if (entries[sug.id]?.status === "approved") {
        entries[sug.id] = { ...entries[sug.id], status: "saved" };
        n++;
      }
    }
    commit({ ...state, entries, message: `Saved ${n} ${n === 1 ? "line" : "lines"} to the record. Nothing else changed.` });
  },
  pin(id: string) {
    const on = state.pinned.includes(id);
    commit({
      ...state,
      pinned: on ? state.pinned.filter((p) => p !== id) : [...state.pinned, id],
      message: on ? "Unpinned." : "Pinned to the top of the brief.",
    });
  },
  /**
   * Draft log lines from a person's own notes about an unrecorded event.
   * One sentence becomes one line; every line points back to the notes.
   */
  draftFromNotes(eventId: string, text: string, highStakes: boolean) {
    const ev = EVENTS.find((e) => e.id === eventId);
    if (!ev) return;
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const meetingId = `event:${eventId}`;
    const custom = state.custom.filter((x) => x.meeting !== meetingId);
    const entries = { ...state.entries };
    sentences.forEach((t, i) => {
      const id = `q-${eventId}-${i}`;
      delete entries[id];
      custom.push({
        id,
        meeting: meetingId,
        account: ev.account,
        kind: "log",
        section: "Log",
        text: /[.!?]$/.test(t) ? t : `${t}.`,
        sources: [`note:${eventId}`, ev.id],
        confidence: "High",
      });
    });
    commit({
      ...state,
      custom,
      entries,
      notes: { ...state.notes, [eventId]: { text, highStakes } },
      message: `Drafted ${sentences.length} ${sentences.length === 1 ? "line" : "lines"} from your notes. Nothing is saved yet.`,
    });
  },
  move(id: string, dir: -1 | 1) {
    const order = outreach(state).map((o) => o.account.id);
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    const name = ACCOUNTS.find((a) => a.id === id)?.name;
    commit({ ...state, order, message: `${name} moved to number ${j + 1}.` });
  },
  snooze(id: string) {
    const on = state.snoozed.includes(id);
    const name = ACCOUNTS.find((a) => a.id === id)?.name;
    commit({
      ...state,
      snoozed: on ? state.snoozed.filter((x) => x !== id) : [...state.snoozed, id],
      message: on ? `${name} is back on this week’s list.` : `${name} snoozed until next week.`,
    });
  },
  moveOpp(id: string, stage: Stage) {
    const at = stamp(state.clock);
    const opp = liveOpps(state).find((o) => o.id === id);
    commit({
      ...state,
      clock: state.clock + 1,
      moves: { ...state.moves, [id]: { stage, at } },
      message: `${opp?.name ?? "Opportunity"} moved to ${stage}.`,
    });
  },
  setMapping(col: string, field: string) {
    commit({ ...state, imp: { ...state.imp, mapping: { ...state.imp.mapping, [col]: field }, mappingOk: false }, message: `${col} will go into ${field}.` });
  },
  confirmMapping(ok: boolean) {
    commit({ ...state, imp: { ...state.imp, mappingOk: ok }, message: ok ? "Column mapping confirmed." : "Mapping reopened." });
  },
  decideRule(id: string, decision: string, message: string) {
    commit({ ...state, imp: { ...state.imp, rules: { ...state.imp.rules, [id]: decision } }, message });
  },
  runImport(n: number) {
    const at = stamp(state.clock);
    commit({ ...state, clock: state.clock + 1, imp: { ...state.imp, doneAt: at }, message: `Imported ${n} contacts. Nothing else changed.` });
  },
  undoImport() {
    commit({ ...state, imp: { ...state.imp, doneAt: undefined }, message: "Import undone." });
  },
  saveList(list: Omit<SavedList, "id">) {
    const id = `list-${state.lists.length + 1}`;
    commit({ ...state, lists: [...state.lists, { ...list, id }], message: `Saved the list “${list.name}”.` });
  },
  deleteList(id: string) {
    commit({ ...state, lists: state.lists.filter((l) => l.id !== id), message: "List removed." });
  },
  announce(message: string) {
    commit({ ...state, message });
  },
  reset() {
    commit({ ...INITIAL, message: "Demo reset. Everything is back to the start of the day." });
  },
};

/* ---------- Derived views ---------- */

export const isGated = (s: Suggestion) => GATED.includes(s.kind);

export function pending(s: State, filter?: (sug: Suggestion) => boolean) {
  return allSugs(s).filter((sug) => isGated(sug) && entryOf(s, sug.id).status === "pending" && (!filter || filter(sug)));
}

export function saved(s: State, filter?: (sug: Suggestion) => boolean) {
  return allSugs(s).filter((sug) => entryOf(s, sug.id).status === "saved" && (!filter || filter(sug)));
}

/** Opportunities as the record shows them now: base plus approved additions and stage changes. */
export function liveOpps(s: State): (Opp & { changedAt?: string; addedAt?: string; movedAt?: string })[] {
  const opps: (Opp & { changedAt?: string; addedAt?: string; movedAt?: string })[] = OPPS.map((o) => ({ ...o }));
  for (const sug of saved(s)) {
    const eff = sug.effect;
    const at = entryOf(s, sug.id).at;
    if (eff?.type === "addOpp" && !opps.some((o) => o.id === eff.opp.id)) opps.push({ ...eff.opp, addedAt: at });
    if (eff?.type === "stage") {
      const o = opps.find((x) => x.id === eff.opp);
      if (o) {
        o.stage = eff.to;
        o.changedAt = at;
      }
    }
  }
  for (const o of opps) {
    const m = s.moves?.[o.id];
    if (m) {
      o.stage = m.stage;
      o.movedAt = m.at;
    }
  }
  return opps;
}

export type TimelineEntry = {
  key: string;
  date: string;
  title: string;
  type: InteractionType;
  ours: string;
  with?: string;
  highStakes?: boolean;
  lines: { text: string; at?: string; sources: string[] }[];
  source?: string;
};

export type LiveAccount = Omit<Account, "people"> & {
  people: (Person & { added?: string; leftAt?: string })[];
  timeline: TimelineEntry[];
};

/** The account as the record shows it now: the base data plus every saved change. */
export function liveAccount(s: State, id: string): LiveAccount | undefined {
  const base = ACCOUNTS.find((a) => a.id === id);
  if (!base) return undefined;
  const people: LiveAccount["people"] = base.people.map((p) => ({ ...p }));
  let nextStep = base.nextStep;
  let lastTouch = base.lastTouch;
  let lastTouchDays = base.lastTouchDays;
  const groups = new Map<string, TimelineEntry>();

  for (const sug of saved(s, (x) => x.account === id)) {
    const e = entryOf(s, sug.id);
    const eff = sug.effect;
    if (eff?.type === "personLeft") {
      const p = people.find((x) => x.name === eff.person);
      if (p) p.leftAt = e.at;
    } else if (eff?.type === "addPerson") {
      people.push({ ...eff.person, added: e.at });
    } else if (eff?.type === "nextStep") {
      nextStep = eff.text;
    }
    if (!["log", "task", "record"].includes(sug.kind)) continue;
    const m = MEETINGS.find((x) => x.id === sug.meeting);
    const ev = EVENTS.find((x) => `event:${x.id}` === sug.meeting);
    const key = sug.meeting;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        date: m ? "Nov 12" : (ev?.day.replace(/^\w+, /, "") ?? "Nov 12"),
        title: m ? `${m.title} · approved by Daniel` : `${ev?.title ?? "Note"} · logged from your notes`,
        type: m?.type ?? ev?.type ?? "Call",
        ours: "Daniel Okoro",
        with: m ? m.attendees.join(", ") : ev?.with,
        highStakes: ev ? s.notes[ev.id]?.highStakes : m?.highStakes,
        lines: [],
      });
    }
    groups.get(key)!.lines.push({ text: textOf(s, sug), at: e.at, sources: sug.sources });
    if (m) {
      lastTouch = "Nov 12";
      lastTouchDays = 0;
    }
  }

  if (s.imp?.doneAt) {
    const rows = SAMPLE.filter((r) => r.account === id && !(id === "fernhill" && r.name === "Sam Reyes" && s.imp.rules.dupes === "skip"));
    if (rows.length) {
      groups.set("import", {
        key: "import",
        date: "Nov 10",
        title: "RetailTech Expo leads · imported by Daniel",
        type: "Event",
        ours: "Daniel Okoro",
        with: [...new Set(rows.map((r) => r.name))].join(", "),
        lines: rows.filter((r) => r.note).map((r) => ({ text: `Note from ${r.name}: \u201c${r.note}\u201d`, at: s.imp.doneAt, sources: ["importFile"] })),
      });
    }
  }

  const order = (d: string) => Date.parse(`${d} 2026`) || 0;
  const timeline = [
    ...groups.values(),
    ...base.history.map((h) => ({ ...h, key: h.date + h.title, lines: h.lines.map((t) => ({ text: t, sources: [] as string[] })) })),
  ].sort((a, b) => order(b.date) - order(a.date));

  return { ...base, people, nextStep, lastTouch, lastTouchDays, timeline };
}

export function tasks(s: State) {
  const fromLogs = saved(s)
    .filter((sug) => sug.effect?.type === "task")
    .map((sug) => {
      const eff = sug.effect as Extract<Suggestion["effect"], { type: "task" }>;
      return { text: eff.text, due: eff.due, account: eff.account, source: sug.sources[0] as string | undefined };
    });
  return [...fromLogs, ...BASE_TASKS.map((t) => ({ ...t, source: undefined as string | undefined }))];
}

/** This week's outreach, ranked by the weight of its reasons; a person's reordering wins. */
export function outreach(s: State) {
  const ranked = ACCOUNTS.map((a) => ({ account: a, signals: SIGNALS[a.id] ?? [] }))
    .map((r) => ({ ...r, score: r.signals.reduce((n, x) => n + x.weight, 0) }))
    .sort((x, y) => y.score - x.score);
  if (!s.order.length) return ranked;
  return [...ranked].sort((x, y) => {
    const i = s.order.indexOf(x.account.id);
    const j = s.order.indexOf(y.account.id);
    return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
  });
}

export const me = ME;
