import type { Metadata } from "next";
import { KepalaHalamanTerpusat } from "@/features/tata-letak/components/KepalaHalamanTerpusat";
import { DaftarKanal } from "@/features/artikel/components/DaftarKanal";
import { KATEGORI_INFORMASI } from "@/features/artikel/kategori";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Informasi",
  description:
    "Informasi kesehatan dan perawatan alat untuk warga Desa Sangge.",
};

/**
 * Satu halaman Informasi yang memuat semua kanal (Kesehatan, Perawatan Alat)
 * berurutan — menggantikan dropdown yang memecahnya ke halaman terpisah.
 * Lebih ramah HP: satu ketukan, tanpa submenu.
 *
 * Tiap kategori dipisah oleh judul terpusat `KepalaHalamanTerpusat`, jadi
 * batas antara "Kesehatan" dan "Perawatan Alat" jelas terlihat tanpa perlu
 * navigasi pil di atas.
 */
export default function Informasi() {
  return (
    <div className="min-h-screen bg-latar">
      <div className="space-y-14 pb-12 sm:space-y-16 sm:pb-14">
        {KATEGORI_INFORMASI.map((k) => (
          // scroll-mt memberi ruang di bawah header lengket saat menuju anchor.
          <section key={k.kode} id={k.kode} className="scroll-mt-24">
            <KepalaHalamanTerpusat judul={k.label} />
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <DaftarKanal kategori={k} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
