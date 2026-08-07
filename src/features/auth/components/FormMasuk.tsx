"use client";

import { useActionState, useState, type KeyboardEvent } from "react";
import { useFormStatus } from "react-dom";
import {
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  User,
} from "lucide-react";
import { masuk, type StatusMasuk } from "../actions";

const awal: StatusMasuk = {};

function TombolMasuk() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-hijau-utama px-4 py-3 font-bold text-white shadow-[0_3px_8px_rgba(79,99,57,0.22)] hover:bg-hijau-pekat disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle
            className="animate-spin"
            size={20}
            aria-hidden="true"
          />
          Memeriksa akun...
        </>
      ) : (
        <>
          <LogIn size={20} aria-hidden="true" />
          Masuk ke Admin
        </>
      )}
    </button>
  );
}

export function FormMasuk({ lanjut }: { lanjut?: string }) {
  const [status, aksi] = useActionState(masuk, awal);
  const [kataSandiTerlihat, setKataSandiTerlihat] = useState(false);
  const [capsLockAktif, setCapsLockAktif] = useState(false);

  function periksaCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLockAktif(event.getModifierState("CapsLock"));
  }

  return (
    <form
      action={aksi}
      className="space-y-5"
      aria-label="Form masuk admin Desa Sangge"
      noValidate
    >
      {/* Halaman tujuan sebelum diminta masuk; diteruskan ke server action
          supaya setelah masuk kembali ke sana, bukan selalu ke /admin. */}
      {lanjut && <input type="hidden" name="lanjut" value={lanjut} />}
      {status.pesan && (
        <div
          role="alert"
          className="rounded-lg border border-merah-layanan bg-red-50 px-4 py-3 text-sm font-semibold text-merah-layanan"
        >
          {status.pesan}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block font-bold text-tinta">
          Nama Pengguna
        </label>
        <div className="group relative">
          <User
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-redup transition-colors group-focus-within:text-hijau-utama"
            size={20}
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="next"
            placeholder="Contoh: sangge"
            aria-invalid={!!status.galatEmail}
            aria-describedby={status.galatEmail ? "galat-email" : undefined}
            className={`min-h-12 w-full rounded-lg border bg-latar/40 py-3 pl-12 pr-4 text-tinta placeholder:text-tinta-redup/70 focus:border-hijau-utama focus:bg-white focus:outline-none focus:ring-2 focus:ring-hijau-muda ${
              status.galatEmail ? "border-merah-layanan" : "border-garis"
            }`}
          />
        </div>
        {status.galatEmail && (
          <p
            id="galat-email"
            className="mt-1.5 text-sm font-semibold text-merah-layanan"
          >
            {status.galatEmail}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="kataSandi"
          className="mb-2 block font-bold text-tinta"
        >
          Kata Sandi
        </label>
        <div className="group relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-redup transition-colors group-focus-within:text-hijau-utama"
            size={20}
            aria-hidden="true"
          />
          <input
            id="kataSandi"
            name="kataSandi"
            type={kataSandiTerlihat ? "text" : "password"}
            autoComplete="current-password"
            enterKeyHint="go"
            placeholder="Masukkan kata sandi"
            onKeyDown={periksaCapsLock}
            onKeyUp={periksaCapsLock}
            onBlur={() => setCapsLockAktif(false)}
            aria-invalid={!!status.galatKataSandi}
            aria-describedby={
              [
                status.galatKataSandi ? "galat-kata-sandi" : null,
                capsLockAktif ? "peringatan-caps-lock" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={`min-h-12 w-full rounded-lg border bg-latar/40 py-3 pl-12 pr-12 text-tinta placeholder:text-tinta-redup/70 focus:border-hijau-utama focus:bg-white focus:outline-none focus:ring-2 focus:ring-hijau-muda ${
              status.galatKataSandi
                ? "border-merah-layanan"
                : "border-garis"
            }`}
          />
          <button
            type="button"
            onClick={() => setKataSandiTerlihat((terlihat) => !terlihat)}
            aria-label={
              kataSandiTerlihat
                ? "Sembunyikan kata sandi"
                : "Tampilkan kata sandi"
            }
            aria-pressed={kataSandiTerlihat}
            className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-tinta-redup hover:bg-hijau-muda hover:text-hijau-utama"
          >
            {kataSandiTerlihat ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        {status.galatKataSandi && (
          <p
            id="galat-kata-sandi"
            className="mt-1.5 text-sm font-semibold text-merah-layanan"
          >
            {status.galatKataSandi}
          </p>
        )}
        {capsLockAktif && (
          <p
            id="peringatan-caps-lock"
            className="mt-2 flex items-center gap-2 text-sm font-semibold text-oker"
            aria-live="polite"
          >
            <CircleAlert size={17} aria-hidden="true" className="shrink-0" />
            Caps Lock sedang aktif.
          </p>
        )}
      </div>

      <TombolMasuk />
    </form>
  );
}
