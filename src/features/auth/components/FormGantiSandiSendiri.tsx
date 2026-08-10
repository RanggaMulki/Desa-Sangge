"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { gantiKataSandiSendiri, type HasilAkun } from "../akun-actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";

const KELAS_INPUT =
  "mt-1.5 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda";

/** Ganti kata sandi akun yang sedang login (wajib tahu sandi lama). */
export function FormGantiSandiSendiri() {
  const [hasil, aksi, sedang] = useActionState<HasilAkun | null, FormData>(
    gantiKataSandiSendiri,
    null,
  );
  useNotifHasil(hasil);

  return (
    <section className="rounded-xl border border-garis bg-white p-5">
      <h2 className="text-lg font-bold text-tinta">Ganti kata sandi saya</h2>
      <form action={aksi} className="mt-4 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-tinta">
            Kata sandi lama
          </span>
          <input
            name="kataSandiLama"
            type="password"
            required
            autoComplete="current-password"
            className={KELAS_INPUT}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-tinta">
            Kata sandi baru
          </span>
          <input
            name="kataSandiBaru"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className={KELAS_INPUT}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-tinta">
            Ulangi kata sandi baru
          </span>
          <input
            name="ulangiKataSandi"
            type="password"
            required
            autoComplete="new-password"
            className={KELAS_INPUT}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={sedang}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
          >
            <KeyRound size={18} aria-hidden="true" />
            {sedang ? "Menyimpan…" : "Ganti kata sandi"}
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
    </section>
  );
}
