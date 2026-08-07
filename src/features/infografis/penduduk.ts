import type { KategoriInfografis } from "./kategori";

export const GOLONGAN_UMUR_PENDUDUK = [
  "0-4 tahun",
  "5-9 tahun",
  "10-14 tahun",
  "15-19 tahun",
  "20-24 tahun",
  "25-29 tahun",
  "30-34 tahun",
  "35-39 tahun",
  "40-44 tahun",
  "45-49 tahun",
  "50-54 tahun",
  "55-59 tahun",
  "60-64 tahun",
  "65-69 tahun",
  "70-74 tahun",
  "75 tahun ke atas",
] as const;

export const KUNCI_PENGATURAN_PENDUDUK = {
  periode: "penduduk.periode",
  sumberNama: "penduduk.sumber-nama",
  sumberUrl: "penduduk.sumber-url",
} as const;

/**
 * Sumber resmi data kependudukan: portal PADUKAN Boyolali (Pangkalan Data
 * Kependudukan), sumber PDAK Kemendagri. Bisa dikutip publik, tidak seperti
 * pendataan internal.
 */
export const SUMBER_PADUKAN_SANGGE = {
  nama: "PDAK Kemendagri (Dukcapil), 2026 Gasal",
  url: "https://padukan.boyolali.go.id/data/beranda",
} as const;

export const SUMBER_INPUT_ADMIN = {
  nama: "Input pengelola Website Desa Sangge",
  url: "",
} as const;

/**
 * Agregat resmi Desa Sangge dari portal PADUKAN Boyolali, diambil pada tingkat
 * DESA (kode wilayah 33.09.15.2006), periode 2026 Gasal, sumber PDAK Kemendagri.
 * Tanpa nama, NIK, atau alamat — hanya agregat.
 *
 * Ini data Dukcapil (terdaftar KTP / de jure). Berbeda dari pendataan MCD desa
 * (penghuni nyata / de facto) yang sempat dipakai sebelumnya; totalnya pun
 * berbeda (3.675 vs 3.610) karena metodologinya memang beda. Yang dipublikasi
 * kini konsisten satu sumber: Dukcapil.
 *
 * Pekerjaan diambil 10 terbanyak dari daftar jabatan Dukcapil (labelnya di
 * features/infografis/kategori.ts). Pendidikan Dukcapil punya 10 jenjang;
 * jenjang diploma s.d. strata diringkas menjadi satu "Diploma/Sarjana".
 */
export const DATA_PADUKAN_SANGGE_2026 = {
  periode: "2026 Gasal",
  tahun: 2026,
  kecamatan: "Klego",
  desa: "Sangge",
  kodeWilayah: "33.09.15.2006",
  ringkasan: {
    penduduk: 3675,
    laki: 1852,
    perempuan: 1823,
    kk: 1257,
  },
  piramida: GOLONGAN_UMUR_PENDUDUK.map((label, index) => ({
    label,
    laki: [
      112, 137, 137, 143, 115, 168, 158, 124, 152, 126, 96, 90, 87, 89, 44,
      74,
    ][index],
    perempuan: [
      104, 137, 151, 119, 122, 147, 141, 132, 125, 111, 110, 89, 107, 95, 50,
      83,
    ][index],
  })),
  statusPerkawinan: [
    { label: "Belum Kawin", nilai: 1497 },
    { label: "Kawin", nilai: 1880 },
    { label: "Cerai Hidup", nilai: 73 },
    { label: "Cerai Mati", nilai: 225 },
  ],
  pendidikan: [
    { label: "Tidak/Belum Sekolah", nilai: 924 },
    { label: "Belum Tamat SD/Sederajat", nilai: 384 },
    { label: "Tamat SD/Sederajat", nilai: 1154 },
    { label: "Tamat SLTP/Sederajat", nilai: 697 },
    { label: "Tamat SLTA/Sederajat", nilai: 461 },
    { label: "Diploma/Sarjana", nilai: 55 },
  ],
  pekerjaan: [
    { label: "Karyawan Swasta", nilai: 892 },
    { label: "Belum/Tidak Bekerja", nilai: 813 },
    { label: "Petani/Pekebun", nilai: 639 },
    { label: "Pelajar/Mahasiswa", nilai: 519 },
    { label: "Mengurus Rumah Tangga", nilai: 317 },
    { label: "Wiraswasta", nilai: 200 },
    { label: "Buruh Tani/Perkebunan", nilai: 125 },
    { label: "Buruh Harian Lepas", nilai: 93 },
    { label: "Perdagangan", nilai: 22 },
    { label: "Guru", nilai: 16 },
  ],
  agama: [{ label: "Islam", nilai: 3675 }],
} as const;

export function barisInfografisPenduduk(): {
  kategori: KategoriInfografis;
  label: string;
  nilai: number;
  urutan: number;
}[] {
  const data = DATA_PADUKAN_SANGGE_2026;
  const baris: {
    kategori: KategoriInfografis;
    label: string;
    nilai: number;
    urutan: number;
  }[] = [
    {
      kategori: "jenis-kelamin",
      label: "Laki-laki",
      nilai: data.ringkasan.laki,
      urutan: 1,
    },
    {
      kategori: "jenis-kelamin",
      label: "Perempuan",
      nilai: data.ringkasan.perempuan,
      urutan: 2,
    },
  ];

  for (const [index, item] of data.piramida.entries()) {
    baris.push(
      {
        kategori: "umur-laki-laki",
        label: item.label,
        nilai: item.laki,
        urutan: index + 1,
      },
      {
        kategori: "umur-perempuan",
        label: item.label,
        nilai: item.perempuan,
        urutan: index + 1,
      },
    );
  }

  const kelompok = [
    ["status-perkawinan", data.statusPerkawinan],
    ["pendidikan", data.pendidikan],
    ["pekerjaan", data.pekerjaan],
    ["agama", data.agama],
  ] as const;

  for (const [kategori, isi] of kelompok) {
    isi.forEach((item, index) => {
      baris.push({
        kategori,
        label: item.label,
        nilai: item.nilai,
        urutan: index + 1,
      });
    });
  }

  return baris;
}
