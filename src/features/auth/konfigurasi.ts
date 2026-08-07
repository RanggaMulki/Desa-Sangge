/**
 * ============================================================
 *  SAKLAR LOGIN ADMIN
 * ============================================================
 *
 * false = siapa pun yang membuka /admin langsung masuk, tanpa login.
 * true  = wajib masuk dengan email dan kata sandi.
 *
 * Saat ini disetel `true`: halaman /admin dan seluruh server action
 * pengelolaan hanya bisa dipakai setelah masuk dengan akun pengurus.
 *
 * Dua lapis penjaganya:
 *   1. Middleware (proxy.ts) mengalihkan pemuatan halaman /admin ke /admin/masuk
 *      bila belum ada sesi yang sah.
 *   2. `pastikanPengurus()` di tiap server action menolak permintaan tanpa sesi
 *      — menutup celah "action dipanggil langsung tanpa membuka halaman".
 *
 * Untuk MASUK: gunakan akun yang sudah ada, atau atur kata sandinya dengan
 *   SANDI_ADMIN='katasandianda' npm run db:sandi
 * (lihat src/db/atur-sandi.ts). Untuk mematikan login sementara saat
 * pengembangan, ubah satu baris di bawah menjadi `false` — tidak ada langkah
 * lain, dan penjaga di atas otomatis jadi tanpa-efek.
 *
 * PERINGATAN bila disetel `false` di website yang sudah tayang: siapa pun di
 * internet yang membuka /admin dapat menulis, mengubah, dan menghapus seluruh
 * isi website, termasuk nomor kontak layanan perlindungan perempuan dan anak.
 */
export const WAJIB_LOGIN = true;
