"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CalendarPlus, Save, X } from "lucide-react";
import type { Agenda } from "@/db/schema";
import { simpanAgenda, type HasilAgenda } from "../actions";

const KELAS_INPUT =
  "mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda";

/**
 * Form tambah/ubah kegiatan.
 *
 * Satu form untuk dua tugas: tanpa `awal` berarti menambah, dengan `awal`
 * berarti mengubah (dibuka lewat ?ubah=<id>). `key` di halaman pemanggil
 * memastikan form ter-reset saat berpindah antara keduanya.
 */
export function FormAgenda({ awal }: { awal?: Agenda | null }) {
  const [hasil, aksi, sedang] = useActionState<HasilAgenda | null, FormData>(
    simpanAgenda,
    null,
  );

  return (
    <form
      action={aksi}
      className="rounded-xl border border-garis bg-white p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-hijau-muda text-hijau-utama">
          <CalendarPlus size={19} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold">
          {awal ? "Ubah kegiatan" : "Tambah kegiatan"}
        </h2>
      </div>

      {awal && <input type="hidden" name="id" value={awal.id} />}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="agenda-judul" className="text-sm font-semibold">
            Nama kegiatan
          </label>
          <input
            id="agenda-judul"
            name="judul"
            type="text"
            required
            maxLength={200}
            defaultValue={awal?.judul ?? ""}
            placeholder="Contoh: Posyandu Balita Dusun Keponan"
            className={KELAS_INPUT}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="agenda-tanggal-mulai"
              className="text-sm font-semibold"
            >
              Tanggal kegiatan
            </label>
            <input
              id="agenda-tanggal-mulai"
              name="tanggalMulai"
              type="date"
              required
              defaultValue={awal?.tanggalMulai ?? ""}
              className={KELAS_INPUT}
            />
          </div>
          <div>
            <label
              htmlFor="agenda-tanggal-selesai"
              className="text-sm font-semibold"
            >
              Sampai tanggal{" "}
              <span className="font-normal text-tinta-redup">(opsional)</span>
            </label>
            <input
              id="agenda-tanggal-selesai"
              name="tanggalSelesai"
              type="date"
              defaultValue={awal?.tanggalSelesai ?? ""}
              className={KELAS_INPUT}
            />
          </div>
        </div>

        <div>
          <label htmlFor="agenda-lokasi" className="text-sm font-semibold">
            Tempat{" "}
            <span className="font-normal text-tinta-redup">(opsional)</span>
          </label>
          <input
            id="agenda-lokasi"
            name="lokasi"
            type="text"
            maxLength={150}
            defaultValue={awal?.lokasi ?? ""}
            placeholder="Contoh: Balai Desa Sangge"
            className={KELAS_INPUT}
          />
        </div>

        <div>
          <label htmlFor="agenda-keterangan" className="text-sm font-semibold">
            Keterangan{" "}
            <span className="font-normal text-tinta-redup">(opsional)</span>
          </label>
          <textarea
            id="agenda-keterangan"
            name="keterangan"
            rows={3}
            defaultValue={awal?.keterangan ?? ""}
            placeholder="Contoh: Bawa buku KIA. Dimulai pukul 09.00."
            className={`${KELAS_INPUT} resize-y`}
          />
        </div>
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
          {sedang
            ? "Menyimpan…"
            : awal
              ? "Simpan perubahan"
              : "Simpan kegiatan"}
        </button>
        {awal && (
          <Link
            href="/admin/agenda"
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
