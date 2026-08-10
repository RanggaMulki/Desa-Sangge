"use client";

import { useActionState } from "react";
import { simpanNamaPerangkat, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";
import { UnggahFoto } from "./UnggahFoto";

/**
 * Form perangkat desa per jabatan: foto opsional + nama.
 *
 * Jabatannya sudah tetap (dari struktur), jadi pengurus desa cukup mengetik
 * nama dan mengunggah foto di kartu yang sesuai — tidak bisa dan tidak perlu
 * mengubah susunannya. Inilah yang membuat "struktur tetap, isi bisa diubah"
 * terasa mudah.
 *
 * Nama disimpan lewat tombol "Simpan" di bawah (semua sekaligus). Foto disimpan
 * SENDIRI begitu dipilih — jadi tombol unggah foto memakai server action
 * terpisah, bukan ikut form nama ini. Keduanya berdampingan tanpa saling
 * mengganggu karena tombol foto tidak men-submit form.
 */
export function FormPerangkat({
  slot,
}: {
  slot: { kunci: string; jabatan: string; nama: string; foto: string | null }[];
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanNamaPerangkat,
    null,
  );
  useNotifHasil(hasil);

  return (
    <form action={aksi} className="space-y-6">
      <div className="space-y-4">
        {slot.map((s) => (
          <div
            key={s.kunci}
            className="flex flex-col gap-4 rounded-xl border border-garis bg-white p-4 sm:flex-row sm:items-center"
          >
            <UnggahFoto posisi={s.kunci} fotoAwal={s.foto} />
            <div className="flex-1">
              <label
                htmlFor={`nama-${s.kunci}`}
                className="text-sm font-medium text-tinta-redup"
              >
                {s.jabatan}
              </label>
              <input
                id={`nama-${s.kunci}`}
                name={`nama-${s.kunci}`}
                type="text"
                defaultValue={s.nama}
                placeholder="Nama pejabat (kosongkan bila belum ada)"
                maxLength={100}
                className="mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-garis pt-5">
        <button
          type="submit"
          disabled={sedang}
          className="rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {sedang ? "Menyimpan nama…" : "Simpan nama"}
        </button>
        {hasil && (
          <p
            role="status"
            className={hasil.ok ? "font-medium text-hijau-utama" : "font-medium text-merah-layanan"}
          >
            {hasil.pesan}
          </p>
        )}
      </div>
    </form>
  );
}
