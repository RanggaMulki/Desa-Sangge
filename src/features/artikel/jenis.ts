import type { KodeKategori } from "./kategori";

export type JenisKonten = "materi" | "poster";

export const JENIS_KONTEN: Record<
  JenisKonten,
  {
    label: string;
    labelSingkat: string;
    deskripsi: string;
  }
> = {
  materi: {
    label: "Materi / artikel",
    labelSingkat: "Materi",
    deskripsi:
      "Tulisan kesehatan atau panduan lengkap dengan ringkasan dan isi yang dapat dibaca warga.",
  },
  poster: {
    label: "Poster informasi",
    labelSingkat: "Poster",
    deskripsi:
      "Satu gambar poster siap baca. Tidak memerlukan ringkasan atau isi artikel.",
  },
};

/**
 * Kesehatan menerima materi dan poster. Perawatan Alat khusus poster.
 * Berita serta Pengumuman tetap berupa tulisan.
 */
export function jenisKontenSah(
  kategori: KodeKategori,
  jenisKonten: JenisKonten,
) {
  if (kategori === "kesehatan") return true;
  if (kategori === "perawatan-alat") return jenisKonten === "poster";
  return jenisKonten === "materi";
}

export function namaKonten(
  jenisKonten: JenisKonten,
  kategori?: KodeKategori,
) {
  if (jenisKonten === "poster") return "poster";
  if (kategori === "berita") return "berita";
  if (kategori === "pengumuman") return "pengumuman";
  return "materi";
}
