import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormVisiMisi } from "@/features/halaman-statis/components/FormVisiMisi";
import { ambilVisiMisi } from "@/features/halaman-statis/queries";

export const metadata = { title: "Visi & Misi" };

export default async function KelolaVisiMisi() {
  const { visi, misi } = await ambilVisiMisi();

  return (
    <>
      <JudulPengelolaan
        judul="Visi & Misi"
        keterangan="Isi visi dan misi Desa Sangge. Perubahan langsung tampil di halaman Profil."
      />
      <FormVisiMisi visi={visi} misi={misi.map((m) => m.teks)} />
    </>
  );
}
