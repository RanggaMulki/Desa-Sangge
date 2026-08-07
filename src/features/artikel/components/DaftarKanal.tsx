import { DaftarArtikel } from "./DaftarArtikel";
import { GaleriPosterInformasi } from "./GaleriPosterInformasi";
import { ambilArtikelPerKategori } from "../queries";
import type { Kategori } from "../kategori";

/** Isi kanal informasi publik sesuai bentuk konten yang didukung kategorinya. */
export async function DaftarKanal({ kategori }: { kategori: Kategori }) {
  const artikel = await ambilArtikelPerKategori(kategori.kode);
  const basis = `/informasi/${kategori.kode}`;

  if (kategori.kode === "kesehatan" || kategori.kode === "perawatan-alat") {
    const poster = artikel.filter(
      (item) => item.jenisKonten === "poster" && item.gambarSampulUrl,
    );
    const tulisan =
      kategori.kode === "kesehatan"
        ? artikel.filter((item) => item.jenisKonten === "materi")
        : [];
    const perawatanAlat = kategori.kode === "perawatan-alat";

    return (
      <div>
        <GaleriPosterInformasi
          poster={poster}
          basis={basis}
          idJudul={`judul-poster-${kategori.kode}`}
          judul={
            perawatanAlat
              ? "Poster Perawatan Alat"
              : "Poster Informasi Kesehatan"
          }
          keterangan={
            perawatanAlat
              ? "Panduan visual untuk merawat peralatan pertanian dan rumah tangga agar tetap aman dan awet."
              : "Materi visual kesehatan dan informasi kegiatan untuk warga Desa Sangge."
          }
          pesanKosong={
            perawatanAlat
              ? "Poster perawatan alat sedang disiapkan dan akan ditampilkan di bagian ini."
              : "Poster kesehatan sedang disiapkan dan akan ditampilkan di bagian ini."
          }
        />

        {tulisan.length > 0 && (
          <section
            aria-labelledby="judul-artikel-kesehatan"
            className="mt-14 sm:mt-16"
          >
            <div className="mb-8 border-b border-garis pb-5">
              <h2
                id="judul-artikel-kesehatan"
                className="text-balance text-2xl font-extrabold text-hijau-pekat sm:text-3xl"
              >
                Materi Kesehatan
              </h2>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-tinta-redup">
                Artikel dan panduan kesehatan lengkap yang dapat dibaca warga.
              </p>
            </div>
            <DaftarArtikel
              artikel={tulisan}
              basis={basis}
              pesanKosong=""
            />
          </section>
        )}
      </div>
    );
  }

  return (
    <DaftarArtikel
      artikel={artikel}
      basis={basis}
      pesanKosong={`Tulisan tentang ${kategori.label.toLowerCase()} sedang disiapkan tim dan akan tampil di sini.`}
    />
  );
}
