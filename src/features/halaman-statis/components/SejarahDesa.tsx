import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilHalaman } from "../queries";
import { SLUG_HALAMAN } from "../halaman";
import { pisahkanNaskahSejarah } from "../naskah-sejarah";

/**
 * Sejarah dan legenda desa ditampilkan sebagai dua kotak teks terpisah.
 *
 * Kedua kotak memakai lebar dan tinggi yang seimbang pada layar besar. Di HP
 * keduanya menumpuk dan tinggi masing-masing kembali mengikuti isi.
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
      className="rounded-lg border border-garis bg-white p-5 shadow-sm sm:p-7 lg:h-full"
    >
      <h3 id={id} className="text-2xl font-extrabold text-hijau-utama">
        {judul}
      </h3>
      <div className="mt-4 border-t border-garis pt-5 text-tinta">
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
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
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
