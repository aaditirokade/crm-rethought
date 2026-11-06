import { notFound } from "next/navigation";
import { Log } from "@/components/proto/views/Log";
import { MEETINGS, TRANSCRIPT } from "@/content/prototype";

export function generateStaticParams() {
  return MEETINGS.filter((m) => m.hasLog).map((m) => ({ id: m.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!TRANSCRIPT[id]) notFound();
  return <Log id={id} />;
}
