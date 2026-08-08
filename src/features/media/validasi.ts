/**
 * Aturan berkas yang boleh diunggah.
 *
 * Dipakai dua kali: di peramban sebelum unggah (Fase 2, pesan langsung ke
 * pengurus desa) dan di server sebagai jaring pengaman. Jaring server tetap
 * wajib walau peramban sudah memeriksa — pemeriksaan di peramban bisa dilewati
 * siapa pun yang memanggil server action langsung, dan halaman pengelolaan
 * sedang berjalan tanpa login.
 */

/**
 * Tipe MIME yang diizinkan, dipetakan ke akhiran berkasnya.
 *
 * HEIC/HEIF (format bawaan foto iPhone) TIDAK ada di sini dengan sengaja:
 * peramban selain Safari tak bisa menampilkannya, jadi menyimpannya percuma.
 * Foto HEIC diubah ke JPEG di peramban sebelum diunggah (lihat FormGaleri),
 * sehingga yang sampai ke server sudah berupa JPEG yang pasti bisa tampil.
 */
export const TIPE_DIIZINKAN: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "application/pdf": "pdf",
};

/**
 * Batas ukuran di server: 6 MB, disamakan dengan `bodySizeLimit` di
 * next.config.ts. Foto dari HP (3–8 MB) dikompresi di peramban jauh di bawah
 * angka ini sebelum dikirim; batas ini hanya menahan yang lolos tanpa kompresi.
 */
export const MAKS_BYTE = 6 * 1024 * 1024;

/** Nama folder tujuan di dalam bucket, sekaligus daftar yang sah. */
export type FolderMedia =
  | "galeri"
  | "artikel"
  | "perangkat"
  | "lampiran"
  | "sambutan"
  | "halaman";
export const FOLDER_MEDIA: FolderMedia[] = [
  "galeri",
  "artikel",
  "perangkat",
  "lampiran",
  "sambutan",
  "halaman",
];

export type HasilPeriksa =
  | { ok: true; ekstensi: string }
  | { ok: false; pesan: string };

/**
 * Periksa satu berkas. Mengembalikan pesan bahasa sehari-hari kalau ditolak,
 * bukan melempar error, supaya pemanggil bisa menampilkannya apa adanya.
 */
export function periksaBerkas(tipe: string, ukuranByte: number): HasilPeriksa {
  const ekstensi = TIPE_DIIZINKAN[tipe];
  if (!ekstensi) {
    return {
      ok: false,
      pesan: "Jenis berkas ini belum didukung. Unggah foto (JPG, PNG) atau PDF.",
    };
  }
  if (ukuranByte > MAKS_BYTE) {
    return {
      ok: false,
      pesan: "Ukuran berkas terlalu besar. Coba foto yang lebih kecil.",
    };
  }
  return { ok: true, ekstensi };
}
