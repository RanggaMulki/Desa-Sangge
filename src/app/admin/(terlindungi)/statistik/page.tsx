import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormStatistik } from "@/features/statistik/components/FormStatistik";
import { ambilStatistik } from "@/features/statistik/queries";

export const metadata = { title: "Angka Desa" };

export default async function KelolaStatistik() {
  const data = await ambilStatistik();

  // kunci → angka. Baris lama tanpa kunci diabaikan: form hanya mengenal
  // variabel tetap, jadi sisa data lama tidak ikut tampil dan akan dibersihkan
  // saat disimpan.
  const nilaiAwal: Record<string, number> = {};
  for (const d of data) if (d.kunci) nilaiAwal[d.kunci] = d.nilai;

  const tahunAwal = data.length
    ? Math.max(...data.map((d) => d.tahun))
    : new Date().getFullYear();

  return (
    <>
      <JudulPengelolaan
        judul="Angka Desa"
        keterangan="Jumlah penduduk, kepala keluarga, luas wilayah, dan jumlah dusun. Namanya sudah tetap — cukup isi angkanya."
      />
      <FormStatistik nilaiAwal={nilaiAwal} tahunAwal={tahunAwal} />
    </>
  );
}
