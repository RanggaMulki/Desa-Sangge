"use client";

import { useActionState } from "react";
import { simpanStunting, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";
import type { RingkasanStunting } from "../stunting";

/** Gaya seragam untuk kotak angka: besar, rata kanan, tanpa panah spinner. */
const KELAS_ANGKA =
  "min-h-11 w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-right text-base tabular-nums outline-none [appearance:textfield] focus:border-hijau-utama focus:ring-2 focus:ring-hijau-muda [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const KELAS_TEKS =
  "min-h-11 w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-base outline-none focus:border-hijau-utama focus:ring-2 focus:ring-hijau-muda";

function IsianAngka({
  id,
  name,
  nilai,
  label,
  keterangan,
}: {
  id: string;
  name: string;
  nilai: number;
  label: string;
  keterangan?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-tinta">
        {label}
      </span>
      <input
        id={id}
        name={name}
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        required
        defaultValue={nilai}
        className={KELAS_ANGKA}
      />
      {keterangan && (
        <span className="mt-1.5 block text-sm leading-relaxed text-tinta-redup">
          {keterangan}
        </span>
      )}
    </label>
  );
}

export function FormStunting({
  ringkasanAwal,
}: {
  ringkasanAwal: RingkasanStunting;
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanStunting,
    null,
  );
  useNotifHasil(hasil);

  return (
    <form action={aksi} className="space-y-6">
      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Periode data
        </legend>
        <label className="block max-w-xl">
          <span className="mb-1.5 block text-sm font-semibold text-tinta">
            Bulan dan tahun
          </span>
          <input
            name="periode"
            type="text"
            required
            defaultValue={ringkasanAwal.periode}
            placeholder="Contoh: Juni 2026"
            className={KELAS_TEKS}
          />
        </label>
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Data ibu hamil
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <IsianAngka
            id="jumlah-ibu-hamil"
            name="jumlah-ibu-hamil"
            nilai={ringkasanAwal.jumlahIbuHamil}
            label="Total ibu hamil"
          />
          <IsianAngka
            id="ibu-hamil-kek"
            name="ibu-hamil-kek"
            nilai={ringkasanAwal.ibuHamilKek}
            label="Ibu hamil berisiko KEK"
            keterangan="KEK adalah kekurangan energi kronis."
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Data balita risiko stunting
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <IsianAngka
            id="jumlah-balita"
            name="jumlah-balita"
            nilai={ringkasanAwal.jumlahBalita}
            label="Total balita"
          />
          <IsianAngka
            id="balita-pendek"
            name="balita-pendek"
            nilai={ringkasanAwal.balitaPendek}
            label="Pendek atau sangat pendek"
          />
          <IsianAngka
            id="balita-gizi-kurang"
            name="balita-gizi-kurang"
            nilai={ringkasanAwal.balitaGiziKurang}
            label="Gizi kurang"
          />
          <IsianAngka
            id="balita-berat-badan-kurang"
            name="balita-berat-badan-kurang"
            nilai={ringkasanAwal.balitaBeratBadanKurang}
            label="Berat badan kurang"
          />
        </div>
      </fieldset>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-4 border-t border-garis bg-latar/95 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          {sedang ? "Menyimpan…" : "Simpan data stunting"}
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
