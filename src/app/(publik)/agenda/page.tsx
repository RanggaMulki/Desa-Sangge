import type { Metadata } from "next";
import { SeksiAgenda } from "@/features/agenda/components/SeksiAgenda";
import { KepalaHalamanTerpusat } from "@/features/tata-letak/components/KepalaHalamanTerpusat";

export const metadata: Metadata = {
  title: "Agenda Kegiatan",
  description:
    "Kalender kegiatan Desa Sangge dengan tanggal Masehi dan hari pasaran Jawa.",
};

export const revalidate = 3600;

export default function AgendaKegiatan() {
  return (
    <div className="min-h-screen bg-latar">
      <KepalaHalamanTerpusat judul="Agenda Kegiatan" />
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-4 sm:pb-14 sm:pt-5 lg:px-8">
        <SeksiAgenda />
      </div>
    </div>
  );
}
