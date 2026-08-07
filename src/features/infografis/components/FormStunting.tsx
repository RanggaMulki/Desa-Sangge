"use client";

import { useActionState } from "react";
import { simpanStunting, type HasilSimpan } from "../actions";
import { KATEGORI_STUNTING } from "../stunting";

function InputAngka({
  id,
  name,
  nilai,
  label,
}: {
  id: string;
  name: string;
  nilai: number;
  label: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      required
      defaultValue={nilai}
      aria-label={label}
      className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-right tabular-nums focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
    />
  );
}

export function FormStunting({
  nilaiAwal,
  periodeAwal,
  sumberNamaAwal,
  sumberUrlAwal,
}: {
  nilaiAwal: Record<string, Record<string, number>>;
  periodeAwal: string;
  sumberNamaAwal: string;
  sumberUrlAwal: string;
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanStunting,
    null,
  );

  return (
    <form action={aksi} className="space-y-6">
      <div className="rounded-lg bg-permukaan p-4 text-tinta-redup">
        Isi angka agregat hasil pemantauan posyandu — tanpa nama atau NIK balita.
        Indikatornya tidak harus berjumlah sama; isi seadanya data yang tersedia.
        Golongan yang belum ada datanya cukup diisi 0.
      </div>

      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Periode dan sumber
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block font-semibold text-tinta">
              Periode data
            </span>
            <input
              name="periode"
              type="text"
              required
              defaultValue={periodeAwal}
              placeholder="Contoh: Bulan Timbang Agustus 2026"
              className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">
              Sumber data
            </span>
            <input
              name="sumber-nama"
              type="text"
              defaultValue={sumberNamaAwal}
              placeholder="Posyandu Desa Sangge"
              className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">
              Tautan sumber{" "}
              <span className="font-normal text-tinta-redup">(opsional)</span>
            </span>
            <input
              name="sumber-url"
              type="url"
              defaultValue={sumberUrlAwal}
              placeholder="https://…"
              className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            />
          </label>
        </div>
      </fieldset>

      {KATEGORI_STUNTING.map((kategori, idx) => {
        const nilai = nilaiAwal[kategori.kunci] ?? {};
        return (
          <details
            key={kategori.kunci}
            open={idx === 0}
            className="rounded-xl border border-garis bg-white"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
              {kategori.judul}
              <span className="ml-2 text-sm font-normal text-tinta-redup">
                {kategori.variabel.length} golongan
              </span>
            </summary>
            <div className="border-t border-garis px-5 pb-5 pt-4">
              <p className="mb-3 text-sm text-tinta-redup">
                {kategori.keterangan}
              </p>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-tinta-redup">
                    <th className="pb-2 font-medium">Golongan</th>
                    <th className="w-40 pb-2 text-right font-medium">
                      Jumlah (balita)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kategori.variabel.map((label, index) => (
                    <tr
                      key={label}
                      className="border-t border-garis/70 align-middle"
                    >
                      <th className="py-2 pr-4 text-left font-medium">
                        <label htmlFor={`n-${kategori.kunci}-${index}`}>
                          {label}
                        </label>
                      </th>
                      <td className="py-2">
                        <InputAngka
                          id={`n-${kategori.kunci}-${index}`}
                          name={`n-${kategori.kunci}-${index}`}
                          nilai={nilai[label] ?? 0}
                          label={`${kategori.judul}: ${label}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        );
      })}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-garis bg-latar py-4">
        <button
          type="submit"
          disabled={sedang}
          className="rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          {sedang ? "Menyimpan..." : "Simpan data stunting"}
        </button>
        {hasil && (
          <p
            role="status"
            className={
              hasil.ok
                ? "font-medium text-hijau-utama"
                : "font-medium text-merah-layanan"
            }
          >
            {hasil.pesan}
          </p>
        )}
      </div>
    </form>
  );
}
