"use client";

import { useActionState } from "react";
import { simpanPeta, type HasilSimpan } from "../actions";

/**
 * Form titik peta desa.
 *
 * Sengaja TIDAK meminta alamat sematan (iframe/embed) — itu istilah teknis yang
 * tidak masuk akal bagi pengurus desa. Yang diminta cukup satu hal yang bisa
 * mereka salin sendiri dari Google Maps: koordinat lokasi. Petunjuk langkahnya
 * ditulis lengkap di atas isian, bukan disembunyikan di panduan terpisah.
 */
export function FormPeta({
  titik,
  zoom,
  catatan,
}: {
  titik: string;
  zoom: number;
  catatan: string;
}) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanPeta,
    null,
  );

  return (
    <form action={aksi} className="max-w-2xl space-y-6">
      <ol className="space-y-2 rounded-lg bg-permukaan p-5 text-tinta-redup">
        <li>
          <strong className="text-tinta">1.</strong> Buka Google Maps, cari
          lokasi kantor Desa Sangge.
        </li>
        <li>
          <strong className="text-tinta">2.</strong> Tekan tombol{" "}
          <strong className="text-tinta">Bagikan</strong>, lalu{" "}
          <strong className="text-tinta">Salin tautan</strong>.
        </li>
        <li>
          <strong className="text-tinta">3.</strong> Tempel tautannya di kotak
          di bawah, lalu simpan.
        </li>
      </ol>

      <div>
        <label htmlFor="titik" className="font-medium">
          Titik lokasi
        </label>
        <p className="mb-1.5 text-sm text-tinta-redup">
          Tempel tautan dari tombol Bagikan, mis.{" "}
          <code className="rounded bg-permukaan px-1.5 py-0.5">
            https://maps.app.goo.gl/…
          </code>
          . Bisa juga koordinat langsung seperti{" "}
          <code className="rounded bg-permukaan px-1.5 py-0.5">
            -7.382053, 110.709267
          </code>
          .
        </p>
        <input
          id="titik"
          name="titik"
          type="text"
          defaultValue={titik}
          placeholder="https://maps.app.goo.gl/… atau -7.382053, 110.709267"
          className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
      </div>

      <div>
        <label htmlFor="zoom" className="font-medium">
          Tingkat perbesaran
        </label>
        <p className="mb-1.5 text-sm text-tinta-redup">
          Makin besar angkanya, makin dekat petanya. 14 = satu desa terlihat
          utuh, 16 = pas untuk menunjuk kantor desa, 18 = sangat dekat.
        </p>
        <input
          id="zoom"
          name="zoom"
          type="number"
          min={1}
          max={20}
          defaultValue={zoom}
          className="w-28 rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
      </div>

      <div>
        <label htmlFor="catatan" className="font-medium">
          Catatan di bawah peta{" "}
          <span className="font-normal text-tinta-redup">(boleh dikosongkan)</span>
        </label>
        <p className="mb-1.5 text-sm text-tinta-redup">
          Kosongkan bila titiknya sudah pasti. Isi bila perlu memberi tahu warga
          bahwa titiknya masih perkiraan.
        </p>
        <input
          id="catatan"
          name="catatan"
          type="text"
          defaultValue={catatan}
          maxLength={200}
          className="w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-garis pt-5">
        <button
          type="submit"
          disabled={sedang}
          className="rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {sedang ? "Menyimpan…" : "Simpan titik peta"}
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
