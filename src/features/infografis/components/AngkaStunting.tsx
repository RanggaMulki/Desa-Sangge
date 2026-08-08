import type { ReactNode } from "react";
import { Baby, HeartPulse } from "lucide-react";
import { angka } from "@/lib/format";
import { ambilRingkasanStunting } from "../queries";
import { KartuIkon, type Aksen } from "./KartuIkon";

/** Dua angka total, memakai pola kartu yang sama dengan Data Kependudukan. */
export async function AngkaStunting() {
  const ringkasan = await ambilRingkasanStunting();

  const statistik: {
    kunci: string;
    ikon: ReactNode;
    label: string;
    nilai: string;
    satuan: string;
    aksen: Aksen;
  }[] = [
    {
      kunci: "ibu-hamil",
      ikon: <HeartPulse />,
      label: "Total Ibu Hamil",
      nilai: angka(ringkasan.jumlahIbuHamil),
      satuan: "ibu hamil",
      aksen: "hijau",
    },
    {
      kunci: "balita",
      ikon: <Baby />,
      label: "Total Balita",
      nilai: angka(ringkasan.jumlahBalita),
      satuan: "balita",
      aksen: "hijau",
    },
  ];

  return (
    <section
      aria-label="Ringkasan data risiko stunting"
      className="overflow-hidden rounded-lg border border-garis bg-white"
    >
      <div className="grid gap-px bg-garis sm:grid-cols-2">
        {statistik.map((item) => (
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
