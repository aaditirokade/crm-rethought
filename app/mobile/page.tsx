import type { Metadata } from "next";
import Link from "next/link";
import { MobileApp } from "@/components/mobile/MobileApp";

export const metadata: Metadata = {
  title: "Mobile app · Groundwork",
  description: "Groundwork on a phone: next meeting, swipe to approve, Ask, and voice notes. Sample data.",
};

export default function MobilePage() {
  return (
    <main className="sig min-h-svh lg:grid lg:place-items-center lg:px-8 lg:py-6">
      <div className="hidden w-full max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div>
          <p className="font-mono text-meta tracking-wide text-ink-2">CRM RETHOUGHT · MOBILE · CONCEPT PROTOTYPE · SAMPLE DATA</p>
          <h1 className="mt-2 text-h1 font-semibold">For the minutes between meetings</h1>
          <p className="mt-3 max-w-md text-ink-2">
            On the way to a meeting, an account manager needs three things to know, not a dashboard. After it, they need to log
            it in a minute. The phone app does those two jobs, with the same rule as the desktop: the AI drafts, a person approves.
          </p>
          <ul className="mt-5 space-y-2 text-small">
            <li>
              <span className="font-semibold">Next up:</span> the next meeting and what changed, every line with its source.
            </li>
            <li>
              <span className="font-semibold">Approve:</span> swipe right to approve, left to dismiss, or use the buttons.
            </li>
            <li>
              <span className="font-semibold">Ask:</span> the same sourced answers as the desktop.
            </li>
            <li>
              <span className="font-semibold">Voice note:</span> talk after a conversation; each sentence becomes a line to approve.
            </li>
          </ul>
          <p className="mt-5 text-small text-ink-2">
            Approvals here show up in the{" "}
            <Link href="/prototype" className="underline underline-offset-4">
              desktop prototype
            </Link>{" "}
            too. Open this page on a phone to use it full screen.
          </p>
        </div>
        <div className="mob-frame" aria-label="Phone preview" role="region">
          <MobileApp />
        </div>
      </div>
      <div className="h-svh lg:hidden">
        <MobileApp />
      </div>
    </main>
  );
}
