import type { Metadata } from "next";
import { Shell } from "@/components/proto/Shell";

export const metadata: Metadata = {
  title: "Prototype · CRM Rethought",
  description: "A working prototype of the meeting loop: brief, call log, approvals and the account record. Sample data.",
};

export default function PrototypeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
