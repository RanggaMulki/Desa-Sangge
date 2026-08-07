import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormSejarah } from "@/features/halaman-statis/components/FormSejarah";
import { ambilHalaman } from "@/features/halaman-statis/queries";
import { SLUG_HALAMAN } from "@/features/halaman-statis/halaman";
import { pisahkanNaskahSejarah } from "@/features/halaman-statis/naskah-sejarah";

export const metadata: Metadata = {
  title: "Sejarah Desa",
  robots: { index: false, follow: false },
};

export default async function Kelola() {
  const halaman = await ambilHalaman(SLUG_HALAMAN.sejarah);
  const bagian = pisahkanNaskahSejarah(halaman?.konten ?? "");

  return (
    <div className="masuk-halus">
      <JudulPengelolaan
        judul="Sejarah Desa"
        keterangan="Kelola Sejarah Desa dan Legenda Desa dalam dua naskah terpisah yang tampil di halaman Profil."
      />
      <FormSejarah
        sejarahAwal={bagian.sejarah}
        legendaAwal={bagian.legenda}
      />
    </div>
  );
}
