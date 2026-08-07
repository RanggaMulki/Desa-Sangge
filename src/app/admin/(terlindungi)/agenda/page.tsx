import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { KelolaAgenda } from "@/features/agenda/components/KelolaAgenda";

export const metadata: Metadata = {
  title: "Agenda",
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
        judul="Agenda"
        keterangan="Jadwal kegiatan desa: posyandu, kerja bakti, musyawarah, dan lainnya."
      />
      {(hasil === "tambah" || hasil === "ubah") && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-hijau-utama/30 bg-hijau-muda px-4 py-3 text-sm font-medium text-hijau-utama"
        >
          {hasil === "tambah"
            ? "Kegiatan baru tersimpan dan langsung tampil di website."
            : "Perubahan kegiatan tersimpan."}
        </div>
      )}
      <KelolaAgenda idUbah={ubah} />
    </div>
  );
}
