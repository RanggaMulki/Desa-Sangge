import type { CSSProperties } from "react";
import { ambilStatistik } from "@/features/statistik/queries";
import { CountUp } from "./CountUp";

/**
 * Kartu "Desa Sangge dalam Angka" yang menempel di bagian bawah hero.
 *
 * Enam angka utama: penduduk, KK, dan pembagian wilayah (dusun, dukuh, RT)
 * serta luas. Nilainya dibaca dari tabel statistik (kunci tetap), jadi pengurus
 * bisa memperbaruinya lewat Pengelolaan > Statistik tanpa menyentuh kode.
 *
 * Animasinya sengaja halus: tiap kartu muncul bertahap (masuk-halus + jeda
 * bertingkat) dan angkanya menghitung naik (CountUp). Keduanya otomatis mati
 * untuk pengguna reduced motion. Seluruh kartu hilang bila data penduduk belum
 * diisi, jadi hero tidak pernah menampilkan angka kosong.
 *
 * Tampilan tanpa ikon, satu baris di desktop (6 kolom), tiga kolom di tablet,
 * dua kolom di HP. Teks rata tengah, angka besar supaya nyaman dilihat.
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

export async function KartuStatistikHero() {
  const statistik = await ambilStatistik();
  const peta = new Map(statistik.map((s) => [s.kunci, s]));

  // Tanpa jumlah penduduk, kartunya tidak ditampilkan sama sekali.
  if (!peta.get("penduduk")?.nilai) return null;

  return (
    <div className="rounded-2xl border border-garis bg-white px-4 py-5 text-center shadow-xl shadow-black/10 sm:px-6 sm:py-6 md:rounded-3xl">
      {/* Enam metrik: 2 kolom di HP, 3 kolom tablet, 6 kolom (1 baris) di desktop.
          Garis pemisah vertikal antar item lewat border-left. Item pertama di
          setiap baris tidak diberi garis supaya tepi kiri tetap bersih. */}
      <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-3 sm:gap-y-5 lg:grid-cols-6">
        {ITEM.map((it, i) => {
          const stat = peta.get(it.kunci);
          const v = stat?.nilai;
          const adaAngka = v !== undefined && v !== null && v > 0;

          // Garis pemisah: border-left pada semua item kecuali kolom pertama
          // per breakpoint. Di HP (2 kolom): item genap (0, 2, 4) tanpa garis.
          // Di tablet (3 kolom): item 0, 3 tanpa garis. Di desktop (6 kolom):
          // hanya item 0 tanpa garis.
          const pemisah = [
            // HP: sembunyikan border di kolom pertama (index genap)
            i % 2 === 0 ? "border-l-0" : "border-l border-garis",
            // Tablet: override — sembunyikan di kolom pertama per baris 3 kolom
            i % 3 === 0
              ? "sm:border-l-0"
              : "sm:border-l sm:border-garis",
            // Desktop: override — semua punya garis kecuali item pertama
            i === 0 ? "lg:border-l-0" : "lg:border-l lg:border-garis",
          ].join(" ");

          return (
            <div
              key={it.kunci}
              className={`masuk-halus py-1 ${pemisah}`}
              style={{ "--jeda-masuk": `${i * 80}ms` } as CSSProperties}
            >
              <div className="font-extrabold tabular-nums tracking-tight text-hijau-pekat">
                {adaAngka ? (
                  <CountUp
                    nilai={v}
                    sufiks={it.satuan}
                    jeda={i * 80}
                    className="text-xl sm:text-2xl lg:text-3xl"
                  />
                ) : (
                  <span className="text-xl text-tinta-redup sm:text-2xl lg:text-3xl">
                    —
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-medium text-tinta-redup sm:text-sm">
                {it.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
