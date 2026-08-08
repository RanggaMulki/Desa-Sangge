import {
  KELAS_LATAR_SEKSI,
  type LatarSeksi,
} from "@/features/tata-letak/latar";

export type { LatarSeksi } from "@/features/tata-letak/latar";

/**
 * Satu bagian selebar layar dengan latar berwarna dan judul ber-jangkar.
 *
 * Bedanya dengan `SeksiBerjudul`: yang ini punya latar sendiri dan membentang
 * penuh ke tepi layar, jadi bisa ditumpuk berselang-seling warnanya untuk
 * memberi irama pada halaman panjang seperti Profil Desa. `SeksiBerjudul`
 * tidak berlatar dan mewarisi lebar dari induknya.
 *
 * `id` dipasang di elemen <section> terluar, bukan di judulnya, supaya saat
 * jangkar dituju (mis. /profil#sejarah), yang berhenti di batas atas layar
 * adalah tepi atas bloknya — bukan judul yang menggantung dengan latar
 * berwarna terpotong di atasnya.
 */
export function SeksiBerlatar({
  id,
  judul,
  keterangan,
  latar = "terang",
  children,
}: {
  id: string;
  judul: string;
  keterangan?: string;
  latar?: LatarSeksi;
  /**
   * "lebar" dipertahankan untuk kompatibilitas pemanggil lama. Seluruh seksi
   * publik sekarang memakai kanvas 7xl agar sejajar dengan halaman lain.
   */
  lebar?: "normal" | "lebar";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`judul-${id}`}
      className={`scroll-mt-[calc(var(--tinggi-header)+1.5rem)] ${KELAS_LATAR_SEKSI[latar]}`}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <h2
          id={`judul-${id}`}
          className="judul-seksi-beranda max-w-4xl text-balance text-left text-hijau-pekat"
        >
          {judul}
        </h2>
        {keterangan && (
          <p className="mt-3 max-w-3xl text-left text-tinta-redup">
            {keterangan}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
