import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import {
  ambilPenggunaSaatIni,
  ambilSemuaPengguna,
} from "@/features/auth/queries";
import { DaftarAkun } from "@/features/auth/components/DaftarAkun";
import { FormTambahAkun } from "@/features/auth/components/FormTambahAkun";
import { FormGantiSandiSendiri } from "@/features/auth/components/FormGantiSandiSendiri";

export const metadata: Metadata = {
  title: "Akun Pengurus",
  robots: { index: false, follow: false },
};

export default async function KelolaAkunPage() {
  const [akunSaya, daftar] = await Promise.all([
    ambilPenggunaSaatIni(),
    ambilSemuaPengguna(),
  ]);

  return (
    <div className="masuk-halus">
      <JudulPengelolaan
        judul="Akun Pengurus"
        keterangan="Tambah akun, reset kata sandi (untuk pemulihan lupa password lewat akun cadangan), dan ganti kata sandi Anda sendiri."
      />
      <div className="max-w-3xl space-y-6">
        <DaftarAkun daftar={daftar} idSaya={akunSaya?.id ?? ""} />
        <FormTambahAkun />
        <FormGantiSandiSendiri />
      </div>
    </div>
  );
}
