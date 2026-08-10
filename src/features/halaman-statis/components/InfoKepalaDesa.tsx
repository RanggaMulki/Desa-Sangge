import Link from "next/link";

/**
 * Kartu informasi Kepala Desa (HANYA-BACA) untuk halaman Sambutan.
 *
 * Nama dan foto TIDAK diedit di sini — keduanya mengikuti data Bagan &
 * Perangkat (posisi "kepala-desa") supaya satu sumber. Kartu ini cuma
 * menampilkan apa yang sedang dipakai di beranda, dengan tautan ke tempat
 * mengubahnya bila Kepala Desa berganti.
 */
export function InfoKepalaDesa({
  nama,
  fotoUrl,
}: {
  nama: string | null;
  fotoUrl: string | null;
}) {
  return (
    <div className="rounded-xl border border-garis bg-white p-5">
      <p className="mb-4 font-semibold text-tinta">Kepala Desa</p>

      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-hijau-muda ring-4 ring-hijau-muda/70">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoUrl}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid h-full w-full place-items-center text-2xl text-tinta-redup"
            >
              —
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-lg font-bold text-hijau-pekat">
            {nama || "Belum diisi"}
          </p>
          <p className="text-sm text-tinta-redup">Kepala Desa Sangge</p>
          <p className="mt-2 text-sm text-tinta-redup">
            Nama dan foto diambil dari{" "}
            <Link
              href="/admin/perangkat"
              className="font-medium text-hijau-utama underline underline-offset-2 hover:no-underline"
            >
              Bagan &amp; Perangkat
            </Link>
            . Ubah di sana bila Kepala Desa berganti.
          </p>
        </div>
      </div>
    </div>
  );
}
