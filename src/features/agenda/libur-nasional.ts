export type JenisLibur = "libur-nasional" | "cuti-bersama";

export type HariLibur = {
  tanggal: string;
  nama: string;
  jenis: JenisLibur;
};

export const TAHUN_DATA_LIBUR = 2026;

export const SUMBER_LIBUR_NASIONAL =
  "https://setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2026";

/**
 * SKB Menteri Agama, Menteri Ketenagakerjaan, dan Menteri PANRB
 * Nomor 1497/2025, 2/2025, dan 5/2025.
 */
export const DAFTAR_LIBUR_2026: readonly HariLibur[] = [
  { tanggal: "2026-01-01", nama: "Tahun Baru 2026 Masehi", jenis: "libur-nasional" },
  { tanggal: "2026-01-16", nama: "Isra Mikraj Nabi Muhammad saw.", jenis: "libur-nasional" },
  { tanggal: "2026-02-16", nama: "Tahun Baru Imlek 2577 Kongzili", jenis: "cuti-bersama" },
  { tanggal: "2026-02-17", nama: "Tahun Baru Imlek 2577 Kongzili", jenis: "libur-nasional" },
  { tanggal: "2026-03-18", nama: "Hari Suci Nyepi (Tahun Baru Saka 1948)", jenis: "cuti-bersama" },
  { tanggal: "2026-03-19", nama: "Hari Suci Nyepi (Tahun Baru Saka 1948)", jenis: "libur-nasional" },
  { tanggal: "2026-03-20", nama: "Idulfitri 1447 H", jenis: "cuti-bersama" },
  { tanggal: "2026-03-21", nama: "Idulfitri 1447 H", jenis: "libur-nasional" },
  { tanggal: "2026-03-22", nama: "Idulfitri 1447 H", jenis: "libur-nasional" },
  { tanggal: "2026-03-23", nama: "Idulfitri 1447 H", jenis: "cuti-bersama" },
  { tanggal: "2026-03-24", nama: "Idulfitri 1447 H", jenis: "cuti-bersama" },
  { tanggal: "2026-04-03", nama: "Wafat Yesus Kristus", jenis: "libur-nasional" },
  { tanggal: "2026-04-05", nama: "Kebangkitan Yesus Kristus (Paskah)", jenis: "libur-nasional" },
  { tanggal: "2026-05-01", nama: "Hari Buruh Internasional", jenis: "libur-nasional" },
  { tanggal: "2026-05-14", nama: "Kenaikan Yesus Kristus", jenis: "libur-nasional" },
  { tanggal: "2026-05-15", nama: "Kenaikan Yesus Kristus", jenis: "cuti-bersama" },
  { tanggal: "2026-05-27", nama: "Iduladha 1447 H", jenis: "libur-nasional" },
  { tanggal: "2026-05-28", nama: "Iduladha 1447 H", jenis: "cuti-bersama" },
  { tanggal: "2026-05-31", nama: "Hari Raya Waisak 2570 BE", jenis: "libur-nasional" },
  { tanggal: "2026-06-01", nama: "Hari Lahir Pancasila", jenis: "libur-nasional" },
  { tanggal: "2026-06-16", nama: "1 Muharam Tahun Baru Islam 1448 H", jenis: "libur-nasional" },
  { tanggal: "2026-08-17", nama: "Proklamasi Kemerdekaan", jenis: "libur-nasional" },
  { tanggal: "2026-08-25", nama: "Maulid Nabi Muhammad saw.", jenis: "libur-nasional" },
  { tanggal: "2026-12-24", nama: "Kelahiran Yesus Kristus", jenis: "cuti-bersama" },
  { tanggal: "2026-12-25", nama: "Kelahiran Yesus Kristus", jenis: "libur-nasional" },
] as const;

const LIBUR_PER_TANGGAL = new Map(
  DAFTAR_LIBUR_2026.map((libur) => [libur.tanggal, libur]),
);

function formatTanggal(nilai: Date | string) {
  if (typeof nilai === "string") return nilai;

  const tahun = nilai.getFullYear();
  const bulan = String(nilai.getMonth() + 1).padStart(2, "0");
  const tanggal = String(nilai.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${tanggal}`;
}

export function liburUntukTanggal(nilai: Date | string) {
  return LIBUR_PER_TANGGAL.get(formatTanggal(nilai)) ?? null;
}

export function labelJenisLibur(jenis: JenisLibur) {
  return jenis === "libur-nasional" ? "Libur Nasional" : "Cuti Bersama";
}
