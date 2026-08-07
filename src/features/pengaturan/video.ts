/**
 * Video profil desa yang tampil di beranda.
 *
 * Disimpan di tabel `pengaturan` sebagai tautan YouTube — BUKAN berkas video di
 * server. Alasannya kuota: video berukuran ratusan MB, jauh melewati batas
 * unggah 6 MB dan menghabiskan 10 GB R2 dalam sekali unggah, sementara situs
 * harus hidup bertahun-tahun tanpa dipantau. YouTube yang menyimpan dan
 * menstreaming; situs cukup menyematkannya. Nol biaya, nol kuota.
 */
export const KUNCI_VIDEO_PROFIL = "beranda.video-profil";

/**
 * Ambil ID video (11 karakter) dari berbagai bentuk tautan YouTube yang wajar
 * ditempel pengurus: watch?v=, youtu.be/, /embed/, /shorts/, /live/, atau ID
 * telanjang. Mengembalikan null kalau bukan tautan YouTube yang dikenali.
 */
export function idYouTube(masukan: string): string | null {
  const teks = masukan.trim();
  if (!teks) return null;

  const pola = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of pola) {
    const cocok = teks.match(p);
    if (cocok) return cocok[1];
  }

  // ID telanjang yang ditempel langsung.
  if (/^[A-Za-z0-9_-]{11}$/.test(teks)) return teks;

  return null;
}

/**
 * Alamat sematan untuk <iframe>, memakai domain nocookie supaya tidak memasang
 * cookie pelacak sebelum video diputar — sejalan dengan sikap privasi situs.
 * Mengembalikan null bila tautannya bukan YouTube yang sah.
 */
export function urlSematanYouTube(masukan: string): string | null {
  const id = idYouTube(masukan);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

/** Bentuk kanonik yang disimpan, supaya rapi dan mudah dibuka lagi. */
export function urlKanonikYouTube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
