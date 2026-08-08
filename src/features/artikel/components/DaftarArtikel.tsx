import type { CSSProperties } from "react";
import Link from "next/link";
import { KartuArtikel, type RingkasanArtikel } from "./KartuArtikel";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";

/**
 * Kisi kartu artikel, lengkap dengan tampilan saat masih kosong.
 *
 * Keadaan kosong ditangani di sini, bukan di tiap halaman, supaya halaman
 * berita dan tiga kanal informasi tidak masing-masing menulis versi
 * "belum ada isi" yang berbeda-beda kalimatnya.
 */
export function DaftarArtikel({
  artikel,
  basis,
  pesanKosong,
}: {
  artikel: RingkasanArtikel[];
  basis: string;
  pesanKosong: string;
}) {
  if (artikel.length === 0) {
    return (
      <KotakKosong judul="Belum ada tulisan di sini" pesan={pesanKosong}>
        <Link
          href="/"
          className="font-medium text-hijau-utama underline underline-offset-4 hover:no-underline"
        >
          Kembali ke beranda
        </Link>
      </KotakKosong>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {artikel.map((a, i) => (
        <li
          key={a.id}
          className="masuk-halus"
          style={{ "--jeda-masuk": `${(i % 6) * 70}ms` } as CSSProperties}
        >
          <KartuArtikel artikel={a} basis={basis} />
        </li>
      ))}
    </ul>
  );
}
