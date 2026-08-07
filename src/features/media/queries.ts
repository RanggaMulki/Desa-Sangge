import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { media } from "@/db/schema";

/**
 * Semua berkas di pustaka media, terbaru lebih dulu.
 *
 * Dipakai halaman pustaka media (Fase 2) untuk menampilkan dan memilih ulang
 * berkas yang sudah pernah diunggah, supaya foto yang sama tidak diunggah
 * berkali-kali dan kuota tidak terbuang.
 */
export async function ambilSemuaMedia(batas = 200) {
  return db
    .select()
    .from(media)
    .orderBy(desc(media.dibuatPada))
    .limit(batas);
}

/**
 * Total pemakaian penyimpanan dalam byte, untuk indikator kuota.
 *
 * R2 gratisnya 10 GB. Angka ini yang nanti ditampilkan sebagai "sudah terpakai
 * sekian dari 10 GB" supaya pengurus desa tahu sebelum kepenuhan, bukan setelah
 * unggahan mulai gagal.
 */
export async function totalUkuranMedia(): Promise<number> {
  const [hasil] = await db
    .select({ total: sql<number>`coalesce(sum(${media.ukuranByte}), 0)::bigint` })
    .from(media);
  return Number(hasil?.total ?? 0);
}
