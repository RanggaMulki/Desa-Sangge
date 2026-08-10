"use client";

import { useActionState, useState } from "react";
import { KeyRound, Power, PowerOff } from "lucide-react";
import {
  resetKataSandi,
  ubahAktifAkun,
  type HasilAkun,
} from "../akun-actions";
import { useNotifHasil } from "@/features/admin/components/notifikasi";

type Akun = {
  id: string;
  nama: string;
  namaPengguna: string;
  aktif: boolean;
};

function BarisAkun({ akun, saya }: { akun: Akun; saya: boolean }) {
  const [bukaReset, setBukaReset] = useState(false);
  const [hasilReset, aksiReset, sedangReset] = useActionState<
    HasilAkun | null,
    FormData
  >(resetKataSandi, null);
  const [hasilAktif, aksiAktif, sedangAktif] = useActionState<
    HasilAkun | null,
    FormData
  >(ubahAktifAkun, null);

  useNotifHasil(hasilReset);
  useNotifHasil(hasilAktif);

  const pesan = hasilReset ?? hasilAktif;

  return (
    <li className="rounded-lg border border-garis p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-tinta">
            {akun.nama}
            {saya && (
              <span className="rounded-full bg-hijau-muda px-2 py-0.5 text-xs font-bold text-hijau-utama">
                Anda
              </span>
            )}
            {!akun.aktif && (
              <span className="rounded-full bg-permukaan px-2 py-0.5 text-xs font-bold uppercase text-tinta-redup">
                Nonaktif
              </span>
            )}
          </p>
          <p className="text-sm text-tinta-redup">
            Nama pengguna:{" "}
            <span className="font-medium text-tinta">{akun.namaPengguna}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saya && (
            <span className="text-sm text-tinta-redup">
              Ganti lewat &ldquo;Ganti kata sandi saya&rdquo; di bawah.
            </span>
          )}

          {/* Reset & nonaktif hanya untuk akun LAIN. Akun sendiri diganti lewat
              form "Ganti kata sandi saya" yang mewajibkan sandi lama. */}
          {!saya && (
            <button
              type="button"
              onClick={() => setBukaReset((v) => !v)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-garis px-3 py-1.5 text-sm font-medium hover:border-hijau-utama"
            >
              <KeyRound size={15} aria-hidden="true" />
              Reset sandi
            </button>
          )}

          {!saya && (
            <form action={aksiAktif}>
              <input type="hidden" name="id" value={akun.id} />
              <input
                type="hidden"
                name="aktif"
                value={akun.aktif ? "false" : "true"}
              />
              <button
                type="submit"
                disabled={sedangAktif}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${
                  akun.aktif
                    ? "border-garis text-merah-layanan hover:border-merah-layanan"
                    : "border-garis text-hijau-utama hover:border-hijau-utama"
                }`}
              >
                {akun.aktif ? (
                  <>
                    <PowerOff size={15} aria-hidden="true" />
                    Nonaktifkan
                  </>
                ) : (
                  <>
                    <Power size={15} aria-hidden="true" />
                    Aktifkan
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {bukaReset && (
        <form
          action={aksiReset}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-garis pt-3"
        >
          <input type="hidden" name="id" value={akun.id} />
          <input
            name="kataSandiBaru"
            type="text"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Kata sandi baru (min 8)"
            className="min-h-10 flex-1 rounded-lg border border-garis bg-white px-3 py-2 text-sm focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
          />
          <button
            type="submit"
            disabled={sedangReset}
            className="inline-flex min-h-10 items-center rounded-lg bg-hijau-utama px-4 py-2 text-sm font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
          >
            {sedangReset ? "Menyimpan…" : "Simpan sandi baru"}
          </button>
        </form>
      )}

      {pesan && (
        <p
          role="status"
          className={`mt-2 text-sm font-medium ${
            pesan.ok ? "text-hijau-utama" : "text-merah-layanan"
          }`}
        >
          {pesan.pesan}
        </p>
      )}
    </li>
  );
}

export function DaftarAkun({
  daftar,
  idSaya,
}: {
  daftar: Akun[];
  idSaya: string;
}) {
  return (
    <section className="rounded-xl border border-garis bg-white p-5">
      <h2 className="text-lg font-bold text-tinta">Daftar akun pengurus</h2>
      <ul className="mt-4 space-y-3">
        {daftar.map((a) => (
          <BarisAkun key={a.id} akun={a} saya={a.id === idSaya} />
        ))}
      </ul>
    </section>
  );
}
