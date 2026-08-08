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

/**
 * Angka ringkas yang dipublikasikan pada halaman Risiko Stunting.
 *
 * Bentuknya mengikuti rekap Desa Sangge Juni 2026: data ibu hamil berisiko
 * KEK serta tiga indikator risiko pada balita. Nilai disimpan sebagai
 * `pengaturan` agar pengurus dapat memperbaruinya tanpa menambah enum atau
 * migrasi database setiap kali format rekap berubah.
 */
export type RingkasanStunting = {
  periode: string;
  jumlahIbuHamil: number;
  ibuHamilKek: number;
  jumlahBalita: number;
  balitaPendek: number;
  balitaGiziKurang: number;
  balitaBeratBadanKurang: number;
};

export const DATA_STUNTING_JUNI_2026: RingkasanStunting = {
  periode: "Juni 2026",
  jumlahIbuHamil: 17,
  ibuHamilKek: 2,
  jumlahBalita: 185,
  balitaPendek: 29,
  balitaGiziKurang: 10,
  balitaBeratBadanKurang: 28,
};

/** Urutan dan nama isian dijadikan satu sumber untuk form serta action. */
export const ISIAN_STUNTING = [
  {
    kunci: "jumlahIbuHamil",
    nama: "jumlah-ibu-hamil",
    label: "Total ibu hamil",
  },
  {
    kunci: "ibuHamilKek",
    nama: "ibu-hamil-kek",
    label: "Ibu hamil berisiko KEK",
  },
  {
    kunci: "jumlahBalita",
    nama: "jumlah-balita",
    label: "Total balita",
  },
  {
    kunci: "balitaPendek",
    nama: "balita-pendek",
    label: "Balita pendek atau sangat pendek",
  },
  {
    kunci: "balitaGiziKurang",
    nama: "balita-gizi-kurang",
    label: "Balita gizi kurang",
  },
  {
    kunci: "balitaBeratBadanKurang",
    nama: "balita-berat-badan-kurang",
    label: "Balita dengan berat badan kurang",
  },
] as const satisfies readonly {
  kunci: Exclude<keyof RingkasanStunting, "periode">;
  nama: string;
  label: string;
}[];

export const KUNCI_DATA_STUNTING = {
  periode: "stunting.periode",
  jumlahIbuHamil: "stunting.jumlah-ibu-hamil",
  ibuHamilKek: "stunting.ibu-hamil-kek",
  jumlahBalita: "stunting.jumlah-balita",
  balitaPendek: "stunting.balita-pendek",
  balitaGiziKurang: "stunting.balita-gizi-kurang",
  balitaBeratBadanKurang: "stunting.balita-berat-badan-kurang",
} as const;

export const KUNCI_PENGATURAN_STUNTING = {
  ...KUNCI_DATA_STUNTING,
  sumberNama: "stunting.sumber-nama",
  sumberUrl: "stunting.sumber-url",
} as const;

export const SUMBER_STUNTING_DEFAULT = {
  nama: "Posyandu Desa Sangge",
  url: "",
} as const;

/** Persentase mentah; pembulatan tampilan ditangani Intl.NumberFormat. */
export function hitungPersentase(jumlah: number, total: number): number {
  return total > 0 ? (jumlah / total) * 100 : 0;
}

/** Memastikan setiap jumlah risiko tidak melampaui total kelompoknya. */
export function validasiRingkasanStunting(
  ringkasan: RingkasanStunting,
): string | null {
  if (ringkasan.jumlahIbuHamil === 0 && ringkasan.jumlahBalita === 0) {
    return "Total ibu hamil dan total balita tidak boleh sama-sama 0.";
  }
  if (ringkasan.ibuHamilKek > ringkasan.jumlahIbuHamil) {
    return "Ibu hamil berisiko KEK tidak boleh melebihi total ibu hamil.";
  }

  const risikoBalita = [
    ["Balita pendek atau sangat pendek", ringkasan.balitaPendek],
    ["Balita gizi kurang", ringkasan.balitaGiziKurang],
    ["Balita dengan berat badan kurang", ringkasan.balitaBeratBadanKurang],
  ] as const;
  const tidakSah = risikoBalita.find(
    ([, jumlah]) => jumlah > ringkasan.jumlahBalita,
  );

  return tidakSah
    ? `${tidakSah[0]} tidak boleh melebihi total balita.`
    : null;
}

/**
 * Membentuk data aman dari pengaturan database. Isian hilang atau rusak jatuh
 * ke rekap Juni 2026, sehingga halaman tidak kembali menampilkan angka contoh
 * lama ketika kode pertama kali diterapkan.
 */
export function susunRingkasanStunting(
  nilai: ReadonlyMap<string, string>,
): RingkasanStunting {
  const adaRekapBaru = ISIAN_STUNTING.some((isian) =>
    nilai.has(KUNCI_DATA_STUNTING[isian.kunci]),
  );
  const baca = (
    kunci: (typeof KUNCI_DATA_STUNTING)[keyof typeof KUNCI_DATA_STUNTING],
    bawaan: number,
  ) => {
    const hasil = Number(nilai.get(kunci));
    return Number.isInteger(hasil) && hasil >= 0 ? hasil : bawaan;
  };

  return {
    periode:
      (adaRekapBaru && nilai.get(KUNCI_DATA_STUNTING.periode)?.trim()) ||
      DATA_STUNTING_JUNI_2026.periode,
    jumlahIbuHamil: baca(
      KUNCI_DATA_STUNTING.jumlahIbuHamil,
      DATA_STUNTING_JUNI_2026.jumlahIbuHamil,
    ),
    ibuHamilKek: baca(
      KUNCI_DATA_STUNTING.ibuHamilKek,
      DATA_STUNTING_JUNI_2026.ibuHamilKek,
    ),
    jumlahBalita: baca(
      KUNCI_DATA_STUNTING.jumlahBalita,
      DATA_STUNTING_JUNI_2026.jumlahBalita,
    ),
    balitaPendek: baca(
      KUNCI_DATA_STUNTING.balitaPendek,
      DATA_STUNTING_JUNI_2026.balitaPendek,
    ),
    balitaGiziKurang: baca(
      KUNCI_DATA_STUNTING.balitaGiziKurang,
      DATA_STUNTING_JUNI_2026.balitaGiziKurang,
    ),
    balitaBeratBadanKurang: baca(
      KUNCI_DATA_STUNTING.balitaBeratBadanKurang,
      DATA_STUNTING_JUNI_2026.balitaBeratBadanKurang,
    ),
  };
}
