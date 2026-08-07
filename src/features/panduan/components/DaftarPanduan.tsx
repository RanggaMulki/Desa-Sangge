import { DAFTAR_PANDUAN, BELUM_TERSEDIA } from "../langkah";

/**
 * Panduan pemakaian website, ditujukan untuk pengurus desa — bukan developer.
 *
 * Halaman ini publik, tidak disembunyikan di balik login. Panduannya tidak
 * memuat rahasia apa pun, dan menaruhnya di balik login berarti orang yang
 * kesulitan masuk justru tidak bisa membaca cara masuk.
 */
export function DaftarPanduan() {
  return (
    <>
      <ol className="space-y-10">
        {DAFTAR_PANDUAN.map((p, i) => (
          <li key={p.judul}>
            <article>
              <h2 className="text-xl font-bold">
                <span className="text-tinta-redup">{i + 1}. </span>
                {p.judul}
              </h2>
              <p className="mt-1 text-tinta-redup">{p.ringkasan}</p>

              <ol className="mt-4 space-y-3">
                {p.langkah.map((l, j) => (
                  <li key={l} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-hijau-muda font-semibold text-hijau-utama"
                    >
                      {j + 1}
                    </span>
                    <span className="flex-1">{l}</span>
                  </li>
                ))}
              </ol>

              {p.catatan && (
                <p className="mt-4 rounded-lg bg-permukaan p-4 text-tinta-redup">
                  {p.catatan}
                </p>
              )}
            </article>
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="judul-belum"
        className="mt-14 rounded-xl border border-garis bg-permukaan p-7"
      >
        <h2 id="judul-belum" className="text-lg font-semibold">
          Yang belum bisa dikerjakan
        </h2>
        <p className="mt-1 text-tinta-redup">
          Bagian berikut masih dalam pengerjaan. Panduannya akan ditambahkan di
          halaman ini begitu selesai.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-6 text-tinta-redup">
          {BELUM_TERSEDIA.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
