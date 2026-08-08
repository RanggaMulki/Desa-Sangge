import type { CSSProperties } from "react";
import { ambilStatistik } from "@/features/statistik/queries";
import { CountUp } from "./CountUp";

/**
 * Strip angka desa — pita gelap selebar layar di bawah hero.
 *
 * Menggantikan kartu putih mengambang yang sebelumnya menempel di bagian
 * bawah hero. Dengan strip terpisah:
 *
 * - Foto hero tampil penuh tanpa terpotong
 * - Angka menonjol di atas latar gelap (kontras tinggi)
 * - Transisi visual natural antara hero dan konten berikutnya
 *
 * Latar memakai --gradien-data (navy → hijau tua) yang sudah ada di
 * design token. Garis pemisah putih semi-transparan.
 *
 * Enam angka utama: penduduk, KK, dusun, dukuh, RT, luas wilayah.
 * Seluruh strip hilang bila data penduduk belum diisi.
 */
const ITEM: {
  kunci: string;
  label: string;
  satuan: string;
}[] = [
  { kunci: "penduduk", label: "Jumlah Penduduk", satuan: " jiwa" },
  { kunci: "kk", label: "Kepala Keluarga", satuan: " KK" },
  { kunci: "dusun", label: "Jumlah Dusun", satuan: " dusun" },
  { kunci: "dukuh", label: "Jumlah Dukuh", satuan: " dukuh" },
  { kunci: "rt", label: "Jumlah RT", satuan: " RT" },
  { kunci: "luas", label: "Luas Wilayah", satuan: " ha" },
];

export async function StripStatistik() {
  const statistik = await ambilStatistik();
  const peta = new Map(statistik.map((s) => [s.kunci, s]));

  // Tanpa jumlah penduduk, strip tidak ditampilkan sama sekali.
  if (!peta.get("penduduk")?.nilai) return null;

  return (
    <section
      aria-label="Statistik desa"
      className="latar-data-earthy py-6 sm:py-8"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 sm:gap-y-7 lg:grid-cols-6">
          {ITEM.map((it, i) => {
            const stat = peta.get(it.kunci);
            const v = stat?.nilai;
            const adaAngka = v !== undefined && v !== null && v > 0;

            // Garis pemisah vertikal putih semi-transparan.
            // Item pertama di setiap baris (per breakpoint) tidak diberi garis.
            const pemisah = [
              i % 2 === 0 ? "" : "border-l border-white/20",
              i % 3 === 0 ? "sm:border-l-0" : "sm:border-l sm:border-white/20",
              i === 0 ? "lg:border-l-0" : "lg:border-l lg:border-white/20",
            ].join(" ");

            return (
              <div
                key={it.kunci}
                className={`masuk-halus text-center ${pemisah}`}
                style={{ "--jeda-masuk": `${i * 80}ms` } as CSSProperties}
              >
                <div className="font-extrabold tabular-nums tracking-tight text-white">
                  {adaAngka ? (
                    <CountUp
                      nilai={v}
                      sufiks={it.satuan}
                      jeda={i * 80}
                      className="text-2xl sm:text-3xl lg:text-[2rem]"
                    />
                  ) : (
                    <span className="text-2xl text-white/50 sm:text-3xl lg:text-[2rem]">
                      —
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-white/60">
                  {it.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
