import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormPerangkat } from "@/features/pemerintahan/components/FormPerangkat";
import { ambilPengisiStruktur } from "@/features/pemerintahan/queries";
import { slotTerurut } from "@/features/pemerintahan/struktur";

export const metadata = { title: "Bagan & Perangkat" };

export default async function KelolaPerangkat() {
  const pengisi = await ambilPengisiStruktur();
  const slot = slotTerurut().map((s) => ({
    kunci: s.kunci,
    jabatan: s.jabatan,
    nama: pengisi.get(s.kunci)?.nama ?? "",
    foto: pengisi.get(s.kunci)?.fotoUrl ?? null,
  }));

  return (
    <>
      <JudulPengelolaan
        judul="Bagan & Perangkat Desa"
        keterangan="Ubah nama serta tambah, ganti, atau hapus foto tiap jabatan. Foto boleh dikosongkan dan susunan bagan tetap."
      />
      <FormPerangkat slot={slot} />
    </>
  );
}
