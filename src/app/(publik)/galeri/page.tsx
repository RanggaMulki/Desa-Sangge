import type { Metadata } from "next";
import { GridGaleri } from "@/features/galeri/components/GridGaleri";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi foto kegiatan warga dan pemerintah Desa Sangge.",
};

export const revalidate = 3600;

export default function Galeri() {
  return (
    <div className="min-h-screen bg-latar">
      <section className="latar-kepala-galeri border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-11 sm:py-14 lg:px-8">
          <h1 className="text-balance text-4xl font-extrabold text-white sm:text-5xl">
            Galeri Kegiatan
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Potret kegiatan warga, pelayanan, dan kehidupan Desa Sangge.
          </p>
        </div>
      </section>

      <section className="latar-arsip-galeri relative isolate overflow-hidden border-y border-hijau-utama/15">
        <div
          aria-hidden="true"
          className="kisi-arsip-galeri pointer-events-none absolute inset-0 -z-10"
        />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:pb-20 sm:pt-10 lg:px-8">
          <GridGaleri />
        </div>
      </section>
    </div>
  );
}
