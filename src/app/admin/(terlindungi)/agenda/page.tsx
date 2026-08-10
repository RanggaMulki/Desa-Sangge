import type { Metadata } from "next";
import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { NotifParamHasil } from "@/features/admin/components/NotifParamHasil";
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
      <NotifParamHasil
        pesan={
          hasil === "tambah"
            ? "Kegiatan baru tersimpan dan langsung tampil di website."
            : hasil === "ubah"
              ? "Perubahan kegiatan tersimpan."
              : null
        }
      />
      <KelolaAgenda idUbah={ubah} />
    </div>
  );
}
