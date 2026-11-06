import { notFound } from "next/navigation";
import { QuickLog } from "@/components/proto/views/QuickLog";
import { EVENTS } from "@/content/more";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!EVENTS.some((e) => e.id === id)) notFound();
  return <QuickLog id={id} />;
}
