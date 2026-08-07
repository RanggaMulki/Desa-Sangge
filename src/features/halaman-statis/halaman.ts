/**
 * Daftar halaman statis yang selalu ada.
 *
 * Halaman-halaman ini di-seed sekali lalu hanya diubah isinya lewat halaman
 * pengelolaan. Tidak pernah dibuat atau dihapus dari UI, karena setiap
 * slug-nya sudah dipakai sebagai alamat halaman di app/.
 */
export const SLUG_HALAMAN = {
  profil: "profil-desa",
  sejarah: "sejarah",
  // Hanya pernyataan visi. Butir misi disimpan di tabel `misi` sendiri,
  // karena bentuknya daftar, bukan paragraf.
  visi: "visi",
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
