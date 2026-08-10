"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { EditorArtikel } from "@/features/artikel/components/EditorArtikel";
import { simpanVisiMisi, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";

/**
 * Editor Visi dan Misi memakai pola yang sama dengan editor artikel, sehingga
 * pengurus dapat menebalkan, memiringkan, membuat daftar, tautan, kutipan,
 * judul bagian, dan menyisipkan gambar tanpa menulis HTML sendiri.
 */
export function FormVisiMisi({
  visi,
  misiHtml,
}: {
  visi: string;
  misiHtml: string;
}) {
  const [visiHtml, setVisiHtml] = useState(visi || "<p></p>");
  const [isiMisi, setIsiMisi] = useState(
    misiHtml || "<ol><li><p></p></li></ol>",
  );
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanVisiMisi,
    null,
  );
  useNotifHasil(hasil);

  return (
    <form action={aksi} className="max-w-5xl space-y-6">
      <input type="hidden" name="visi" value={visiHtml} />
      <input type="hidden" name="misi" value={isiMisi} />

      <section
        aria-labelledby="judul-editor-visi"
        className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="border-b border-garis pb-4">
          <h2
            id="judul-editor-visi"
            className="text-xl font-extrabold text-hijau-utama"
          >
            Visi Desa
          </h2>
        </div>
        <div className="mt-5">
          <EditorArtikel
            id="editor-visi-desa"
            labelAksesibel="Pernyataan Visi Desa"
            nilai={visiHtml}
            onChange={setVisiHtml}
            tinggi="ringkas"
            folderMedia="halaman"
          />
        </div>
      </section>

      <section
        aria-labelledby="judul-editor-misi"
        className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="border-b border-garis pb-4">
          <h2
            id="judul-editor-misi"
            className="text-xl font-extrabold text-hijau-utama"
          >
            Misi Desa
          </h2>
        </div>
        <div className="mt-5">
          <EditorArtikel
            id="editor-misi-desa"
            labelAksesibel="Daftar Misi Desa"
            nilai={isiMisi}
            onChange={setIsiMisi}
            tinggi="sedang"
            folderMedia="halaman"
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : "Simpan visi dan misi"}
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
