/**
 * Sample import for the prototype: a lead list from a trade show, 214 rows, of which 8 are shown.
 * Every name, company and address here is made up.
 */

export const FILE = { name: "retailtech-expo-leads.csv", rows: 214, from: "RetailTech Expo, Nov 10" };

export const FIELDS = ["Contact name", "Account", "Role", "Email", "Interaction date", "Interaction note", "Owner", "Don’t import"] as const;
export type Field = (typeof FIELDS)[number];

export const COLUMNS: { col: string; field: Field; confidence: "High" | "Medium"; why: string }[] = [
  { col: "Full Name", field: "Contact name", confidence: "High", why: "All 214 values look like person names." },
  { col: "Company", field: "Account", confidence: "High", why: "3 match your accounts; 41 are new companies." },
  { col: "Title", field: "Role", confidence: "High", why: "Job titles in 203 of 214 rows." },
  { col: "E-mail", field: "Email", confidence: "High", why: "205 valid addresses, 9 blank." },
  { col: "Date Met", field: "Interaction date", confidence: "Medium", why: "Two date formats in one column; see the fixes below." },
  { col: "Booth Notes", field: "Interaction note", confidence: "Medium", why: "Free text. Kept as a note, never written as a fact on the record." },
  { col: "Rep", field: "Owner", confidence: "High", why: "Every row says “Daniel O.”, matched to Daniel Orro." },
];

export type Row = { name: string; company: string; title: string; email: string; date: string; note: string; rep: string; account?: string };

export const SAMPLE: Row[] = [
  { name: "Sam Reyes", company: "Fernhill Outfitters Inc.", title: "VP Merchandising", email: "sam.reyes@fernhill.example", date: "11/10/2026", note: "Wants a forecasting demo for his planners", rep: "Daniel O.", account: "fernhill" },
  { name: "Priya Nair", company: "Fernhill Outfitters", title: "Retail Ops Manager", email: "priya.nair@fernhill.example", date: "10 Nov 2026", note: "Asked about the refresh delays", rep: "Daniel O.", account: "fernhill" },
  { name: "Mei Tanaka", company: "Kestrel Home", title: "Director of Regional Ops", email: "", date: "11/10/2026", note: "Pacific and Mountain timing", rep: "Daniel O.", account: "kestrel" },
  { name: "Jordan Pike", company: "Lumen & Lane", title: "Head of Analytics", email: "jordan@lumenlane.example", date: "11/10/2026", note: "Evaluating vendors in Q1", rep: "Daniel O." },
  { name: "Sam Reyes", company: "Fernhill Outfitters", title: "VP, Merchandising", email: "sreyes@fernhill.example", date: "10 Nov 2026", note: "Came back with two planners", rep: "Daniel O.", account: "fernhill" },
  { name: "Ines Carvalho", company: "Marlow Street Market", title: "COO", email: "ines@marlowstreet.example", date: "11/10/2026", note: "30 stores, runs on spreadsheets", rep: "Daniel O." },
  { name: "Theo Marsh", company: "Harbor Lane Books", title: "Owner", email: "theo@harborlane.example", date: "10 Nov 2026", note: "Said he’d reply about the renewal this week", rep: "Daniel O.", account: "harbor" },
  { name: "Ken Ruiz", company: "Dovetail Outdoor", title: "", email: "ken@dovetail.example", date: "11/10/2026", note: "", rep: "Daniel O." },
];

/**
 * What the AI found. "fix" rules change values and wait for Approve; "choice" rules are decisions only a
 * person makes (duplicates, missing data), so the AI lists the options and recommends none.
 */
export type Rule =
  | { id: string; kind: "fix"; title: string; rows: number; confidence: "High" | "Medium"; preview: { before: string; after: string }[] }
  | { id: string; kind: "choice"; title: string; rows: number; why: string; options: { id: string; label: string; skips: number }[] };

export const RULES: Rule[] = [
  {
    id: "dates",
    kind: "fix",
    title: "Date Met uses two formats. Read both as Nov 10, 2026.",
    rows: 61,
    confidence: "High",
    preview: [
      { before: "11/10/2026", after: "Nov 10, 2026" },
      { before: "10 Nov 2026", after: "Nov 10, 2026" },
    ],
  },
  {
    id: "company",
    kind: "fix",
    title: "“Fernhill Outfitters Inc.” is your account Fernhill Outfitters. Match those rows to it.",
    rows: 4,
    confidence: "High",
    preview: [{ before: "Fernhill Outfitters Inc.", after: "Fernhill Outfitters (existing account)" }],
  },
  {
    id: "dupes",
    kind: "choice",
    title: "Sam Reyes appears twice with different emails, and is already a contact on Fernhill.",
    rows: 2,
    why: "Deciding whether two records are the same person stays with people. Pick what happens to these rows.",
    options: [
      { id: "attach", label: "Log both visits on the existing Sam Reyes", skips: 2 },
      { id: "skip", label: "Skip both rows", skips: 2 },
      { id: "new", label: "Import as new contacts", skips: 0 },
    ],
  },
  {
    id: "noemail",
    kind: "choice",
    title: "9 rows have no email.",
    rows: 9,
    why: "Without an email these contacts can’t be matched later. Pick what happens to them.",
    options: [
      { id: "keep", label: "Import without email", skips: 0 },
      { id: "skip", label: "Skip these rows", skips: 9 },
    ],
  },
];
