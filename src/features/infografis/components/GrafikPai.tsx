"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import { angka } from "@/lib/format";
import { SLOT_KATEGORIKAL } from "../warna";
import type { Butir } from "../kategori";
import { TabelData } from "./TabelData";
import { TampilanData } from "./TampilanData";

type DataPai = Butir & {
  persen: number;
  warna: string;
};

const FORMAT_PERSEN = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

function TooltipPai({
  active,
  payload,
  satuan,
}: TooltipContentProps & { satuan: string }) {
  const data = payload?.[0]?.payload as DataPai | undefined;
  if (!active || !data) return null;

  return (
    <div className="min-w-44 rounded-lg border border-garis bg-white px-3.5 py-3 text-sm shadow-[0_3px_8px_rgba(46,48,62,0.12)]">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-sm"
          style={{ background: data.warna }}
        />
        <p className="font-bold text-tinta">{data.label}</p>
      </div>
      <p className="mt-2 tabular-nums text-tinta-redup">
        <strong className="text-tinta">{angka(data.nilai)}</strong> {satuan}
        {" · "}
        {FORMAT_PERSEN.format(data.persen)}%
      </p>
    </div>
  );
}

/**
 * Donut interaktif untuk komposisi penduduk per dusun.
 *
 * Daftar di kanan berfungsi sebagai legenda sekaligus kontrol sentuh. Angka
 * pasti dan persentase selalu tertulis, sehingga warna bukan satu-satunya
 * pembawa informasi.
 */
export function GrafikPai({
  butir,
  satuan = "jiwa",
}: {
  butir: Butir[];
  satuan?: string;
}) {
  const total = butir.reduce((nilai, item) => nilai + item.nilai, 0);
  const data = useMemo<DataPai[]>(
    () =>
      [...butir]
        .sort((a, b) => b.nilai - a.nilai)
        .map((item, index) => ({
          ...item,
          persen: total > 0 ? (item.nilai / total) * 100 : 0,
          warna: SLOT_KATEGORIKAL[index % SLOT_KATEGORIKAL.length],
        })),
    [butir, total],
  );
  const [aktifId, setAktifId] = useState(() => data[0]?.id ?? "");
  const aktif = data.find((item) => item.id === aktifId) ?? data[0];

  if (total === 0 || !aktif) return null;

  return (
    <TampilanData
      label="Pilih tampilan grafik atau tabel"
      grafik={
        <div className="grid items-center gap-7 md:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)] md:gap-10">
          <div className="relative mx-auto h-64 w-full max-w-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Tooltip
                  content={(props) => (
                    <TooltipPai {...props} satuan={satuan} />
                  )}
                  wrapperStyle={{ outline: "none", zIndex: 10 }}
                />
                <Pie
                  data={data}
                  dataKey="nilai"
                  nameKey="label"
                  innerRadius="58%"
                  outerRadius="88%"
                  paddingAngle={1.5}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive={false}
                  onClick={(entry) => {
                    const item = entry.payload as DataPai | undefined;
                    if (item?.id) setAktifId(item.id);
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  {data.map((item) => (
                    <Cell
                      key={item.id}
                      fill={item.warna}
                      opacity={item.id === aktif.id ? 1 : 0.82}
                      stroke={item.id === aktif.id ? "#2e303e" : "#ffffff"}
                      strokeWidth={item.id === aktif.id ? 3 : 2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div
              aria-live="polite"
              className="pointer-events-none absolute inset-0 grid place-content-center px-16 text-center"
            >
              <span className="truncate text-sm font-semibold text-tinta-redup">
                {aktif.label}
              </span>
              <strong className="mt-0.5 text-2xl font-extrabold tabular-nums text-hijau-utama">
                {angka(aktif.nilai)}
              </strong>
              <span className="text-xs font-medium text-tinta-redup">
                {FORMAT_PERSEN.format(aktif.persen)}%
              </span>
            </div>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
            {data.map((item) => {
              const terpilih = item.id === aktif.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={terpilih}
                    onClick={() => setAktifId(item.id)}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                      terpilih
                        ? "bg-hijau-muda text-tinta"
                        : "hover:bg-permukaan"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-sm"
                      style={{ background: item.warna }}
                    />
                    <span className="min-w-0 flex-1 font-semibold">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-right tabular-nums">
                      <strong className="block text-hijau-utama">
                        {angka(item.nilai)}
                      </strong>
                      <span className="block text-xs text-tinta-redup">
                        {FORMAT_PERSEN.format(item.persen)}%
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      }
      tabel={<TabelData butir={butir} satuan={satuan} />}
    />
  );
}
