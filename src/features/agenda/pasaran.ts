export const DAFTAR_PASARAN = [
  "Legi",
  "Pahing",
  "Pon",
  "Wage",
  "Kliwon",
] as const;

export type PasaranJawa = (typeof DAFTAR_PASARAN)[number];

export const SUMBER_KALENDER_JAWA =
  "https://javasenseapp.com/id/kalender-jawa/";

const MILIDETIK_PER_HARI = 86_400_000;
const ACUAN_LEGI_UTC = Date.UTC(2026, 7, 2);

function komponenTanggal(nilai: Date | string) {
  if (typeof nilai === "string") {
    const [tahun, bulan, tanggal] = nilai.split("-").map(Number);
    return { tahun, bulan, tanggal };
  }

  return {
    tahun: nilai.getFullYear(),
    bulan: nilai.getMonth() + 1,
    tanggal: nilai.getDate(),
  };
}

/**
 * Menghasilkan nama Pancawara untuk tanggal Masehi.
 *
 * Acuan 2 Agustus 2026 = Legi telah dicocokkan dengan kalender JavaSense.
 * Perhitungan memakai UTC dari komponen tanggal agar tidak bergeser akibat
 * zona waktu atau daylight-saving pada perangkat pengunjung.
 */
export function pasaranUntukTanggal(nilai: Date | string): PasaranJawa {
  const { tahun, bulan, tanggal } = komponenTanggal(nilai);
  const target = Date.UTC(tahun, bulan - 1, tanggal);
  const selisihHari = Math.round(
    (target - ACUAN_LEGI_UTC) / MILIDETIK_PER_HARI,
  );
  const index = ((selisihHari % 5) + 5) % 5;
  return DAFTAR_PASARAN[index];
}
