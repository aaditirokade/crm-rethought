/**
 * Ask: answers about accounts, for the prototype. Three questions have written answers; any other
 * question that names an account gets an answer assembled from that account's record.
 * In a live product a language model would write these from the same sources; every claim keeps its source.
 * All data is made up.
 */
import { NEXT_MOVE, OPPS, SIGNALS } from "./more";
import { ACCOUNTS } from "./prototype";

export type Segment = { text: string; cite?: string[] };
export type Stat = { label: string; value: number; prefix?: string; suffix?: string };
/**
 * An action the AI suggests from its answer. Nothing happens until the person chooses it: a draft or a task waits in
 * Review like any other line, and "open" only takes them to the place to do it.
 */
export type SuggestedAction = { id: string; kind: "email" | "task" | "meeting" | "open"; title: string; detail: string; href?: string; due?: string };
export type Answer = {
  id: string;
  question: string;
  steps: string[];
  segments: Segment[];
  stats: Stat[];
  accounts: string[];
  next?: string;
  actions?: SuggestedAction[];
};

export const SUGGESTED = [
  "Why is Fernhill slipping?",
  "Which renewals in the next 120 days need attention?",
  "What did we promise Brightwater, and is it on track?",
];

const WRITTEN: (Answer & { match: (q: string) => boolean })[] = [
  {
    id: "fernhill-why",
    question: SUGGESTED[0],
    match: (q) => /fern/.test(q) && /(why|slip|risk|churn|worr|wrong|happen)/.test(q),
    steps: ["Reading 3 emails", "Reading 2 support tickets", "Reading the Oct 14 call", "Checking weekly usage", "Checking the record"],
    segments: [
      { text: "Three things changed since your last call on Oct 14. " },
      { text: "Dashboard use fell about 40% after their Oct 20 reorg", cite: ["usage"] },
      { text: ". " },
      { text: "Lena Ortiz, your day to day contact, left, and Priya Nair took over", cite: ["bounce"] },
      { text: ". " },
      { text: "Two tickets about late data refreshes, one still open", cite: ["t4821", "t4790"] },
      { text: ", sit on top of a promise we missed: " },
      { text: "the markdown report due Nov 1", cite: ["promise"] },
      { text: ". The renewal is still set for " },
      { text: "Jan 25", cite: ["renewal"] },
      { text: ", but it needs a visible fix before then." },
    ],
    stats: [
      { label: "Dashboard use since Oct 20", value: -38, suffix: "%" },
      { label: "Open tickets", value: 1 },
      { label: "Days to renewal", value: 74 },
    ],
    accounts: ["fernhill"],
    next: "Bring a fix date for the refreshes and a new date for the report to today’s 10:00.",
    actions: [
      { id: "fh-priya", kind: "email", title: "Draft a note to Priya Nair", detail: "Introduce yourself as her contact, own the missed markdown report and give a new date." },
      { id: "fh-ticket", kind: "task", title: "Ask support for a fix date on ticket 4821", detail: "Due before today’s 10:00, so you can bring it to the quarterly review.", due: "Today, 10:00" },
      { id: "fh-qbr", kind: "open", title: "Open the 10:00 quarterly review", detail: "Drafted lines from the call are waiting there.", href: "/prototype/log/fernhill-qbr" },
    ],
  },
  {
    id: "renewals",
    question: SUGGESTED[1],
    match: (q) => /renew/.test(q) && !ACCOUNTS.some((a) => q.includes(a.id) || q.includes(a.name.split(" ")[0].toLowerCase())),
    steps: ["Checking 5 renewal dates", "Reading recent touches", "Checking open tickets"],
    segments: [
      { text: "Three accounts renew in the next 120 days. " },
      { text: "Harbor Lane Books needs you most: no reply to the renewal proposal in 21 days", cite: ["hEmail"] },
      { text: ", renewal Feb 14", cite: ["hRecord"] },
      { text: ". " },
      { text: "Fernhill Outfitters renews Jan 25 with usage down since their reorg", cite: ["usage"] },
      { text: ". " },
      { text: "Alder & Finch is healthy, but ticket 4877 should close before the Dec 1 kickoff", cite: ["aTicket", "aRecord"] },
      { text: "." },
    ],
    stats: [
      { label: "Renewals within 120 days", value: 3 },
      { label: "Stores up for renewal", value: 116 },
      { label: "At risk", value: 1 },
    ],
    accounts: ["harbor", "fernhill", "alder"],
    next: NEXT_MOVE.harbor,
    actions: [
      { id: "hl-owner", kind: "email", title: "Draft a follow up to Harbor Lane’s owner", detail: "21 days without a reply: offer two times this week to walk through the proposal." },
      { id: "hl-alder", kind: "task", title: "Chase ticket 4877 for Alder & Finch", detail: "Close it before the Dec 1 kickoff.", due: "Mon, Nov 30" },
      { id: "hl-brief", kind: "open", title: "Open the brief for the Nov 18 owner visit", detail: "Booked as high stakes; the brief is ready.", href: "/prototype/brief/harbor-owner" },
    ],
  },
  {
    id: "brightwater-promises",
    question: SUGGESTED[2],
    match: (q) => /bright/.test(q) && /(promis|track|owe|commit)/.test(q),
    steps: ["Reading the Oct 29 kickoff call", "Checking your tasks", "Checking weekly usage"],
    segments: [
      { text: "Two promises from the Oct 29 kickoff. " },
      { text: "A training session for store managers by Nov 15", cite: ["bwPromise"] },
      { text: ": the invite is still on your task list, due tomorrow. " },
      { text: "Single sign on before rolling out to all 18 stores", cite: ["bwKickoff"] },
      { text: ": no date yet. " },
      { text: "Two of five store managers haven’t logged in since setup", cite: ["bwUsage"] },
      { text: ", so the training matters more than it looks." },
    ],
    stats: [
      { label: "Promises open", value: 2 },
      { label: "Days to the training deadline", value: 3 },
      { label: "Store managers active", value: 3, suffix: " of 5" },
    ],
    accounts: ["brightwater"],
    next: NEXT_MOVE.brightwater,
    actions: [
      { id: "bw-training", kind: "meeting", title: "Send the store manager training invite", detail: "Due tomorrow: propose Thursday or Friday for all five managers." },
      { id: "bw-sso", kind: "email", title: "Draft a note on single sign on", detail: "Ask their IT lead for a date, so the rollout to all 18 stores can be planned." },
      { id: "bw-open", kind: "open", title: "Open Brightwater Grocers", detail: "See who has logged in since setup.", href: "/prototype/accounts/brightwater" },
    ],
  },
];

const TODAY = Date.parse("2026-11-12");

/** Answer a question: a written answer if one fits, else one built from the named account's record. */
export function answerFor(question: string): Answer {
  const q = question.toLowerCase();
  const written = WRITTEN.find((w) => w.match(q));
  if (written) return { ...written, question };

  const a = ACCOUNTS.find((x) => q.includes(x.id) || q.includes(x.name.split(" ")[0].toLowerCase()));
  if (a) {
    const days = Math.round((Date.parse(a.renewalDate) - TODAY) / 864e5);
    const signals = SIGNALS[a.id] ?? [];
    const opps = OPPS.filter((o) => o.account === a.id);
    const segments: Segment[] = [
      { text: `${a.name} is ${a.health.toLowerCase()}: ${a.healthWhy}. It renews ${a.renewal}, in ${days} days, and the last touch was ${a.lastTouch}. ` },
    ];
    if (signals.length) {
      segments.push({ text: "What stands out: " });
      signals.forEach((s, i) => {
        segments.push({ text: s.text.charAt(0).toLowerCase() + s.text.slice(1), cite: [s.source] });
        segments.push({ text: i === signals.length - 1 ? ". " : "; " });
      });
    }
    if (opps.length) segments.push({ text: `Open opportunities: ${opps.map((o) => `${o.name.toLowerCase()} (${o.stage.toLowerCase()})`).join(", ")}.` });
    return {
      id: `account-${a.id}`,
      question,
      steps: ["Reading the record", "Reading recent interactions", "Checking opportunities"],
      segments,
      stats: [
        { label: "Days to renewal", value: days },
        { label: "Stores", value: a.stores },
        { label: "Open opportunities", value: opps.length },
      ],
      accounts: [a.id],
      next: NEXT_MOVE[a.id],
      actions: [
        { id: `${a.id}-checkin`, kind: "email", title: `Draft a check in to ${a.name}`, detail: `Built from the last touch (${a.lastTouch}) and what stands out above.` },
        { id: `${a.id}-open`, kind: "open", title: `Open ${a.name}`, detail: "Every interaction, the people and the opportunities.", href: `/prototype/accounts/${a.id}` },
      ],
    };
  }

  return {
    id: "none",
    question,
    steps: ["Looking for an account in your question"],
    segments: [
      {
        text: "I couldn’t tie that to one of your accounts, so I won’t guess. Ask about an account by name (Fernhill, Brightwater, Kestrel, Alder & Finch, Harbor Lane) or try a suggested question.",
      },
    ],
    stats: [],
    accounts: [],
  };
}

/** Weekly dashboard views per account, 8 weeks ending Nov 9. */
export const PULSE: Record<string, number[]> = {
  fernhill: [398, 405, 412, 410, 300, 262, 258, 255],
  harbor: [60, 58, 52, 47, 44, 40, 35, 31],
  brightwater: [0, 0, 0, 0, 0, 24, 61, 88],
  kestrel: [300, 310, 322, 330, 341, 352, 360, 371],
  alder: [520, 515, 530, 525, 518, 522, 527, 531],
};
