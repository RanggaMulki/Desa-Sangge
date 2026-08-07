import type { Metadata } from "next";
import { HalamanFormArtikel } from "@/features/artikel/components/HalamanFormArtikel";

export const metadata: Metadata = {
  title: "Ubah Informasi",
  robots: { index: false, follow: false },
};

export default async function UbahArtikel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HalamanFormArtikel id={id} />;
}
