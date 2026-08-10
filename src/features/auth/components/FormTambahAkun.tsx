"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { tambahAkun, type HasilAkun } from "../akun-actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";

const KELAS_INPUT =
  "mt-1.5 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda";

/**
 * Form membuat akun pengurus baru. Kata sandi awal sengaja terlihat (type text)
 * supaya pengurus bisa membacanya untuk diberikan ke pemilik akun baru.
 */
export function FormTambahAkun() {
  const [hasil, aksi, sedang] = useActionState<HasilAkun | null, FormData>(
    tambahAkun,
    null,
  );
  useNotifHasil(hasil);

  return (
    <section className="rounded-xl border border-garis bg-white p-5">
      <h2 className="text-lg font-bold text-tinta">Tambah akun pengurus</h2>
      <form action={aksi} className="mt-4 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-tinta">Nama lengkap</span>
          <input
            name="nama"
            type="text"
            required
            maxLength={100}
            placeholder="mis. Budi Santoso"
            className={KELAS_INPUT}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-tinta">
            Nama pengguna (untuk masuk)
          </span>
          <input
            name="namaPengguna"
            type="text"
            required
            autoComplete="off"
            placeholder="mis. budi"
            className={KELAS_INPUT}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-tinta">
            Kata sandi awal
          </span>
          <input
            name="kataSandi"
            type="text"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className={KELAS_INPUT}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={sedang}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
          >
            <UserPlus size={18} aria-hidden="true" />
            {sedang ? "Membuat…" : "Buat akun"}
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
