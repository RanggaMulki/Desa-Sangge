import type { Metadata } from "next";
import { PratinjauArtikelAdmin } from "@/features/artikel/components/PratinjauArtikelAdmin";

export const metadata: Metadata = {
  title: "Pratinjau Informasi",
  robots: { index: false, follow: false },
};

export default async function PratinjauArtikel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PratinjauArtikelAdmin id={id} />;
}
