import type { BatasWilayah } from "@/db/schema";

export type ArahWilayah = BatasWilayah["arah"];

/**
 * Empat arah batas desa, beserta labelnya.
 *
 * Sumber tunggal: dipakai untuk mengurutkan hasil query, memberi label di
 * halaman publik, dan menyusun isian di halaman pengelolaan. Urutannya
 * mengikuti kebiasaan dokumen desa (utara-timur-selatan-barat), bukan abjad.
 */
export const ARAH_WILAYAH: {
  kunci: ArahWilayah;
  /** Dipakai di form pengelolaan, di mana konteksnya perlu jelas. */
  label: string;
  /** Dipakai di kartu ringkas halaman publik, di mana ruangnya sempit. */
  singkat: string;
}[] = [
  { kunci: "utara", label: "Sebelah Utara", singkat: "Utara" },
  { kunci: "timur", label: "Sebelah Timur", singkat: "Timur" },
  { kunci: "selatan", label: "Sebelah Selatan", singkat: "Selatan" },
  { kunci: "barat", label: "Sebelah Barat", singkat: "Barat" },
];
