import type { ReactNode } from "react";
import {
  Baby,
  ExternalLink,
  Percent,
  Ruler,
  TriangleAlert,
} from "lucide-react";
import { angka } from "@/lib/format";
import {
  ambilMetadataStunting,
  ambilRingkasanStunting,
} from "../queries";
import { KartuIkon, type Aksen } from "./KartuIkon";

const FORMAT_PERSEN = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

/**
 * Angka pokok Risiko Stunting — sekerangka dengan AngkaDesa pada kependudukan.
 *
 * Semua angkanya DITURUNKAN dari data TB/U (lihat ambilRingkasanStunting), jadi
 * selalu konsisten dengan grafiknya. Bila belum ada data terukur, seluruh panel
 * disembunyikan dan keadaan kosong ditangani DaftarStunting.
 */
export async function AngkaStunting() {
  const [ringkasan, metadata] = await Promise.all([
    ambilRingkasanStunting(),
    ambilMetadataStunting(),
  ]);

  if (ringkasan.diukur === 0 && ringkasan.jumlahBalita === 0) return null;

  const ringkas: {
    kunci: string;
    ikon: ReactNode;
    label: string;
    nilai: string;
    satuan: string;
    aksen: Aksen;
  }[] = [
    {
      kunci: "balita",
      ikon: <Baby />,
      label: "Jumlah Balita",
      nilai: angka(ringkasan.jumlahBalita),
      satuan: "balita",
      aksen: "hijau",
    },
    {
      kunci: "diukur",
      ikon: <Ruler />,
      label: "Diukur (TB/U)",
      nilai: angka(ringkasan.diukur),
      satuan: "balita",
      aksen: "hijau",
    },
    {
      kunci: "stunting",
      ikon: <TriangleAlert />,
      label: "Balita Stunting",
      nilai: angka(ringkasan.stunting),
      satuan: "balita",
      aksen: "oranye",
    },
    {
      kunci: "prevalensi",
      ikon: <Percent />,
      label: "Prevalensi Stunting",
      nilai: FORMAT_PERSEN.format(ringkasan.prevalensi),
      satuan: "%",
      aksen: "oranye",
    },
  ];

  return (
    <section
      aria-label="Ringkasan risiko stunting"
      className="overflow-hidden rounded-lg border border-garis bg-white"
    >
      <div className="grid gap-px bg-garis sm:grid-cols-2 lg:grid-cols-4">
        {ringkas.map((item) => (
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
