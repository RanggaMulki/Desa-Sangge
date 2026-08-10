"use client";

import { useActionState } from "react";
import { simpanStatistik, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";
import { ANGKA_DESA } from "../angka";

/**
 * Form angka pokok desa berbentuk TABEL dengan variabel TETAP.
 *
 * Nama metrik dan satuannya sudah tercetak dan tidak bisa diketik — pengurus
 * desa hanya mengisi angkanya. Nama yang dulu bebas diketik terbukti jadi
 * sumber salah isi: muncul baris karangan dan angka berformat keliru.
 *
 * Tahun cukup diisi SEKALI untuk semua angka, bukan per baris seperti dulu.
 */
export function FormStatistik({
  nilaiAwal,
  tahunAwal,
}: {
  /** kunci → angka yang sudah tersimpan. */
  nilaiAwal: Record<string, number>;
  tahunAwal: number;
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanStatistik,
    null,
  );
  useNotifHasil(hasil);

  return (
    <form action={aksi} className="space-y-6">
      <div className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-tinta-redup">
              <th className="pb-2 font-medium">Angka desa</th>
              <th className="w-48 pb-2 text-right font-medium">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {ANGKA_DESA.map((a) => {
              const awal = nilaiAwal[a.kunci] ?? 0;
              return (
                <tr key={a.kunci} className="border-t border-garis/70">
                  <td className="py-2.5 pr-4">
                    <label htmlFor={`n-${a.kunci}`} className="font-medium">
                      {a.label}
                    </label>
                    <p className="text-sm text-tinta-redup">{a.petunjuk}</p>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        id={`n-${a.kunci}`}
                        name={`n-${a.kunci}`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        defaultValue={awal > 0 ? awal : ""}
                        placeholder="0"
                        className="w-28 rounded-lg border border-garis bg-white px-3 py-2 text-right tabular-nums focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
                      />
                      <span className="w-14 shrink-0 text-sm text-tinta-redup">
                        {a.satuan}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-garis pt-4">
          <label htmlFor="tahun" className="font-medium">
            Tahun data
          </label>
          <input
            id="tahun"
            name="tahun"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            defaultValue={tahunAwal}
            className="w-28 rounded-lg border border-garis bg-white px-3 py-2 text-right tabular-nums focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
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
