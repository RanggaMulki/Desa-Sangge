import type { Metadata } from "next";
import { KepalaHalaman } from "@/features/tata-letak/components/KepalaHalaman";
import { BaganPemerintahan } from "@/features/pemerintahan/components/BaganPemerintahan";
import { KatalogPerangkat } from "@/features/pemerintahan/components/KatalogPerangkat";

export const metadata: Metadata = {
  title: "Struktur Organisasi dan Tata Kerja Pemerintah Desa Sangge",
  description:
    "Bagan struktur organisasi beserta nama dan foto lengkap perangkat Desa Sangge.",
};

export const revalidate = 3600;

/**
 * Halaman detail struktur pemerintahan, dituju dari tautan "Lihat struktur
 * lebih lengkap" di halaman profil.
 *
 * Halaman profil hanya menampilkan bagan pohonnya; halaman ini menampilkan
 * bagan yang sama PLUS katalog wajah lengkapnya, supaya profil tetap ringkas
 * dan yang butuh detail bisa membukanya sekali klik.
 */
export default function StrukturPemerintahan() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
      <KepalaHalaman judul="Struktur Organisasi dan Tata Kerja Pemerintah Desa Sangge" />

      <section aria-labelledby="judul-bagan">
        <h2
          id="judul-bagan"
          className="judul-seksi-beranda mb-6 text-balance text-left text-hijau-pekat"
        >
          Bagan Organisasi
        </h2>
        {/* Bagan pohon dulu, lalu wajah perangkatnya langsung di bawahnya —
            satu kesatuan tanpa judul kedua. */}
        <BaganPemerintahan />
        <div className="mt-12">
          <KatalogPerangkat />
        </div>
      </section>
    </div>
  );
}
