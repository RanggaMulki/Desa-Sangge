import Link from "next/link";

/**
 * Judul seksi beserta tautan "lihat semua" di kanannya.
 *
 * Dijadikan satu komponen supaya tiap seksi tidak punya versi judulnya
 * sendiri-sendiri, yang biasanya berujung ukuran dan jarak yang beda tipis
 * antar seksi.
 */
export function JudulSeksi({
  judul,
  aksen,
  keterangan,
  tautan,
}: {
  judul: string;
  aksen?: string;
  keterangan?: string;
  tautan?: { label: string; href: string };
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-garis pb-5">
      <div className="max-w-3xl">
        <h2 className="judul-seksi-beranda text-balance text-hijau-pekat">
          {judul}
          {aksen && <span className="text-oker"> {aksen}</span>}
        </h2>
        {keterangan && (
          <p className="mt-3 max-w-[65ch] leading-relaxed text-tinta-redup">
            {keterangan}
          </p>
        )}
      </div>
      {tautan && (
        <Link
          href={tautan.href}
          className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-hijau-utama hover:text-hijau-pekat"
        >
          {tautan.label}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6l-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
