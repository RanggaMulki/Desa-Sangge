import { Ruler, Users } from "lucide-react";

import { IDENTITAS } from "@/features/tata-letak/navigasi";
import { ambilStatistik } from "@/features/statistik/queries";
import { ambilPengaturanPeta } from "@/features/pengaturan/queries";
import { alamatSematan } from "@/features/pengaturan/peta";
import { angka } from "@/lib/format";
import { ambilBatasWilayah } from "../queries";
import { ARAH_WILAYAH } from "../wilayah";

/**
 * Peta lokasi desa: sematan peta penuh di atas, diikuti batas wilayah dan
 * angka ringkas desa dalam satu alur baca vertikal.
 *
 * Sengaja RINGKAS — hanya batas desa, luas, dan jumlah penduduk. Rincian
 * kependudukan selengkapnya (per dusun, jenis kelamin, umur, pendidikan,
 * pekerjaan, agama) punya halamannya sendiri di /infografis, supaya bagian ini
 * tidak berubah menjadi tabel panjang.
 *
 * Tinggal di folder fitur, BUKAN di `tata-letak/`, karena komponen ini
 * mengambil data dari database. Aturan proyek: berkas yang menyentuh data
 * tinggal bersama fiturnya, bukan di folder bersama berisi perkakas tampilan.
 *
 * Memakai <iframe> biasa, bukan pustaka peta seperti Leaflet: pustaka peta
 * menambah paket JavaScript besar dan sering butuh kunci API yang bisa
 * kedaluwarsa — dua hal yang harus dihindari pada website yang berjalan
 * bertahun-tahun tanpa developer.
 */

/** Label pendek arah, diambil dari sumber tunggal di wilayah.ts. */
const SINGKAT = new Map(ARAH_WILAYAH.map((a) => [a.kunci, a.singkat]));

export async function PetaLokasi() {
  const { nama, peta } = IDENTITAS;

  const [batas, statistik, aturPeta] = await Promise.all([
    ambilBatasWilayah(),
    ambilStatistik(),
    ambilPengaturanPeta(),
  ]);

  /**
   * Titik peta diambil dari pengaturan yang diisi pengurus desa. Selama belum
   * diatur, dipakai alamat bawaan di navigasi.ts yang hanya menunjuk wilayah
   * kecamatan secara umum — dan catatan bawaannya menjelaskan itu apa adanya,
   * supaya tak ada yang mengira titiknya sudah pasti.
   */
  const sematan = aturPeta.titik
    ? alamatSematan(aturPeta.titik, aturPeta.zoom)
    : peta.embed;
  const catatanPeta = aturPeta.titik ? aturPeta.catatan : peta.catatan;

  /**
   * Kedua angka dicari lewat kolom `kunci`, BUKAN lewat pencocokan teks label
   * seperti `label.includes("luas")`. Pencocokan teks rapuh: begitu pengurus
   * desa mengganti nama labelnya, angkanya hilang diam-diam tanpa pesan.
   */
  const luas = statistik.find((s) => s.kunci === "luas") ?? null;
  const penduduk = statistik.find((s) => s.kunci === "penduduk") ?? null;

  // Kalau semuanya kosong, kartu informasi tidak dirender sama sekali dan peta
  // memakai lebar penuh — bukan kotak putih kosong yang terlihat rusak. Ini
  // keadaan nyata setelah `npm run db:dummy:hapus` dijalankan.
  const adaInfo = batas.length > 0 || luas !== null || penduduk !== null;

  return (
    <div>
      {/* Peta menjadi konten utama dan selalu berada sebelum informasi wilayah. */}
      <div className="overflow-hidden rounded-lg border border-garis bg-white">
        <iframe
          src={sematan}
          title={`Peta lokasi ${nama}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[clamp(20rem,48vw,32rem)] w-full border-0"
        />
      </div>

      {adaInfo && (
        <section
          aria-labelledby={batas.length > 0 ? "judul-batas-desa" : undefined}
          className="mt-4 overflow-hidden rounded-lg border border-garis bg-white"
        >
          {batas.length > 0 && (
            <div className="px-4 py-4 sm:px-5">
              <h3
                id="judul-batas-desa"
                className="text-lg font-bold text-tinta sm:text-xl"
              >
                Batas Wilayah Desa
              </h3>
              <dl className="mt-4 space-y-1 lg:grid lg:grid-cols-4 lg:divide-x lg:divide-garis lg:space-y-0">
                {batas.map((b) => (
                  <div
                    className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-2.5 lg:block lg:px-5 lg:py-3 first:lg:pl-0 last:lg:pr-0"
                    key={b.id}
                  >
                    <dt className="text-sm font-bold text-hijau-utama">
                      {SINGKAT.get(b.arah) ?? b.arah}
                    </dt>
                    <dd className="break-words text-base leading-snug text-tinta lg:mt-1">
                      {b.keterangan}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(luas || penduduk) && (
            <div
              className={`grid border-t border-garis bg-krem/45 ${
                luas && penduduk
                  ? "grid-cols-2 divide-x divide-garis"
                  : "grid-cols-1"
              }`}
            >
              {luas && (
                <div className="flex min-w-0 gap-3 px-4 py-4 sm:px-6 sm:py-5">
                  <Ruler
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-cokelat"
                    strokeWidth={1.8}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-tinta-redup">
                      Luas Desa
                    </p>
                    <p className="mt-1 break-words text-lg font-bold text-tinta">
                      {angka(luas.nilai)}
                      {luas.satuan && ` ${luas.satuan}`}
                    </p>
                  </div>
                </div>
              )}

              {penduduk && (
                <div className="flex min-w-0 gap-3 px-4 py-4 sm:px-6 sm:py-5">
                  <Users
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-hijau-utama"
                    strokeWidth={1.8}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-tinta-redup">
                      Jumlah Penduduk
                    </p>
                    <p className="mt-1 break-words text-lg font-bold text-tinta">
                      {angka(penduduk.nilai)}
                      {penduduk.satuan && ` ${penduduk.satuan}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {catatanPeta && <p className="mt-4 text-tinta-redup">{catatanPeta}</p>}
    </div>
  );
}
