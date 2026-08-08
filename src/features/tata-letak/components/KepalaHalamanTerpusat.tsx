/**
 * Header halaman publik yang ringkas, transparan, dan terpusat.
 *
 * Dipakai pada halaman yang tidak membutuhkan kalimat pengantar agar judul
 * langsung mengarahkan perhatian ke konten utama di bawahnya.
 */
export function KepalaHalamanTerpusat({ judul }: { judul: string }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 pb-3 pt-8 sm:pb-4 sm:pt-10 lg:px-8">
        <div className="flex justify-center text-center">
          <h1 className="judul-halaman-terpusat text-balance font-serif text-4xl font-semibold tracking-[-0.02em] text-hijau-pekat sm:text-5xl">
            {judul}
          </h1>
        </div>
      </div>
    </section>
  );
}
