import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { galeri } from "@/db/schema";

/** Foto kegiatan terbaru untuk cuplikan di beranda. */
export async function ambilGaleriTerbaru(batas = 6) {
  return db
    .select()
    .from(galeri)
    .orderBy(desc(galeri.tanggal))
    .limit(batas);
}

/**
 * Seluruh isi galeri untuk halaman /galeri.
 *
 * Diberi batas atas walaupun tidak ada penomoran halaman. Galeri desa
 * realistisnya berisi puluhan foto, bukan ribuan, dan batas ini mencegah
 * satu halaman raksasa kalau ternyata dugaan itu meleset.
 */
export async function ambilSemuaGaleri(batas = 60) {
  return db
    .select()
    .from(galeri)
    .orderBy(desc(galeri.tanggal))
    .limit(batas);
}
