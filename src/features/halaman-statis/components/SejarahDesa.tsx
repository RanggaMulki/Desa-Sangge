import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilHalaman } from "../queries";
import { SLUG_HALAMAN } from "../halaman";
import { pisahkanNaskahSejarah } from "../naskah-sejarah";

/**
 * Sejarah dan legenda desa ditampilkan sebagai dua kotak teks terpisah.
 *
 * Kedua kotak memakai ukuran teks dan lebar baris yang nyaman untuk naskah
 * panjang. Tingginya mengikuti isi agar tidak menyisakan bidang kosong bila
 * panjang Sejarah dan Legenda berbeda.
 */
function KotakCeritaDesa({
  id,
  judul,
  html,
}: {
  id: string;
  judul: string;
  html: string;
}) {
  const adaIsi =
    html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim().length > 0;

  return (
    <article
      aria-labelledby={id}
      className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <h3
        id={id}
        className="text-balance text-2xl font-extrabold leading-tight text-hijau-utama"
      >
        {judul}
      </h3>
      <div className="mt-5 hyphens-auto border-t border-garis pt-5 text-left text-base font-normal leading-7 text-tinta sm:pt-6 sm:text-lg sm:leading-8 sm:text-justify [text-align-last:left] [&_p]:!mb-5 [&_p:last-child]:!mb-0">
        {adaIsi ? (
          <KontenAman html={html} />
        ) : (
          <p className="text-lg text-tinta-redup">-</p>
        )}
      </div>
    </article>
  );
}

export async function SejarahDesa() {
  const halaman = await ambilHalaman(SLUG_HALAMAN.sejarah);

  if (!halaman || halaman.konten.trim() === "") {
    return (
      <KotakKosong
        judul="Sejarah desa belum ditulis"
        pesan="Pengurus desa dapat mengisinya lewat halaman pengelolaan. Bagian ini akan langsung tampil begitu disimpan."
      />
    );
  }

  const bagian = pisahkanNaskahSejarah(halaman.konten);

  return (
    <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
      <KotakCeritaDesa
        id="subjudul-sejarah-desa"
        judul="Sejarah Desa"
        html={bagian.sejarah}
      />
      <KotakCeritaDesa
        id="subjudul-legenda-desa"
        judul="Legenda Desa"
        html={bagian.legenda}
      />
    </div>
  );
}
