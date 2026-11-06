"use client";

import Link from "next/link";
import { COLUMNS, FIELDS, FILE, RULES, SAMPLE } from "@/content/imports";
import { PageHead } from "../bits";
import { actions, useProto } from "../store";

/**
 * Import a trade show lead list. The AI proposes the column mapping and finds problems; a person confirms
 * the mapping, approves each fix, and makes the calls only people make (duplicates, missing data).
 * Nothing is written until Import.
 */
export function Imports() {
  const s = useProto();
  const imp = s.imp;
  const field = (col: string) => imp.mapping[col] ?? COLUMNS.find((c) => c.col === col)?.field ?? "Don’t import";
  const decided = RULES.filter((r) => imp.rules[r.id]).length;
  const datesFixed = imp.rules.dates === "approved";
  const companyFixed = imp.rules.company === "approved";
  const skipped = RULES.reduce((n, r) => {
    if (r.kind !== "choice") return n;
    const o = r.options.find((x) => x.id === imp.rules[r.id]);
    return n + (o?.skips ?? 0);
  }, 0);
  const contacts = FILE.rows - skipped;
  const ready = imp.mappingOk && decided === RULES.length;
  const steps = [
    { name: "File", done: true },
    { name: "Columns", done: imp.mappingOk },
    { name: "Fixes", done: decided === RULES.length },
    { name: "Import", done: !!imp.doneAt },
  ];

  const cell = (raw: string, kind: "date" | "company") => {
    const issue = kind === "date" ? !datesFixed && raw.includes(" ") : !companyFixed && raw.endsWith("Inc.");
    const fixed = kind === "date" ? (datesFixed ? "Nov 10, 2026" : raw) : companyFixed && raw.endsWith("Inc.") ? "Fernhill Outfitters" : raw;
    return <td className={`px-3 py-2 ${issue ? "bg-draft" : ""}`}>{issue ? <span className="font-medium">{raw}</span> : fixed}</td>;
  };

  return (
    <div>
      <PageHead title="Imports" sub="Bring a list in without breaking the record. The AI maps and checks; you decide." />

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Import steps">
        {steps.map((st, i) => (
          <li key={st.name} className={`rounded-full border px-3 py-1 font-mono text-meta tracking-wide ${st.done ? "border-good text-good" : "border-line-strong text-ink-2"}`}>
            {st.done ? "✓" : i + 1} {st.name.toUpperCase()}
            <span className="sr-only">{st.done ? ", done" : ", to do"}</span>
          </li>
        ))}
      </ol>

      {imp.doneAt ? (
        <section aria-labelledby="h-done" className="proto-card mt-6 p-5">
          <p className="sig-approved-tag">{"✓"} IMPORTED BY DANIEL · {imp.doneAt}</p>
          <h2 id="h-done" className="mt-1 text-h2 font-semibold">
            {contacts} contacts imported from {FILE.name}
          </h2>
          <p className="mt-1 text-ink-2">
            Visits to Fernhill, Kestrel and Harbor Lane are on their timelines as notes. 41 new companies wait in a list for review
            before they become accounts.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/prototype/accounts/fernhill" className="sig-btn sig-btn-primary">
              See it on Fernhill
            </Link>
            <button type="button" className="sig-btn" onClick={() => actions.undoImport()}>
              Undo import
            </button>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="h-file" className="proto-card mt-6 p-4 sm:p-5">
        <h2 id="h-file" className="text-h3 font-semibold">
          1 · File
        </h2>
        <p className="mt-1">
          <span className="font-mono text-meta tracking-wide">{FILE.name.toUpperCase()}</span> · {FILE.rows} rows · from {FILE.from}
        </p>
        <p className="text-small text-ink-2">A sample file for the demo. The first 8 rows are shown; highlighted cells have a problem the AI found.</p>
        <div className="relative mt-3 overflow-x-auto" role="region" aria-label="First 8 rows of the file" tabIndex={0}>
          <table className="w-full min-w-[56rem] text-left text-small">
            <caption className="sr-only">First 8 rows of {FILE.name}</caption>
            <thead className="border-b border-line font-mono text-meta tracking-wide text-ink-2">
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c.col} scope="col" className="px-3 py-2 font-medium">
                    {c.col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SAMPLE.map((r, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">{r.name}</td>
                  {cell(r.company, "company")}
                  <td className="px-3 py-2">{r.title || <span className="text-ink-2">blank</span>}</td>
                  <td className={`px-3 py-2 ${!r.email ? "bg-draft" : ""}`}>{r.email || <span className="font-medium">blank</span>}</td>
                  {cell(r.date, "date")}
                  <td className="px-3 py-2">{r.note || <span className="text-ink-2">blank</span>}</td>
                  <td className="px-3 py-2">{r.rep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-cols" className="proto-card mt-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="h-cols" className="text-h3 font-semibold">
            2 · Columns
          </h2>
          {imp.mappingOk ? <span className="sig-approved-tag">{"✓"} CONFIRMED BY DANIEL</span> : <span className="sig-draft-tag">DRAFT MAPPING</span>}
        </div>
        <p className="text-small text-ink-2">The AI matched each column to a field and says why. Change any of them before you confirm.</p>
        <ul className={`mt-3 divide-y divide-line rounded-[4px] ${imp.mappingOk ? "" : "sig-row-draft"}`}>
          {COLUMNS.map((c) => (
            <li key={c.col} className="grid gap-2 px-3 py-3 sm:grid-cols-[10rem_14rem_minmax(0,1fr)] sm:items-center">
              <span className="font-mono text-meta font-medium tracking-wide">{c.col.toUpperCase()}</span>
              <label>
                <span className="sr-only">Field for {c.col}</span>
                <select className="proto-input py-1 text-small" value={field(c.col)} onChange={(e) => actions.setMapping(c.col, e.target.value)}>
                  {FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-small">
                {c.why} <span className="font-mono text-meta text-ink-2">CONFIDENCE {c.confidence.toUpperCase()}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          {imp.mappingOk ? (
            <button type="button" className="sig-btn" onClick={() => actions.confirmMapping(false)}>
              Change the mapping
            </button>
          ) : (
            <button type="button" className="sig-btn sig-btn-primary" onClick={() => actions.confirmMapping(true)}>
              Confirm mapping
            </button>
          )}
        </div>
      </section>

      <section aria-labelledby="h-fixes" className="proto-card mt-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="h-fixes" className="text-h3 font-semibold">
            3 · Fixes
          </h2>
          <span className="font-mono text-meta tracking-wide text-ink-2">
            {decided} OF {RULES.length} DECIDED
          </span>
        </div>
        <p className="text-small text-ink-2">Each fix shows its rows before and after. Calls about people stay with you; the AI lists the options and picks none.</p>
        <ul className="mt-3 space-y-3">
          {RULES.map((r) => {
            const d = imp.rules[r.id];
            return (
              <li key={r.id} className={`rounded-[4px] border p-3 ${d ? "border-line" : r.kind === "fix" ? "sig-row-draft border-transparent" : "border-line-strong"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  {r.kind === "fix" ? (
                    d === "approved" ? (
                      <span className="sig-approved-tag">{"✓"} FIX APPROVED</span>
                    ) : d === "dismissed" ? (
                      <span className="font-mono text-meta tracking-wide text-ink-2">FIX DISMISSED · ROWS KEPT AS THEY ARE</span>
                    ) : (
                      <span className="sig-draft-tag">DRAFT FIX</span>
                    )
                  ) : (
                    <span className="font-mono text-meta tracking-wide text-warn">{"▲"} PEOPLE ONLY</span>
                  )}
                  <span className="font-mono text-meta text-ink-2">{r.rows} ROWS</span>
                </div>
                <p className="mt-1">{r.title}</p>
                {r.kind === "fix" ? (
                  <>
                    <ul className="mt-2 space-y-1">
                      {r.preview.map((p) => (
                        <li key={p.before} className="flex flex-wrap items-center gap-2 font-mono text-meta">
                          <span className="rounded-[3px] bg-surface-2 px-1.5 py-0.5 line-through decoration-ink-2">{p.before}</span>
                          <span aria-hidden="true">{"→"}</span>
                          <span className="sr-only">becomes</span>
                          <span className="rounded-[3px] border border-good px-1.5 py-0.5 text-good">{p.after}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 font-mono text-meta text-ink-2">CONFIDENCE {r.confidence.toUpperCase()}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {d ? (
                        <button type="button" className="sig-btn" onClick={() => actions.decideRule(r.id, "", "Fix reopened.")}>
                          Undo
                        </button>
                      ) : (
                        <>
                          <button type="button" className="sig-btn sig-btn-primary" onClick={() => actions.decideRule(r.id, "approved", `Fix approved for ${r.rows} rows.`)}>
                            Approve for {r.rows} rows
                          </button>
                          <button type="button" className="sig-btn" onClick={() => actions.decideRule(r.id, "dismissed", "Fix dismissed. Rows kept as they are.")}>
                            Not right
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <fieldset className="mt-2">
                    <legend className="text-small text-ink-2">{r.why}</legend>
                    <div className="mt-2 space-y-1.5">
                      {r.options.map((o) => (
                        <label key={o.id} className="flex cursor-pointer items-center gap-2 text-small">
                          <input
                            type="radio"
                            name={r.id}
                            checked={d === o.id}
                            onChange={() => actions.decideRule(r.id, o.id, `${o.label}.`)}
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="h-run" className="sticky bottom-0 mt-6 border-t border-line bg-bg py-4">
        <h2 id="h-run" className="sr-only">
          4 · Import
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-small">
            {ready ? (
              <>
                Ready: <span className="font-semibold">{contacts} contacts</span> and their notes. Nothing is written until you press Import.
              </>
            ) : (
              <span className="text-ink-2">
                {imp.mappingOk ? "" : "Confirm the column mapping. "}
                {decided < RULES.length ? `${RULES.length - decided} ${RULES.length - decided === 1 ? "fix needs" : "fixes need"} a decision.` : ""}
              </span>
            )}
          </p>
          <button type="button" className="sig-btn sig-btn-primary" disabled={!ready || !!imp.doneAt} onClick={() => actions.runImport(contacts)}>
            {imp.doneAt ? "Imported" : `Import ${ready ? contacts : ""} contacts`}
          </button>
        </div>
      </section>
    </div>
  );
}
