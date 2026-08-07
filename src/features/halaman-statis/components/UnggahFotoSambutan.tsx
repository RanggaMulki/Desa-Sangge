"use client";

import { useState, useTransition } from "react";
import { siapkanGambarUntukUnggah } from "@/features/media/gambar-klien";
import { simpanFotoSambutan, hapusFotoSambutan } from "../actions";

/**
 * Unggah/ganti/hapus foto khusus seksi Sambutan di beranda.
 *
 * Foto dikecilkan di peramban dulu (foto HP bisa 3–8 MB) sebelum dikirim ke
 * server action yang menaruhnya di R2. Unggahannya langsung tersimpan begitu
 * dipilih — terpisah dari tombol "Simpan sambutan" untuk naskahnya, sama
 * seperti foto perangkat.
 *
 * Kalau foto khusus dikosongkan, beranda memakai foto Kepala Desa dari data
 * Perangkat sebagai cadangan; preview di sini menampilkan foto cadangan itu
 * supaya pengurus melihat apa yang sebenarnya tampil.
 */
export function UnggahFotoSambutan({
  fotoSambutan,
  fotoKades,
}: {
  fotoSambutan: string | null;
  fotoKades: string | null;
}) {
  const [foto, setFoto] = useState<string | null>(fotoSambutan);
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(
    null,
  );
  const [sedang, mulai] = useTransition();

  // Yang benar-benar tampil di beranda: foto khusus kalau ada, kalau tidak
  // foto Kepala Desa.
  const tampil = foto ?? fotoKades;
  const pakaiKades = !foto && !!fotoKades;

  async function saatPilih(e: React.ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    e.target.value = ""; // supaya memilih berkas yang sama lagi tetap memicu
    if (!berkas) return;
    setPesan(null);

    let kecil: File;
    try {
      kecil = await siapkanGambarUntukUnggah(berkas, {
        batasMb: 0.3,
        sisiMaksimal: 1000,
      });
    } catch {
      setPesan({ ok: false, teks: "Gagal memproses foto. Coba foto lain." });
      return;
    }

    const fd = new FormData();
    fd.set("foto", kecil, kecil.name);

    mulai(async () => {
      const hasil = await simpanFotoSambutan(fd);
      if (hasil.ok) {
        setFoto(hasil.url);
        setPesan({ ok: true, teks: "Tersimpan" });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  function saatHapus() {
    setPesan(null);
    mulai(async () => {
      const hasil = await hapusFotoSambutan();
      if (hasil.ok) {
        setFoto(null);
        setPesan({ ok: true, teks: hasil.pesan });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  return (
    <div className="rounded-xl border border-garis bg-white p-5">
      <p className="mb-1 font-semibold text-tinta">Foto Sambutan</p>
      <p className="mb-4 text-sm text-tinta-redup">
        Foto yang tampil di samping kata sambutan pada halaman depan.
      </p>

      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-hijau-muda ring-4 ring-hijau-muda/70">
          {tampil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tampil}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid h-full w-full place-items-center text-2xl text-tinta-redup"
            >
              —
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* <label> membuka pemilih berkas lewat perilaku bawaan peramban. */}
            <label
              className={`inline-block cursor-pointer rounded-lg border border-garis px-3 py-1.5 text-sm font-medium hover:border-hijau-utama ${
                sedang ? "opacity-60" : ""
              }`}
            >
              {sedang ? "Mengunggah…" : foto ? "Ganti foto" : "Unggah foto"}
              <input
                type="file"
                accept="image/*"
                onChange={saatPilih}
                disabled={sedang}
                className="hidden"
              />
            </label>

            {foto && (
              <button
                type="button"
                onClick={saatHapus}
                disabled={sedang}
                className="rounded-lg border border-garis px-3 py-1.5 text-sm font-medium text-merah-layanan hover:border-merah-layanan disabled:opacity-60"
              >
                Hapus foto khusus
              </button>
            )}
          </div>

          <p className="mt-2 text-sm text-tinta-redup">
            {pakaiKades
              ? "Sekarang memakai foto Kepala Desa dari Bagan & Perangkat. Unggah di sini untuk memakai foto khusus."
              : foto
                ? "Memakai foto khusus. Hapus untuk kembali ke foto Kepala Desa."
                : "Belum ada foto. Unggah di sini, atau atur foto Kepala Desa di Bagan & Perangkat."}
          </p>

          {pesan && (
            <p
              role="status"
              className={`mt-1 text-sm font-medium ${
                pesan.ok ? "text-hijau-utama" : "text-merah-layanan"
              }`}
            >
              {pesan.teks}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
