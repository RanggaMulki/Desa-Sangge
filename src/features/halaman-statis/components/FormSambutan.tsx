"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { EditorArtikel } from "@/features/artikel/components/EditorArtikel";
import { simpanSambutan, type HasilSimpan } from "../actions";

/**
 * Form naskah Sambutan Kepala Desa yang tampil di beranda.
 *
 * Memakai editor teks yang sama dengan Sejarah dan artikel supaya pengurus
 * desa cukup belajar satu editor. Boleh dikosongkan: isi kosong menyembunyikan
 * kutipan sambutan di beranda (kartu Kepala Desa tetap tampil).
 */
export function FormSambutan({ kontenAwal }: { kontenAwal: string }) {
  const [konten, setKonten] = useState(kontenAwal || "<p></p>");
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanSambutan,
    null,
  );

  return (
    <form action={aksi} className="max-w-3xl space-y-5">
      <input type="hidden" name="konten" value={konten} />

      <div className="rounded-xl border border-garis bg-white p-5">
        <p className="mb-3 text-sm text-tinta-redup">
          Tulis kata sambutan Kepala Desa yang tampil di halaman depan. Cukup
          satu sampai dua paragraf. Foto dan nama Kepala Desa diambil otomatis
          dari <strong>Bagan &amp; Perangkat</strong>, jadi tidak perlu ditulis
          lagi di sini. Kalau kotak ini dikosongkan, kutipan sambutannya
          disembunyikan dari beranda.
        </p>
        <EditorArtikel nilai={konten} onChange={setKonten} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : "Simpan sambutan"}
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
