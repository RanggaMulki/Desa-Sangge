import { cache } from "react";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { statistikDesa } from "@/db/schema";

/**
 * Angka desa untuk beranda.
 *
 * Mengembalikan array kosong kalau belum diisi, dan pemanggilnya wajib
 * menyembunyikan seluruh seksi. Menampilkan "0 Jiwa" membuat website
 * terlihat terbengkalai, persis yang terjadi pada situs desa lain.
 *
 * Dibungkus `cache()` karena satu halaman bisa memanggilnya lebih dari sekali
 * (kisi angkanya sendiri, dan keterangan tahun datanya). Tanpa ini, satu
 * halaman jadi dua kueri untuk data yang sama persis.
 */
export const ambilStatistik = cache(async function () {
  return db.select().from(statistikDesa).orderBy(asc(statistikDesa.urutan));
});

/**
 * Angka yang dirujuk halaman lain, dicari lewat kolom `kunci` — BUKAN lewat
 * pencocokan teks label.
 *
 * Pencocokan teks (`label.includes("luas")`) rapuh: begitu pengurus desa
 * mengganti nama labelnya, angkanya hilang diam-diam tanpa pesan apa pun.
 * `kunci` adalah penanda tetap yang tidak ikut berubah saat label diedit.
 */
export async function ambilStatistikBerkunci(kunci: string) {
  const semua = await ambilStatistik();
  return semua.find((s) => s.kunci === kunci) ?? null;
}
