"use client";

import { useActionState } from "react";
import { ChevronDown } from "lucide-react";
import { simpanInfografis, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";
import { KATEGORI_INFOGRAFIS } from "../kategori";

const KUNCI_KHUSUS = new Set([
  "jenis-kelamin",
  "umur-laki-laki",
  "umur-perempuan",
]);

/** Gaya seragam untuk semua kotak angka: besar, rata kanan, tanpa panah spinner. */
const KELAS_ANGKA =
  "min-h-11 w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-right text-base tabular-nums outline-none [appearance:textfield] focus:border-hijau-utama focus:ring-2 focus:ring-hijau-muda [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function InputAngka({
  id,
  name,
  nilai,
  label,
}: {
  id?: string;
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
      className={KELAS_ANGKA}
    />
  );
}

/** Field berlabel di atas (untuk angka pokok & periode). */
function Field({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-tinta">
        {judul}
      </span>
      {children}
    </label>
  );
}

/** Seksi lipat dengan judul + jumlah butir dan panah penanda buka/tutup. */
function SeksiLipat({
  judul,
  jumlah,
  satuan,
  bukaAwal,
  children,
}: {
  judul: string;
  jumlah: number;
  satuan: string;
  bukaAwal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={bukaAwal}
      className="group overflow-hidden rounded-xl border border-garis bg-white"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 hover:bg-permukaan/50 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-center gap-2 font-bold text-tinta">
          {judul}
          <span className="rounded-full bg-permukaan px-2.5 py-0.5 text-xs font-semibold text-tinta-redup">
            {jumlah} {satuan}
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-tinta-redup transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-garis p-5">{children}</div>
    </details>
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
  useNotifHasil(hasil);
  const gender = KATEGORI_INFOGRAFIS.find((i) => i.kunci === "jenis-kelamin");
  const umurLaki = KATEGORI_INFOGRAFIS.find((i) => i.kunci === "umur-laki-laki");
  const umurPerempuan = KATEGORI_INFOGRAFIS.find(
    (i) => i.kunci === "umur-perempuan",
  );

  return (
    <form action={aksi} className="space-y-6">
      {/* --- Periode data --- */}
      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Periode data
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field judul="Tahun">
            <input
              name="tahun"
              type="number"
              inputMode="numeric"
              min={2000}
              max={2100}
              required
              defaultValue={tahunAwal}
              className={KELAS_ANGKA}
            />
          </Field>
          <Field judul="Semester">
            <select
              name="semester"
              defaultValue={semesterAwal}
              className="min-h-11 w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-base outline-none focus:border-hijau-utama focus:ring-2 focus:ring-hijau-muda"
            >
              <option value="Gasal">Gasal</option>
              <option value="Genap">Genap</option>
            </select>
          </Field>
        </div>
      </fieldset>

      {/* --- Angka pokok --- */}
      <fieldset className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <legend className="px-2 text-lg font-bold text-tinta">
          Angka pokok penduduk
        </legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field judul="Total penduduk">
            <InputAngka
              id="total-penduduk"
              name="total-penduduk"
              nilai={ringkasanAwal.penduduk}
              label="Total penduduk"
            />
          </Field>
          {gender?.variabel.map((label, index) => (
            <Field key={label} judul={label}>
              <InputAngka
                id={`n-jenis-kelamin-${index}`}
                name={`n-jenis-kelamin-${index}`}
                nilai={nilaiAwal["jenis-kelamin"]?.[label] ?? 0}
                label={`Jumlah ${label.toLowerCase()}`}
              />
            </Field>
          ))}
          <Field judul="Jumlah KK">
            <InputAngka
              id="jumlah-kk"
              name="jumlah-kk"
              nilai={ringkasanAwal.kk}
              label="Jumlah kepala keluarga"
            />
          </Field>
        </div>
      </fieldset>

      {/* --- Piramida umur: kartu per kelompok, tanpa geser horizontal di HP --- */}
      {umurLaki && umurPerempuan && (
        <SeksiLipat
          judul="Piramida Penduduk"
          jumlah={umurLaki.variabel.length}
          satuan="kelompok umur"
          bukaAwal
        >
          {/* Judul kolom hanya di layar lebar */}
          <div className="hidden px-1 pb-2 text-sm font-semibold text-tinta-redup sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_9rem] sm:gap-4">
            <span>Kelompok umur</span>
            <span className="text-right">Laki-laki</span>
            <span className="text-right">Perempuan</span>
          </div>
          <div className="divide-y divide-garis/70">
            {umurLaki.variabel.map((label, index) => (
              <div
                key={label}
                className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_9rem] sm:items-center sm:gap-4"
              >
                <span className="font-medium text-tinta">{label}</span>
                <div className="flex items-center gap-2 sm:block">
                  <span className="w-20 shrink-0 text-sm text-tinta-redup sm:hidden">
                    Laki-laki
                  </span>
                  <InputAngka
                    id={`n-umur-laki-laki-${index}`}
                    name={`n-umur-laki-laki-${index}`}
                    nilai={nilaiAwal["umur-laki-laki"]?.[label] ?? 0}
                    label={`Laki-laki usia ${label}`}
                  />
                </div>
                <div className="flex items-center gap-2 sm:block">
                  <span className="w-20 shrink-0 text-sm text-tinta-redup sm:hidden">
                    Perempuan
                  </span>
                  <InputAngka
                    id={`n-umur-perempuan-${index}`}
                    name={`n-umur-perempuan-${index}`}
                    nilai={nilaiAwal["umur-perempuan"]?.[label] ?? 0}
                    label={`Perempuan usia ${label}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SeksiLipat>
      )}

      {/* --- Kategori lain (agama, pendidikan, pekerjaan, dst.) --- */}
      {KATEGORI_INFOGRAFIS.filter(
        (kategori) => !KUNCI_KHUSUS.has(kategori.kunci),
      ).map((kategori) => (
        <SeksiLipat
          key={kategori.kunci}
          judul={kategori.judul}
          jumlah={kategori.variabel.length}
          satuan="golongan"
          bukaAwal={kategori.kunci === "agama"}
        >
          <div className="divide-y divide-garis/70">
            {kategori.variabel.map((label, index) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(0,1fr)_9rem] items-center gap-3 py-3 sm:gap-4"
              >
                <label
                  htmlFor={`n-${kategori.kunci}-${index}`}
                  className="font-medium text-tinta"
                >
                  {label}
                </label>
                <InputAngka
                  id={`n-${kategori.kunci}-${index}`}
                  name={`n-${kategori.kunci}-${index}`}
                  nilai={(nilaiAwal[kategori.kunci] ?? {})[label] ?? 0}
                  label={`${kategori.judul}: ${label}`}
                />
              </div>
            ))}
          </div>
        </SeksiLipat>
      ))}

      {/* --- Bar simpan lengket --- */}
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-4 border-t border-garis bg-latar/95 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          {sedang ? "Menyimpan…" : "Simpan data penduduk"}
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
