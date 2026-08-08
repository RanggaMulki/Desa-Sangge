import { angka } from "@/lib/format";
import { ambilStatistik } from "@/features/statistik/queries";
import { ambilJenisKelamin } from "../queries";
import { IkonOrang, IkonRumah, IkonLaki, IkonPerempuan } from "../ikon";
import { KartuIkon } from "./KartuIkon";

export async function AngkaDesa() {
  const [statistik, gender] = await Promise.all([
    ambilStatistik(),
    ambilJenisKelamin(),
  ]);

  const penduduk = statistik.find((s) => s.kunci === "penduduk") ?? null;
  const kk = statistik.find((s) => s.kunci === "kk") ?? null;
  const adaGender = gender.laki + gender.perempuan > 0;

  if (!penduduk && !kk && !adaGender) return null;

  const ringkasan = [
    penduduk
      ? {
          kunci: "penduduk",
          ikon: <IkonOrang />,
          label: "Total Penduduk",
          nilai: angka(penduduk.nilai),
          satuan: "jiwa",
          aksen: "hijau" as const,
        }
      : null,
    adaGender
      ? {
          kunci: "laki-laki",
          ikon: <IkonLaki />,
          label: "Laki-laki",
          nilai: angka(gender.laki),
          satuan: "jiwa",
          aksen: "hijau" as const,
        }
      : null,
    adaGender
      ? {
          kunci: "perempuan",
          ikon: <IkonPerempuan />,
          label: "Perempuan",
          nilai: angka(gender.perempuan),
          satuan: "jiwa",
          aksen: "oranye" as const,
        }
      : null,
    kk
      ? {
          kunci: "kk",
          ikon: <IkonRumah />,
          label: "Jumlah KK",
          nilai: angka(kk.nilai),
          satuan: "KK",
          aksen: "hijau" as const,
        }
      : null,
  ].filter((item) => item !== null);

  return (
    <section
      aria-label="Ringkasan data kependudukan"
      className="overflow-hidden rounded-lg border border-garis bg-white"
    >
      <div className="grid gap-px bg-garis sm:grid-cols-2 lg:grid-cols-4">
        {ringkasan.map((item) => (
          <KartuIkon
            key={item.kunci}
            ikon={item.ikon}
            label={item.label}
            nilai={item.nilai}
            satuan={item.satuan}
            aksen={item.aksen}
          />
        ))}
      </div>
    </section>
  );
}
