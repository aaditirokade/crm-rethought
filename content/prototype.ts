/**
 * Sample data for the working prototype. Every company, person and number here is made up.
 * The user is Daniel Okoro, an account manager at Larkspur (a made up retail analytics company).
 */

export type Confidence = "High" | "Medium";
export type SourceKind = "EMAIL" | "TICKET" | "CALL" | "USAGE" | "RECORD" | "LOG" | "NOTE" | "CALENDAR" | "FILE";

export type Source = { id: string; kind: SourceKind; when: string; title: string; excerpt: string };

export type Effect =
  | { type: "personLeft"; account: string; person: string }
  | { type: "addPerson"; account: string; person: { name: string; role: string } }
  | { type: "addOpp"; account: string; opp: Opp }
  | { type: "stage"; account: string; opp: string; to: Stage }
  | { type: "nextStep"; account: string; text: string }
  | { type: "task"; text: string; due: string; account: string };

/**
 * One line the AI drafted.
 * brief: part of a private brief, no gate (pin, dismiss).
 * fix: a record fix inside a brief; writes to the record when approved.
 * flag: something only a person may act on (a merge); the AI never offers to do it.
 * log, task, record: drafted after a call; approved line by line, then saved together.
 * email: a draft the person sends themselves.
 * opp, stage: a new opportunity or a stage change the AI spotted; written to the record only when approved.
 */
export type Kind = "brief" | "fix" | "flag" | "log" | "task" | "record" | "email" | "opp" | "stage";

export type Suggestion = {
  id: string;
  meeting: string;
  account: string;
  kind: Kind;
  section: string;
  text: string;
  sources: string[];
  confidence: Confidence;
  tag?: string;
  effect?: Effect;
};

export const GATED: Kind[] = ["fix", "log", "task", "record", "opp", "stage"];

export type Stage = "Idea" | "Qualified" | "Proposal" | "Committed";
export type Opp = { id: string; account: string; name: string; stage: Stage; close: string };
export type InteractionType = "Video" | "Call" | "In person" | "Event" | "Email" | "Ticket";

export const ME = { name: "Daniel Okoro", short: "Daniel", role: "Account Manager", company: "Larkspur" };
export const NOW = { day: "Thu, Nov 12", time: "9:05 AM", stamp: "NOV 12" };

export const SOURCES: Record<string, Source> = {
  usage: { id: "usage", kind: "USAGE", when: "Nov 9", title: "Weekly usage, Fernhill", excerpt: "Store traffic dashboard: 412 weekly views before Oct 20, 255 in the week of Nov 2." },
  t4821: { id: "t4821", kind: "TICKET", when: "4821", title: "Ticket 4821 · open since Nov 5", excerpt: "“Sales data for the Northeast stores is a day late again. Our Monday meeting runs on stale numbers.”" },
  t4790: { id: "t4790", kind: "TICKET", when: "4790", title: "Ticket 4790 · closed Oct 29", excerpt: "“Refresh failed overnight for 6 stores.” Closed after a manual rerun." },
  bounce: { id: "bounce", kind: "EMAIL", when: "Nov 3", title: "Auto reply from Lena Ortiz", excerpt: "“I’ve left Fernhill. For anything about Larkspur, please contact Priya Nair.”" },
  sam: { id: "sam", kind: "EMAIL", when: "Nov 6", title: "Sam Reyes to Daniel", excerpt: "“Before Thursday, can you send rough pricing for adding our 12 new stores in the spring?”" },
  promise: { id: "promise", kind: "CALL", when: "Oct 14 18:42", title: "Call with Fernhill, Oct 14 · 18:42", excerpt: "Daniel: “We’ll have the custom markdown report to you by November 1.”" },
  renewal: { id: "renewal", kind: "RECORD", when: "Renewal", title: "Fernhill record · renewal", excerpt: "Renewal on Jan 25, 2027 · 40 stores · owner Daniel Okoro." },
  c0410: { id: "c0410", kind: "CALL", when: "04:10", title: "Today’s call · 04:10", excerpt: "Sam: “Priya Nair runs retail ops now. She’ll be your day to day contact.”" },
  c1205: { id: "c1205", kind: "CALL", when: "12:05", title: "Today’s call · 12:05", excerpt: "Sam: “We’re renewing all 40. The 12 new stores, price that separately.”" },
  c1240: { id: "c1240", kind: "CALL", when: "12:40", title: "Today’s call · 12:40", excerpt: "Daniel: “I’ll send pricing for the 12 stores by Monday.”" },
  c2130: { id: "c2130", kind: "CALL", when: "21:30", title: "Today’s call · 21:30", excerpt: "Priya: “The late refreshes are the main issue. We need a date for a fix.”" },
  c2655: { id: "c2655", kind: "CALL", when: "26:55", title: "Today’s call · 26:55", excerpt: "Daniel: “I’ll get you a fix date from our support lead by tomorrow.”" },
  bwUsage: { id: "bwUsage", kind: "USAGE", when: "Nov 10", title: "Weekly usage, Brightwater", excerpt: "Store manager logins since setup on Oct 29: 3 of 5 managers active, 2 with no login." },
  bwKickoff: { id: "bwKickoff", kind: "CALL", when: "Oct 29 31:10", title: "Kickoff call, Oct 29 · 31:10", excerpt: "Dana (IT lead): “Single sign on is a must before we roll out to all 18 stores.”" },
  bwPromise: { id: "bwPromise", kind: "CALL", when: "Oct 29 44:02", title: "Kickoff call, Oct 29 · 44:02", excerpt: "Daniel: “We’ll run a training session for your store managers by November 15.”" },
  bwDup: { id: "bwDup", kind: "RECORD", when: "Contacts", title: "Brightwater record · contacts", excerpt: "Omar Haddad · omar.haddad@brightwater.example and Omar Haddad · o.haddad@brightwater.example, both Store Operations." },
  kEmail: { id: "kEmail", kind: "EMAIL", when: "Nov 9", title: "Mei Tanaka to Daniel", excerpt: "“We’re planning to open Pacific and Mountain next year. Can we talk about adding both regions?”" },
  kRecord: { id: "kRecord", kind: "RECORD", when: "Contract", title: "Kestrel record · contract", excerpt: "22 stores, Atlantic and Central regions, renews Aug 1, 2027." },
  hEmail: { id: "hEmail", kind: "EMAIL", when: "Oct 22", title: "Daniel to Theo Marsh", excerpt: "Sent the Q3 summary and the renewal proposal for 12 stores. No reply since." },
  hRecord: { id: "hRecord", kind: "RECORD", when: "Renewal", title: "Harbor Lane record · renewal", excerpt: "Renewal on Feb 14, 2027 · 12 stores · proposal sent Oct 22." },
  hPress: { id: "hPress", kind: "EMAIL", when: "Nov 8", title: "Industry newsletter", excerpt: "\u201cHarbor Lane Books is said to be reviewing its analytics tools ahead of a refit.\u201d Unconfirmed." },
  aRecord: { id: "aRecord", kind: "CALENDAR", when: "Dec 1", title: "Calendar · Alder & Finch renewal kickoff", excerpt: "Renewal kickoff with Ruth Calloway, Dec 1, 2:00." },
  aTicket: { id: "aTicket", kind: "TICKET", when: "4877", title: "Ticket 4877 · open since Nov 10", excerpt: "\u201cHoliday markdown alerts fire twice for some stores.\u201d" },
  expo: { id: "expo", kind: "CALENDAR", when: "Nov 10", title: "Calendar · RetailTech Expo, booth duty", excerpt: "Booth 214, 10:00 to 4:00. No recording." },
  importFile: { id: "importFile", kind: "FILE", when: "214 rows", title: "retailtech-expo-leads.csv", excerpt: "Imported by Daniel Okoro after approving the column mapping and each fix. Booth notes are kept as notes, not facts." },
  kUsage: { id: "kUsage", kind: "USAGE", when: "Nov 9", title: "Quarterly usage, Kestrel", excerpt: "Dashboard views up 18% on last quarter; 9 of 11 regional managers active weekly." },
};

export type Person = { name: string; role: string };

export type Account = {
  id: string;
  name: string;
  segment: string;
  stores: number;
  renewal: string;
  health: "Healthy" | "Needs a look" | "At risk";
  renewalDate: string;
  openTicket?: string;
  lastTouchDays: number;
  healthWhy: string;
  lastTouch: string;
  nextStep: string;
  people: Person[];
  history: { date: string; title: string; type: InteractionType; ours: string; lines: string[]; source?: string; with?: string }[];
};

export const ACCOUNTS: Account[] = [
  {
    id: "fernhill",
    name: "Fernhill Outfitters",
    segment: "Outdoor retail",
    stores: 40,
    renewal: "Jan 25",
    renewalDate: "2027-01-25",
    openTicket: "t4821",
    lastTouchDays: 29,
    health: "Needs a look",
    healthWhy: "dashboard use down after a reorg",
    lastTouch: "Oct 14",
    nextStep: "Quarterly review, Nov 12",
    people: [
      { name: "Sam Reyes", role: "VP Merchandising" },
      { name: "Lena Ortiz", role: "Retail Ops Lead, day to day contact" },
    ],
    history: [
      { date: "Nov 5", title: "Ticket 4821 opened", type: "Ticket", ours: "Support", with: "Priya Nair", lines: ["Late data refresh for Northeast stores."], source: "t4821" },
      { date: "Oct 27", title: "Ticket 4790 opened and closed", type: "Ticket", ours: "Support", with: "Lena Ortiz", lines: ["Refresh failed for 6 stores; rerun on Oct 29."], source: "t4790" },
      {
        date: "Oct 14",
        title: "Quarterly call · approved by Daniel",
        type: "Video",
        ours: "Daniel Okoro",
        with: "Sam Reyes",
        lines: ["Promised a custom markdown report by Nov 1.", "Sam wants store traffic views by region."],
        source: "promise",
      },
      { date: "Sep 30", title: "Email to Lena Ortiz", type: "Email", ours: "Daniel Okoro", with: "Lena Ortiz", lines: ["Shared the Q4 rollout plan for store dashboards."] },
      { date: "Sep 24", title: "Weekly check in", type: "Call", ours: "Daniel Okoro", with: "Lena Ortiz", lines: ["Lena asked for a regional view; agreed to scope it."] },
      { date: "Oct 7", title: "Training session", type: "Video", ours: "Ana Ruiz (Solutions)", with: "Lena Ortiz", lines: ["Trained 12 store leads on the traffic dashboard."] },
    ],
  },
  {
    id: "brightwater",
    name: "Brightwater Grocers",
    segment: "Grocery",
    stores: 18,
    renewal: "Oct 1",
    renewalDate: "2027-10-01",
    lastTouchDays: 14,
    health: "Needs a look",
    healthWhy: "2 of 5 store managers not active",
    lastTouch: "Oct 29",
    nextStep: "Onboarding check in, Nov 12",
    people: [
      { name: "Dana Whitfield", role: "IT Lead" },
      { name: "Omar Haddad", role: "Store Operations" },
      { name: "Omar Haddad", role: "Store Operations (second record)" },
    ],
    history: [{ date: "Oct 29", title: "Kickoff call · approved by Daniel", type: "Video", ours: "Daniel Okoro", with: "Dana Whitfield", lines: ["SSO needed before full rollout.", "Training for store managers promised by Nov 15."], source: "bwKickoff" }],
  },
  {
    id: "kestrel",
    name: "Kestrel Home",
    segment: "Home goods",
    stores: 22,
    renewal: "Aug 1",
    renewalDate: "2027-08-01",
    lastTouchDays: 3,
    health: "Healthy",
    healthWhy: "usage up 18% this quarter",
    lastTouch: "Nov 9",
    nextStep: "Expansion call, Nov 12",
    people: [{ name: "Mei Tanaka", role: "Director of Regional Ops" }],
    history: [{ date: "Nov 9", title: "Email from Mei Tanaka", type: "Email", ours: "Daniel Okoro", with: "Mei Tanaka", lines: ["Asked about adding Pacific and Mountain regions."], source: "kEmail" }],
  },
  {
    id: "alder",
    name: "Alder & Finch",
    segment: "Apparel",
    stores: 64,
    renewal: "Mar 3",
    renewalDate: "2027-03-03",
    openTicket: "aTicket",
    lastTouchDays: 8,
    health: "Healthy",
    healthWhy: "weekly use steady",
    lastTouch: "Nov 4",
    nextStep: "Renewal kickoff, Dec 1",
    people: [{ name: "Ruth Calloway", role: "Head of Planning" }],
    history: [{ date: "Oct 30", title: "Store visit, Portland flagship", type: "In person", ours: "Ana Ruiz (Solutions)", with: "Ruth Calloway", lines: ["Walked the holiday floor plan; wants markdown alerts by store."] }, { date: "Nov 4", title: "Planning call · approved by Daniel", type: "Call", ours: "Daniel Okoro", with: "Ruth Calloway", lines: ["Happy with weekly reports; wants a holiday view."] }],
  },
  {
    id: "harbor",
    name: "Harbor Lane Books",
    segment: "Books",
    stores: 12,
    renewal: "Feb 14",
    renewalDate: "2027-02-14",
    lastTouchDays: 21,
    health: "At risk",
    healthWhy: "no reply in 21 days",
    lastTouch: "Oct 22",
    nextStep: "None set",
    people: [{ name: "Theo Marsh", role: "Owner" }],
    history: [{ date: "Oct 22", title: "Email to Theo Marsh", type: "Email", ours: "Daniel Okoro", with: "Theo Marsh", lines: ["Sent the Q3 summary and renewal proposal; no reply yet."], source: "hEmail" }],
  },
];

export type Meeting = {
  id: string;
  account: string;
  title: string;
  day: string;
  time: string;
  length: string;
  context: string;
  lastTouch: string;
  attendees: string[];
  /** The call has ended and a log was drafted from the transcript. */
  hasLog?: boolean;
  /** This brief is built from the approved log of another meeting. */
  fromLog?: string;
  type: InteractionType;
  /** High stakes: not recorded, drafts only from the owner’s notes, medium confidence lines hidden. */
  highStakes?: boolean;
};

export const MEETINGS: Meeting[] = [
  {
    id: "fernhill-qbr",
    account: "fernhill",
    title: "Quarterly review",
    day: "Today",
    time: "10:00",
    length: "45 min",
    context: "Renewal in 74 days",
    lastTouch: "Last spoke Oct 14 · 29 days ago",
    attendees: ["Sam Reyes", "Priya Nair"],
    hasLog: true,
    type: "Video",
  },
  {
    id: "brightwater-checkin",
    account: "brightwater",
    title: "Onboarding check in",
    day: "Today",
    time: "1:30",
    length: "30 min",
    context: "Week 3 of onboarding",
    lastTouch: "Last spoke Oct 29 · 14 days ago",
    attendees: ["Dana Whitfield", "Omar Haddad"],
    type: "Video",
  },
  {
    id: "kestrel-expansion",
    account: "kestrel",
    title: "Expansion call",
    day: "Today",
    time: "4:00",
    length: "30 min",
    context: "Asked about 2 more regions",
    lastTouch: "Last spoke Nov 9 · 3 days ago",
    attendees: ["Mei Tanaka"],
    type: "Call",
  },
  {
    id: "fernhill-pricing",
    account: "fernhill",
    title: "Pricing follow up",
    day: "Mon, Nov 16",
    time: "10:30",
    length: "30 min",
    context: "Booked at the end of today’s review",
    lastTouch: "Last spoke today",
    attendees: ["Sam Reyes", "Priya Nair"],
    fromLog: "fernhill-qbr",
    type: "Video",
  },
  {
    id: "harbor-owner",
    account: "harbor",
    title: "Renewal talk with the owner",
    day: "Wed, Nov 18",
    time: "9:00",
    length: "45 min",
    context: "In person, at their main store",
    lastTouch: "Last touch Oct 22 · 21 days ago",
    attendees: ["Theo Marsh"],
    type: "In person",
    highStakes: true,
  },
];

export const TRANSCRIPT = {
  "fernhill-qbr": {
    ended: "ended 10:41",
    moments: [
      { t: "04:10", who: "Sam", text: "Priya Nair runs retail ops now. She’ll be your day to day contact." },
      { t: "12:05", who: "Sam", text: "We’re renewing all 40. The 12 new stores, price that separately." },
      { t: "12:40", who: "Daniel", text: "I’ll send pricing for the 12 stores by Monday." },
      { t: "21:30", who: "Priya", text: "The late refreshes are the main issue. We need a date for a fix." },
      { t: "26:55", who: "Daniel", text: "I’ll get you a fix date from our support lead by tomorrow." },
    ],
  },
} as Record<string, { ended: string; moments: { t: string; who: string; text: string }[] }>;

export const EMAIL_DRAFT: Record<string, string> = {
  "fernhill-qbr":
    "Hi Sam and Priya,\n\nThanks for the time today. Pricing for the 12 new stores will be with you by Monday, and I’ll have a fix date for the late refreshes by tomorrow. I also owe you the markdown report I promised for Nov 1. I’m sorry it’s late; I’ll include a new date with the pricing.\n\nDaniel",
};

export const BASE_TASKS = [{ text: "Send the store manager training invite", due: "Fri, Nov 13", account: "brightwater" }];

const F = "fernhill-qbr";
const B = "brightwater-checkin";
const K = "kestrel-expansion";

export const SUGGESTIONS: Suggestion[] = [
  // Fernhill brief
  { id: "b1", meeting: F, account: "fernhill", kind: "brief", section: "What changed since Oct 14", text: "Lena Ortiz, your day to day contact, has left Fernhill. Priya Nair is taking over.", sources: ["bounce"], confidence: "Medium" },
  { id: "fx1", meeting: F, account: "fernhill", kind: "fix", section: "What changed since Oct 14", text: "Mark Lena Ortiz as left in the record.", sources: ["bounce"], confidence: "Medium", effect: { type: "personLeft", account: "fernhill", person: "Lena Ortiz" } },
  { id: "b2", meeting: F, account: "fernhill", kind: "brief", section: "What changed since Oct 14", text: "Sam Reyes asked for pricing on 12 new stores opening in the spring.", sources: ["sam"], confidence: "High" },
  { id: "b3", meeting: F, account: "fernhill", kind: "brief", section: "What changed since Oct 14", text: "Store traffic dashboard use fell by about 40% after their Oct 20 reorg.", sources: ["usage"], confidence: "High" },
  { id: "b4", meeting: F, account: "fernhill", kind: "brief", section: "What changed since Oct 14", text: "Two tickets about late data refreshes; one is still open.", sources: ["t4821", "t4790"], confidence: "High" },
  { id: "b5", meeting: F, account: "fernhill", kind: "brief", section: "Promises still open", text: "You promised a custom markdown report by Nov 1. It hasn’t been sent.", sources: ["promise"], confidence: "High", tag: "OVERDUE" },
  { id: "b6", meeting: F, account: "fernhill", kind: "brief", section: "Suggested agenda", text: "Own the late markdown report and give a new date.", sources: ["promise"], confidence: "High" },
  { id: "b7", meeting: F, account: "fernhill", kind: "brief", section: "Suggested agenda", text: "Meet Priya; ask what changed in the reorg.", sources: ["bounce", "usage"], confidence: "Medium" },
  { id: "b8", meeting: F, account: "fernhill", kind: "brief", section: "Suggested agenda", text: "Open the 12 store expansion before the Jan 25 renewal.", sources: ["sam", "renewal"], confidence: "High" },

  // Fernhill log, drafted from the call
  { id: "l1", meeting: F, account: "fernhill", kind: "log", section: "Log", text: "Fernhill will renew all 40 stores on Jan 25.", sources: ["c1205"], confidence: "High" },
  { id: "l2", meeting: F, account: "fernhill", kind: "log", section: "Log", text: "They want the 12 new stores priced as a separate expansion.", sources: ["c1205"], confidence: "High" },
  { id: "l3", meeting: F, account: "fernhill", kind: "log", section: "Log", text: "Late data refreshes are their main complaint; they want a fix date.", sources: ["c2130"], confidence: "High" },
  { id: "l4", meeting: F, account: "fernhill", kind: "task", section: "Follow ups", text: "Send pricing for the 12 new stores.", sources: ["c1240"], confidence: "High", effect: { type: "task", text: "Send Fernhill pricing for 12 new stores", due: "Mon, Nov 16", account: "fernhill" } },
  { id: "l5", meeting: F, account: "fernhill", kind: "task", section: "Follow ups", text: "Get a fix date for the late refreshes from support.", sources: ["c2655"], confidence: "High", effect: { type: "task", text: "Get a refresh fix date from support for Fernhill", due: "Fri, Nov 13", account: "fernhill" } },
  { id: "e1", meeting: F, account: "fernhill", kind: "email", section: "Follow ups", text: "Follow up email to Sam and Priya: recap, the two dates, the overdue report.", sources: ["c1240", "c2655", "promise"], confidence: "Medium" },
  { id: "l7", meeting: F, account: "fernhill", kind: "record", section: "Record updates", text: "Add Priya Nair, Retail Ops Manager, as day to day contact.", sources: ["c0410"], confidence: "High", effect: { type: "addPerson", account: "fernhill", person: { name: "Priya Nair", role: "Retail Ops Manager, day to day contact" } } },
  { id: "l8", meeting: F, account: "fernhill", kind: "record", section: "Record updates", text: "Add an expansion deal: 12 new stores, spring.", sources: ["c1205"], confidence: "Medium", effect: { type: "addOpp", account: "fernhill", opp: { id: "fern-exp", account: "fernhill", name: "Expansion · 12 new stores", stage: "Idea", close: "Spring" } } },
  { id: "l9", meeting: F, account: "fernhill", kind: "record", section: "Record updates", text: "Set next step: send pricing by Nov 16.", sources: ["c1240"], confidence: "High", effect: { type: "nextStep", account: "fernhill", text: "Send pricing by Nov 16, then pricing call" } },

  // Brightwater brief
  { id: "bw1", meeting: B, account: "brightwater", kind: "brief", section: "What changed since Oct 29", text: "Two of five store managers haven’t logged in since setup.", sources: ["bwUsage"], confidence: "High" },
  { id: "bw2", meeting: B, account: "brightwater", kind: "flag", section: "What changed since Oct 29", text: "Omar Haddad appears in two contact records with different emails.", sources: ["bwDup"], confidence: "Medium" },
  { id: "bw3", meeting: B, account: "brightwater", kind: "brief", section: "Open issues", text: "Their IT lead needs single sign on before rolling out to all 18 stores.", sources: ["bwKickoff"], confidence: "High" },
  { id: "bw4", meeting: B, account: "brightwater", kind: "brief", section: "Promises still open", text: "You promised a store manager training session by Nov 15.", sources: ["bwPromise"], confidence: "High", tag: "DUE FRI" },

  // Kestrel brief
  { id: "k1", meeting: K, account: "kestrel", kind: "brief", section: "What changed since Nov 9", text: "Mei Tanaka asked about adding the Pacific and Mountain regions next year.", sources: ["kEmail"], confidence: "High" },
  { id: "k2", meeting: K, account: "kestrel", kind: "brief", section: "What changed since Nov 9", text: "Dashboard use is up 18% on last quarter; 9 of 11 regional managers use it weekly.", sources: ["kUsage"], confidence: "High" },
  // Harbor Lane brief: a high stakes meeting
  { id: "h1", meeting: "harbor-owner", account: "harbor", kind: "brief", section: "What changed since Oct 22", text: "No reply to the Q3 summary and renewal proposal since Oct 22.", sources: ["hEmail"], confidence: "High" },
  { id: "h2", meeting: "harbor-owner", account: "harbor", kind: "brief", section: "What changed since Oct 22", text: "The renewal on Feb 14 covers 12 stores.", sources: ["hRecord"], confidence: "High" },
  { id: "h3", meeting: "harbor-owner", account: "harbor", kind: "brief", section: "What changed since Oct 22", text: "Harbor Lane may be reviewing other analytics tools.", sources: ["hPress"], confidence: "Medium" },

  // Opportunities the AI spotted; written to the record only when approved
  { id: "o1", meeting: "", account: "kestrel", kind: "opp", section: "Opportunities", text: "Open an opportunity: Kestrel expansion to the Pacific and Mountain regions.", sources: ["kEmail"], confidence: "Medium", effect: { type: "addOpp", account: "kestrel", opp: { id: "kes-exp", account: "kestrel", name: "Expansion · Pacific and Mountain", stage: "Idea", close: "Next year" } } },
  { id: "o2", meeting: "", account: "fernhill", kind: "stage", section: "Opportunities", text: "Move the Fernhill renewal from Proposal to Committed: Sam said they are renewing all 40 stores.", sources: ["c1205"], confidence: "High", effect: { type: "stage", account: "fernhill", opp: "fern-renewal", to: "Committed" } },
  { id: "o3", meeting: "", account: "harbor", kind: "stage", section: "Opportunities", text: "Move the Harbor Lane renewal back to Qualified: no reply to the proposal in 21 days.", sources: ["hEmail"], confidence: "Medium", effect: { type: "stage", account: "harbor", opp: "harbor-renewal", to: "Qualified" } },

  { id: "k3", meeting: K, account: "kestrel", kind: "brief", section: "Suggested agenda", text: "Ask how many stores each new region adds; today’s contract covers 22.", sources: ["kRecord", "kEmail"], confidence: "Medium" },
];

export const account = (id: string) => ACCOUNTS.find((a) => a.id === id);
export const meeting = (id: string) => MEETINGS.find((m) => m.id === id);
export const forMeeting = (id: string) => SUGGESTIONS.filter((s) => s.meeting === id);
