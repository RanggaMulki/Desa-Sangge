"use client";

import { useState, useTransition } from "react";
import { konfirmasi } from "@/lib/alert";
import { siapkanGambarUntukUnggah } from "@/features/media/gambar-klien";
import {
  tambahFotoGaleri,
  hapusFotoGaleri,
  ubahNamaGaleri,
  type FotoGaleri,
} from "../actions";

/**
 * Pengelolaan galeri: unggah foto kegiatan + daftar foto yang bisa dihapus.
 *
 * Nama kegiatan BOLEH dikosongkan — foto tetap bisa diunggah dan dinamai
 * belakangan. Tidak ada isian tanggal atau deskripsi.
 *
 * Foto dikecilkan di peramban DULU (foto HP bisa 3–8 MB) sebelum dikirim,
 * lalu server menaruhnya di Cloudflare R2 dan menyimpan link-nya ke database.
 *
 * HEIC/HEIF (format bawaan kamera iPhone) DIUBAH ke JPEG lebih dulu di
 * peramban. Ini wajib, bukan pemanis: peramban selain Safari tidak bisa
 * membaca HEIC sama sekali — foto begitu akan gagal dikecilkan dan, kalaupun
 * tersimpan, tidak akan tampil di halaman galeri. Setelah diubah, semua foto
 * keluar sebagai JPEG sehingga pasti tampil di HP mana pun.
 */

export function FormGaleri({ awal }: { awal: FotoGaleri[] }) {
  const [daftar, setDaftar] = useState<FotoGaleri[]>(awal);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(
    null,
  );
  const [sedang, mulai] = useTransition();
  const [hapusId, setHapusId] = useState<string | null>(null);
  const [ubahId, setUbahId] = useState<string | null>(null);
  const [namaUbah, setNamaUbah] = useState("");

  async function saatPilihFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    e.target.value = ""; // supaya memilih berkas yang sama lagi tetap memicu
    if (!berkas) return;

    setPesan(null);

    // Dikecilkan, dan SELALU keluar sebagai JPEG supaya apa pun format
    //    asalnya (PNG, WEBP, GIF, BMP) pasti tampil dan ukurannya kecil.
    let kecil: File;
    try {
      kecil = await siapkanGambarUntukUnggah(berkas, {
        batasMb: 0.4,
        sisiMaksimal: 1400,
      });
    } catch {
      setPesan({
        ok: false,
        teks: "Gagal memproses foto. Coba foto berformat JPG atau PNG.",
      });
      return;
    }

    const fd = new FormData();
    fd.set("nama", nama.trim());
    fd.set("foto", kecil, berkas.name);

    mulai(async () => {
      const hasil = await tambahFotoGaleri(fd);
      if (hasil.ok && hasil.foto) {
        setDaftar((d) => [hasil.foto!, ...d]);
        setNama("");
        setPesan({ ok: true, teks: "Foto tersimpan." });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  async function saatHapus(id: string, judul: string) {
    // Sebelumnya foto terhapus TANPA konfirmasi — sekali salah pencet,
    // dokumentasi kegiatan hilang dari R2 dan tidak bisa dikembalikan.
    const setuju = await konfirmasi({
      judul: "Hapus foto ini?",
      teks: judul
        ? `Foto “${judul}” akan dihapus dan tidak bisa dikembalikan.`
        : "Foto akan dihapus dan tidak bisa dikembalikan.",
      tombolYa: "Ya, hapus",
      berbahaya: true,
    });
    if (!setuju) return;

    setHapusId(id);
    mulai(async () => {
      const hasil = await hapusFotoGaleri(id);
      if (hasil.ok) {
        setDaftar((d) => d.filter((f) => f.id !== id));
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
      setHapusId(null);
    });
  }

  function mulaiUbah(foto: FotoGaleri) {
    setPesan(null);
    setUbahId(foto.id);
    setNamaUbah(foto.judul);
  }

  function simpanUbah(id: string) {
    mulai(async () => {
      const hasil = await ubahNamaGaleri(id, namaUbah);
      if (hasil.ok && hasil.foto) {
        const diperbarui = hasil.foto;
        setDaftar((d) => d.map((f) => (f.id === id ? diperbarui : f)));
        setUbahId(null);
        setPesan({ ok: true, teks: hasil.pesan });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* --- Unggah foto baru --- */}
      <div className="rounded-xl border border-garis bg-white p-5 sm:p-6">
        <label htmlFor="nama-kegiatan" className="font-medium">
          Nama kegiatan <span className="font-normal text-tinta-redup">(boleh dikosongkan)</span>
        </label>
        <input
          id="nama-kegiatan"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Musyawarah Desa Penetapan APBDes"
          maxLength={200}
          className="mt-1.5 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* <label> membuka pemilih berkas lewat perilaku bawaan peramban. */}
          <label
            className={`inline-block cursor-pointer rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:opacity-90 ${
              sedang ? "opacity-60" : ""
            }`}
          >
            {sedang && !hapusId ? "Mengunggah…" : "Pilih & unggah foto"}
            {/**
             * accept HANYA "image/*", tanpa ".heic/.heif" yang eksplisit.
             *
             * Disengaja: saat HEIC tidak disebut, pemilih foto iPhone (Safari)
             * OTOMATIS mengubah HEIC menjadi JPEG ketika dipilih, jadi berkas
             * yang masuk sudah JPEG dan tidak perlu heic2any sama sekali —
             * konverter itu rewel dan kadang gagal. Berkas .heic dari desktop
             * yang tetap lolos ke sini masih ditangani heic2any sebagai cadangan.
             */}
            <input
              type="file"
              accept="image/*"
              onChange={saatPilihFoto}
              disabled={sedang}
              className="hidden"
            />
          </label>
          <p className="text-sm text-tinta-redup">
            JPG, PNG, WEBP, GIF, dan HEIC (iPhone) didukung. Foto otomatis dikecilkan.
          </p>
        </div>

        {pesan && (
          <p
            role="status"
            className={`mt-3 text-sm font-medium ${
              pesan.ok ? "text-hijau-utama" : "text-merah-layanan"
            }`}
          >
            {pesan.teks}
          </p>
        )}
      </div>

      {/* --- Daftar foto --- */}
      {daftar.length === 0 ? (
        <p className="text-tinta-redup">Belum ada foto di galeri.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftar.map((f) => (
            <li
              key={f.id}
              className="overflow-hidden rounded-xl border border-garis bg-white"
            >
              <div className="aspect-[4/3] bg-permukaan">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.gambarUrl}
                  alt={f.judul}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                {ubahId === f.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={namaUbah}
                      onChange={(e) => setNamaUbah(e.target.value)}
                      maxLength={200}
                      autoFocus
                      placeholder="Nama kegiatan (boleh dikosongkan)"
                      className="w-full rounded-lg border border-garis bg-white px-3 py-2 text-sm focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => simpanUbah(f.id)}
                        disabled={sedang}
                        className="rounded-lg bg-hijau-utama px-3 py-1.5 text-sm font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
                      >
                        {sedang ? "Menyimpan…" : "Simpan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUbahId(null)}
                        disabled={sedang}
                        className="rounded-lg border border-garis px-3 py-1.5 text-sm font-medium hover:border-hijau-utama disabled:opacity-60"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`min-w-0 flex-1 truncate ${
                        f.judul ? "font-medium" : "text-tinta-redup"
                      }`}
                    >
                      {f.judul || "(tanpa nama)"}
                    </span>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => mulaiUbah(f)}
                        disabled={sedang}
                        className="rounded-lg border border-garis px-3 py-1.5 text-sm font-medium text-hijau-utama hover:border-hijau-utama disabled:opacity-60"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => saatHapus(f.id, f.judul)}
                        disabled={sedang}
                        className="rounded-lg border border-garis px-3 py-1.5 text-sm font-medium text-merah-layanan hover:border-merah-layanan disabled:opacity-60"
                      >
                        {hapusId === f.id ? "Menghapus…" : "Hapus"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
