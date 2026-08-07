"use client";

/**
 * Pesan galat ditulis untuk pengurus desa, bukan developer.
 * Detail teknisnya sengaja tidak ditampilkan, hanya dicatat di log server.
 */
export default function Galat({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-garis bg-white p-8 text-center">
      <h1 className="text-xl font-bold">Halaman gagal dimuat</h1>
      <p className="mt-2 text-tinta-redup">
        Biasanya ini karena koneksi internet sedang terputus. Coba muat ulang.
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-lg bg-hijau-utama px-5 py-3 font-semibold text-white"
      >
        Muat ulang halaman
      </button>
    </div>
  );
}
