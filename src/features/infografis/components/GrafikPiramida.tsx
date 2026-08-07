"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { angka } from "@/lib/format";
import type { Butir } from "../kategori";
import { TampilanData } from "./TampilanData";

type DataPiramida = {
  label: string;
  laki: number;
  perempuan: number;
  lakiAsli: number;
  perempuanAsli: number;
};

function TooltipPiramida({ active, payload }: TooltipContentProps) {
  const data = payload?.[0]?.payload as DataPiramida | undefined;
  if (!active || !data) return null;

  return (
    <div className="min-w-52 rounded-lg bg-tinta px-4 py-3 text-sm text-white shadow-[0_4px_8px_rgba(46,48,62,0.18)]">
      <p className="font-bold">{data.label}</p>
      <dl className="mt-2 space-y-1.5 text-white/80">
        <div className="flex items-baseline justify-between gap-5">
          <dt>Laki-laki</dt>
          <dd className="font-bold tabular-nums text-white">
            {angka(data.lakiAsli)} jiwa
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-5">
          <dt>Perempuan</dt>
          <dd className="font-bold tabular-nums text-white">
            {angka(data.perempuanAsli)} jiwa
          </dd>
        </div>
      </dl>
    </div>
  );
}

function useKurangiGerak() {
  const [kurangi, setKurangi] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ubah = () => setKurangi(media.matches);
    ubah();
    media.addEventListener("change", ubah);
    return () => media.removeEventListener("change", ubah);
  }, []);

  return kurangi;
}

/**
 * Piramida penduduk dua arah. Nilai laki-laki dibuat negatif hanya untuk
 * menggambar batang ke kiri; seluruh teks dan tabel tetap menampilkan angka
 * positif supaya pembaca tidak mengira jumlah warganya negatif.
 */
export function GrafikPiramida({
  laki,
  perempuan,
}: {
  laki: Butir[];
  perempuan: Butir[];
}) {
  const kurangiGerak = useKurangiGerak();
  const data = useMemo<DataPiramida[]>(() => {
    const perempuanPerLabel = new Map(
      perempuan.map((item) => [item.label, item.nilai]),
    );
    return laki.map((item) => {
      const nilaiPerempuan = perempuanPerLabel.get(item.label) ?? 0;
      return {
        label: item.label,
        laki: -item.nilai,
        perempuan: nilaiPerempuan,
        lakiAsli: item.nilai,
        perempuanAsli: nilaiPerempuan,
      };
    });
  }, [laki, perempuan]);

  const totalLaki = data.reduce((total, item) => total + item.lakiAsli, 0);
  const totalPerempuan = data.reduce(
    (total, item) => total + item.perempuanAsli,
    0,
  );

  return (
    <TampilanData
      label="Pilih tampilan piramida atau tabel"
      grafik={
        <>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 text-tinta">
              <span
                aria-hidden="true"
                className="size-3 rounded-sm bg-hijau-utama"
              />
              Laki-laki
            </span>
            <span className="inline-flex items-center gap-2 text-tinta">
              <span
                aria-hidden="true"
                className="size-3 rounded-sm bg-oranye-data"
              />
              Perempuan
            </span>
          </div>

          <div
            role="img"
            aria-label={`Piramida penduduk dengan ${data.length} kelompok umur, ${angka(totalLaki)} laki-laki dan ${angka(totalPerempuan)} perempuan`}
            className="h-[650px] min-h-[34rem] w-full sm:h-[610px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 8, bottom: 12, left: 0 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--color-garis)"
                  strokeDasharray="3 4"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--color-tinta-redup)", fontSize: 12 }}
                  tickFormatter={(value: number) => angka(Math.abs(value))}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={108}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--color-tinta)", fontSize: 12 }}
                />
                <ReferenceLine
                  x={0}
                  stroke="var(--color-tinta)"
                  strokeOpacity={0.45}
                />
                <Tooltip
                  content={(props) => <TooltipPiramida {...props} />}
                  cursor={{
                    fill: "var(--color-permukaan)",
                    fillOpacity: 0.65,
                  }}
                  wrapperStyle={{ outline: "none", zIndex: 10 }}
                />
                <Bar
                  dataKey="laki"
                  name="Laki-laki"
                  fill="var(--color-hijau-utama)"
                  maxBarSize={22}
                  radius={[4, 0, 0, 4]}
                  isAnimationActive={!kurangiGerak}
                  animationDuration={550}
                />
                <Bar
                  dataKey="perempuan"
                  name="Perempuan"
                  fill="var(--color-oranye-data)"
                  maxBarSize={22}
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={!kurangiGerak}
                  animationDuration={550}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      }
      tabel={
        <table className="w-full table-fixed text-xs sm:text-sm">
          <caption className="sr-only">
            Jumlah penduduk laki-laki dan perempuan menurut kelompok umur
          </caption>
            <thead>
              <tr className="border-b border-garis text-left text-tinta-redup">
                <th className="w-1/2 pb-3 pr-3 font-semibold">
                  Kelompok umur
                </th>
                <th className="w-1/4 px-2 pb-3 text-right font-semibold">
                  Laki-laki
                </th>
                <th className="w-1/4 pb-3 pl-2 text-right font-semibold">
                  Perempuan
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.label} className="border-b border-garis/70">
                  <th className="break-words py-3 pr-3 text-left font-medium text-tinta">
                    {item.label}
                  </th>
                  <td className="px-2 py-3 text-right tabular-nums">
                    {angka(item.lakiAsli)}
                  </td>
                  <td className="py-3 pl-2 text-right tabular-nums">
                    {angka(item.perempuanAsli)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-tinta">
                <th className="pt-3 text-left">Jumlah</th>
                <td className="px-2 pt-3 text-right tabular-nums">
                  {angka(totalLaki)}
                </td>
                <td className="pt-3 text-right tabular-nums">
                  {angka(totalPerempuan)}
                </td>
              </tr>
            </tfoot>
          </table>
      }
    />
  );
}
