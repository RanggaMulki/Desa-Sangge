"use client";

import { useActionState } from "react";
import { simpanVisiMisi, type HasilSimpan } from "../actions";

/**
 * Form visi & misi.
 *
 * Visi satu kotak pendek; misi satu kotak besar dengan aturan sederhana:
 * satu baris = satu butir. Ini sengaja dipilih ketimbang deretan tombol
 * tambah/hapus baris — bagi pengurus desa, mengetik daftar di satu kotak jauh
 * lebih intuitif.
 */
export function FormVisiMisi({
  visi,
  misi,
}: {
  visi: string;
  misi: string[];
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanVisiMisi,
    null,
  );

  return (
    <form action={aksi} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="visi" className="font-medium">
          Visi
        </label>
        <p className="mb-1.5 text-sm text-tinta-redup">
          Satu kalimat pernyataan visi desa.
        </p>
        <textarea
          id="visi"
          name="visi"
          rows={3}
          defaultValue={visi}
          className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
      </div>

      <div>
        <label htmlFor="misi" className="font-medium">
          Misi
        </label>
        <p className="mb-1.5 text-sm text-tinta-redup">
          Tulis <strong>satu misi per baris</strong>. Tekan Enter untuk butir
          berikutnya.
        </p>
        <textarea
          id="misi"
          name="misi"
          rows={8}
          defaultValue={misi.join("\n")}
          className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 leading-relaxed focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
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
            className={hasil.ok ? "font-medium text-hijau-utama" : "font-medium text-merah-layanan"}
          >
            {hasil.pesan}
          </p>
        )}
      </div>
    </form>
  );
}
