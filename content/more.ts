/** More sample data for the prototype: opportunities, outreach signals, unrecorded events. All made up. */
import type { Opp } from "./prototype";

export const OPPS: Opp[] = [
  { id: "fern-renewal", account: "fernhill", name: "Renewal · 40 stores", stage: "Proposal", close: "Jan 25" },
  { id: "harbor-renewal", account: "harbor", name: "Renewal · 12 stores", stage: "Proposal", close: "Feb 14" },
  { id: "alder-renewal", account: "alder", name: "Renewal · 64 stores", stage: "Qualified", close: "Mar 3" },
  { id: "bw-rollout", account: "brightwater", name: "Rollout to all 18 stores", stage: "Qualified", close: "Dec 15" },
  { id: "kes-renewal", account: "kestrel", name: "Renewal · 22 stores", stage: "Qualified", close: "Aug 1" },
];

export type Signal = { text: string; source: string; weight: number; tone?: "risk" | "warn" | "good" };

/** Why an account should be contacted this week. Weights add up to the rank. */
export const SIGNALS: Record<string, Signal[]> = {
  fernhill: [
    { text: "Promise overdue: the markdown report was due Nov 1", source: "promise", weight: 3, tone: "risk" },
    { text: "Dashboard use down about 40% since Oct 20", source: "usage", weight: 2, tone: "warn" },
    { text: "Renewal in 74 days", source: "renewal", weight: 2 },
  ],
  harbor: [
    { text: "No reply to the renewal proposal in 21 days", source: "hEmail", weight: 3, tone: "risk" },
    { text: "Renewal in 94 days", source: "hRecord", weight: 1 },
  ],
  brightwater: [
    { text: "2 of 5 store managers not active", source: "bwUsage", weight: 2, tone: "warn" },
    { text: "Training promised by Nov 15", source: "bwPromise", weight: 2 },
  ],
  kestrel: [{ text: "Asked to add 2 regions", source: "kEmail", weight: 2, tone: "good" }],
  alder: [
    { text: "Open ticket: alerts fire twice", source: "aTicket", weight: 1, tone: "warn" },
    { text: "Renewal kickoff on Dec 1", source: "aRecord", weight: 1 },
  ],
};

export const NEXT_MOVE: Record<string, string> = {
  fernhill: "Send the late markdown report with a new date before Monday’s pricing call.",
  harbor: "Ask for 30 minutes in person; the Nov 18 visit is booked as high stakes.",
  brightwater: "Book the store manager training before Friday.",
  kestrel: "Size the two regions with Mei on today’s call.",
  alder: "Close ticket 4877 before the Dec 1 kickoff.",
};

/** Interactions that ended without a recording. The AI asks whether to log them. */
export const EVENTS = [
  {
    id: "expo",
    account: "fernhill",
    title: "RetailTech Expo, booth chat",
    type: "Event" as const,
    day: "Tue, Nov 10",
    with: "Sam Reyes",
    sample:
      "Sam stopped by the booth. He wants a demo of the new forecasting view for his planners. He asked if we can include it in the renewal.",
  },
];
