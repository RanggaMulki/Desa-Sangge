import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { SeksiBerlatar } from "@/features/tata-letak/components/SeksiBerlatar";
import { ambilVisiMisi } from "../queries";

/**
 * Bagian Visi & Misi di halaman Profil.
 *
 * Visi dan misi ditampilkan polos dalam satu kolom yang berada di tengah.
 * Setiap butir misi memakai satu baris bernomor agar urutannya mudah dipindai.
 */
export async function VisiMisi() {
  const { visi, misi } = await ambilVisiMisi();

  return (
    <SeksiBerlatar
      id="visi-misi"
      judul="Visi dan Misi Desa Sangge"
      keterangan="Arah pembangunan desa yang menjadi landasan pelayanan pemerintah dan pemberdayaan masyarakat."
      latar="hijau"
    >
      {!visi && misi.length === 0 ? (
        <KotakKosong
          judul="Visi dan misi belum diisi"
          pesan="Visi dan misi Desa Sangge akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
        />
      ) : (
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-12">
          {visi && (
            <article
              aria-labelledby="judul-visi"
              className="masuk-halus"
            >
              <h3
                id="judul-visi"
                className="text-center text-3xl font-extrabold text-hijau-pekat sm:text-4xl"
              >
                Visi
              </h3>
              <blockquote className="mx-auto mt-6 w-fit max-w-full">
                <p className="hyphens-auto whitespace-pre-line text-justify text-lg font-semibold leading-relaxed text-tinta lg:whitespace-nowrap">
                  {visi}
                </p>
              </blockquote>
            </article>
          )}

          {misi.length > 0 && (
            <section
              aria-labelledby="judul-misi"
              className="masuk-halus [--jeda-masuk:100ms]"
            >
              <h3
                id="judul-misi"
                className="text-center text-3xl font-extrabold text-hijau-pekat sm:text-4xl"
              >
                Misi
              </h3>

              <ol className="mt-5 space-y-2 text-lg font-medium leading-normal text-tinta sm:text-xl">
                {misi.map((item, index) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-3"
                  >
                    <span className="font-extrabold text-hijau-pekat">
                      {index + 1}.
                    </span>
                    <span className="hyphens-auto text-justify">{item.teks}</span>
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
