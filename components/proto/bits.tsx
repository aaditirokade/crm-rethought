import type { Account } from "@/content/prototype";

export function Health({ a }: { a: Pick<Account, "health" | "healthWhy"> }) {
  const tone = a.health === "Healthy" ? "text-good" : a.health === "At risk" ? "text-risk" : "text-warn";
  const icon = a.health === "Healthy" ? "●" : a.health === "At risk" ? "■" : "▲";
  return (
    <span className={tone}>
      <span aria-hidden="true">{icon} </span>
      {a.health}
      <span className="text-ink-2"> · {a.healthWhy}</span>
    </span>
  );
}

export function PageHead({ kicker, title, sub }: { kicker?: React.ReactNode; title: string; sub?: React.ReactNode }) {
  return (
    <div>
      {kicker ? <div className="font-mono text-meta tracking-wide text-ink-2">{kicker}</div> : null}
      <h1 className="mt-1 text-h1 font-semibold">{title}</h1>
      {sub ? <div className="mt-1 text-ink-2">{sub}</div> : null}
    </div>
  );
}
