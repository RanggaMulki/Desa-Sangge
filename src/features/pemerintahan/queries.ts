import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { batasWilayah, perangkatDesa } from "@/db/schema";
import { ARAH_WILAYAH } from "./wilayah";

/**
 * Perangkat desa yang masih menjabat, urut sesuai kolom `urutan`.
 *
 * Urutan diatur manual, bukan diurutkan berdasarkan nama atau jabatan.
 * Struktur pemerintahan desa punya hierarki yang tidak bisa ditebak dari
 * teks jabatannya, dan pengurus desa lebih tahu urutan yang benar.
 */
export async function ambilPerangkatAktif() {
  return db
    .select()
    .from(perangkatDesa)
    .where(eq(perangkatDesa.aktif, true))
    .orderBy(asc(perangkatDesa.urutan));
}

/**
 * Nama & foto tiap slot bagan, dipetakan berdasarkan `posisi`.
 *
 * Mengembalikan Map<posisi, {nama, fotoUrl}> supaya komponen bagan tinggal
 * mencocokkan tiap slot tetapnya dengan pengisi terkini. Kalau satu posisi
 * diisi lebih dari satu baris (mis. sisa data lama), yang urutannya paling
 * kecil yang dipakai.
 */
export async function ambilPengisiStruktur() {
  const baris = await db
    .select({
      nama: perangkatDesa.nama,
      fotoUrl: perangkatDesa.fotoUrl,
      posisi: perangkatDesa.posisi,
    })
    .from(perangkatDesa)
    .where(eq(perangkatDesa.aktif, true))
    .orderBy(asc(perangkatDesa.urutan));

  const perPosisi = new Map<string, { nama: string; fotoUrl: string | null }>();
  for (const b of baris) {
    if (b.posisi && !perPosisi.has(b.posisi)) {
      perPosisi.set(b.posisi, { nama: b.nama, fotoUrl: b.fotoUrl });
    }
  }
  return perPosisi;
}

/** Urutan mata angin diambil dari sumber tunggal di wilayah.ts. */
const URUTAN_ARAH = ARAH_WILAYAH.map((a) => a.kunci);

/**
 * Batas wilayah, sudah urut utara-timur-selatan-barat.
 *
 * Diurutkan di sini, bukan lewat ORDER BY, karena urutannya mengikuti
 * kebiasaan penulisan dokumen desa dan tidak bisa diambil dari kolom mana
 * pun. Menambah kolom `urutan` hanya untuk empat baris tetap justru
 * menambah satu hal lagi yang bisa salah diisi.
 */
export async function ambilBatasWilayah() {
  const baris = await db.select().from(batasWilayah);
  return URUTAN_ARAH.map((arah) => baris.find((b) => b.arah === arah)).filter(
    (b) => b !== undefined,
  );
}
