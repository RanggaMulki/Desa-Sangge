import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormBatas } from "@/features/pemerintahan/components/FormBatas";
import { ambilBatasWilayah } from "@/features/pemerintahan/queries";

export const metadata = { title: "Batas Wilayah" };

export default async function KelolaBatas() {
  const data = await ambilBatasWilayah();

  const awal = data.map((d) => ({
    arah: d.arah,
    keterangan: d.keterangan,
  }));

  return (
    <>
      <JudulPengelolaan
        judul="Batas Wilayah"
        keterangan="Desa dan kecamatan yang berbatasan dengan Desa Sangge di tiap arah mata angin."
      />
      <FormBatas awal={awal} />
    </>
  );
}
