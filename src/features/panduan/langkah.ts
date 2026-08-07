/**
 * Isi halaman panduan pemakaian website untuk pengurus desa.
 *
 * Ditulis sebagai data, bukan JSX, supaya menambah panduan baru cukup
 * menambah satu objek di daftar ini tanpa menyentuh tata letaknya.
 *
 * ATURAN ISI: hanya tulis langkah untuk fitur yang SUDAH ADA. Panduan yang
 * menjelaskan tombol yang belum dibuat lebih merugikan daripada tidak ada
 * panduan sama sekali — pembacanya akan menyangka dirinya yang salah karena
 * tidak menemukan tombolnya.
 */

export type Panduan = {
  judul: string;
  ringkasan: string;
  langkah: string[];
  catatan?: string;
};

export const DAFTAR_PANDUAN: Panduan[] = [
  {
    judul: "Membuka halaman pengelolaan",
    ringkasan:
      "Halaman pengelolaan adalah tempat mengubah isi website. Tautannya sengaja tidak dipasang di menu.",
    langkah: [
      "Buka website desa seperti biasa di peramban (Chrome, Safari, atau lainnya).",
      "Klik kolom alamat di bagian atas peramban.",
      "Tambahkan /admin di belakang alamat website, lalu tekan Enter.",
      "Halaman pengelolaan akan terbuka.",
    ],
    catatan:
      "Simpan alamat ini sebagai bookmark supaya tidak perlu mengetik ulang setiap kali.",
  },
  {
    judul: "Kalau website terlihat belum berubah",
    ringkasan:
      "Halaman website disimpan sementara supaya cepat dibuka warga. Perubahan tidak selalu langsung terlihat.",
    langkah: [
      "Tunggu beberapa saat, lalu muat ulang halaman.",
      "Kalau masih sama, tutup tab lalu buka lagi alamat websitenya.",
    ],
    catatan:
      "Ini bukan kerusakan. Website memang dirancang menyimpan salinan halaman supaya hemat dan tetap cepat dibuka dari jaringan desa.",
  },
];

/**
 * Hal yang belum bisa dikerjakan lewat website, ditulis terbuka.
 *
 * Lebih baik pengurus desa tahu batasnya sekarang daripada mencari-cari
 * tombol yang memang belum ada.
 */
export const BELUM_TERSEDIA = [
  "Mengunggah foto ke galeri",
  "Mengubah isi halaman profil, sejarah, dan visi-misi",
  "Menambah jadwal agenda kegiatan",
  "Mengubah nomor kontak layanan",
];
