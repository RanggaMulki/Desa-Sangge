/**
 * Susunan tetap struktur pemerintahan Desa Sangge, dalam bentuk pohon.
 *
 * INI BAGIAN YANG "TETAP". Susunan jabatan dan siapa membawahi siapa dikunci
 * di sini, di kode. Yang berubah lewat pengelolaan web hanya NAMA dan FOTO tiap
 * jabatan — diambil dari tabel perangkat_desa lewat `posisi` yang cocok dengan
 * `kunci` di bawah.
 *
 * Bentuk pohon dipilih supaya bagannya bisa digambar persis seperti bagan resmi
 * desa: Kepala Desa di puncak, Sekretaris Desa membawahi para Kaur, dan Kasi
 * serta Kepala Dusun berada langsung di bawah Kepala Desa. Garis penghubungnya
 * digambar otomatis dari susunan anak-cabang ini.
 *
 * Kalau struktur desa benar-benar berubah (mis. dusun bertambah), itu perubahan
 * kode yang disengaja di berkas ini — bukan sesuatu yang diubah pengurus desa
 * dari website.
 */

export type NodeStruktur = {
  /** Cocok dengan kolom `posisi` di perangkat_desa. Jangan diubah sembarangan. */
  kunci: string;
  /** Label jabatan pada kotak bagan. Bagian dari struktur tetap. */
  jabatan: string;
  anak?: NodeStruktur[];
};

export const STRUKTUR: NodeStruktur = {
  kunci: "kepala-desa",
  jabatan: "Kepala Desa",
  anak: [
    {
      kunci: "sekretaris",
      jabatan: "Sekretaris Desa",
      anak: [
        { kunci: "kaur-umum", jabatan: "Kepala Urusan Umum dan Perencanaan" },
        { kunci: "kaur-keuangan", jabatan: "Kepala Urusan Keuangan" },
      ],
    },
    { kunci: "kasi-pemerintahan", jabatan: "Kepala Seksi Pemerintahan" },
    {
      kunci: "kasi-kesra",
      jabatan: "Kepala Seksi Kesejahteraan dan Pelayanan",
    },
    { kunci: "kadus-1", jabatan: "Kepala Dusun I" },
    { kunci: "kadus-2", jabatan: "Kepala Dusun II" },
    { kunci: "kadus-3", jabatan: "Kepala Dusun III" },
  ],
};

/** Semua kunci posisi di pohon, untuk memeriksa apakah ada isinya sama sekali. */
export function semuaKunci(node: NodeStruktur = STRUKTUR): string[] {
  return [node.kunci, ...(node.anak ?? []).flatMap((a) => semuaKunci(a))];
}

/** kunci -> jabatan, supaya bagan mengambil label tiap slot dari satu sumber. */
export function labelJabatan(): Map<string, string> {
  const m = new Map<string, string>();
  const jelajah = (n: NodeStruktur) => {
    m.set(n.kunci, n.jabatan);
    n.anak?.forEach(jelajah);
  };
  jelajah(STRUKTUR);
  return m;
}

/**
 * Daftar slot terurut (kepala dulu, lalu ke bawah), dipakai form pengelolaan
 * untuk menampilkan isian per jabatan sesuai urutan bagan, dan sebagai `urutan`
 * saat menyimpan baris perangkat baru.
 */
export function slotTerurut(): { kunci: string; jabatan: string; urutan: number }[] {
  const out: { kunci: string; jabatan: string; urutan: number }[] = [];
  let n = 0;
  const jelajah = (node: NodeStruktur) => {
    out.push({ kunci: node.kunci, jabatan: node.jabatan, urutan: ++n });
    node.anak?.forEach(jelajah);
  };
  jelajah(STRUKTUR);
  return out;
}
