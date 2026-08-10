import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { NotifParamHasil } from "@/features/admin/components/NotifParamHasil";
import { KelolaKontak } from "@/features/kontak-layanan/components/KelolaKontak";

export const metadata: Metadata = {
  title: "Kontak & Layanan",
  robots: { index: false, follow: false },
};

export default async function Kelola({
  searchParams,
}: {
  searchParams: Promise<{ ubah?: string; hasil?: string }>;
}) {
  const { ubah, hasil } = await searchParams;

  return (
    <div className="masuk-halus">
      <JudulPengelolaan
        judul="Kontak & Layanan"
        keterangan="Nomor yang bisa dihubungi warga, termasuk kontak KPPA. Tampil di footer semua halaman."
      />
      <NotifParamHasil
        pesan={
          hasil === "tambah"
            ? "Kontak baru tersimpan dan langsung tampil di website."
            : hasil === "ubah"
              ? "Perubahan kontak tersimpan."
              : null
        }
      />
      <KelolaKontak idUbah={ubah} />
    </div>
  );
}
