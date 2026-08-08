import { ambilRingkasanStunting } from "../queries";
import type { Butir } from "../kategori";
import { GrafikKolom, GrafikPai } from "./GrafikLazy";
import { PanelGrafik } from "./PanelGrafik";

/** Dua panel grafik yang mengikuti struktur visual Infografis Penduduk. */
export async function DaftarStunting() {
  const ringkasan = await ambilRingkasanStunting();

  const ibuHamil: Butir[] = [
    {
      id: "ibu-hamil-kek",
      label: "Berisiko KEK",
      nilai: ringkasan.ibuHamilKek,
    },
    {
      id: "ibu-hamil-tidak-kek",
      label: "Tidak berisiko KEK",
      nilai: Math.max(0, ringkasan.jumlahIbuHamil - ringkasan.ibuHamilKek),
    },
  ];

  const risikoBalita: Butir[] = [
    {
      id: "balita-pendek",
      label: "Pendek/sangat pendek",
      nilai: ringkasan.balitaPendek,
    },
    {
      id: "balita-gizi-kurang",
      label: "Gizi kurang",
      nilai: ringkasan.balitaGiziKurang,
    },
    {
      id: "balita-berat-badan-kurang",
      label: "Berat badan kurang",
      nilai: ringkasan.balitaBeratBadanKurang,
    },
  ];

  return (
    <div className="space-y-8">
      <PanelGrafik
        id="risiko-kek-ibu-hamil"
        judul="Risiko KEK pada Ibu Hamil"
        keterangan="Perbandingan ibu hamil yang berisiko kekurangan energi kronis (KEK) dan yang tidak berisiko."
        butir={ibuHamil}
        labelJumlah="Total ibu hamil"
        satuan="ibu hamil"
        anak={<GrafikPai butir={ibuHamil} satuan="ibu hamil" />}
      />

      <PanelGrafik
        id="indikator-risiko-balita"
        judul="Indikator Risiko pada Balita"
        keterangan="Setiap indikator dibandingkan dengan total balita yang dipantau. Seorang balita dapat tercatat pada lebih dari satu indikator."
        butir={risikoBalita}
        totalAcuan={ringkasan.jumlahBalita}
        labelJumlah="Total balita dipantau"
        satuan="balita"
        anak={
          <GrafikKolom
            butir={risikoBalita}
            satuan="balita"
            totalAcuan={ringkasan.jumlahBalita}
            labelTotal="Total balita"
          />
        }
      />
    </div>
  );
}
