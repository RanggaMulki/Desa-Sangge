import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { SeksiBerlatar } from "@/features/tata-letak/components/SeksiBerlatar";
import { ambilVisiMisi } from "../queries";

/**
 * Bagian Visi & Misi di halaman Profil.
 *
 * Visi dan Misi ditumpuk vertikal dalam satu kolom. Lebarnya dibatasi agar
 * baris teks tetap nyaman dibaca, sementara tinggi tiap blok mengikuti isi.
 */
export async function VisiMisi() {
  const { visi, misi } = await ambilVisiMisi();

  return (
    <SeksiBerlatar
      id="visi-misi"
      judul="Visi dan Misi Desa Sangge"
      latar="hijau"
    >
      {!visi && misi.length === 0 ? (
        <KotakKosong
          judul="Visi dan misi belum diisi"
          pesan="Visi dan misi Desa Sangge akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
        />
      ) : (
        <div className="mx-auto grid max-w-[71.5625rem] grid-cols-1 items-start gap-4 sm:gap-5">
          {visi && (
            <article
              aria-labelledby="judul-visi"
              className="masuk-halus w-full rounded-lg border border-garis bg-white p-4 sm:p-5"
            >
              <h3
                id="judul-visi"
                className="text-left text-2xl font-extrabold leading-tight text-hijau-pekat"
              >
                Visi
              </h3>
              <blockquote className="mt-4 border-t border-garis pt-4 sm:mt-5 sm:pt-5">
                <div className="hyphens-auto text-left text-lg font-normal italic leading-8 tracking-[-0.01em] text-tinta sm:text-justify sm:text-xl sm:leading-9 [text-align-last:left] [text-wrap:wrap] [&>div>p]:!mb-0">
                  <KontenAman html={visi} />
                </div>
              </blockquote>
            </article>
          )}

          {misi.length > 0 && (
            <section
              aria-labelledby="judul-misi"
              className="masuk-halus w-full rounded-lg border border-garis bg-white p-4 sm:p-5 [--jeda-masuk:100ms]"
            >
              <h3
                id="judul-misi"
                className="text-left text-2xl font-extrabold leading-tight text-hijau-pekat"
              >
                Misi
              </h3>

              <ol className="mt-4 list-none divide-y divide-garis border-t border-garis pt-1 font-normal leading-8 text-tinta sm:mt-5 sm:text-lg">
                {misi.map((item, index) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 py-3.5 first:pt-3 last:pb-0 sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:gap-4 sm:py-4"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-hijau-utama text-sm font-extrabold tabular-nums text-white sm:size-9 sm:text-base">
                      {index + 1}
                    </span>
                    <div className="min-w-0 hyphens-auto text-left font-normal tracking-[-0.01em] sm:text-justify [text-align-last:left] [&>div>p]:!mb-0">
                      <KontenAman html={item.teks} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </SeksiBerlatar>
  );
}
