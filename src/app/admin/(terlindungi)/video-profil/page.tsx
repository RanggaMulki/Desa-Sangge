import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormVideoProfil } from "@/features/pengaturan/components/FormVideoProfil";
import { ambilVideoProfil } from "@/features/pengaturan/queries";

export const metadata: Metadata = {
  title: "Video Profil Desa",
  robots: { index: false, follow: false },
};

export default async function Kelola() {
  const tautan = await ambilVideoProfil();

  return (
    <div className="masuk-halus">
      <JudulPengelolaan
        judul="Video Profil Desa"
        keterangan="Video yang tampil di halaman depan, tepat di bawah Sambutan. Ditayangkan lewat YouTube — situs tidak menyimpan berkas videonya."
      />
      <FormVideoProfil tautanAwal={tautan} />
    </div>
  );
}
