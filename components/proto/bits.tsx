import type { Account } from "@/content/prototype";
import { Leaves } from "./Leaves";

export function Health({ a }: { a: Pick<Account, "health" | "healthWhy"> }) {
  const tone = a.health === "Healthy" ? "text-good" : a.health === "At risk" ? "text-risk" : "text-warn";
  const icon = a.health === "Healthy" ? "●" : a.health === "At risk" ? "■" : "▲";
  const wash = a.health === "Healthy" ? "is-good" : a.health === "At risk" ? "is-risk" : "is-warn";
  const [first, ...rest] = a.healthWhy.split(" ");
  return (
    <span className="health-why">
      {/* The tag, the dot and the reason's first word never break apart, so the reason always starts beside the tag. */}
      <span className="whitespace-nowrap">
        <span className={`health-pill ${wash} ${tone}`}>
          <span aria-hidden="true">{icon} </span>
          {a.health}
        </span>
        {/* The reason wears the tag's color, so the two read as one (decision 0120); every pair passes AA. */}
        <span className={`font-medium ${tone}`}>
          {" \u00B7 "}
          {first}
        </span>
      </span>
      {rest.length ? <span className={`font-medium ${tone}`}> {rest.join(" ")}</span> : null}
    </span>
  );
}

/** Every page's title sits on the leaves block (decision 0119), each page with its own arrangement of leaves. */
export function PageHead({ kicker, title, sub }: { kicker?: React.ReactNode; title: string; sub?: React.ReactNode }) {
  const seed = [...title].reduce((n, c) => n + c.charCodeAt(0), 0);
  return (
    <header className="gw-block gw-head">
      <Leaves seed={seed} count={10} />
      <Leaves seed={seed + 7} count={7} scale={0.4} spread={[0.3, 0.95]} wide className="gw-leaves-low" />
      {kicker ? <div className="font-mono text-meta tracking-wide text-ink-2">{kicker}</div> : null}
      <h1 className="mt-1 text-h1 font-semibold">{title}</h1>
      {sub ? <div className="mt-1 max-w-3xl text-ink-2">{sub}</div> : null}
    </header>
  );
}
