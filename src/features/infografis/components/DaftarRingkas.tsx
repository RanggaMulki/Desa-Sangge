import { angka } from "@/lib/format";
import type { Butir } from "../kategori";

/**
 * Daftar ringkas — angka + persen per baris, TANPA grafik.
 *
 * Dipakai untuk data yang satu kategorinya mendominasi hampir seluruhnya
 * (mis. agama: Islam 97%+). Grafik untuk data seperti itu tidak menyampaikan
 * apa pun — lingkaran yang 97% satu warna hanya menunjukkan "hampir semuanya
 * sama", yang sudah jelas dari angkanya. Jadi cukup ditulis sebagai baris
 * keterangan yang bersih.
 *
 * Baris bernilai nol tidak ditampilkan (disaring di pemanggil), supaya tidak
 * ada deretan "0" yang memenuhi ruang tanpa guna.
 */
export function DaftarRingkas({ butir }: { butir: Butir[] }) {
  const total = butir.reduce((n, b) => n + b.nilai, 0);

  return (
    <ul className="divide-y divide-garis">
      {butir.map((b) => {
        const persen = total > 0 ? Math.round((b.nilai / total) * 100) : 0;
        return (
          <li
            key={b.id}
            className="flex items-baseline justify-between gap-4 py-3"
          >
            <span className="font-medium">{b.label}</span>
            <span className="shrink-0 tabular-nums">
              <span className="text-xl font-bold text-hijau-utama">
                {angka(b.nilai)}
              </span>{" "}
              <span className="text-tinta-redup">({persen}%)</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
