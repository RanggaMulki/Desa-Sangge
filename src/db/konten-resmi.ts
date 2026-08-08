/**
 * Konten resmi yang harus tetap sama pada seed awal maupun pemasangan data
 * contoh. Perubahan melalui pengelolaan dapat menimpa isi record setelahnya.
 */
/**
 * Riwayat sekaligus legenda Desa Sangge, ditulis sebagai satu narasi.
 *
 * Sengaja tanpa subjudul di dalamnya: judul seksi "Sejarah dan Legenda Desa"
 * sudah menaunginya, dan legenda Nyi Ageng Serang memang menyatu di dalam
 * riwayatnya — bukan cerita terpisah. Kalau kelak ada legenda lain yang
 * berdiri sendiri, tambahkan <h3> baru sebagai pemisah.
 */
export const KONTEN_SEJARAH_DESA = [
  "<p>Desa Sangge merupakan salah satu desa di Kecamatan Klego, Kabupaten " +
    "Boyolali, Provinsi Jawa Tengah. Desa ini dikenal dengan Sendang Sangge, " +
    "sebuah mata air yang hingga kini masih dimanfaatkan oleh masyarakat dan " +
    "dipercaya tidak pernah kering. Menurut tradisi lisan yang berkembang di " +
    "masyarakat, keberadaan Sendang Sangge berkaitan dengan perjalanan Nyi " +
    "Ageng Serang saat melakukan perjuangan melawan penjajahan Belanda.</p>",
  "<p>Dikisahkan bahwa Nyi Ageng Serang bersama pasukannya singgah di wilayah " +
    "yang kini menjadi Desa Sangge untuk beristirahat dan merawat pengikutnya " +
    "yang sedang sakit. Saat persediaan air habis, beliau menancapkan tongkatnya " +
    "ke tanah hingga memancarkan sumber mata air yang kemudian dikenal sebagai " +
    "Sendang Sangge. Menurut cerita yang diwariskan secara turun-temurun, nama " +
    "&quot;Sangge&quot; berasal dari gabungan kata <em>songgo-songgo</em> " +
    "(penyangga) dan <em>age-age</em> (cepat), yang menggambarkan proses " +
    "pembangunan pesanggrahan secara cepat dengan bantuan penyangga.</p>",
  "<p>Hingga saat ini, Sendang Sangge tidak hanya menjadi sumber air bagi " +
    "masyarakat, tetapi juga menjadi simbol sejarah, identitas, dan warisan " +
    "budaya Desa Sangge yang terus dijaga dan dilestarikan oleh masyarakat " +
    "setempat.</p>",
].join("");

// =====================================================================
// DATA STRUKTURAL RESMI DESA SANGGE
//
// Nilai riil yang sudah dikonfirmasi pengurus desa dan ditayangkan. Diseed
// idempoten oleh seed.ts (hanya mengisi bila baris belum ada), jadi TIDAK
// menimpa perubahan yang dilakukan admin lewat halaman pengelolaan. Gunanya:
// data resmi ini punya sumber di kode yang bisa dipulihkan (di-commit), bukan
// hanya hidup di database. Ubah rutin tetap lewat pengelolaan, bukan di sini.
//
// Foto perangkat menunjuk objek yang sudah diunggah ke Cloudflare R2. Bila
// database dipulihkan dari nol tapi objek R2-nya masih ada, fotonya ikut
// kembali; kalau tidak, barisnya tetap ada tanpa foto dan tinggal diunggah
// ulang lewat pengelolaan.
// =====================================================================

export const PERANGKAT_DESA_RESMI: {
  posisi: string;
  nama: string;
  jabatan: string;
  fotoUrl: string | null;
  periode: string | null;
  urutan: number;
}[] = [
  { posisi: "kepala-desa", nama: "Mahmudi", jabatan: "Kepala Desa", fotoUrl: "/media/perangkat/ee65ec78-d374-4e6c-b9ee-dba6f5eb000c.jpg", periode: "2019–2025", urutan: 1 },
  { posisi: "sekretaris", nama: "Plt. Budi Utomo", jabatan: "Sekretaris Desa", fotoUrl: "/media/perangkat/ffcd6dad-9baf-4d22-945a-d8add5e509c8.png", periode: null, urutan: 2 },
  { posisi: "kaur-umum", nama: "Budi Utomo", jabatan: "Kepala Urusan Umum dan Perencanaan", fotoUrl: "/media/perangkat/d9432e1f-909a-4275-b394-a79bd6569f89.jpg", periode: null, urutan: 3 },
  { posisi: "kaur-keuangan", nama: "Paramita Suci, S.E.", jabatan: "Kepala Urusan Keuangan", fotoUrl: "/media/perangkat/e289a309-4991-4b30-a5e2-55ef3c203ae9.png", periode: null, urutan: 4 },
  { posisi: "kasi-pemerintahan", nama: "Haris Hidayanto", jabatan: "Kepala Seksi Pemerintahan", fotoUrl: "/media/perangkat/026a6cef-051f-4cef-81ab-e026ca841561.png", periode: null, urutan: 5 },
  { posisi: "kasi-kesra", nama: "Fajar Syamra Na'im", jabatan: "Kepala Seksi Kesejahteraan dan Pelayanan", fotoUrl: "/media/perangkat/76b7c156-05bc-4ebe-bd66-efc21bab06e1.jpg", periode: null, urutan: 6 },
  { posisi: "kadus-1", nama: "Haris Hidayanto", jabatan: "Kepala Dusun I", fotoUrl: "/media/perangkat/12e33f35-d62b-4e76-97c5-6514cd6c09c3.jpg", periode: null, urutan: 7 },
  { posisi: "kadus-2", nama: "Adib Kristiyono", jabatan: "Kepala Dusun II", fotoUrl: "/media/perangkat/7375e830-2c7e-41f0-a845-dd73062922cb.png", periode: null, urutan: 8 },
  { posisi: "kadus-3", nama: "Arif Setiyadhi", jabatan: "Kepala Dusun III", fotoUrl: "/media/perangkat/79627a7c-697c-4564-a1fa-40a2770654b6.jpg", periode: null, urutan: 9 },
];

/**
 * Angka desa yang diisi manual (bukan dari impor kependudukan MCD).
 * Penduduk, KK, dan jenis kelamin datang dari `npm run db:penduduk`, jadi
 * TIDAK diseed di sini agar tidak bentrok.
 */
export const STATISTIK_MANUAL_RESMI: {
  kunci: string;
  label: string;
  nilai: number;
  satuan: string;
  tahun: number;
  urutan: number;
}[] = [
  { kunci: "luas", label: "Luas Wilayah", nilai: 447, satuan: "Ha", tahun: 2026, urutan: 7 },
  { kunci: "dusun", label: "Jumlah Dusun", nilai: 3, satuan: "dusun", tahun: 2026, urutan: 8 },
  { kunci: "dukuh", label: "Jumlah Dukuh", nilai: 7, satuan: "dukuh", tahun: 2026, urutan: 9 },
  { kunci: "rt", label: "Jumlah RT", nilai: 26, satuan: "RT", tahun: 2026, urutan: 10 },
];

export const BATAS_WILAYAH_RESMI: {
  arah: "utara" | "timur" | "selatan" | "barat";
  keterangan: string;
}[] = [
  { arah: "utara", keterangan: "Desa Banyurip" },
  { arah: "timur", keterangan: "Desa Beji, Kecamatan Andong" },
  { arah: "selatan", keterangan: "Desa Kalangan dan Desa Sendangrejo" },
  { arah: "barat", keterangan: "Desa Bade dan Desa Blumbang" },
];
