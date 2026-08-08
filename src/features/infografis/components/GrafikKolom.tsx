"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { angka } from "@/lib/format";
import { BATANG } from "../warna";
import type { Butir } from "../kategori";
import { TabelData } from "./TabelData";
import { TampilanData } from "./TampilanData";

type DataGrafik = Butir & { persen: number };

const FORMAT_PERSEN = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

function TooltipBatang({
  active,
  payload,
  satuan,
}: TooltipContentProps & { satuan: string }) {
  const data = payload?.[0]?.payload as DataGrafik | undefined;
  if (!active || !data) return null;

  return (
    <div className="min-w-44 rounded-lg border border-garis bg-white px-3.5 py-3 text-sm shadow-[0_3px_8px_rgba(46,48,62,0.12)]">
      <p className="font-bold text-tinta">{data.label}</p>
      <dl className="mt-2 space-y-1.5 text-tinta-redup">
        <div className="flex items-baseline justify-between gap-5">
          <dt>Jumlah</dt>
          <dd className="font-bold tabular-nums text-tinta">
            {angka(data.nilai)} {satuan}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-5">
          <dt>Persentase</dt>
          <dd className="font-bold tabular-nums text-tinta">
            {FORMAT_PERSEN.format(data.persen)}%
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Grafik batang horizontal interaktif untuk umur, pendidikan, dan pekerjaan.
 *
 * Polanya mengadaptasi Chart with Tooltip dari shadcn/21st.dev. Batang
 * horizontal dipilih karena label data desa cukup panjang dan harus tetap
 * terbaca di HP. Batang selalu menampilkan jumlah; tooltip dan tabel tetap
 * menyertakan persentase sebagai informasi pendamping.
 */
export function GrafikKolom({
  butir,
  satuan = "jiwa",
  totalAcuan,
  labelTotal,
}: {
  butir: Butir[];
  satuan?: string;
  totalAcuan?: number;
  labelTotal?: string;
}) {
  const jumlahButir = useMemo(
    () => butir.reduce((nilai, item) => nilai + item.nilai, 0),
    [butir],
  );
  const total = totalAcuan ?? jumlahButir;
  const data = useMemo<DataGrafik[]>(
    () =>
      butir.map((item) => ({
        ...item,
        persen: total > 0 ? (item.nilai / total) * 100 : 0,
      })),
    [butir, total],
  );
  const tinggi = Math.max(290, data.length * 49);

  return (
    <TampilanData
      label="Pilih tampilan grafik atau tabel"
      grafik={
        <div
          role="img"
          aria-label={`Grafik jumlah ${satuan} untuk ${data.length} golongan`}
          style={{ height: tinggi }}
          className="w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 18, bottom: 4, left: 0 }}
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
                tickFormatter={(value: number) => angka(value)}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={132}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: "var(--color-tinta-redup)", fontSize: 12 }}
              />
              <Tooltip
                content={(props) => (
                  <TooltipBatang {...props} satuan={satuan} />
                )}
                cursor={{ fill: "var(--color-permukaan)", fillOpacity: 0.7 }}
                wrapperStyle={{ outline: "none", zIndex: 10 }}
              />
              <Bar
                dataKey="nilai"
                fill={BATANG}
                maxBarSize={27}
                radius={[0, 5, 5, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      tabel={
        <TabelData
          butir={butir}
          satuan={satuan}
          totalAcuan={totalAcuan}
          labelTotal={labelTotal}
        />
      }
    />
  );
}
