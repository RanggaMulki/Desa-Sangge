import type { KontakLayanan } from "@/db/schema";

export type JenisKontak = KontakLayanan["jenis"];

/**
 * Label dan urutan tampil tiap jenis kontak.
 *
 * Urutannya bukan abjad melainkan tingkat kemendesakan: nomor darurat dan
 * perlindungan perempuan-anak di atas, urusan administrasi biasa di bawah.
 * Orang yang sedang panik tidak akan menggulir mencari nomor yang tepat.
 */
export const JENIS_KONTAK: {
  kode: JenisKontak;
  label: string;
  keterangan?: string;
}[] = [
  {
    kode: "darurat",
    label: "Nomor Darurat",
    keterangan: "Bisa dihubungi kapan saja.",
  },
  {
    kode: "kppa",
    label: "Perlindungan Perempuan dan Anak",
    keterangan: "Untuk warga yang mengalami kekerasan. Identitas dijaga.",
  },
  {
    kode: "kesehatan",
    label: "Layanan Kesehatan",
    keterangan: "Bidan desa, posyandu, dan rujukan puskesmas.",
  },
  {
    kode: "umum",
    label: "Kontak Pemerintah Desa",
    keterangan: "Urusan surat-menyurat dan administrasi warga.",
  },
];
