import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diatur di environment.");
}

/**
 * Coba-ulang khusus kegagalan JARINGAN ke Neon.
 *
 * Neon free tier menidurkan compute-nya setelah ±5 menit menganggur.
 * Permintaan PERTAMA saat compute sedang bangun kadang gagal dengan
 * "fetch failed", padahal beberapa ratus milidetik kemudian sudah siap.
 * Tanpa penanganan, satu kegagalan sesaat itu membuat seluruh halaman /admin
 * (yang query langsung ke database tiap dibuka) error total — persis yang
 * dialami pengurus saat membuka dasbor setelah website lama tak dipakai.
 *
 * Yang diulang HANYA fetch yang MELEMPAR (kegagalan jaringan/koneksi). Respons
 * HTTP yang sah — termasuk error SQL yang datang sebagai 400 — TIDAK melempar
 * di lapisan ini, jadi tidak pernah ikut diulang: query yang memang salah tetap
 * gagal cepat, bukan diulang sia-sia. Jeda bertingkat menutup waktu bangun
 * compute (±2,5 detik total) sebelum akhirnya menyerah.
 */
neonConfig.fetchFunction = async (url: string, options: RequestInit) => {
  const jedaMs = [250, 750, 1500];
  let galatTerakhir: unknown;
  for (let percobaan = 0; percobaan <= jedaMs.length; percobaan += 1) {
    try {
      return await fetch(url, options);
    } catch (galat) {
      galatTerakhir = galat;
      if (percobaan < jedaMs.length) {
        await new Promise((lanjut) => setTimeout(lanjut, jedaMs[percobaan]));
      }
    }
  }
  throw galatTerakhir;
};

/**
 * Koneksi database lewat HTTP, bukan TCP pool.
 *
 * Alasannya: tiap serverless function di Vercel berumur pendek dan bisa
 * ada banyak instance sekaligus. Connection pool TCP akan menghabiskan
 * kuota koneksi Neon free tier dengan cepat. Driver HTTP tidak menahan
 * koneksi terbuka, jadi lebih aman untuk website yang jalan tanpa dipantau.
 *
 * Konsekuensinya: tidak mendukung transaksi multi-statement. Untuk operasi
 * hapus-lalu-tulis yang harus atomik, pakai `db.batch([...])` (satu transaksi
 * lewat HTTP). Kalau nanti benar-benar butuh transaksi interaktif, ganti ke
 * `drizzle-orm/neon-serverless` (Pool) hanya pada modul yang membutuhkannya.
 */
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
