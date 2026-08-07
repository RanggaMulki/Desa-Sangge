import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormSambutan } from "@/features/halaman-statis/components/FormSambutan";
import { UnggahFotoSambutan } from "@/features/halaman-statis/components/UnggahFotoSambutan";
import {
  ambilFotoSambutan,
  ambilHalaman,
} from "@/features/halaman-statis/queries";
import { SLUG_HALAMAN } from "@/features/halaman-statis/halaman";
import { ambilPengisiStruktur } from "@/features/pemerintahan/queries";

export const metadata: Metadata = {
  title: "Sambutan Kepala Desa",
  robots: { index: false, follow: false },
};

export default async function Kelola() {
  const [halaman, fotoSambutan, pengisi] = await Promise.all([
    ambilHalaman(SLUG_HALAMAN.sambutan),
    ambilFotoSambutan(),
    ambilPengisiStruktur(),
  ]);
  const kades = pengisi.get("kepala-desa");

  return (
    <div className="masuk-halus">
      <JudulPengelolaan
        judul="Sambutan Kepala Desa"
        keterangan="Foto dan kata sambutan yang tampil di halaman depan. Nama Kepala Desa mengikuti data Bagan & Perangkat."
      />
      <div className="max-w-3xl space-y-5">
        <UnggahFotoSambutan
          fotoSambutan={fotoSambutan}
          fotoKades={kades?.fotoUrl ?? null}
        />
        <FormSambutan kontenAwal={halaman?.konten ?? ""} />
      </div>
    </div>
  );
}
