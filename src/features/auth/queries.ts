import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pengguna } from "@/db/schema";
import { bacaSesi } from "./session";
import { WAJIB_LOGIN } from "./konfigurasi";

/**
 * Data pengguna yang sedang masuk, diambil ulang dari database.
 *
 * Cookie hanya menyimpan id dan nama. Untuk apa pun yang menentukan hak akses,
 * baca dari database supaya akun yang baru dinonaktifkan langsung kehilangan
 * akses tanpa perlu menunggu cookie-nya kedaluwarsa.
 */
export async function ambilPenggunaSaatIni() {
  /**
   * Saat login dimatikan, tidak ada sesi sehingga tidak ada penulis.
   * Dipakaikan akun admin pertama supaya artikel tetap punya penulis dan
   * halaman admin tetap bisa menyapa dengan sebuah nama.
   *
   * Konsekuensinya: semua tulisan tercatat atas nama akun yang sama, siapa
   * pun yang sebenarnya menulis.
   */
  if (!WAJIB_LOGIN) {
    const [pertama] = await db
      .select({
        id: pengguna.id,
        nama: pengguna.nama,
        email: pengguna.email,
        aktif: pengguna.aktif,
      })
      .from(pengguna)
      .where(eq(pengguna.aktif, true))
      .orderBy(asc(pengguna.dibuatPada))
      .limit(1);
    return pertama ?? null;
  }

  const sesi = await bacaSesi();
  if (!sesi) return null;

  const [akun] = await db
    .select({
      id: pengguna.id,
      nama: pengguna.nama,
      email: pengguna.email,
      aktif: pengguna.aktif,
    })
    .from(pengguna)
    .where(eq(pengguna.id, sesi.penggunaId))
    .limit(1);

  if (!akun || !akun.aktif) return null;
  return akun;
}

/**
 * Penjaga untuk server action yang hanya boleh dijalankan pengurus.
 *
 * Dipanggil di baris pertama tiap action pengelolaan. Middleware (proxy.ts)
 * sudah menjaga PEMUATAN halaman /admin, tetapi server action adalah endpoint
 * POST tersendiri yang bisa dipanggil langsung tanpa membuka halamannya —
 * jadi tiap action wajib memeriksa sesinya sendiri, bukan menitipkan ke
 * middleware.
 *
 * Selama WAJIB_LOGIN masih `false`, `ambilPenggunaSaatIni()` selalu
 * mengembalikan akun admin pertama, sehingga penjaga ini TIDAK berefek apa pun
 * — situs tetap terbuka seperti sekarang. Begitu login dinyalakan, penjaga
 * inilah yang menutup lubangnya.
 *
 * Melempar (bukan mengembalikan hasil) supaya action berhenti sebelum
 * menyentuh database. Pengguna sah tidak pernah kena lemparan ini karena
 * mereka selalu punya sesi; yang kena hanyalah permintaan tanpa sesi sah.
 */
export async function pastikanPengurus() {
  const akun = await ambilPenggunaSaatIni();
  if (!akun) {
    throw new Error("Tidak diizinkan. Masuk dulu sebagai pengurus desa.");
  }
  return akun;
}

/**
 * Daftar semua akun pengurus untuk halaman Kelola Akun.
 *
 * `email` di database itu nama pengguna (nama kolom historis). Kata sandinya
 * TIDAK pernah ikut dibaca — hanya hash yang tersimpan, dan itu pun tak
 * diperlukan di sini.
 */
export async function ambilSemuaPengguna() {
  return db
    .select({
      id: pengguna.id,
      nama: pengguna.nama,
      namaPengguna: pengguna.email,
      aktif: pengguna.aktif,
      dibuatPada: pengguna.dibuatPada,
    })
    .from(pengguna)
    .orderBy(asc(pengguna.dibuatPada));
}
