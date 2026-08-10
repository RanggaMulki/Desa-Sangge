"use client";

import { useEffect } from "react";
import { notifSwal } from "./notifikasi";

/**
 * Memunculkan toast sukses SweetAlert2 satu kali saat halaman terbuka dengan
 * pesan tertentu — dipakai halaman yang REDIRECT setelah simpan (Kontak,
 * Agenda), di mana toast tidak bisa muncul dari form-nya karena form sudah
 * berpindah halaman.
 */
export function NotifParamHasil({ pesan }: { pesan: string | null }) {
  useEffect(() => {
    if (pesan) notifSwal(true, pesan);
  }, [pesan]);
  return null;
}
