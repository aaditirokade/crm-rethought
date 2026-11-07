/**
 * How many of the 13 AI sales products we read do each of the six things Groundwork plans to do
 * (research/competitive-analysis.md, as of Nov 6, 2026). One ordinal scale in one hue:
 * dark = yes, light = partly, fill = no mention found. Every segment carries its number.
 */
const ROWS: { label: string; yes: number; partly: number; none: number; ours?: boolean }[] = [
  { label: "Call log into the CRM", yes: 9, partly: 3, none: 1 },
  { label: "Brief before a meeting", yes: 7, partly: 3, none: 3 },
  { label: "Deal risk with a reason", yes: 4, partly: 8, none: 1 },
  { label: "What changed since last time", yes: 2, partly: 5, none: 6 },
  { label: "Person approves first", yes: 3, partly: 3, none: 7 },
  { label: "Source on each AI line", yes: 0, partly: 5, none: 8 },
];
const TOTAL = 13;

export function Coverage() {
  return (
    <figure className="relative max-w-[32rem]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-meta tracking-wide text-ink-2" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span className="cov-key cov-yes" /> YES
        </span>
        <span className="flex items-center gap-1.5">
          <span className="cov-key cov-partly" /> PARTLY
        </span>
        <span className="flex items-center gap-1.5">
          <span className="cov-key cov-none" /> NO MENTION FOUND
        </span>
      </div>
      <ol className="mt-4 space-y-3" aria-hidden="true">
        {ROWS.map((r) => (
          <li key={r.label}>
            <p className="flex justify-between gap-3 text-small">
              <span className="font-medium">{r.label}</span>
              <span className="font-mono text-meta text-ink-2">{r.yes} OF {TOTAL} YES</span>
            </p>
            <div className="cov-bar mt-1.5">
              {(["yes", "partly", "none"] as const).map((k) =>
                r[k] ? (
                  <span key={k} className={`cov-seg cov-${k}`} style={{ flexGrow: r[k] }} title={`${r.label}: ${r[k]} ${k === "none" ? "no mention found" : k}`}>
                    {r[k]}
                  </span>
                ) : null,
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="sr-only">
      <table>
        <caption>How many of 13 AI sales products do each thing, from their public pages</caption>
        <thead>
          <tr>
            <th scope="col">Capability</th>
            <th scope="col">Yes</th>
            <th scope="col">Partly</th>
            <th scope="col">No mention found</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.yes}</td>
              <td>{r.partly}</td>
              <td>{r.none}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <figcaption className="mt-5 text-small text-ink-2">
        Thirteen products that put AI around the meeting, read from their public pages on Nov 6, 2026. Not hands on trials.
      </figcaption>
    </figure>
  );
}
