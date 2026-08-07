import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KepalaHalaman } from "@/features/tata-letak/components/KepalaHalaman";
import { DaftarKanal } from "@/features/artikel/components/DaftarKanal";
import { ambilKategori, KATEGORI_INFORMASI } from "@/features/artikel/kategori";

export const revalidate = 3600;

/** Hanya kanal edukasi Informasi (kesehatan, perawatan alat). */
export async function generateStaticParams() {
  return KATEGORI_INFORMASI.map((k) => ({ kategori: k.kode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const info = ambilKategori(kategori);
  if (!info?.kanalInformasi) return { title: "Halaman tidak ditemukan" };

  return { title: info.label, description: info.deskripsi };
}

export default async function KanalInformasi({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const info = ambilKategori(kategori);

  // Hanya kanal Informasi yang punya halaman ini. Kategori warisan seperti
  // berita, pengumuman, dan sejarah-budaya ditolak (kanalInformasi = false).
  if (!info?.kanalInformasi) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
      <KepalaHalaman judul={info.label} keterangan={info.deskripsi} />
      <DaftarKanal kategori={info} />
    </div>
  );
}
