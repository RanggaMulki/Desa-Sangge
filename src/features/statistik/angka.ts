/**
 * Angka pokok desa — daftar variabel TETAP.
 *
 * Nama metriknya dikunci di sini; pengurus desa hanya mengisi ANGKA-nya lewat
 * halaman pengelolaan. Nama yang dulu bisa diketik bebas terbukti jadi sumber
 * salah isi (pernah muncul "Jumlah RT = 3.880.000" dan luas 447,3950 Ha yang
 * diketik 4473950 tanpa koma).
 *
 * Enam yang pertama (penduduk … mutasi) tampil sebagai bagian "Administrasi
 * Penduduk" di beranda. `luas` dipakai halaman Peta Lokasi, `dusun` sebagai
 * pelengkap. `kunci` adalah penanda tetap yang dirujuk halaman lain — jangan
 * diubah sembarangan.
 */
export const ANGKA_DESA: {
  kunci: string;
  label: string;
  satuan: string;
  petunjuk: string;
}[] = [
  {
    kunci: "penduduk",
    label: "Jumlah Penduduk",
    satuan: "jiwa",
    petunjuk: "Total seluruh warga desa.",
  },
  {
    kunci: "laki",
    label: "Laki-laki",
    satuan: "jiwa",
    petunjuk: "Jumlah penduduk laki-laki.",
  },
  {
    kunci: "perempuan",
    label: "Perempuan",
    satuan: "jiwa",
    petunjuk: "Jumlah penduduk perempuan.",
  },
  {
    kunci: "kk",
    label: "Kepala Keluarga",
    satuan: "KK",
    petunjuk: "Banyaknya kepala keluarga.",
  },
  {
    kunci: "sementara",
    label: "Penduduk Sementara",
    satuan: "jiwa",
    petunjuk: "Penduduk tidak tetap atau pendatang sementara.",
  },
  {
    kunci: "mutasi",
    label: "Mutasi Penduduk",
    satuan: "jiwa",
    petunjuk: "Perpindahan penduduk (masuk/keluar) pada periode data.",
  },
  {
    kunci: "luas",
    label: "Luas Wilayah",
    satuan: "Ha",
    petunjuk:
      "Bilangan bulat hektare. Contoh: luas 447,3950 Ha ditulis 447 — jangan tulis 4473950.",
  },
  {
    kunci: "dusun",
    label: "Jumlah Dusun",
    satuan: "dusun",
    petunjuk: "Banyaknya dusun di desa.",
  },
  {
    kunci: "dukuh",
    label: "Jumlah Dukuh",
    satuan: "dukuh",
    petunjuk: "Banyaknya dukuh (dusun kecil) di desa.",
  },
  {
    kunci: "rt",
    label: "Jumlah RT",
    satuan: "RT",
    petunjuk: "Banyaknya Rukun Tetangga (RT). Isi jumlahnya, bukan nomornya.",
  },
];

/** Semua kunci yang sah. Baris di luar daftar ini dianggap sisa data lama. */
export const KUNCI_ANGKA = ANGKA_DESA.map((a) => a.kunci);
