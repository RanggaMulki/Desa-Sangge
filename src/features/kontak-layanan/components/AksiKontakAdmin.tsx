"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { konfirmasi } from "@/lib/alert";
import { hapusKontak } from "../actions";

/** Tombol Ubah + Hapus di tiap baris kontak, dengan konfirmasi sebelum hapus. */
export function AksiKontakAdmin({ id, nama }: { id: string; nama: string }) {
  const router = useRouter();
  const [sedang, mulai] = useTransition();
  const [pesan, setPesan] = useState<string | null>(null);

  async function hapus() {
    const setuju = await konfirmasi({
      judul: "Hapus kontak ini?",
      teks: `“${nama}” akan dihapus dan tidak lagi tampil di website.`,
      tombolYa: "Ya, hapus",
      berbahaya: true,
    });
    if (!setuju) return;
    setPesan(null);
    mulai(async () => {
      const hasil = await hapusKontak(id);
      if (hasil.ok) {
        router.refresh();
      } else {
        setPesan(hasil.pesan);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <Link
          href={`/admin/kontak?ubah=${id}`}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-hijau-utama hover:bg-hijau-muda"
        >
          <Pencil size={16} aria-hidden="true" />
          Ubah
        </Link>
        <button
          type="button"
          onClick={hapus}
          disabled={sedang}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-merah-layanan hover:bg-merah-layanan/10 disabled:opacity-60"
        >
          <Trash2 size={16} aria-hidden="true" />
          {sedang ? "Menghapus…" : "Hapus"}
        </button>
      </div>
      {pesan && (
        <p role="alert" className="text-sm font-medium text-merah-layanan">
          {pesan}
        </p>
      )}
    </div>
  );
}
