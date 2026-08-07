"use client";

import { useActionState } from "react";
import { simpanInfografis, type HasilSimpan } from "../actions";
import { KATEGORI_INFOGRAFIS } from "../kategori";

const KUNCI_KHUSUS = new Set([
  "jenis-kelamin",
  "umur-laki-laki",
  "umur-perempuan",
]);

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

export function FormInfografis({
  nilaiAwal,
  ringkasanAwal,
  tahunAwal,
  semesterAwal,
}: {
  nilaiAwal: Record<string, Record<string, number>>;
  ringkasanAwal: { penduduk: number; kk: number };
  tahunAwal: number;
  semesterAwal: "Gasal" | "Genap";
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanInfografis,
    null,
  );
  const gender = KATEGORI_INFOGRAFIS.find(
    (item) => item.kunci === "jenis-kelamin",
  );
  const umurLaki = KATEGORI_INFOGRAFIS.find(
    (item) => item.kunci === "umur-laki-laki",
  );
  const umurPerempuan = KATEGORI_INFOGRAFIS.find(
    (item) => item.kunci === "umur-perempuan",
  );

  return (
    <form action={aksi} className="space-y-6">
      <div className="rounded-lg bg-permukaan p-4 text-tinta-redup">
        Isi data agregat tanpa nama atau NIK warga. Jumlah pada jenis kelamin,
        piramida umur, status perkawinan, dan pendidikan akan diperiksa
        otomatis agar sama dengan total penduduk. Agama boleh seluruhnya 0 bila
        sumber data belum menyediakannya.
      </div>

      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Periode dan angka utama
        </legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">Tahun</span>
            <input
              name="tahun"
              type="number"
              min={2000}
              max={2100}
              required
              defaultValue={tahunAwal}
              className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 tabular-nums focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">
              Semester
            </span>
            <select
              name="semester"
              defaultValue={semesterAwal}
              className="min-h-12 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            >
              <option value="Gasal">Gasal</option>
              <option value="Genap">Genap</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">
              Total penduduk
            </span>
            <InputAngka
              id="total-penduduk"
              name="total-penduduk"
              nilai={ringkasanAwal.penduduk}
              label="Total penduduk"
            />
          </label>
          {gender?.variabel.map((label, index) => (
            <label key={label} className="block">
              <span className="mb-2 block font-semibold text-tinta">
                {label}
              </span>
              <InputAngka
                id={`n-jenis-kelamin-${index}`}
                name={`n-jenis-kelamin-${index}`}
                nilai={nilaiAwal["jenis-kelamin"]?.[label] ?? 0}
                label={`Jumlah ${label.toLowerCase()}`}
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block font-semibold text-tinta">
              Jumlah KK
            </span>
            <InputAngka
              id="jumlah-kk"
              name="jumlah-kk"
              nilai={ringkasanAwal.kk}
              label="Jumlah kepala keluarga"
            />
          </label>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-tinta-redup">
          Simpan hanya angka agregat. Nama dan NIK warga tidak dimasukkan ke
          website.
        </p>
      </fieldset>

      {umurLaki && umurPerempuan && (
        <details open className="rounded-xl border border-garis bg-white">
          <summary className="cursor-pointer list-none px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            Piramida Penduduk
            <span className="ml-2 text-sm font-normal text-tinta-redup">
              {umurLaki.variabel.length} kelompok umur
            </span>
          </summary>
          <div className="overflow-x-auto border-t border-garis px-5 pb-5 pt-4">
            <p className="mb-4 text-sm text-tinta-redup">
              Isi jumlah laki-laki dan perempuan untuk setiap kelompok umur.
            </p>
            <table className="w-full min-w-[38rem]">
              <thead>
                <tr className="text-left text-sm text-tinta-redup">
                  <th className="pb-2 font-medium">Kelompok umur</th>
                  <th className="w-40 px-2 pb-2 text-right font-medium">
                    Laki-laki
                  </th>
                  <th className="w-40 pb-2 pl-2 text-right font-medium">
                    Perempuan
                  </th>
                </tr>
              </thead>
              <tbody>
                {umurLaki.variabel.map((label, index) => (
                  <tr
                    key={label}
                    className="border-t border-garis/70 align-middle"
                  >
                    <th className="py-2 pr-4 text-left font-medium">{label}</th>
                    <td className="px-2 py-2">
                      <InputAngka
                        id={`n-umur-laki-laki-${index}`}
                        name={`n-umur-laki-laki-${index}`}
                        nilai={nilaiAwal["umur-laki-laki"]?.[label] ?? 0}
                        label={`Laki-laki usia ${label}`}
                      />
                    </td>
                    <td className="py-2 pl-2">
                      <InputAngka
                        id={`n-umur-perempuan-${index}`}
                        name={`n-umur-perempuan-${index}`}
                        nilai={nilaiAwal["umur-perempuan"]?.[label] ?? 0}
                        label={`Perempuan usia ${label}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {KATEGORI_INFOGRAFIS.filter(
        (kategori) => !KUNCI_KHUSUS.has(kategori.kunci),
      ).map((kategori) => {
        const nilai = nilaiAwal[kategori.kunci] ?? {};
        return (
          <details
            key={kategori.kunci}
            open={kategori.kunci === "agama"}
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
                      Jumlah (jiwa)
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
          {sedang ? "Menyimpan..." : "Simpan data penduduk"}
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
