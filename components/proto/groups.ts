import { EVENTS } from "@/content/more";
import { account, MEETINGS, type Suggestion } from "@/content/prototype";

/** Where a pending line came from, and where to review it in context. */
export function originOf(sug: Suggestion) {
  if (!sug.meeting) return { key: "opps", label: "Spotted by AI · opportunities", href: "/prototype/opportunities", when: "" };
  if (sug.meeting.startsWith("ask:")) {
    return { key: sug.meeting, label: `${account(sug.account)?.name} · Drafted from Ask`, href: "/prototype", when: "" };
  }
  if (sug.meeting.startsWith("event:")) {
    const ev = EVENTS.find((e) => `event:${e.id}` === sug.meeting);
    return { key: sug.meeting, label: `${account(sug.account)?.name} · ${ev?.title ?? "Notes"}`, href: `/prototype/quick-log/${ev?.id}`, when: ev?.day ?? "" };
  }
  const m = MEETINGS.find((x) => x.id === sug.meeting);
  return {
    key: sug.meeting,
    label: `${account(sug.account)?.name} · ${m?.title ?? ""}`,
    href: sug.kind === "fix" ? `/prototype/brief/${sug.meeting}` : `/prototype/log/${sug.meeting}`,
    when: m ? `${m.day}, ${m.time}` : "",
  };
}

export function groupByOrigin(items: Suggestion[]) {
  const map = new Map<string, { origin: ReturnType<typeof originOf>; items: Suggestion[] }>();
  for (const x of items) {
    const o = originOf(x);
    if (!map.has(o.key)) map.set(o.key, { origin: o, items: [] });
    map.get(o.key)!.items.push(x);
  }
  // Drafts chosen from Ask come first, so "Review it" lands on them (decision 0099).
  const all = [...map.values()];
  return [...all.filter((g) => g.origin.key.startsWith("ask:")), ...all.filter((g) => !g.origin.key.startsWith("ask:"))];
}
