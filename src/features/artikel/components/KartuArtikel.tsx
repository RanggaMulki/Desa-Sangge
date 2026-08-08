import Link from "next/link";
import Image from "next/image";
import { ambilKategori, type KodeKategori } from "../kategori";
import { tanggalPendek } from "@/lib/format";
import type { JenisKonten } from "../jenis";

export type RingkasanArtikel = {
  id: string;
  judul: string;
  slug: string;
  kategori: KodeKategori;
  jenisKonten: JenisKonten;
  ringkasan: string;
  gambarSampulUrl: string | null;
  tanggalTerbit: Date | null;
};

/**
 * Kartu artikel, dipakai di halaman berita maupun kanal informasi.
 *
 * Gambar sampul boleh kosong, dan itu kondisi yang wajar, bukan kasus tepi:
 * artikel edukasi kesehatan sering hanya berupa teks dan lampiran PDF.
 * Jadi kartunya dirancang tetap utuh tanpa gambar — bukan menyisakan kotak
 * abu-abu penampung yang membuat halaman terlihat rusak.
 */
export function KartuArtikel({
  artikel,
  basis,
}: {
  artikel: RingkasanArtikel;
  /** Awalan alamat, mis. "/berita" atau "/informasi/kesehatan". */
  basis: string;
}) {
  const kategori = ambilKategori(artikel.kategori);

  return (
    <article className="h-full">
      <Link
        href={`${basis}/${artikel.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-garis bg-white hover:-translate-y-0.5 hover:border-hijau-utama hover:shadow-[0_4px_12px_rgb(0_0_0/0.07)]"
      >
        {artikel.gambarSampulUrl && (
          <div className="relative aspect-[16/9] overflow-hidden bg-permukaan">
            <Image
              src={artikel.gambarSampulUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
              quality={80}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <p className="text-tinta-redup">
            {kategori?.label}
            {artikel.tanggalTerbit &&
              ` · ${tanggalPendek(artikel.tanggalTerbit)}`}
          </p>
          <h3 className="mt-2 text-lg font-semibold group-hover:underline">
            {artikel.judul}
          </h3>
          <p className="mt-2 flex-1 text-tinta-redup">{artikel.ringkasan}</p>
        </div>
      </Link>
    </article>
  );
}
