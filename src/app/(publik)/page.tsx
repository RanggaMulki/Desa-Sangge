import type { Metadata } from "next";
import { Hero } from "@/features/beranda/components/Hero";
import { StripStatistik } from "@/features/beranda/components/StripStatistik";
import { SambutanKepalaDesa } from "@/features/beranda/components/SambutanKepalaDesa";
import { VideoProfil } from "@/features/beranda/components/VideoProfil";
import { PerangkatRingkas } from "@/features/beranda/components/PerangkatRingkas";
import { PotensiDesa } from "@/features/beranda/components/PotensiDesa";
import { AgendaTerdekat } from "@/features/beranda/components/AgendaTerdekat";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website resmi Desa Sangge, Kecamatan Klego, Kabupaten Boyolali. " +
    "Informasi kesehatan, panduan perawatan alat, agenda, dan layanan warga.",
};

/**
 * Halaman disajikan statis dan dibangun ulang tiap jam.
 *
 * Penting untuk free tier: tanpa ini, setiap kunjungan akan menembak Neon
 * dan menghabiskan compute hours pada website yang berjalan bertahun-tahun
 * tanpa dipantau siapa pun.
 */
export const revalidate = 3600;

/**
 * Urutan seksi meniru struktur situs desa rujukan, tapi ISINYA disesuaikan
 * dengan kenyataan Desa Sangge (desa pertanian, bukan desa wisata pesisir):
 *
 *   Hero              foto sawah penuh
 *   Strip Statistik   pita gelap "Desa Sangge dalam Angka"
 *   Sambutan          Kepala Desa (naskah masih sementara)
 *   Video Profil      video profil desa
 *   Aparat            empat pejabat inti (foto + nama)
 *   Potensi           pertanian (foto dan uraian ringkas)
 *   Agenda            kegiatan mendatang
 *
 * Seksi yang datanya kosong (statistik, agenda, informasi, sambutan)
 * tidak dirender sama sekali. Latar yang bersebelahan tetap berasal dari dua
 * warna tema yang sama, jadi halaman tidak membentuk belang baru saat satu
 * seksi hilang.
 *
 * APB Desa dan etalase UMKM belum dipasang di beranda karena data resminya
 * belum tersedia. Rute infografis APB Desa tetap dapat diakses dari navigasi.
 *
 * CATATAN: <PitaKppa /> sementara dilepas dari beranda atas permintaan.
 * Komponennya masih ada di features/beranda/components/PitaKppa.tsx dan
 * tinggal dipasang kembali di sini setelah nomor kontak KPPA yang asli tersedia.
 */
export default function Beranda() {
  return (
    <>
      <Hero />
      <StripStatistik />
      <SambutanKepalaDesa />
      <VideoProfil />
      <PerangkatRingkas />
      <PotensiDesa />
      <AgendaTerdekat />
    </>
  );
}
