import type { Metadata } from "next";
import { GridGaleri } from "@/features/galeri/components/GridGaleri";
import { KepalaHalamanTerpusat } from "@/features/tata-letak/components/KepalaHalamanTerpusat";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi foto kegiatan warga dan pemerintah Desa Sangge.",
};

export const revalidate = 3600;

export default function Galeri() {
  return (
    <div className="min-h-screen bg-latar">
      <KepalaHalamanTerpusat judul="Galeri Kegiatan" />

      <section className="latar-arsip-galeri relative isolate overflow-hidden border-y border-hijau-utama/15">
        <div
          aria-hidden="true"
          className="kisi-arsip-galeri pointer-events-none absolute inset-0 -z-10"
        />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-4 sm:pb-20 sm:pt-5 lg:px-8">
          <GridGaleri />
        </div>
      </section>
    </div>
  );
}
