"use client";

export default function Galat({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-2xl font-bold">Halaman gagal dimuat</h1>
      <p className="mt-3 text-tinta-redup">
        Biasanya ini karena koneksi internet sedang terputus. Coba muat ulang.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-hijau-utama px-6 py-3.5 font-semibold text-white"
      >
        Muat ulang halaman
      </button>
    </div>
  );
}
