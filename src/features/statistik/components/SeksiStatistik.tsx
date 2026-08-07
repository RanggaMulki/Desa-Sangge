import { KisiStatistik, tahunStatistikTerbaru } from "./KisiStatistik";
import { SeksiBerjudul } from "@/features/tata-letak/components/SeksiBerjudul";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";

/**
 * Blok "Desa Sangge dalam Angka" di halaman profil.
 *
 * Berbeda dari versi beranda, blok ini TIDAK hilang saat datanya kosong,
 * melainkan berganti keterangan. Alasannya: di profil, halaman ini menautkan
 * bagiannya lewat jangkar (mis. /profil#angka dari pengalihan alamat lama),
 * dan bagian yang lenyap membuat jangkar itu tak punya sasaran. Di beranda
 * tidak ada jangkar, jadi di sana seksinya boleh hilang total.
 */
export async function SeksiStatistik() {
  const tahun = await tahunStatistikTerbaru();

  return (
    <SeksiBerjudul
      id="angka"
      judul="Desa Sangge dalam Angka"
      keterangan={tahun !== null ? `Data tahun ${tahun}.` : undefined}
    >
      {tahun !== null ? (
        <KisiStatistik terang />
      ) : (
        <KotakKosong
          judul="Angka desa belum diisi"
          pesan="Jumlah penduduk, kepala keluarga, dan luas wilayah akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
        />
      )}
    </SeksiBerjudul>
  );
}
