"use client";

import { useActionState } from "react";
import { simpanBatasWilayah, type HasilSimpan } from "../actions";

const LABEL_ARAH: Record<string, string> = {
  utara: "Utara",
  timur: "Timur",
  selatan: "Selatan",
  barat: "Barat",
};

/**
 * Form batas wilayah desa: empat baris tetap (utara/timur/selatan/barat).
 *
 * Admin hanya mengubah keterangan di tiap arah, tidak bisa menambah atau
 * menghapus arah — sesuai konvensi dokumen desa yang selalu empat arah.
 */
export function FormBatas({
  awal,
}: {
  awal: { arah: string; keterangan: string }[];
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanBatasWilayah,
    null,
  );

  /** Empat arah tetap. Kalau datanya belum ada, keterangan dikosongkan. */
  const ARAH = ["utara", "timur", "selatan", "barat"] as const;
  const dataPerArah = Object.fromEntries(awal.map((b) => [b.arah, b.keterangan]));

  return (
    <form action={aksi} className="space-y-6">
      <div className="space-y-4">
        {ARAH.map((arah) => (
          <div
            key={arah}
            className="rounded-xl border border-garis bg-white p-5"
          >
            <label
              htmlFor={`keterangan-${arah}`}
              className="text-sm font-medium text-tinta-redup"
            >
              Batas {LABEL_ARAH[arah]}
            </label>
            <input
              id={`keterangan-${arah}`}
              name={`keterangan-${arah}`}
              type="text"
              defaultValue={dataPerArah[arah] ?? ""}
              placeholder={`Desa dan kecamatan di sisi ${arah.toLowerCase()}`}
              maxLength={150}
              className="mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-garis pt-5">
        <button
          type="submit"
          disabled={sedang}
          className="rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {sedang ? "Menyimpan…" : "Simpan perubahan"}
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
