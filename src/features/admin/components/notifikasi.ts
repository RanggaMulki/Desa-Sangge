"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

/**
 * Notifikasi terpusat untuk seluruh pengelola, memakai SweetAlert2.
 *
 * Toast di pojok kanan atas: hijau saat berhasil (tersimpan/terupload), merah
 * saat gagal. Dipakai dua cara:
 *   - `useNotifHasil(hasil)` untuk form yang memakai useActionState.
 *   - `notifSwal(ok, pesan)` untuk aksi imperatif (mis. unggah foto/galeri).
 */
export function notifSwal(ok: boolean, pesan: string) {
  void Swal.fire({
    toast: true,
    position: "top-end",
    icon: ok ? "success" : "error",
    title: pesan,
    showConfirmButton: false,
    timer: ok ? 2600 : 4500,
    timerProgressBar: true,
    customClass: { popup: "swal-desa" },
  });
}

type Hasil = { ok: boolean; pesan: string } | null | undefined;

/**
 * Memunculkan toast tiap kali hasil action berubah. useActionState membuat
 * objek hasil baru setiap submit, jadi efek ini menyala pada tiap penyimpanan
 * — dan TIDAK menyala saat render pertama (hasil masih null).
 */
export function useNotifHasil(hasil: Hasil) {
  useEffect(() => {
    if (!hasil) return;
    notifSwal(hasil.ok, hasil.pesan);
  }, [hasil]);
}
