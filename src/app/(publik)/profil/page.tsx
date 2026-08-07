import type { Metadata } from "next";
import Link from "next/link";
import { SeksiBerlatar } from "@/features/tata-letak/components/SeksiBerlatar";
import { PetaLokasi } from "@/features/pemerintahan/components/PetaLokasi";
import { VisiMisi } from "@/features/halaman-statis/components/VisiMisi";
import { SejarahDesa } from "@/features/halaman-statis/components/SejarahDesa";
import { BaganPemerintahan } from "@/features/pemerintahan/components/BaganPemerintahan";
import { IDENTITAS } from "@/features/tata-letak/navigasi";

export const metadata: Metadata = {
  title: "Profil Desa",
  description:
    `Visi dan misi, bagan pemerintahan, sejarah, dan lokasi ${IDENTITAS.nama}, ` +
    `${IDENTITAS.wilayah}.`,
};

export const revalidate = 3600;

/**
 * Profil desa: empat bagian bertumpuk, tiap bagian berbeda warna latarnya.
 *
 *   Visi & Misi   hijau muda
 *   Bagan         putih
 *   Sejarah       permukaan (abu kehijauan tipis)
 *   Peta          putih
 *
 * Warna tiap bagian cukup diganti lewat satu prop `latar` di bawah.
 *
 * `id` tiap bagian bukan hiasan: alamat lama /profil/visi-misi, /profil/
 * sejarah, dan /profil/pemerintahan dialihkan ke jangkar ini lewat
 * next.config.ts. Mengubah `id` berarti memutus pengalihan yang sesuai.
 *
 * Halaman ini tidak lagi memakai pita judul di atas, atas permintaan —
 * langsung masuk ke bagian pertama. Judul halaman tetap ada tapi hanya untuk
 * pembaca layar dan mesin pencari (<h1> sr-only di bawah): tanpa itu, halaman
 * kehilangan penanda "ini halaman apa" dan hierarki judulnya langsung loncat
 * ke <h2>.
 */
export default function ProfilDesa() {
  return (
    <>
      <h1 className="sr-only">Profil {IDENTITAS.nama}</h1>

      <VisiMisi />

      <SeksiBerlatar
        id="pemerintahan"
        judul="Struktur Organisasi dan Tata Kerja Pemerintah Desa Sangge"
        latar="terang"
      >
        <BaganPemerintahan />

        {/* Tautan ke halaman detail: bagan + katalog wajah lengkap. Ditaruh di
            kanan bawah, tebal dan huruf besar, sesuai contoh yang diminta. */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/profil/pemerintahan"
            className="inline-flex items-center gap-2 font-bold uppercase text-tinta underline-offset-4 hover:text-hijau-utama hover:underline"
          >
            Lihat struktur lebih lengkap
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6l-6 6" />
            </svg>
          </Link>
        </div>
      </SeksiBerlatar>

      <SeksiBerlatar
        id="sejarah"
        judul="Sejarah dan Legenda Desa"
        keterangan="Riwayat Sendang Sangge dan cerita yang diwariskan masyarakat."
        latar="permukaan"
      >
        <SejarahDesa />
      </SeksiBerlatar>

      <SeksiBerlatar
        id="peta"
        judul="Peta Lokasi Desa"
        lebar="lebar"
        keterangan="Letak dan batas wilayah Desa Sangge, Kecamatan Klego, Kabupaten Boyolali."
        latar="terang"
      >
        <PetaLokasi />
      </SeksiBerlatar>
    </>
  );
}
