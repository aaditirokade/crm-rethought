import type { Metadata } from "next";
import Link from "next/link";
import { WfNav } from "@/components/wf/WfNav";
import { ME } from "@/content/sample";

export const metadata: Metadata = {
  title: "Wireframes · CRM Rethought",
  description: "Grayscale wireframes of the meeting loop: Today, Meeting brief and Log a call. Sample data.",
};

export default function WireframesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="wf min-h-svh">
      <p className="border-b border-line bg-fill px-4 py-2 text-center text-sm">
        Wireframe · sample data · grayscale on purpose ·{" "}
        <Link href="/wireframes" className="underline underline-offset-4">
          All screens
        </Link>
      </p>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/wireframes" className="font-semibold">
              CRM Rethought
            </Link>
            <WfNav />
          </div>
          <p className="text-sm text-ink-2">
            {ME.name}
            <span className="hidden sm:inline"> · {ME.role}</span>
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
