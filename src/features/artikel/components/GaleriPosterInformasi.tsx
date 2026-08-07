import Image from "next/image";
import Link from "next/link";
import { tanggalPendek } from "@/lib/format";
import type { RingkasanArtikel } from "./KartuArtikel";

const JUMLAH_SLOT_POSTER = 6;

/** Grid poster bersama untuk kanal Kesehatan dan Perawatan Alat. */
export function GaleriPosterInformasi({
  poster,
  basis,
  idJudul,
  judul,
  keterangan,
  pesanKosong,
}: {
  poster: RingkasanArtikel[];
  basis: string;
  idJudul: string;
  judul: string;
  keterangan: string;
  pesanKosong: string;
}) {
  return (
    <section aria-labelledby={idJudul}>
      <div className="mb-8 border-b border-garis pb-5">
        <h2
          id={idJudul}
          className="text-balance text-2xl font-extrabold text-hijau-pekat sm:text-3xl"
        >
          {judul}
        </h2>
        <p className="mt-2 max-w-[65ch] leading-relaxed text-tinta-redup">
          {keterangan}
        </p>
      </div>

      {poster.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {poster.map((item, i) => (
            <li key={item.id}>
              <Link
                href={`${basis}/${item.slug}`}
                aria-label={`Buka poster ${item.judul}`}
                className="group block h-full overflow-hidden rounded-lg border border-garis bg-white hover:border-hijau-utama"
              >
                <figure>
                  <div className="relative aspect-[3/4] bg-white">
                    <Image
                      src={item.gambarSampulUrl!}
                      alt={item.judul}
                      fill
                      priority={i < 3}
                      sizes="(min-width: 640px) 30vw, 46vw"
                      quality={85}
                      className="object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                    />
                  </div>
                  <figcaption className="sr-only">
                    {item.judul}
                    {item.tanggalTerbit &&
                      `, diterbitkan ${tanggalPendek(item.tanggalTerbit)}`}
                  </figcaption>
                </figure>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul
            aria-hidden="true"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
          >
            {Array.from({ length: JUMLAH_SLOT_POSTER }, (_, indeks) => (
              <li
                key={indeks}
                className="overflow-hidden rounded-lg border border-hijau-utama/20 bg-[#f7f7f2]"
              >
                <span className="grid aspect-[3/4] place-items-center bg-[linear-gradient(145deg,#f4f5ee_0%,#dfe4d1_100%)] text-hijau-utama/40">
                  <IkonPoster />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-tinta-redup">{pesanKosong}</p>
        </>
      )}
    </section>
  );
}

function IkonPoster() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m6.5 17 3.5-4 2.5 2.5 2-2 3 3.5" />
    </svg>
  );
}
