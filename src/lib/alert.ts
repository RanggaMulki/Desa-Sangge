"use client";

import Swal from "sweetalert2";

/**
 * SATU-SATUNYA pintu dialog konfirmasi di seluruh website.
 *
 * Menggantikan window.confirm bawaan browser dengan SweetAlert2 supaya
 * tampilannya mengikuti tema desa (bukan kotak abu-abu sistem) dan tombolnya
 * berlabel jelas ("Ya, hapus" / "Batal"), bukan OK/Cancel yang ambigu.
 *
 * Komponen lain JANGAN memanggil Swal.fire langsung — lewat sini, supaya
 * gaya tombol dan perilakunya tidak pelan-pelan berbeda antar halaman.
 *
 * Catatan: dialog "tinggalkan halaman?" saat menutup tab (beforeunload)
 * tetap milik browser — itu memang tidak bisa diganti oleh library mana pun.
 */

const TOMBOL_BATAL =
  "inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-garis bg-white px-5 py-2.5 font-semibold text-tinta hover:bg-permukaan";

const TOMBOL_YA_BIASA =
  "inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat";

const TOMBOL_YA_BERBAHAYA =
  "inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-merah-layanan px-5 py-2.5 font-semibold text-white hover:opacity-90";

export async function konfirmasi({
  judul,
  teks,
  tombolYa = "Ya, lanjutkan",
  berbahaya = false,
}: {
  judul: string;
  /** Kalimat penjelas akibat tindakan. Sebut nama datanya supaya tidak salah pilih. */
  teks?: string;
  /** Label kata kerja: "Ya, hapus", "Ya, terbitkan" — bukan sekadar "OK". */
  tombolYa?: string;
  /** true untuk tindakan yang tidak bisa dibatalkan: tombol merah, fokus di Batal. */
  berbahaya?: boolean;
}): Promise<boolean> {
  const hasil = await Swal.fire({
    title: judul,
    text: teks,
    showCancelButton: true,
    confirmButtonText: tombolYa,
    cancelButtonText: "Batal",
    reverseButtons: true,
    // Tindakan berbahaya: Enter jatuh ke Batal, bukan ke tombol merah.
    focusCancel: berbahaya,
    buttonsStyling: false,
    // Jangan utak-atik style <body>; halaman ini punya header lengket dan
    // hero setinggi layar yang bergeser kalau Swal mengubah tinggi body.
    heightAuto: false,
    customClass: {
      popup: "!rounded-2xl",
      title: "!text-xl !font-bold !text-tinta",
      htmlContainer: "!text-tinta-redup",
      actions: "!gap-2",
      confirmButton: berbahaya ? TOMBOL_YA_BERBAHAYA : TOMBOL_YA_BIASA,
      cancelButton: TOMBOL_BATAL,
    },
  });

  return hasil.isConfirmed;
}
