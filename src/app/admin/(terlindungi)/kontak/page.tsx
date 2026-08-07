import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
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
      {(hasil === "tambah" || hasil === "ubah") && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-hijau-utama/30 bg-hijau-muda px-4 py-3 text-sm font-medium text-hijau-utama"
        >
          {hasil === "tambah"
            ? "Kontak baru tersimpan dan langsung tampil di website."
            : "Perubahan kontak tersimpan."}
        </div>
      )}
      <KelolaKontak idUbah={ubah} />
    </div>
  );
}
