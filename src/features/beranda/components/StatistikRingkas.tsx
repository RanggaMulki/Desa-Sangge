import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import {
  KisiStatistik,
  tahunStatistikTerbaru,
} from "@/features/statistik/components/KisiStatistik";

export async function StatistikRingkas() {
  const tahun = await tahunStatistikTerbaru();

  // Seksi hilang sepenuhnya kalau belum diisi. Tidak ada "Belum Ada Data".
  if (tahun === null) return null;

  return (
    <Seksi latar="hijau">
      <JudulSeksi
        judul="Desa Sangge dalam Angka"
        // Angka diisi manual dan tidak berubah sendiri, jadi tahunnya harus
        // terlihat supaya pembaca tahu kapan data ini berlaku.
        keterangan={`Data tahun ${tahun}.`}
      />
      <KisiStatistik />
    </Seksi>
  );
}
