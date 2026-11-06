"use client";

import { useSyncExternalStore } from "react";
import {
  ACCOUNTS,
  BASE_TASKS,
  GATED,
  ME,
  NOW,
  SUGGESTIONS,
  type Account,
  type Person,
  type Suggestion,
} from "@/content/prototype";

/**
 * The prototype's whole state: what happened to each AI line, and what is pinned.
 * Kept in this browser only (localStorage), so the demo survives page changes and reloads.
 */
export type Status = "pending" | "approved" | "dismissed" | "saved";
export type Entry = { status: Status; text?: string; at?: string };
export type State = { entries: Record<string, Entry>; pinned: string[]; clock: number; message: string };

const KEY = "crm-rethought-prototype-v1";
const INITIAL: State = { entries: {}, pinned: [], clock: 0, message: "" };

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
  state = next;
  try {
    const { message: _m, ...keep } = next;
    void _m;
    window.localStorage.setItem(KEY, JSON.stringify(keep));
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

const byId = (id: string) => SUGGESTIONS.find((s) => s.id === id);

export const entryOf = (s: State, id: string): Entry => s.entries[id] ?? { status: "pending" };
export const textOf = (s: State, sug: Suggestion) => entryOf(s, sug.id).text ?? sug.text;

function set(id: string, entry: Entry, message: string) {
  commit({ ...state, entries: { ...state.entries, [id]: entry }, message });
}

export const actions = {
  /** Approve a gated line. A record fix inside a brief saves at once; log lines wait for Save. */
  approve(id: string) {
    const sug = byId(id);
    const at = stamp(state.clock);
    const status: Status = sug?.kind === "fix" ? "saved" : "approved";
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
    for (const sug of SUGGESTIONS) {
      if (meetingId && sug.meeting !== meetingId) continue;
      if (entries[sug.id]?.status === "approved") {
        entries[sug.id] = { ...entries[sug.id], status: "saved" };
        n++;
      }
    }
    commit({ ...state, entries, message: `Saved ${n} ${n === 1 ? "line" : "lines"} to the record. Nothing else changed.` });
    return n;
  },
  pin(id: string) {
    const on = state.pinned.includes(id);
    commit({
      ...state,
      pinned: on ? state.pinned.filter((p) => p !== id) : [...state.pinned, id],
      message: on ? "Unpinned." : "Pinned to the top of the brief.",
    });
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
  return SUGGESTIONS.filter((sug) => isGated(sug) && entryOf(s, sug.id).status === "pending" && (!filter || filter(sug)));
}

export function saved(s: State, filter?: (sug: Suggestion) => boolean) {
  return SUGGESTIONS.filter((sug) => entryOf(s, sug.id).status === "saved" && (!filter || filter(sug)));
}

export type LiveAccount = Omit<Account, "people"> & {
  people: (Person & { added?: string; leftAt?: string })[];
  approvedLog: { sug: Suggestion; text: string; at?: string }[];
};

/** The account as the record shows it now: the base data plus every saved change. */
export function liveAccount(s: State, id: string): LiveAccount | undefined {
  const base = ACCOUNTS.find((a) => a.id === id);
  if (!base) return undefined;
  const people: LiveAccount["people"] = base.people.map((p) => ({ ...p }));
  const deals = [...base.deals];
  let nextStep = base.nextStep;
  let lastTouch = base.lastTouch;
  const approvedLog: LiveAccount["approvedLog"] = [];

  for (const sug of saved(s, (x) => x.account === id)) {
    const e = entryOf(s, sug.id);
    const eff = sug.effect;
    if (eff?.type === "personLeft") {
      const p = people.find((x) => x.name === eff.person);
      if (p) p.leftAt = e.at;
    } else if (eff?.type === "addPerson") {
      people.push({ ...eff.person, added: e.at });
    } else if (eff?.type === "addDeal") {
      deals.push(eff.deal);
    } else if (eff?.type === "nextStep") {
      nextStep = eff.text;
    }
    if (sug.kind !== "fix") {
      approvedLog.push({ sug, text: textOf(s, sug), at: e.at });
      lastTouch = "Nov 12";
    }
  }
  return { ...base, people, deals, nextStep, lastTouch, approvedLog };
}

export function tasks(s: State) {
  const fromLogs = saved(s)
    .filter((sug) => sug.effect?.type === "task")
    .map((sug) => {
      const eff = sug.effect as Extract<Suggestion["effect"], { type: "task" }>;
      return { text: eff.text, due: eff.due, account: eff.account, source: sug.sources[0] };
    });
  return [...fromLogs, ...BASE_TASKS.map((t) => ({ ...t, source: undefined as string | undefined }))];
}

export const me = ME;
