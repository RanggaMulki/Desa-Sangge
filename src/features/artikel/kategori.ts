/**
 * Sumber tunggal kebenaran untuk kategori artikel.
 *
 * Menambah kategori baru cukup diubah di berkas ini (dan di enum
 * `kategoriArtikel` pada src/db/schema.ts). Jangan menulis ulang daftar
 * kategori di komponen mana pun.
 */

export type KodeKategori =
  | "berita"
  | "pengumuman"
  | "kesehatan"
  | "perawatan-alat"
  | "sejarah-budaya";

export type Kategori = {
  kode: KodeKategori;
  /** Label yang dilihat admin dan pengunjung. Bahasa sehari-hari. */
  label: string;
  /** Kalimat penjelas di halaman daftar dan kartu kanal di beranda. */
  deskripsi: string;
  /** Muncul di menu "Informasi" pada navigasi utama. */
  kanalInformasi: boolean;
};

export const KATEGORI: Record<KodeKategori, Kategori> = {
  berita: {
    kode: "berita",
    label: "Berita",
    deskripsi: "Kabar dan kegiatan terbaru dari Desa Sangge.",
    kanalInformasi: false,
  },
  pengumuman: {
    kode: "pengumuman",
    label: "Pengumuman",
    deskripsi: "Informasi resmi dari pemerintah desa.",
    kanalInformasi: false,
  },
  kesehatan: {
    kode: "kesehatan",
    label: "Kesehatan",
    deskripsi: "Panduan menjaga kesehatan keluarga, dari balita sampai lansia.",
    kanalInformasi: true,
  },
  "perawatan-alat": {
    kode: "perawatan-alat",
    label: "Perawatan Alat",
    deskripsi: "Cara merawat peralatan pertanian dan rumah tangga agar awet.",
    kanalInformasi: true,
  },
  "sejarah-budaya": {
    kode: "sejarah-budaya",
    label: "Sejarah & Budaya",
    deskripsi: "Asal-usul, tradisi, dan kekayaan budaya Desa Sangge.",
    // Dipertahankan untuk membaca record lama tanpa migrasi enum Postgres,
    // tetapi tidak lagi menjadi kanal informasi publik.
    kanalInformasi: false,
  },
};

export const SEMUA_KATEGORI = Object.values(KATEGORI);

/** Kategori yang tampil sebagai kanal edukasi di beranda dan menu Informasi. */
export const KATEGORI_INFORMASI = SEMUA_KATEGORI.filter(
  (k) => k.kanalInformasi,
);

export function ambilKategori(kode: string): Kategori | undefined {
  return KATEGORI[kode as KodeKategori];
}

// =============================================================
// Kanal pengelolaan
// =============================================================

/**
 * Dua pintu pengelolaan artikel di halaman admin.
 *
 * Tabelnya satu (artikel), tapi pengurus desa mengelolanya lewat dua menu
 * terpisah supaya tidak tercampur: "Informasi" untuk artikel edukasi yang
 * tahan lama, "Berita" untuk kabar dan pengumuman yang terikat waktu.
 * Editor dan mesin penyimpanannya tetap satu — hanya pintunya yang beda.
 */
export type KanalKelola = "informasi" | "berita";

/** Kategori yang boleh dibuat/diubah dari tiap pintu pengelolaan. */
export const KATEGORI_PER_KANAL: Record<KanalKelola, KodeKategori[]> = {
  informasi: ["kesehatan", "perawatan-alat"],
  berita: ["berita", "pengumuman"],
};

/** Seluruh kategori yang bisa dikelola dari admin (sejarah-budaya tidak). */
export const KATEGORI_BISA_KELOLA: KodeKategori[] = [
  ...KATEGORI_PER_KANAL.informasi,
  ...KATEGORI_PER_KANAL.berita,
];

/** Menentukan artikel ini milik pintu pengelolaan yang mana. */
export function kanalDariKategori(kode: KodeKategori): KanalKelola {
  return KATEGORI_PER_KANAL.berita.includes(kode) ? "berita" : "informasi";
}

/** Alamat halaman daftar admin untuk sebuah kanal. */
export function urlAdminKanal(kanal: KanalKelola): string {
  return kanal === "berita" ? "/admin/berita" : "/admin/artikel";
}

/** Alamat publik sebuah artikel, mengikuti kategorinya. */
export function urlPublikArtikel(kode: KodeKategori, slug: string): string {
  return kanalDariKategori(kode) === "berita"
    ? `/berita/${slug}`
    : `/informasi/${kode}/${slug}`;
}
