/**
 * Tab kategori pada halaman Infografis — SUMBER TUNGGAL.
 *
 * Dua kategori: Penduduk (data kependudukan) dan Risiko Stunting (kesehatan).
 * Tiap kategori punya HALAMANNYA SENDIRI (rute terpisah di
 * app/(publik)/infografis/), bukan ditumpuk dalam satu halaman panjang — supaya
 * tiap fitur rapi, mudah dicari, dan bisa dikembangkan sendiri-sendiri.
 *
 * Menambah atau membuang tab cukup dari daftar di bawah, lalu menyiapkan berkas
 * rutenya. Urutannya sekaligus urutan tampil di navigasi.
 */
export type KunciTab = "penduduk" | "stunting";

export const TAB_INFOGRAFIS: {
  kunci: KunciTab;
  label: string;
  href: string;
  /** Dipakai sebagai judul & keterangan halaman kategori itu. */
  judul: string;
  keterangan: string;
}[] = [
  {
    kunci: "penduduk",
    label: "Penduduk",
    href: "/infografis",
    judul: "Data Kependudukan",
    keterangan:
      "Jumlah penduduk Desa Sangge menurut dusun, umur, pendidikan, pekerjaan, dan agama.",
  },
  {
    kunci: "stunting",
    label: "Risiko Stunting",
    href: "/infografis/stunting",
    judul: "Risiko Stunting",
    keterangan:
      "Data ibu hamil berisiko KEK dan kondisi gizi balita di Desa Sangge.",
  },
];

/** Cari satu tab berdasarkan kuncinya. Dipakai tiap halaman kategori. */
export function tab(kunci: KunciTab) {
  const t = TAB_INFOGRAFIS.find((x) => x.kunci === kunci);
  if (!t) throw new Error(`Tab infografis tidak dikenal: ${kunci}`);
  return t;
}
