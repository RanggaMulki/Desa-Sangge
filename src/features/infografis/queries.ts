import { cache } from "react";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { infografis, pengaturan } from "@/db/schema";
import { KATEGORI_INFOGRAFIS, type KategoriInfografis } from "./kategori";
import {
  KUNCI_PENGATURAN_PENDUDUK,
  SUMBER_PADUKAN_SANGGE,
} from "./penduduk";
import {
  KATEGORI_STUNTING,
  KUNCI_PENGATURAN_STUNTING,
  SUMBER_STUNTING_DEFAULT,
  susunRingkasanStunting,
} from "./stunting";

/**
 * Semua rincian kependudukan, sudah dikelompokkan per kategori.
 *
 * Diambil sekali lalu dikelompokkan di memori, bukan satu query per kategori:
 * enam query terpisah untuk data sekecil ini hanya memboroskan compute Neon
 * pada free tier.
 *
 * Kategori yang belum ada isinya tetap muncul di hasil dengan daftar kosong —
 * pemanggil yang memutuskan menampilkannya atau tidak.
 */
export const ambilInfografis = cache(async function () {
  const baris = await db
    .select()
    .from(infografis)
    .orderBy(asc(infografis.urutan));

  return KATEGORI_INFOGRAFIS.map((k) => ({
    ...k,
    butir: baris.filter((b) => b.kategori === k.kunci),
  }));
});

/**
 * Jumlah laki-laki & perempuan, diambil dari kategori jenis-kelamin.
 *
 * Dipakai kartu angka pokok di atas halaman (bukan sebagai grafik terpisah).
 * Cocoknya lewat teks label — bila pengurus desa menulis label lain, angkanya
 * jatuh ke 0 dengan aman, bukan salah tempat.
 */
export async function ambilJenisKelamin() {
  const semua = await ambilInfografis();
  const butir = semua.find((k) => k.kunci === "jenis-kelamin")?.butir ?? [];
  const cari = (kata: string) =>
    butir.find((b) => b.label.toLowerCase().includes(kata))?.nilai ?? 0;
  return { laki: cari("laki"), perempuan: cari("perempuan") };
}

/** Periode dan sumber agregat yang menyertai seluruh grafik penduduk. */
export const ambilMetadataPenduduk = cache(async function () {
  const baris = await db.select().from(pengaturan);
  const nilai = new Map(baris.map((item) => [item.kunci, item.nilai]));

  return {
    periode: nilai.get(KUNCI_PENGATURAN_PENDUDUK.periode) ?? "",
    sumberNama:
      nilai.get(KUNCI_PENGATURAN_PENDUDUK.sumberNama) ??
      SUMBER_PADUKAN_SANGGE.nama,
    sumberUrl:
      nilai.get(KUNCI_PENGATURAN_PENDUDUK.sumberUrl) ??
      SUMBER_PADUKAN_SANGGE.url,
  };
});

/** Rincian satu kategori saja, dipakai form pengelolaan. */
export async function ambilInfografisPerKategori() {
  const baris = await db
    .select()
    .from(infografis)
    .orderBy(asc(infografis.urutan));

  const peta = new Map<KategoriInfografis, { label: string; nilai: number }[]>();
  for (const k of KATEGORI_INFOGRAFIS) peta.set(k.kunci, []);
  for (const b of baris) {
    peta.get(b.kategori)?.push({ label: b.label, nilai: b.nilai });
  }
  return peta;
}

// =====================================================================
// Risiko Stunting Balita
// =====================================================================

/**
 * Rincian stunting dikelompokkan per kategori, siap tampil. Sama seperti
 * ambilInfografis tapi memakai KATEGORI_STUNTING. Kategori tanpa isi tetap
 * muncul dengan daftar kosong; pemanggil yang memutuskan menampilkannya.
 */
export const ambilStunting = cache(async function () {
  const baris = await db
    .select()
    .from(infografis)
    .orderBy(asc(infografis.urutan));

  return KATEGORI_STUNTING.map((k) => ({
    ...k,
    butir: baris.filter((b) => b.kategori === k.kunci),
  }));
});

/** Rekap ibu hamil dan balita yang dipublikasikan pada halaman stunting. */
export const ambilRingkasanStunting = cache(async function () {
  const baris = await db.select().from(pengaturan);
  return susunRingkasanStunting(
    new Map(baris.map((item) => [item.kunci, item.nilai])),
  );
});

/** Periode dan sumber yang menyertai grafik stunting. */
export const ambilMetadataStunting = cache(async function () {
  const baris = await db.select().from(pengaturan);
  const nilai = new Map(baris.map((item) => [item.kunci, item.nilai]));
  const ringkasan = susunRingkasanStunting(nilai);

  return {
    periode: ringkasan.periode,
    sumberNama:
      nilai.get(KUNCI_PENGATURAN_STUNTING.sumberNama) ??
      SUMBER_STUNTING_DEFAULT.nama,
    sumberUrl:
      nilai.get(KUNCI_PENGATURAN_STUNTING.sumberUrl) ??
      SUMBER_STUNTING_DEFAULT.url,
  };
});

/** Rincian stunting per kategori, dipakai form pengelolaan. */
export async function ambilStuntingPerKategori() {
  const baris = await db
    .select()
    .from(infografis)
    .orderBy(asc(infografis.urutan));

  const peta = new Map<string, { label: string; nilai: number }[]>();
  for (const k of KATEGORI_STUNTING) peta.set(k.kunci, []);
  for (const b of baris) {
    peta.get(b.kategori)?.push({ label: b.label, nilai: b.nilai });
  }
  return peta;
}
