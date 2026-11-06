"use client";

import Link from "next/link";
import { ACCOUNTS } from "@/content/prototype";
import { Health, PageHead } from "../bits";
import { Lists } from "./Lists";
import { liveAccount, pending, useProto } from "../store";

export function Accounts() {
  const s = useProto();
  return (
    <div>
      <PageHead title="Accounts" sub={`${ACCOUNTS.length} accounts you own`} />
      <Lists />
      <div className="proto-card relative mt-6 overflow-x-auto" role="region" aria-label="Accounts table" tabIndex={0}>
        <table className="w-full min-w-[46rem] text-left">
          <caption className="sr-only">Accounts with health, renewal, last touch and lines waiting for approval</caption>
          <thead className="border-b border-line font-mono text-meta tracking-wide text-ink-2">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">ACCOUNT</th>
              <th scope="col" className="px-4 py-2 font-medium">HEALTH</th>
              <th scope="col" className="px-4 py-2 font-medium">RENEWAL</th>
              <th scope="col" className="px-4 py-2 font-medium">LAST TOUCH</th>
              <th scope="col" className="px-4 py-2 font-medium">WAITING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ACCOUNTS.map((base) => {
              const a = liveAccount(s, base.id) ?? base;
              const w = pending(s, (x) => x.account === base.id).length;
              return (
                <tr key={a.id}>
                  <th scope="row" className="px-4 py-3 align-top font-normal">
                    <Link href={`/prototype/accounts/${a.id}`} className="font-semibold hover:underline">
                      {a.name}
                    </Link>
                    <span className="block text-small text-ink-2">
                      {a.segment} · {a.stores} stores
                    </span>
                  </th>
                  <td className="px-4 py-3 align-top text-small">
                    <Health a={a} />
                  </td>
                  <td className="px-4 py-3 align-top font-mono text-meta">{a.renewal.toUpperCase()}</td>
                  <td className="px-4 py-3 align-top font-mono text-meta">{a.lastTouch.toUpperCase()}</td>
                  <td className="px-4 py-3 align-top font-mono text-meta">
                    {w ? <span className="text-accent">{w} TO APPROVE</span> : <span className="text-ink-2">NONE</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
