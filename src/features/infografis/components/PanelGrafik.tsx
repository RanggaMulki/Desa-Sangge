import type { ReactNode } from "react";
import { angka } from "@/lib/format";
import type { Butir } from "../kategori";

/**
 * Bingkai satu grafik infografis: judul, keterangan, isi grafik, dan total di
 * kaki panel. Dipakai bersama oleh kategori penduduk dan stunting; `satuan`
 * yang membedakan kakinya ("jiwa" untuk penduduk, "balita" untuk stunting).
 */
export function PanelGrafik({
  id,
  judul,
  keterangan,
  butir,
  anak,
  labelJumlah = "Total",
  satuan = "jiwa",
  totalAcuan,
}: {
  id: string;
  judul: string;
  keterangan: string;
  butir: Butir[];
  anak: ReactNode;
  labelJumlah?: string;
  satuan?: string;
  totalAcuan?: number;
}) {
  const jumlahButir = butir.reduce((nilai, item) => nilai + item.nilai, 0);
  const total = totalAcuan ?? jumlahButir;

  return (
    <section
      aria-labelledby={`judul-${id}`}
      className="overflow-hidden rounded-lg border border-garis bg-white"
    >
      <header className="border-b border-garis bg-permukaan px-5 py-5 sm:px-7">
        <h2
          id={`judul-${id}`}
          className="text-xl font-bold text-tinta sm:text-2xl"
        >
          {judul}
        </h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-tinta-redup sm:text-base">
          {keterangan}
        </p>
      </header>
      <div className="px-4 py-6 sm:px-7 sm:py-7">{anak}</div>
      <p className="flex items-baseline justify-between gap-4 border-t border-garis bg-permukaan px-5 py-3.5 text-sm text-tinta-redup sm:px-7">
        <span>{labelJumlah}</span>
        <strong className="text-base tabular-nums text-tinta">
          {angka(total)} {satuan}
        </strong>
      </p>
    </section>
  );
}
