import { notFound } from "next/navigation";
import { AccountView } from "@/components/proto/views/AccountView";
import { ACCOUNTS, account } from "@/content/prototype";

export function generateStaticParams() {
  return ACCOUNTS.map((a) => ({ id: a.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!account(id)) notFound();
  return <AccountView id={id} />;
}
