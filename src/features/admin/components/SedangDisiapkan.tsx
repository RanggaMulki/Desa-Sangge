/**
 * Isi halaman pengelolaan yang formnya belum dibuat.
 *
 * Sengaja jujur menyebut cara mengisi sementara (lewat data awal / dummy) dan
 * bahwa formnya menyusul, bukan halaman kosong yang membuat pengurus mengira
 * ada yang rusak.
 */
export function SedangDisiapkan({ nama }: { nama: string }) {
  return (
    <div className="rounded-xl border border-dashed border-garis bg-white px-6 py-14 text-center">
      <p className="text-lg font-semibold">Form {nama} sedang disiapkan</p>
      <p className="mx-auto mt-2 max-w-md text-tinta-redup">
        Halaman ini akan segera bisa diisi langsung dari sini. Sementara itu,
        isinya masih diatur lewat data awal oleh tim pengembang.
      </p>
    </div>
  );
}

/** Judul + keterangan seragam di atas tiap halaman pengelolaan. */
export function JudulPengelolaan({
  judul,
  keterangan,
}: {
  judul: string;
  keterangan?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-hijau-utama sm:text-3xl">
        {judul}
      </h1>
      {keterangan && <p className="mt-1 text-tinta-redup">{keterangan}</p>}
    </div>
  );
}
