import type { Infografis } from "@/db/schema";
import { GOLONGAN_UMUR_PENDUDUK } from "./penduduk";

export type KategoriInfografis = Infografis["kategori"];

/** Satu baris data siap tampil: nama golongan dan jumlahnya. */
export type Butir = { id: string; label: string; nilai: number };

export type BentukGrafik = "kolom" | "pai" | "piramida";

/**
 * Kelompok data kependudukan yang dipakai halaman publik dan admin.
 *
 * Nama golongan dikunci supaya admin hanya
 * mengubah angka dan tidak membuat variasi ejaan yang memecah data.
 */
export const KATEGORI_INFOGRAFIS: {
  kunci: KategoriInfografis;
  judul: string;
  keterangan: string;
  bentuk: BentukGrafik;
  variabel: readonly string[];
  urut?: boolean;
}[] = [
  {
    kunci: "jenis-kelamin",
    judul: "Jenis Kelamin",
    keterangan: "Jumlah penduduk laki-laki dan perempuan.",
    bentuk: "kolom",
    variabel: ["Laki-laki", "Perempuan"],
  },
  {
    kunci: "umur-laki-laki",
    judul: "Umur Laki-laki",
    keterangan: "Sebaran umur penduduk laki-laki.",
    bentuk: "piramida",
    urut: true,
    variabel: GOLONGAN_UMUR_PENDUDUK,
  },
  {
    kunci: "umur-perempuan",
    judul: "Umur Perempuan",
    keterangan: "Sebaran umur penduduk perempuan.",
    bentuk: "piramida",
    urut: true,
    variabel: GOLONGAN_UMUR_PENDUDUK,
  },
  {
    kunci: "agama",
    judul: "Agama",
    keterangan: "Agama yang tercatat pada data kependudukan.",
    bentuk: "pai",
    variabel: [
      "Islam",
      "Kristen",
      "Katolik",
      "Hindu",
      "Buddha",
      "Konghucu",
      "Kepercayaan Lainnya",
    ],
  },
  {
    kunci: "status-perkawinan",
    judul: "Status Perkawinan",
    keterangan: "Komposisi penduduk menurut status perkawinan.",
    bentuk: "pai",
    variabel: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"],
  },
  {
    kunci: "pendidikan",
    judul: "Pendidikan",
    keterangan: "Pendidikan terakhir yang tercatat untuk setiap penduduk.",
    bentuk: "kolom",
    urut: true,
    variabel: [
      "Tidak/Belum Sekolah",
      "Belum Tamat SD/Sederajat",
      "Tamat SD/Sederajat",
      "Tamat SLTP/Sederajat",
      "Tamat SLTA/Sederajat",
      "Diploma/Sarjana",
    ],
  },
  {
    kunci: "pekerjaan",
    judul: "Pekerjaan (10 Terbanyak)",
    keterangan:
      "Sepuluh jenis pekerjaan dengan penduduk terbanyak menurut data Dukcapil.",
    bentuk: "kolom",
    variabel: [
      "Karyawan Swasta",
      "Belum/Tidak Bekerja",
      "Petani/Pekebun",
      "Pelajar/Mahasiswa",
      "Mengurus Rumah Tangga",
      "Wiraswasta",
      "Buruh Tani/Perkebunan",
      "Buruh Harian Lepas",
      "Perdagangan",
      "Guru",
    ],
  },
];
