/**
 * Sample data for the wireframes. Every company, person and number here is made up.
 * The user is Daniel Okoro, an account manager at Larkspur (a made up retail analytics company).
 */

export type Confidence = "High" | "Medium";

export type Source = {
  id: string;
  kind: "Email" | "Ticket" | "Call" | "Usage report" | "Record";
  label: string;
  date: string;
  excerpt: string;
};

export type Suggestion = {
  id: string;
  text: string;
  sources: string[];
  confidence: Confidence;
  /** A record fix the person can approve in place, shown under the line. */
  fix?: string;
  /** Extra state shown as a small tag, such as "Overdue". */
  tag?: string;
};

export type Section = { id: string; title: string; hint?: string; items: Suggestion[] };

export const ME = { name: "Daniel Okoro", role: "Account Manager", company: "Larkspur" };
export const NOW = "Thu, Nov 12 · 9:05 AM";

export const SOURCES: Record<string, Source> = {
  usage: {
    id: "usage",
    kind: "Usage report",
    label: "Weekly usage",
    date: "Nov 9",
    excerpt: "Store traffic dashboard: 412 weekly views before Oct 20, 255 in the week of Nov 2.",
  },
  t4821: {
    id: "t4821",
    kind: "Ticket",
    label: "Ticket 4821 · open",
    date: "Nov 5",
    excerpt: "“Sales data for the Northeast stores is a day late again. Our Monday meeting runs on stale numbers.”",
  },
  t4790: {
    id: "t4790",
    kind: "Ticket",
    label: "Ticket 4790 · closed",
    date: "Oct 27",
    excerpt: "“Refresh failed overnight for 6 stores.” Closed Oct 29 after a manual rerun.",
  },
  bounce: {
    id: "bounce",
    kind: "Email",
    label: "Auto reply from Lena Ortiz",
    date: "Nov 3",
    excerpt: "“I’ve left Fernhill. For anything about Larkspur, please contact Priya Nair.”",
  },
  sam: {
    id: "sam",
    kind: "Email",
    label: "Sam Reyes to Daniel",
    date: "Nov 6",
    excerpt: "“Before Thursday, can you send rough pricing for adding our 12 new stores in the spring?”",
  },
  promise: {
    id: "promise",
    kind: "Call",
    label: "Call with Fernhill · 18:42",
    date: "Oct 14",
    excerpt: "Daniel: “We’ll have the custom markdown report to you by November 1.”",
  },
  stage: {
    id: "stage",
    kind: "Record",
    label: "Renewal date in the record",
    date: "Jan 25",
    excerpt: "Renewal on Jan 25, 2027 · 40 stores · owner Daniel Okoro.",
  },
  c0410: {
    id: "c0410",
    kind: "Call",
    label: "Today’s call · 04:10",
    date: "Nov 12",
    excerpt: "Sam: “Priya Nair runs retail ops now. She’ll be your day to day contact.”",
  },
  c1205: {
    id: "c1205",
    kind: "Call",
    label: "Today’s call · 12:05",
    date: "Nov 12",
    excerpt: "Sam: “We’re renewing all 40. The 12 new stores, price that separately.”",
  },
  c1240: {
    id: "c1240",
    kind: "Call",
    label: "Today’s call · 12:40",
    date: "Nov 12",
    excerpt: "Daniel: “I’ll send pricing for the 12 stores by Monday.”",
  },
  c2130: {
    id: "c2130",
    kind: "Call",
    label: "Today’s call · 21:30",
    date: "Nov 12",
    excerpt: "Priya: “The late refreshes are the main issue. We need a date for a fix.”",
  },
  c2655: {
    id: "c2655",
    kind: "Call",
    label: "Today’s call · 26:55",
    date: "Nov 12",
    excerpt: "Daniel: “I’ll get you a fix date from our support lead by tomorrow.”",
  },
};

export const MEETINGS = [
  {
    id: "fernhill",
    time: "10:00",
    account: "Fernhill Outfitters",
    title: "Quarterly review",
    context: "Renewal in 74 days",
    status: "Brief ready · 1 fix to approve",
    href: "/wireframes/brief",
  },
  {
    id: "brightwater",
    time: "1:30",
    account: "Brightwater Grocers",
    title: "Onboarding check in",
    context: "Week 3 of onboarding",
    status: "Brief drafting",
  },
  {
    id: "kestrel",
    time: "4:00",
    account: "Kestrel Home",
    title: "Expansion call",
    context: "Asked about 2 more regions",
    status: "Brief drafting",
  },
];

export const BRIEF = {
  account: "Fernhill Outfitters",
  meeting: "Quarterly review · Today, 10:00 · 45 min",
  lastTouch: "Last spoke Oct 14 · 29 days ago",
  attendees: [
    { name: "Sam Reyes", role: "VP Merchandising", note: "Last touch Nov 6, email" },
    { name: "Priya Nair", role: "Retail Ops Manager", note: "New to you" },
  ],
  sections: [
    {
      id: "changed",
      title: "What changed since Oct 14",
      items: [
        {
          id: "b1",
          text: "Lena Ortiz, your day to day contact, has left Fernhill. Priya Nair is taking over.",
          sources: ["bounce"],
          confidence: "Medium",
          fix: "Mark Lena Ortiz as left and add Priya Nair as day to day contact",
        },
        {
          id: "b2",
          text: "Sam Reyes asked for pricing on 12 new stores opening in the spring.",
          sources: ["sam"],
          confidence: "High",
        },
        {
          id: "b3",
          text: "Store traffic dashboard use fell by about 40% after their Oct 20 reorg.",
          sources: ["usage"],
          confidence: "High",
        },
        {
          id: "b4",
          text: "Two tickets about late data refreshes; one is still open.",
          sources: ["t4821", "t4790"],
          confidence: "High",
        },
      ],
    },
    {
      id: "promises",
      title: "Promises still open",
      items: [
        {
          id: "b5",
          text: "You promised a custom markdown report by Nov 1. It hasn’t been sent.",
          sources: ["promise"],
          confidence: "High",
          tag: "Overdue",
        },
      ],
    },
    {
      id: "agenda",
      title: "Suggested agenda",
      hint: "Drafted from the lines above. Reorder or remove anything.",
      items: [
        { id: "b6", text: "Own the late markdown report and give a new date.", sources: ["promise"], confidence: "High" },
        { id: "b7", text: "Meet Priya; ask what changed in the reorg.", sources: ["bounce", "usage"], confidence: "Medium" },
        { id: "b8", text: "Open the 12 store expansion before the Jan 25 renewal.", sources: ["sam", "stage"], confidence: "High" },
      ],
    },
  ] as Section[],
};

export type LogItem = Suggestion & { kind?: "email" };

export const LOG = {
  account: "Fernhill Outfitters",
  meeting: "Quarterly review · Today, 10:00 · ended 10:41",
  transcript: [
    { t: "04:10", who: "Sam", text: "Priya Nair runs retail ops now. She’ll be your day to day contact." },
    { t: "12:05", who: "Sam", text: "We’re renewing all 40. The 12 new stores, price that separately." },
    { t: "12:40", who: "Daniel", text: "I’ll send pricing for the 12 stores by Monday." },
    { t: "21:30", who: "Priya", text: "The late refreshes are the main issue. We need a date for a fix." },
    { t: "26:55", who: "Daniel", text: "I’ll get you a fix date from our support lead by tomorrow." },
  ],
  sections: [
    {
      id: "summary",
      title: "Log",
      hint: "Goes on the account timeline once approved.",
      items: [
        { id: "l1", text: "Fernhill will renew all 40 stores on Jan 25.", sources: ["c1205"], confidence: "High" },
        { id: "l2", text: "They want the 12 new stores priced as a separate expansion.", sources: ["c1205"], confidence: "High" },
        { id: "l3", text: "Late data refreshes are their main complaint; they want a fix date.", sources: ["c2130"], confidence: "High" },
      ],
    },
    {
      id: "followups",
      title: "Follow ups",
      items: [
        { id: "l4", text: "Task for you: send pricing for 12 stores, due Mon, Nov 16.", sources: ["c1240"], confidence: "High" },
        { id: "l5", text: "Task for you: get a fix date from support, due Fri, Nov 13.", sources: ["c2655"], confidence: "High" },
        {
          id: "l6",
          kind: "email",
          text: "Follow up email to Sam and Priya: recap, the two dates, the overdue report.",
          sources: ["c1240", "c2655", "promise"],
          confidence: "Medium",
        },
      ],
    },
    {
      id: "record",
      title: "Record updates",
      items: [
        { id: "l7", text: "Add Priya Nair, Retail Ops Manager, as day to day contact.", sources: ["c0410"], confidence: "High" },
        { id: "l8", text: "Add an expansion deal: 12 stores, spring.", sources: ["c1205"], confidence: "Medium" },
        { id: "l9", text: "Set next step: send pricing by Nov 16.", sources: ["c1240"], confidence: "High" },
      ],
    },
  ] as { id: string; title: string; hint?: string; items: LogItem[] }[],
  emailDraft:
    "Hi Sam and Priya,\n\nThanks for the time today. Pricing for the 12 new stores will be with you by Monday, and I’ll have a fix date for the late refreshes by tomorrow. I also owe you the markdown report I promised for Nov 1; I’m sorry it’s late, and I’ll include a new date with the pricing.\n\nDaniel",
};
