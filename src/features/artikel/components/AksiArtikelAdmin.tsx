"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, Pencil, Send, Trash2, Undo2 } from "lucide-react";
import { konfirmasi } from "@/lib/alert";
import { hapusArtikelAdmin, ubahStatusArtikel } from "../actions";
import type { KodeKategori } from "../kategori";
import { namaKonten, type JenisKonten } from "../jenis";

export function AksiArtikelAdmin({
  id,
  judul,
  kategori,
  jenisKonten,
  status,
  urlPublik,
}: {
  id: string;
  judul: string;
  kategori: KodeKategori;
  jenisKonten: JenisKonten;
  status: "draf" | "terbit";
  urlPublik: string;
}) {
  const router = useRouter();
  const [sedang, mulai] = useTransition();
  const [pesan, setPesan] = useState<string | null>(null);
  const sebutan = namaKonten(jenisKonten, kategori);

  async function ubahStatus(statusBaru: "draf" | "terbit") {
    const setuju = await konfirmasi(
      statusBaru === "terbit"
        ? {
            judul: `Terbitkan ${sebutan} ini?`,
            teks: `“${judul}” akan langsung dapat dilihat warga.`,
            tombolYa: "Ya, terbitkan",
          }
        : {
            judul: `Kembalikan ${sebutan} ke draf?`,
            teks: `“${judul}” tidak lagi tampil untuk warga sampai diterbitkan ulang.`,
            tombolYa: "Ya, jadikan draf",
          },
    );
    if (!setuju) return;

    setPesan(null);
    mulai(async () => {
      const hasil = await ubahStatusArtikel(id, statusBaru);
      setPesan(hasil.pesan);
      if (hasil.ok) router.refresh();
    });
  }

  async function hapus() {
    const setuju = await konfirmasi({
      judul: `Hapus ${sebutan} ini?`,
      teks: `“${judul}” akan dihapus dan tidak bisa dikembalikan.`,
      tombolYa: "Ya, hapus",
      berbahaya: true,
    });
    if (!setuju) return;

    setPesan(null);
    mulai(async () => {
      const hasil = await hapusArtikelAdmin(id);
      setPesan(hasil.pesan);
      if (hasil.ok) router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1">
        <Link
          href={`/admin/artikel/${id}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-hijau-utama hover:bg-hijau-muda"
        >
          <Pencil size={17} aria-hidden="true" />
          Ubah
        </Link>
        {status === "terbit" && (
          <Link
            href={urlPublik}
            target="_blank"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold hover:bg-permukaan"
          >
            <Eye size={17} aria-hidden="true" />
            Lihat
          </Link>
        )}
        <button
          type="button"
          onClick={() => ubahStatus(status === "draf" ? "terbit" : "draf")}
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold hover:bg-permukaan disabled:opacity-60"
        >
          {status === "draf" ? (
            <Send size={17} aria-hidden="true" />
          ) : (
            <Undo2 size={17} aria-hidden="true" />
          )}
          {status === "draf" ? "Terbitkan" : "Jadikan draf"}
        </button>
        <button
          type="button"
          onClick={hapus}
          disabled={sedang}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-merah-layanan hover:bg-permukaan disabled:opacity-60"
        >
          <Trash2 size={17} aria-hidden="true" />
          Hapus
        </button>
      </div>
      {pesan && (
        <p role="status" className="mt-1 text-sm text-tinta-redup">
          {sedang ? "Memproses..." : pesan}
        </p>
      )}
    </div>
  );
}
