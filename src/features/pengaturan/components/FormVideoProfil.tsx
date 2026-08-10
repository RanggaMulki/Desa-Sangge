"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { simpanVideoProfil, type HasilSimpan } from "../actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";

/**
 * Form tautan video profil YouTube. Pengurus cukup menempel tautannya —
 * tidak perlu tahu apa itu embed atau iframe. Boleh dikosongkan untuk
 * menyembunyikan video dari beranda.
 */
export function FormVideoProfil({ tautanAwal }: { tautanAwal: string }) {
  const [hasil, aksi, sedang] = useActionState<HasilSimpan | null, FormData>(
    simpanVideoProfil,
    null,
  );
  useNotifHasil(hasil);

  return (
    <form action={aksi} className="max-w-2xl space-y-5">
      <div className="rounded-xl border border-garis bg-white p-5">
        <label htmlFor="video" className="block font-semibold text-tinta">
          Tautan video YouTube
        </label>
        <input
          id="video"
          name="video"
          type="url"
          defaultValue={tautanAwal}
          placeholder="https://www.youtube.com/watch?v=…"
          className="mt-2 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-6 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {sedang ? "Menyimpan…" : "Simpan video"}
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
