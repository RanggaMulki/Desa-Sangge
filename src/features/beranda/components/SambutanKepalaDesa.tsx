import { Seksi } from "@/features/tata-letak/components/Seksi";
import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { ambilPengisiStruktur } from "@/features/pemerintahan/queries";
import { ambilHalaman } from "@/features/halaman-statis/queries";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Sambutan Kepala Desa.
 *
 * Nama dan foto diambil dari data perangkat (posisi "kepala-desa") supaya
 * selalu ikut terbaru bila diganti lewat pengelolaan. NASKAH sambutannya
 * dibaca dari halaman statis slug "sambutan" — diisi pengurus desa lewat
 * Pengelolaan > Sambutan Kepala Desa, bukan ditulis di kode.
 *
 * Kartu Kepala Desa (nama + foto, keduanya data riil) tampil selama ada
 * Kepala Desa. Kutipan sambutannya hanya muncul bila naskahnya sudah diisi;
 * selama kosong, kartunya tetap ada tanpa kutipan — jadi beranda tidak pernah
 * menampilkan sambutan karangan.
 */
export async function SambutanKepalaDesa() {
  const [pengisi, halaman] = await Promise.all([
    ambilPengisiStruktur(),
    ambilHalaman("sambutan"),
  ]);
  const kades = pengisi.get("kepala-desa");
  const naskah = halaman?.konten?.trim() ?? "";
  // Foto Kepala Desa dari data Perangkat (Bagan & Perangkat).
  const fotoUrl = kades?.fotoUrl ?? null;

  // Tanpa sosok Kepala Desa tidak ada yang bisa ditampilkan.
  if (!kades?.nama) return null;

  return (
    <Seksi latar="terang" aria-labelledby="judul-sambutan">
      <ScrollReveal>
        <div className="grid items-start gap-7 md:grid-cols-[15rem_minmax(0,1fr)] md:items-center md:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <div className="mx-auto w-full max-w-72 sm:max-w-80 md:w-60 md:max-w-none lg:w-64">
            <div className="aspect-square overflow-hidden rounded-full bg-hijau-muda ring-4 ring-hijau-muda/70 sm:ring-6 md:ring-8">
              {fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoUrl}
                  alt={`Foto ${kades.nama}, Kepala Desa Sangge`}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-6xl font-bold text-hijau-utama/30">
                  {kades.nama.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h2
              id="judul-sambutan"
              className="judul-seksi-beranda text-balance text-center text-hijau-pekat md:text-left"
            >
              Sambutan <span className="text-oker">Kepala Desa</span>
            </h2>

            <div className="mt-3 text-center md:mt-4 md:text-left">
              <p className="text-lg font-extrabold uppercase leading-tight text-hijau-utama">
                {kades.nama}
              </p>
              <p className="mt-1 text-sm font-semibold uppercase text-oker">
                Kepala Desa Sangge
              </p>
            </div>

            {naskah !== "" && (
              <blockquote className="mx-auto mt-5 max-w-3xl border-t border-garis pt-5 text-justify text-base leading-[1.75] text-tinta sm:text-lg md:mx-0 md:mt-6">
                <KontenAman html={naskah} />
              </blockquote>
            )}
          </div>
        </div>
      </ScrollReveal>
    </Seksi>
  );
}
