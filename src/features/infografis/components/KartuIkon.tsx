import type { ReactNode } from "react";

/**
 * Satu sel ringkasan angka pokok di dalam panel Data Kependudukan.
 *
 * Angkanya selalu hijau tua. Aksen hanya mewarnai latar ikon supaya warna
 * bukan satu-satunya pembawa informasi.
 */
export type Aksen = "hijau" | "oranye";

const LENCANA: Record<Aksen, string> = {
  hijau: "bg-hijau-muda text-hijau-utama",
  oranye: "bg-oranye-muda text-oranye-data",
};

export function KartuIkon({
  ikon,
  label,
  nilai,
  satuan,
  aksen = "hijau",
}: {
  ikon: ReactNode;
  label: string;
  nilai: ReactNode;
  satuan?: string | null;
  aksen?: Aksen;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 bg-white px-5 py-6 sm:px-7">
      <span
        aria-hidden="true"
        className={`grid size-11 shrink-0 place-items-center rounded-lg [&_svg]:size-6 ${LENCANA[aksen]}`}
      >
        {ikon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight text-tinta-redup">
          {label}
        </p>
        <p className="mt-1 break-words text-2xl font-extrabold leading-tight tabular-nums text-hijau-utama">
          {nilai}
          {satuan && (
            <span className="ml-1.5 text-base font-medium text-tinta-redup">
              {satuan}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
