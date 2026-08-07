import type { Infografis } from "@/db/schema";
import type { BentukGrafik } from "./kategori";

/**
 * Kategori infografis khusus Risiko Stunting Balita.
 *
 * Disimpan di tabel `infografis` yang sama dengan data kependudukan, dibedakan
 * lewat nilai enum berawalan "stunting-". Nama golongan DIKUNCI di sini supaya
 * pengurus desa hanya mengubah angka, tidak membuat variasi ejaan yang memecah
 * data — pola yang sama persis dengan KATEGORI_INFOGRAFIS pada kategori.ts.
 *
 * Dasar klasifikasi: Standar Antropometri Anak (Permenkes No. 2 Tahun 2020),
 * data pemantauan posyandu/e-PPGBM. Balita = usia 0–59 bulan.
 */
export type KategoriStunting = Extract<
  Infografis["kategori"],
  | "stunting-tbu"
  | "stunting-bbu"
  | "stunting-dusun"
  | "stunting-jenis-kelamin"
  | "stunting-umur"
>;

export const KATEGORI_STUNTING: {
  kunci: KategoriStunting;
  judul: string;
  keterangan: string;
  bentuk: BentukGrafik;
  variabel: readonly string[];
}[] = [
  {
    kunci: "stunting-tbu",
    judul: "Status Tinggi Badan menurut Umur (TB/U)",
    keterangan:
      "Indikator utama stunting. Balita berstatus Pendek dan Sangat Pendek dihitung sebagai stunting.",
    bentuk: "pai",
    variabel: ["Sangat Pendek", "Pendek", "Normal", "Tinggi"],
  },
  {
    kunci: "stunting-bbu",
    judul: "Status Berat Badan menurut Umur (BB/U)",
    keterangan:
      "Gambaran gizi kurang menurut berat badan balita, melengkapi ukuran tinggi badan.",
    bentuk: "kolom",
    variabel: [
      "Berat Badan Sangat Kurang",
      "Berat Badan Kurang",
      "Berat Badan Normal",
      "Risiko Berat Badan Lebih",
    ],
  },
  {
    kunci: "stunting-dusun",
    judul: "Balita Stunting per Dusun",
    keterangan:
      "Jumlah balita pendek dan sangat pendek di tiap dusun, untuk melihat sebaran wilayah.",
    bentuk: "kolom",
    variabel: ["Dusun I", "Dusun II", "Dusun III"],
  },
  {
    kunci: "stunting-jenis-kelamin",
    judul: "Balita menurut Jenis Kelamin",
    keterangan: "Jumlah balita laki-laki dan perempuan yang dipantau.",
    bentuk: "pai",
    variabel: ["Laki-laki", "Perempuan"],
  },
  {
    kunci: "stunting-umur",
    judul: "Balita menurut Kelompok Umur",
    keterangan: "Sebaran umur balita yang dipantau, dalam bulan.",
    bentuk: "kolom",
    variabel: [
      "0-5 bulan",
      "6-11 bulan",
      "12-23 bulan",
      "24-35 bulan",
      "36-47 bulan",
      "48-59 bulan",
    ],
  },
];

/** Semua kunci kategori stunting — dipakai untuk menyaring/menghapus barisnya. */
export const KUNCI_KATEGORI_STUNTING = KATEGORI_STUNTING.map((k) => k.kunci);

/**
 * Label TB/U yang dihitung sebagai stunting. "Sangat Pendek" dan "Pendek"
 * sama-sama mengandung kata "pendek", jadi pencocokan cukup pakai kata itu.
 */
export const KATA_STUNTING_TBU = "pendek";

export const KUNCI_PENGATURAN_STUNTING = {
  periode: "stunting.periode",
  sumberNama: "stunting.sumber-nama",
  sumberUrl: "stunting.sumber-url",
} as const;

export const SUMBER_STUNTING_DEFAULT = {
  nama: "Posyandu Desa Sangge",
  url: "",
} as const;
