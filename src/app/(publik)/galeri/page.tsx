import type { Metadata } from "next";
import { GridGaleri } from "@/features/galeri/components/GridGaleri";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi foto kegiatan warga dan pemerintah Desa Sangge.",
};

export const revalidate = 3600;

export default function Galeri() {
  return (
    // Satu seksi, latar warna solid, isinya hanya foto. Judul disimpan sebagai
    // sr-only supaya halaman tetap punya <h1> untuk pembaca layar & mesin cari.
    <section className="min-h-screen bg-latar">
      <h1 className="sr-only">Galeri Kegiatan Desa Sangge</h1>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
        <GridGaleri />
      </div>
    </section>
  );
}
