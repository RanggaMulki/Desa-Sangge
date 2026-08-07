import type { Metadata } from "next";
import { HalamanFormArtikel } from "@/features/artikel/components/HalamanFormArtikel";

export const metadata: Metadata = {
  title: "Tulis Informasi",
  robots: { index: false, follow: false },
};

export default async function ArtikelBaru({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; jenis?: string }>;
}) {
  const { kategori, jenis } = await searchParams;
  return (
    <HalamanFormArtikel
      kanal="informasi"
      kategoriAwal={kategori}
      jenisAwal={jenis}
    />
  );
}
