"use client";

import dynamic from "next/dynamic";

/**
 * Recharts itu pustaka berat. Di HP (apalagi lewat dev server yang tak
 * terminifikasi) hidrasinya bisa menahan interaktivitas seluruh halaman,
 * termasuk tombol menu di header. Dengan memuatnya secara TERPISAH (ssr:false +
 * import dinamis), sisa halaman — termasuk menu — hidrasi lebih dulu, dan tiap
 * grafik menyusul dengan placeholder. Grafik toh tidak punya HTML berarti saat
 * SSR (ukurannya baru diukur di peramban), jadi tak ada yang hilang.
 */
function Memuat({ tinggi }: { tinggi: number }) {
  return (
    <div
      style={{ minHeight: tinggi }}
      className="grid place-items-center rounded-lg bg-permukaan/60 text-sm text-tinta-redup"
      aria-hidden="true"
    >
      Memuat grafik…
    </div>
  );
}

export const GrafikKolom = dynamic(
  () => import("./GrafikKolom").then((m) => m.GrafikKolom),
  { ssr: false, loading: () => <Memuat tinggi={290} /> },
);

export const GrafikPai = dynamic(
  () => import("./GrafikPai").then((m) => m.GrafikPai),
  { ssr: false, loading: () => <Memuat tinggi={256} /> },
);

export const GrafikPiramida = dynamic(
  () => import("./GrafikPiramida").then((m) => m.GrafikPiramida),
  { ssr: false, loading: () => <Memuat tinggi={480} /> },
);
