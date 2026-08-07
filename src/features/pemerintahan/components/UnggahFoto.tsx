"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { siapkanGambarUntukUnggah } from "@/features/media/gambar-klien";
import { konfirmasi } from "@/lib/alert";
import { hapusFotoPerangkat, simpanFotoPerangkat } from "../actions";

/**
 * Tombol unggah/ganti foto untuk satu jabatan.
 *
 * Foto dikecilkan di peramban DULU sebelum dikirim — foto HP bisa 3–8 MB, dan
 * tanpa ini kuota R2 cepat habis dan unggahannya lambat di jaringan desa.
 * Setelah dikecilkan, foto dikirim ke server action yang menaruhnya di R2 dan
 * menyimpan link-nya ke database.
 *
 * Pratinjau memakai <img> biasa (bukan next/image) supaya peramban mengambil
 * langsung dari R2 tanpa lewat pengoptimal — lebih sederhana dan cukup untuk
 * halaman pengelolaan.
 */
export function UnggahFoto({
  posisi,
  fotoAwal,
}: {
  posisi: string;
  fotoAwal: string | null;
}) {
  const [foto, setFoto] = useState<string | null>(fotoAwal);
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);
  const [sedang, mulai] = useTransition();

  async function saatPilih(e: React.ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    e.target.value = ""; // supaya memilih berkas yang sama lagi tetap memicu
    if (!berkas) return;
    setPesan(null);

    // Memakai jalur unggah yang sama dengan galeri: HEIC (kamera iPhone)
    // diubah ke JPEG lebih dulu, lalu dikecilkan. Sebelumnya foto perangkat
    // memakai kompresi mentah yang tidak mengenali HEIC, jadi foto iPhone gagal.
    let kecil: File;
    try {
      kecil = await siapkanGambarUntukUnggah(berkas, {
        batasMb: 0.3,
        sisiMaksimal: 1000,
      });
    } catch {
      setPesan({
        ok: false,
        teks: "Gagal memproses foto. Coba foto berformat JPG atau PNG.",
      });
      return;
    }

    const fd = new FormData();
    fd.set("posisi", posisi);
    fd.set("foto", kecil, kecil.name);

    mulai(async () => {
      const hasil = await simpanFotoPerangkat(fd);
      if (hasil.ok && hasil.url) {
        setFoto(hasil.url);
        setPesan({ ok: true, teks: "Tersimpan" });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  async function saatHapus() {
    const setuju = await konfirmasi({
      judul: "Hapus foto perangkat?",
      teks: "Foto akan dihapus dari halaman struktur. Nama dan jabatan tetap tersimpan.",
      tombolYa: "Ya, hapus foto",
      berbahaya: true,
    });
    if (!setuju) return;

    setPesan(null);
    mulai(async () => {
      const hasil = await hapusFotoPerangkat(posisi);
      if (hasil.ok) {
        setFoto(null);
        setPesan({ ok: true, teks: hasil.pesan });
      } else {
        setPesan({ ok: false, teks: hasil.pesan });
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-hijau-muda">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt="" className="h-full w-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-full w-full place-items-center text-tinta-redup"
          >
            —
          </span>
        )}
      </div>

      <div className="min-w-0">
        {/* <label> membuka pemilih berkas lewat perilaku bawaan peramban —
            tidak bergantung pada JavaScript untuk membuka dialognya. Hanya
            langkah kompresi + unggah (di onChange) yang butuh JS. */}
        <div className="flex flex-wrap gap-2">
          <label
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-garis px-3 py-2 text-sm font-medium hover:border-hijau-utama ${
              sedang ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {sedang ? "Memproses…" : foto ? "Ganti foto" : "Tambah foto"}
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
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-garis px-3 py-2 text-sm font-medium text-merah-layanan hover:border-merah-layanan disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Hapus foto
            </button>
          )}
        </div>
        {pesan && (
          <p
            role="status"
            className={`mt-1 text-sm ${pesan.ok ? "text-hijau-utama" : "text-merah-layanan"}`}
          >
            {pesan.teks}
          </p>
        )}
      </div>
    </div>
  );
}
