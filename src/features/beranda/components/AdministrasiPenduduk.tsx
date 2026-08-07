import { ambilStatistik } from "@/features/statistik/queries";
import { CountUp } from "./CountUp";

/**
 * "Desa Sangge dalam Angka" — seksi gelap earthy dengan empat angka utama.
 *
 * Desain: latar gradien gelap navy ke hijau pekat menjadi jangkar visual
 * di tengah halaman. Angka putih besar tetap menjadi fokus utamanya.
 *
 * Empat angka saja: Penduduk, KK, Dusun, Luas Wilayah — ringkasan yang
 * paling sering dicari warga. Seluruh seksi hilang bila penduduk belum diisi.
 */

const ITEM: { kunci: string; label: string; satuan: string }[] = [
  { kunci: "penduduk", label: "Jumlah Penduduk", satuan: " jiwa" },
  { kunci: "kk", label: "Kepala Keluarga", satuan: " KK" },
  { kunci: "dusun", label: "Jumlah Dusun", satuan: " dusun" },
  { kunci: "luas", label: "Luas Wilayah", satuan: " ha" },
];

export async function AdministrasiPenduduk() {
  const statistik = await ambilStatistik();
  const peta = new Map(statistik.map((s) => [s.kunci, s]));

  const penduduk = peta.get("penduduk");
  if (!penduduk || !penduduk.nilai) return null;

  const tahun = penduduk.tahun;

  return (
    <section className="latar-data-earthy relative overflow-hidden py-16 text-white sm:py-20">
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* --- Header ---------------------------------------------------- */}
        <div className="mb-10 max-w-2xl sm:mb-12">
          <h2 className="judul-seksi-beranda text-balance text-white">
            Desa Sangge <span className="text-hijau-muda">dalam Angka</span>
          </h2>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-white/80">
            Data ringkasan resmi kependudukan dan wilayah Desa Sangge.
          </p>
        </div>

        {/* --- Grid 4 kartu ---------------------------------------------- */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {ITEM.map((it, indeks) => {
            const stat = peta.get(it.kunci);
            const v = stat?.nilai;
            const adaAngka = v !== undefined && v !== null && v > 0;

            return (
              <div
                key={it.kunci}
                className="rounded-lg border border-white/15 bg-[#3f463e] p-5 text-center sm:p-7"
              >
                {/* Angka besar — animasi count-up */}
                <div className="font-extrabold tabular-nums text-hijau-muda">
                  {adaAngka ? (
                    <CountUp
                      nilai={v}
                      sufiks={it.satuan}
                      jeda={indeks * 90}
                      className="text-3xl sm:text-4xl lg:text-[2.75rem]"
                    />
                  ) : (
                    <span className="text-3xl text-white/65 sm:text-4xl lg:text-[2.75rem]">
                      —
                    </span>
                  )}
                </div>

                {/* Label */}
                <p className="mt-3 text-sm font-medium text-white/75 sm:text-base">
                  {it.label}
                </p>

                {/* Tahun data */}
                {adaAngka && tahun && (
                  <p className="mt-1 text-xs text-white/65">
                    Tahun {tahun}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* --- Catatan kaki ---------------------------------------------- */}
        <p className="mt-10 text-center text-sm text-white/70 sm:mt-12">
          Data merupakan angka ringkasan resmi dari pemerintah desa dan
          diperbarui berkala.
        </p>
      </div>
    </section>
  );
}
