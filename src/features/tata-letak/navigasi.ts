/**
 * Sumber tunggal struktur menu.
 *
 * Header desktop, menu HP, dan footer semuanya membaca dari sini supaya
 * tidak pernah berbeda isi. Maksimal satu tingkat submenu: situs desa lain
 * yang jadi rujukan punya 12 menu dengan submenu sampai 16 butir, dan itu
 * tidak terpakai di HP.
 */

export type ButirMenu = {
  label: string;
  href: string;
  anak?: { label: string; href: string }[];
};

export const MENU_UTAMA: ButirMenu[] = [
  { label: "Beranda", href: "/" },
  /**
   * Tanpa submenu, dan itu disengaja.
   *
   * Tentang desa, sejarah, visi-misi, dan struktur pemerintahan sekarang jadi
   * satu halaman /profil. Keempatnya isinya pendek — beberapa paragraf saja —
   * jadi memecahnya menjadi empat halaman justru membuat pengunjung harus
   * mengklik empat kali untuk membaca yang sebenarnya muat dalam satu layar
   * gulir. Perpindahan antar bagian ditangani daftar isi di dalam halamannya.
   */
  { label: "Profil Desa", href: "/profil" },
  { label: "Infografis", href: "/infografis" },
  /**
   * Satu halaman langsung, tanpa dropdown. Kesehatan dan Perawatan Alat
   * ditampilkan berurutan sebagai dua seksi di /informasi. Dipilih karena
   * situs ini mayoritas dibuka dari HP — di ponsel submenu perlu diketuk dulu
   * untuk mengembang dan gampang salah pencet, sedangkan halaman langsung
   * cukup satu ketukan. Dua kategori juga masih muat nyaman dalam satu layar.
   */
  { label: "Informasi", href: "/informasi" },
  { label: "Agenda", href: "/agenda" },
  { label: "Galeri", href: "/galeri" },
];

/** Menandai menu induk maupun anak yang sesuai dengan halaman aktif. */
export function menuSedangAktif(
  pathname: string,
  butir: ButirMenu,
): boolean {
  if (butir.href === "/") return pathname === "/";
  if (pathname === butir.href || pathname.startsWith(butir.href + "/")) {
    return true;
  }

  return (butir.anak ?? []).some(
    (anak) =>
      pathname === anak.href || pathname.startsWith(anak.href + "/"),
  );
}

export const IDENTITAS = {
  nama: "Desa Sangge",
  /** Dipakai di header, mengikuti pola website desa lain: nama + wilayah. */
  kabupaten: "Kabupaten Boyolali",
  wilayah: "Kecamatan Klego, Kabupaten Boyolali",
  provinsi: "Jawa Tengah",

  /** Alamat resmi kantor Pemerintah Desa Sangge. */
  alamatJalan: "Jalan Bade-Batangan Kilometer 03, Keponan, Sangge",
  kodePos: "57385",
  kodeWilayah: "33.09.15.2006",
  email: "",

  /**
   * Peta lokasi desa.
   *
   * Koordinat menunjuk Desa Sangge, Kec. Klego, Kab. Boyolali.
   * Diambil dari Google Maps: @-7.3772016,110.7124016.
   * Zoom level 14 menampilkan area desa dengan cukup detail.
   *
   * Peta memakai sematan tanpa kunci API, jadi tidak ada tagihan dan tidak
   * ada yang kedaluwarsa — aman untuk website yang jalan bertahun-tahun
   * tanpa dipantau.
   */
  peta: {
    /**
     * Titik BAWAAN: Kantor Balai Desa Sangge.
     *
     * Diambil dari bagian `!3d…!4d…` (titik tempat) pada tautan Google Maps,
     * bukan dari `@…` yang cuma posisi kamera — memakai `@` pernah membuat
     * petanya menunjuk lokasi yang meleset.
     *
     * Perbesaran 17 karena yang ditunjuk sebuah bangunan, bukan wilayah desa:
     * cukup rapat untuk mengenali balai desanya, masih cukup lebar untuk
     * melihat jalan di sekitarnya.
     *
     * Begitu pengurus mengisi titik lewat Pengelolaan > Peta Lokasi, nilai di
     * sini tidak dipakai lagi.
     */
    embed:
      "https://maps.google.com/maps?q=-7.3694111,110.718773&z=17&output=embed",
    tautan:
      "https://www.google.com/maps/search/?api=1&query=-7.3694111,110.718773",
    catatan: null,
  },
} as const;

/**
 * Tautan ke lembaga pemerintahan, mengikuti kebiasaan website desa.
 *
 * Alamat kemendesa.go.id dan kemendagri.go.id sudah pasti. Alamat pemkab
 * perlu Anda cek sekali sebelum website tayang.
 */
export const TAUTAN_LEMBAGA = [
  { label: "Kementerian Desa", href: "https://kemendesa.go.id/" },
  { label: "Kementerian Dalam Negeri", href: "https://kemendagri.go.id/" },
  { label: "Pemkab Boyolali", href: "https://boyolali.go.id/" },
] as const;
