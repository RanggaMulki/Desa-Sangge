"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Phone, Save, X } from "lucide-react";
import type { KontakLayanan } from "@/db/schema";
import { nomorTampil } from "@/lib/format";
import { JENIS_KONTAK } from "../jenis";
import { simpanKontak, type HasilKontak } from "../actions";

const KELAS_INPUT =
  "mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda";

/** Form tambah/ubah kontak layanan. Pola sama dengan FormAgenda. */
export function FormKontak({ awal }: { awal?: KontakLayanan | null }) {
  const [hasil, aksi, sedang] = useActionState<HasilKontak | null, FormData>(
    simpanKontak,
    null,
  );

  return (
    <form action={aksi} className="rounded-xl border border-garis bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-hijau-muda text-hijau-utama">
          <Phone size={19} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold">
          {awal ? "Ubah kontak" : "Tambah kontak"}
        </h2>
      </div>

      {awal && <input type="hidden" name="id" value={awal.id} />}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="kontak-nama" className="text-sm font-semibold">
            Nama layanan
          </label>
          <input
            id="kontak-nama"
            name="namaLayanan"
            type="text"
            required
            maxLength={120}
            defaultValue={awal?.namaLayanan ?? ""}
            placeholder="Contoh: Bidan Desa"
            className={KELAS_INPUT}
          />
        </div>

        <div>
          <label htmlFor="kontak-jenis" className="text-sm font-semibold">
            Jenis layanan
          </label>
          <select
            id="kontak-jenis"
            name="jenis"
            defaultValue={awal?.jenis ?? "umum"}
            className={KELAS_INPUT}
          >
            {JENIS_KONTAK.map((j) => (
              <option key={j.kode} value={j.kode}>
                {j.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-tinta-redup">
            Jenis menentukan letak kontak di halaman publik.
          </p>
        </div>

        <div>
          <label htmlFor="kontak-petugas" className="text-sm font-semibold">
            Nama petugas{" "}
            <span className="font-normal text-tinta-redup">(opsional)</span>
          </label>
          <input
            id="kontak-petugas"
            name="namaPetugas"
            type="text"
            maxLength={100}
            defaultValue={awal?.namaPetugas ?? ""}
            placeholder="Contoh: Ibu Sri Wahyuni"
            className={KELAS_INPUT}
          />
        </div>

        <div>
          <label htmlFor="kontak-nomor" className="text-sm font-semibold">
            Nomor WhatsApp{" "}
            <span className="font-normal text-tinta-redup">(opsional)</span>
          </label>
          <input
            id="kontak-nomor"
            name="nomorWa"
            type="tel"
            inputMode="tel"
            defaultValue={awal?.nomorWa ? nomorTampil(awal.nomorWa) : ""}
            placeholder="Contoh: 0812-3456-7890"
            className={KELAS_INPUT}
          />
          <p className="mt-1 text-sm text-tinta-redup">
            Boleh ditulis dengan strip atau spasi — nanti dirapikan otomatis.
          </p>
        </div>

        <div>
          <label htmlFor="kontak-jam" className="text-sm font-semibold">
            Jam layanan{" "}
            <span className="font-normal text-tinta-redup">(opsional)</span>
          </label>
          <input
            id="kontak-jam"
            name="jamLayanan"
            type="text"
            maxLength={100}
            defaultValue={awal?.jamLayanan ?? ""}
            placeholder="Contoh: Senin–Jumat 08.00–14.00"
            className={KELAS_INPUT}
          />
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input
            type="checkbox"
            name="aktif"
            value="ya"
            defaultChecked={awal?.aktif ?? true}
            className="size-4.5 accent-hijau-utama"
          />
          Tampilkan di website
        </label>
      </div>

      {hasil && !hasil.ok && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-merah-layanan/30 bg-white px-3.5 py-2.5 text-sm font-medium text-merah-layanan"
        >
          {hasil.pesan}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-garis pt-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : awal ? "Simpan perubahan" : "Simpan kontak"}
        </button>
        {awal && (
          <Link
            href="/admin/kontak"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 py-2.5 font-semibold text-tinta-redup hover:bg-permukaan"
          >
            <X size={17} aria-hidden="true" />
            Batal
          </Link>
        )}
      </div>
    </form>
  );
}
