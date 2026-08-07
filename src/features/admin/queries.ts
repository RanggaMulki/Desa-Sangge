import { eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agenda, artikel, galeri, kontakLayanan } from "@/db/schema";

/**
 * ID salah satu artikel yang dipasang `npm run db:dummy`.
 *
 * Cukup satu yang diperiksa. Data contoh selalu dipasang dan dicabut
 * sekaligus, jadi kalau baris ini ada, sisanya pasti ada juga. Sejak data
 * struktural (perangkat, statistik, batas) dijadikan data resmi, yang tersisa
 * dikelola dummy hanyalah artikel & galeri contoh — jadi penandanya ikut
 * pindah ke artikel contoh pertama.
 */
const PENANDA_CONTOH = "ddd40000-0000-4000-8000-000000000001";

/**
 * Apakah data contoh masih terpasang.
 *
 * Dipakai halaman pengelolaan untuk memasang peringatan mencolok: selama masih
 * ada artikel/foto contoh, yang beredar di situs resmi adalah tulisan karangan
 * ("(contoh untuk menguji tampilan)"). Peringatannya hilang sendiri begitu
 * `npm run db:dummy:hapus` dijalankan.
 */
export async function adaDataContoh() {
  const [baris] = await db
    .select({ id: artikel.id })
    .from(artikel)
    .where(eq(artikel.id, PENANDA_CONTOH))
    .limit(1);
  return baris !== undefined;
}

/**
 * Angka ringkas untuk kartu-kartu dashboard pengelolaan.
 *
 * Empat query kecil dijalankan berbarengan; masing-masing hanya menghitung,
 * tidak menarik baris, jadi tetap ringan walau isi website sudah bertahun-
 * tahun menumpuk.
 */
export async function ambilRingkasanDashboard() {
  const hariIni = new Date().toISOString().slice(0, 10);

  const [tulisan, [agendaMendatang], [fotoGaleri], [kontakAktif]] =
    await Promise.all([
      db
        .select({
          kategori: artikel.kategori,
          terbit: sql<number>`count(*) filter (where ${artikel.status} = 'terbit')::int`,
          draf: sql<number>`count(*) filter (where ${artikel.status} = 'draf')::int`,
        })
        .from(artikel)
        .groupBy(artikel.kategori),
      db
        .select({ jumlah: sql<number>`count(*)::int` })
        .from(agenda)
        .where(gte(agenda.tanggalMulai, hariIni)),
      db.select({ jumlah: sql<number>`count(*)::int` }).from(galeri),
      db
        .select({ jumlah: sql<number>`count(*)::int` })
        .from(kontakLayanan)
        .where(eq(kontakLayanan.aktif, true)),
    ]);

  const hitung = (kategoriDicari: string[]) =>
    tulisan
      .filter((t) => kategoriDicari.includes(t.kategori))
      .reduce(
        (total, t) => ({
          terbit: total.terbit + t.terbit,
          draf: total.draf + t.draf,
        }),
        { terbit: 0, draf: 0 },
      );

  return {
    informasi: hitung(["kesehatan", "perawatan-alat"]),
    agendaMendatang: agendaMendatang?.jumlah ?? 0,
    fotoGaleri: fotoGaleri?.jumlah ?? 0,
    kontakAktif: kontakAktif?.jumlah ?? 0,
  };
}
