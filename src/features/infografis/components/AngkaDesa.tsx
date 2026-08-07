import { ExternalLink } from "lucide-react";
import { angka } from "@/lib/format";
import { ambilStatistik } from "@/features/statistik/queries";
import {
  ambilJenisKelamin,
  ambilMetadataPenduduk,
} from "../queries";
import { IkonOrang, IkonRumah, IkonLaki, IkonPerempuan } from "../ikon";
import { KartuIkon } from "./KartuIkon";

export async function AngkaDesa() {
  const [statistik, gender, metadata] = await Promise.all([
    ambilStatistik(),
    ambilJenisKelamin(),
    ambilMetadataPenduduk(),
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

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-garis bg-white px-5 py-4 text-sm text-tinta-redup sm:px-8">
        <span>Sumber:</span>
        {metadata.sumberUrl ? (
          <a
            href={metadata.sumberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-hijau-utama underline underline-offset-4 hover:text-hijau-pekat"
          >
            {metadata.sumberNama}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        ) : (
          <strong className="font-semibold text-tinta">
            {metadata.sumberNama}
          </strong>
        )}
      </p>
    </section>
  );
}
