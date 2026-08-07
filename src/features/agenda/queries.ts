import { asc, desc, eq, gte, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { agenda } from "@/db/schema";
import { tanggalHariIni } from "@/lib/format";

/** Tanggal hari ini dalam format YYYY-MM-DD, sesuai kolom `date` Postgres. */
function hariIni() {
  return tanggalHariIni();
}

/**
 * Kegiatan yang belum lewat, terdekat lebih dulu.
 *
 * Agenda yang sudah lewat sengaja tidak ditampilkan: jadwal posyandu bulan
 * lalu tidak berguna bagi warga, dan justru membuat halaman terasa basi.
 */
export async function ambilAgendaTerdekat(batas = 4) {
  return db
    .select()
    .from(agenda)
    .where(gte(agenda.tanggalMulai, hariIni()))
    .orderBy(asc(agenda.tanggalMulai))
    .limit(batas);
}

/**
 * Kegiatan yang sudah lewat, terbaru lebih dulu.
 *
 * Tidak ditampilkan di beranda, tapi halaman /agenda memerlukannya: warga
 * yang lupa kapan posyandu bulan lalu diadakan tetap butuh catatannya, dan
 * ini juga menjadi bukti bahwa desa memang aktif berkegiatan.
 */
export async function ambilAgendaLampau(batas = 12) {
  return db
    .select()
    .from(agenda)
    .where(lt(agenda.tanggalMulai, hariIni()))
    .orderBy(desc(agenda.tanggalMulai))
    .limit(batas);
}

/**
 * Seluruh agenda untuk kalender publik.
 *
 * Satu kali pengambilan lebih ringan daripada meminta ulang data setiap kali
 * pengunjung berpindah bulan. Batasnya longgar untuk arsip beberapa tahun,
 * tetapi tetap mencegah halaman membawa data tanpa batas ke browser.
 */
export async function ambilAgendaPublik(batas = 400) {
  return db
    .select()
    .from(agenda)
    .orderBy(asc(agenda.tanggalMulai))
    .limit(batas);
}

/**
 * Seluruh agenda untuk halaman pengelolaan, dipisah dua kelompok.
 *
 * "Akan datang" diurutkan dari yang terdekat (itu yang sedang diurus),
 * "sudah lewat" dari yang terbaru. Dua kelompok ini juga yang membuat
 * pengurus tidak perlu berpikir soal arsip: kegiatan otomatis pindah
 * kelompok begitu tanggalnya lewat.
 */
export async function ambilAgendaAdmin() {
  const [mendatang, lampau] = await Promise.all([
    db
      .select()
      .from(agenda)
      .where(gte(agenda.tanggalMulai, hariIni()))
      .orderBy(asc(agenda.tanggalMulai))
      .limit(200),
    db
      .select()
      .from(agenda)
      .where(lt(agenda.tanggalMulai, hariIni()))
      .orderBy(desc(agenda.tanggalMulai))
      .limit(200),
  ]);
  return { mendatang, lampau };
}

/** Satu kegiatan untuk mengisi form ubah. */
export async function ambilAgendaById(id: string) {
  const [baris] = await db
    .select()
    .from(agenda)
    .where(eq(agenda.id, id))
    .limit(1);
  return baris ?? null;
}
