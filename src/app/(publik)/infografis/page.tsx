import type { Metadata } from "next";
import { AngkaDesa } from "@/features/infografis/components/AngkaDesa";
import { DaftarInfografis } from "@/features/infografis/components/DaftarInfografis";
import { tab } from "@/features/infografis/tab";

const INI = tab("penduduk");

export const metadata: Metadata = {
  title: INI.judul,
  description: INI.keterangan,
};

export const revalidate = 3600;

/** Kategori Penduduk — sekaligus halaman utama /infografis. */
export default function InfografisPenduduk() {
  return (
    <>
      <AngkaDesa />
      <div className="mt-10">
        <DaftarInfografis />
      </div>
    </>
  );
}
