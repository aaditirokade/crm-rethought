import { notFound } from "next/navigation";
import { Brief } from "@/components/proto/views/Brief";
import { MEETINGS, meeting } from "@/content/prototype";

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!meeting(id)) notFound();
  return <Brief id={id} />;
}
