import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HalamanArtikel } from "@/features/artikel/components/HalamanArtikel";
import {
  ambilArtikelBySlug,
  ambilSlugArtikelTerbit,
} from "@/features/artikel/queries";
import { ambilKategori } from "@/features/artikel/kategori";
import { jenisKontenSah } from "@/features/artikel/jenis";

export const revalidate = 3600;

export async function generateStaticParams() {
  const semua = await ambilSlugArtikelTerbit();
  return semua
    .filter(
      (a) =>
        ambilKategori(a.kategori)?.kanalInformasi &&
        jenisKontenSah(a.kategori, a.jenisKonten),
    )
    .map((a) => ({ kategori: a.kategori, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}): Promise<Metadata> {
  const { kategori, slug } = await params;
  const info = ambilKategori(kategori);
  if (!info?.kanalInformasi) return { title: "Tulisan tidak ditemukan" };

  const artikel = await ambilArtikelBySlug(slug);
  if (
    !artikel ||
    artikel.kategori !== info.kode ||
    !jenisKontenSah(artikel.kategori, artikel.jenisKonten)
  ) {
    return { title: "Tulisan tidak ditemukan" };
  }

  const deskripsi =
    artikel.jenisKonten === "poster"
      ? `Poster ${info.label.toLowerCase()}: ${artikel.judul}.`
      : artikel.ringkasan;

  return {
    title: artikel.judul,
    description: deskripsi,
    openGraph: {
      title: artikel.judul,
      description: deskripsi,
      type: "article",
      images: artikel.gambarSampulUrl ? [artikel.gambarSampulUrl] : undefined,
    },
  };
}

export default async function DetailInformasi({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}) {
  const { kategori, slug } = await params;
  const info = ambilKategori(kategori);
  if (!info?.kanalInformasi) notFound();

  return (
    <HalamanArtikel
      slug={slug}
      basis={`/informasi/${info.kode}`}
      kategoriSah={[info.kode]}
    />
  );
}
