import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { halamanStatis, misi } from "@/db/schema";
import { SLUG_HALAMAN, type SlugHalaman } from "./halaman";
import {
  ambilButirMisiHtml,
  gabungkanMisiHtml,
  normalkanHtml,
} from "./visi-misi-html";

/**
 * Ambil satu halaman statis.
 *
 * Mengembalikan null kalau slug-nya belum pernah di-seed. Halaman pemanggil
 * wajib menangani null, bukan mengasumsikan datanya pasti ada: seed bisa saja
 * belum dijalankan di database yang baru dibuat.
 */
export async function ambilHalaman(slug: SlugHalaman) {
  const [halaman] = await db
    .select()
    .from(halamanStatis)
    .where(eq(halamanStatis.slug, slug))
    .limit(1);
  return halaman ?? null;
}

/**
 * Visi (satu pernyataan) dan misi (daftar) untuk bagian Profil.
 *
 * Diambil bersama karena digunakan sebagai satu bagian pada halaman Profil.
 * Visi bisa berupa string kosong dan Misi bisa berupa array kosong; komponen
 * penampil yang memutuskan keadaan kosong, bukan query ini.
 */
export async function ambilVisiMisi() {
  const halamanVisi = await ambilHalaman(SLUG_HALAMAN.visi);
  const halamanMisi = await ambilHalaman(SLUG_HALAMAN.misi);
  const daftarMisi = await db
    .select({ id: misi.id, teks: misi.teks })
    .from(misi)
    .orderBy(asc(misi.urutan));

  const visi = normalkanHtml(halamanVisi?.konten ?? "");
  // Baris misi lama tetap menjadi cadangan agar pembaruan ini tidak membuat
  // isi website yang sudah ada mendadak hilang. Setelah editor baru disimpan,
  // dokumen HTML-nya menjadi sumber utama.
  const misiHtml = halamanMisi
    ? normalkanHtml(halamanMisi.konten)
    : gabungkanMisiHtml(daftarMisi);
  const butirMisi = ambilButirMisiHtml(misiHtml);

  return {
    visi,
    misiHtml,
    misi: butirMisi.map((teks, index) => ({
      id: `misi-html-${index + 1}`,
      teks,
    })),
  };
}
