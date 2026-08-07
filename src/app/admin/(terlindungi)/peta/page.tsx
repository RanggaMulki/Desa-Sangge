import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormPeta } from "@/features/pengaturan/components/FormPeta";
import { ambilPengaturanPeta } from "@/features/pengaturan/queries";

export const metadata = { title: "Peta Lokasi" };

export default async function KelolaPeta() {
  const { titik, zoom, catatan } = await ambilPengaturanPeta();

  return (
    <>
      <JudulPengelolaan
        judul="Peta Lokasi Desa"
        keterangan="Titik yang ditunjuk peta di halaman Profil."
      />
      <FormPeta
        titik={titik ? `${titik.lat}, ${titik.lng}` : ""}
        zoom={zoom}
        catatan={catatan}
      />
    </>
  );
}
