/**
 * Daftar slug halaman statis yang dikenali aplikasi.
 *
 * Sebagian dibuat saat seed, sedangkan dokumen baru seperti Misi dibuat lewat
 * upsert ketika pertama kali disimpan. Semuanya memiliki slug tetap karena
 * dipakai sebagai kontrak antara query dan halaman pengelolaan.
 */
export const SLUG_HALAMAN = {
  profil: "profil-desa",
  sejarah: "sejarah",
  // Visi dan misi disimpan sebagai HTML dari editor teks kaya. Tabel `misi`
  // lama tetap dibaca sebagai cadangan sampai pengurus menyimpan lewat editor.
  visi: "visi",
  misi: "misi",
  kppa: "kppa",
  // Naskah sambutan Kepala Desa. Berbeda dari slug lain, ini TIDAK punya
  // alamat halaman sendiri: dipakai sebagai seksi di beranda. Seksinya
  // disembunyikan bila kontennya masih kosong.
  sambutan: "sambutan",
} as const;

export type SlugHalaman = (typeof SLUG_HALAMAN)[keyof typeof SLUG_HALAMAN];

/**
 * Kunci pengaturan (tabel key-value) untuk foto khusus seksi Sambutan di
 * beranda. Disimpan di `pengaturan`, bukan kolom baru di `halaman_statis`,
 * supaya tidak perlu migrasi — sama seperti titik peta. Kalau kosong, beranda
 * memakai foto Kepala Desa dari data Perangkat.
 */
export const KUNCI_FOTO_SAMBUTAN = "sambutan.foto";
