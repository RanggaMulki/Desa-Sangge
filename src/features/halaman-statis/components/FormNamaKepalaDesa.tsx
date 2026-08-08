"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import {
  simpanNamaKepalaDesa,
  type HasilSimpan,
} from "@/features/pemerintahan/actions";

/**
 * Kolom ubah nama Kepala Desa di halaman Sambutan.
 *
 * Menyimpan ke record perangkat posisi "kepala-desa" — sumber data yang sama
 * dengan Bagan & Perangkat — jadi nama di beranda, bagan, dan sambutan selalu
 * seragam. Disediakan di sini karena saat Kepala Desa berganti, pengurus paling
 * sering membukanya lewat halaman Sambutan.
 */
export function FormNamaKepalaDesa({ namaAwal }: { namaAwal: string }) {
  const [nama, setNama] = useState(namaAwal);
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanNamaKepalaDesa,
    null,
  );

  return (
    <form action={aksi} className="rounded-xl border border-garis bg-white p-5">
      <label
        htmlFor="nama-kades"
        className="block text-sm font-semibold text-tinta"
      >
        Nama Kepala Desa
      </label>
      <p className="mt-1 text-sm text-tinta-redup">
        Nama ini tampil di kartu sambutan beranda dan di{" "}
        <strong>Bagan &amp; Perangkat</strong>. Ganti di sini saat Kepala Desa
        berganti — perubahannya otomatis berlaku di kedua tempat.
      </p>

      <input
        id="nama-kades"
        name="nama"
        type="text"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="mis. Bapak Suparno"
        autoComplete="off"
        className="mt-3 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : "Simpan nama"}
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
