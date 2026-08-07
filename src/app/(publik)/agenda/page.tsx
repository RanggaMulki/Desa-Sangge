import type { Metadata } from "next";
import { KepalaHalaman } from "@/features/tata-letak/components/KepalaHalaman";
import { SeksiAgenda } from "@/features/agenda/components/SeksiAgenda";

export const metadata: Metadata = {
  title: "Agenda Kegiatan",
  description:
    "Kalender kegiatan Desa Sangge dengan tanggal Masehi dan hari pasaran Jawa.",
};

export const revalidate = 3600;

export default function AgendaKegiatan() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
      <KepalaHalaman
        judul="Agenda Kegiatan"
        keterangan="Kalender kegiatan desa dengan hari pasaran Jawa pada setiap tanggal."
      />
      <SeksiAgenda />
    </div>
  );
}
