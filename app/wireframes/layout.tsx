import type { Metadata } from "next";
import Link from "next/link";
import { WfNav } from "@/components/wf/WfNav";
import { ME } from "@/content/sample";

export const metadata: Metadata = {
  title: "Wireframes · Groundwork",
  description: "Grayscale wireframes of the meeting loop: Today, Meeting brief and Log a call. Sample data.",
};

export default function WireframesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="wf min-h-svh">
      <header className="border-b border-line">
        <p className="border-b border-line bg-fill px-4 py-2 text-center text-sm">
          Wireframe · sample data · grayscale on purpose ·{" "}
          <Link href="/wireframes" className="underline underline-offset-4">
            All screens
          </Link>
        </p>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
          <div className="flex items-center gap-5 sm:gap-8">
            <Link href="/wireframes" className="whitespace-nowrap font-semibold">
              Groundwork
            </Link>
            <WfNav />
          </div>
          <p className="hidden text-sm text-ink-2 sm:block">
            {ME.name} · {ME.role}
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
