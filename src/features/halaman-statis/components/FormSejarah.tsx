"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { EditorArtikel } from "@/features/artikel/components/EditorArtikel";
import { simpanSejarah, type HasilSimpan } from "../actions";

/**
 * Form naskah Sejarah dan Legenda Desa dengan dua editor terpisah.
 *
 * Memakai editor teks kaya yang sama dengan artikel — pengurus desa cukup
 * belajar satu pola editor untuk semua tulisan. Dua input tersembunyi menjaga
 * batas antara sejarah dan legenda ketika dikirim ke server action.
 */
export function FormSejarah({
  sejarahAwal,
  legendaAwal,
}: {
  sejarahAwal: string;
  legendaAwal: string;
}) {
  const [sejarah, setSejarah] = useState(sejarahAwal || "<p></p>");
  const [legenda, setLegenda] = useState(legendaAwal || "<p></p>");
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanSejarah,
    null,
  );

  return (
    <form action={aksi} className="max-w-6xl space-y-6">
      <input type="hidden" name="sejarah" value={sejarah} />
      <input type="hidden" name="legenda" value={legenda} />

      <p className="max-w-3xl text-sm leading-relaxed text-tinta-redup">
        Sejarah wajib diisi. Legenda dapat dikosongkan terlebih dahulu dan
        akan ditampilkan sebagai tanda "-" pada halaman Profil.
      </p>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <section
          aria-labelledby="judul-editor-sejarah"
          className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="border-b border-garis pb-4">
            <h2
              id="judul-editor-sejarah"
              className="text-xl font-extrabold text-hijau-utama"
            >
              Sejarah Desa
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-tinta-redup">
              Tuliskan riwayat Desa Sangge berdasarkan sumber yang telah
              diperiksa.
            </p>
          </div>
          <div className="mt-5">
            <EditorArtikel
              id="editor-sejarah-desa"
              labelAksesibel="Naskah Sejarah Desa"
              nilai={sejarah}
              onChange={setSejarah}
            />
          </div>
        </section>

        <section
          aria-labelledby="judul-editor-legenda"
          className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="border-b border-garis pb-4">
            <h2
              id="judul-editor-legenda"
              className="text-xl font-extrabold text-hijau-utama"
            >
              Legenda Desa
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-tinta-redup">
              Tuliskan cerita lisan atau legenda yang diwariskan masyarakat.
            </p>
          </div>
          <div className="mt-5">
            <EditorArtikel
              id="editor-legenda-desa"
              labelAksesibel="Naskah Legenda Desa"
              nilai={legenda}
              onChange={setLegenda}
            />
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : "Simpan sejarah dan legenda"}
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
