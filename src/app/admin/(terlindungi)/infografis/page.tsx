import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormInfografis } from "@/features/infografis/components/FormInfografis";
import { FormStunting } from "@/features/infografis/components/FormStunting";
import { TabInfografis } from "@/features/infografis/components/TabInfografis";
import {
  ambilInfografisPerKategori,
  ambilMetadataPenduduk,
  ambilMetadataStunting,
  ambilStuntingPerKategori,
} from "@/features/infografis/queries";
import { ambilStatistik } from "@/features/statistik/queries";
import { KATEGORI_INFOGRAFIS } from "@/features/infografis/kategori";
import { KATEGORI_STUNTING } from "@/features/infografis/stunting";
import { TAB_INFOGRAFIS, type KunciTab } from "@/features/infografis/tab";

export const metadata = { title: "Infografis" };

/**
 * Pengelolaan seluruh kategori infografis dalam SATU halaman.
 *
 * Kategorinya berpindah lewat query `?tab=…`, bukan rute terpisah. Tiap tab
 * punya panel datanya sendiri yang hanya mengambil data miliknya — Penduduk
 * (angka kependudukan) dan Risiko Stunting (angka pemantauan balita).
 */
export default async function KelolaInfografis({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: diminta } = await searchParams;
  const aktif: KunciTab =
    TAB_INFOGRAFIS.find((t) => t.kunci === diminta)?.kunci ?? "penduduk";

  return (
    <>
      <JudulPengelolaan
        judul="Infografis"
        keterangan="Angka yang tampil di halaman Infografis. Pilih kategorinya di bawah, lalu isi angkanya."
      />

      <TabInfografis
        aktif={aktif}
        tautan={(k) => `/admin/infografis?tab=${k}`}
      />

      <div className="mt-6">
        {aktif === "penduduk" ? <PanelPenduduk /> : <PanelStunting />}
      </div>
    </>
  );
}

/** Form angka kependudukan. */
async function PanelPenduduk() {
  const [peta, statistik, metadataPenduduk] = await Promise.all([
    ambilInfografisPerKategori(),
    ambilStatistik(),
    ambilMetadataPenduduk(),
  ]);

  const nilaiAwal: Record<string, Record<string, number>> = {};
  for (const k of KATEGORI_INFOGRAFIS) {
    const map: Record<string, number> = {};
    for (const b of peta.get(k.kunci) ?? []) map[b.label] = b.nilai;
    nilaiAwal[k.kunci] = map;
  }

  const ringkasanAwal = {
    penduduk: statistik.find((item) => item.kunci === "penduduk")?.nilai ?? 0,
    kk: statistik.find((item) => item.kunci === "kk")?.nilai ?? 0,
  };

  let tahun = new Date().getFullYear();
  let semester: "Gasal" | "Genap" = "Genap";
  const periode = metadataPenduduk.periode.match(/^(\d{4})\s+(Gasal|Genap)$/);
  if (periode) {
    tahun = Number(periode[1]);
    semester = periode[2] as "Gasal" | "Genap";
  }

  return (
    <FormInfografis
      nilaiAwal={nilaiAwal}
      ringkasanAwal={ringkasanAwal}
      tahunAwal={tahun}
      semesterAwal={semester}
    />
  );
}

/** Form angka risiko stunting balita. */
async function PanelStunting() {
  const [peta, metadata] = await Promise.all([
    ambilStuntingPerKategori(),
    ambilMetadataStunting(),
  ]);

  const nilaiAwal: Record<string, Record<string, number>> = {};
  for (const k of KATEGORI_STUNTING) {
    const map: Record<string, number> = {};
    for (const b of peta.get(k.kunci) ?? []) map[b.label] = b.nilai;
    nilaiAwal[k.kunci] = map;
  }

  return (
    <FormStunting
      nilaiAwal={nilaiAwal}
      periodeAwal={metadata.periode}
      sumberNamaAwal={metadata.sumberNama}
      sumberUrlAwal={metadata.sumberUrl}
    />
  );
}
