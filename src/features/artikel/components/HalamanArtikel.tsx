import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { KotakLampiran } from "./KotakLampiran";
import { ambilArtikelBySlug, ambilArtikelSerupa } from "../queries";
import { ambilKategori, type KodeKategori } from "../kategori";
import { jenisKontenSah } from "../jenis";
import { tanggalPanjang, tanggalPendek } from "@/lib/format";

/**
 * Isi halaman satu artikel. Dipakai bersama oleh /berita/[slug] dan
 * /informasi/[kategori]/[slug].
 *
 * Dijadikan satu komponen karena isinya memang identik — judul, penulis,
 * tanggal, isi, lampiran. Yang berbeda hanya alamat dasarnya, dan itu cukup
 * lewat prop. Kalau dibuat dua salinan, perbaikan pada tata letak artikel
 * harus dikerjakan dua kali dan cepat atau lambat akan lupa dikerjakan
 * salah satunya.
 *
 * Judulnya ditulis di dalam <article>, bukan lewat komponen judul halaman.
 * Untuk artikel, judul memang bagian dari tulisannya — bukan label halaman
 * yang berdiri di luarnya.
 */
export async function HalamanArtikel({
  slug,
  basis,
  kategoriSah,
}: {
  slug: string;
  /** Tujuan tombol "kembali", mis. "/informasi#kesehatan". */
  basis: string;
  /**
   * Kategori yang boleh tampil di alamat ini.
   *
   * Tanpa penjagaan ini, satu artikel kesehatan bisa dibuka dari
   * /informasi/perawatan-alat/... maupun /berita/..., karena slug-nya unik
   * lintas kategori. Akibatnya satu tulisan punya banyak alamat: mesin
   * pencari menganggapnya konten kembar.
   */
  kategoriSah: KodeKategori[];
}) {
  const artikel = await ambilArtikelBySlug(slug);
  if (!artikel) notFound();
  if (!kategoriSah.includes(artikel.kategori)) notFound();
  if (!jenisKontenSah(artikel.kategori, artikel.jenisKonten)) notFound();

  const kategori = ambilKategori(artikel.kategori);
  const serupa =
    artikel.jenisKonten === "materi"
      ? await ambilArtikelSerupa(artikel.kategori, artikel.id, 4)
      : [];

  if (artikel.jenisKonten === "poster") {
    if (!artikel.gambarSampulUrl) notFound();

    return (
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <p className="text-tinta-redup">
            <Link
              href={basis}
              className="tautan-garis hover:text-hijau-utama"
            >
              Poster {kategori?.label}
            </Link>
            {artikel.tanggalTerbit &&
              ` · ${tanggalPanjang(artikel.tanggalTerbit)}`}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {artikel.judul}
          </h1>
          <div className="masuk-halus relative mt-8 aspect-[3/4] overflow-hidden rounded-lg border border-garis bg-white">
            <Image
              src={artikel.gambarSampulUrl}
              alt={artikel.judul}
              fill
              priority
              sizes="(min-width: 768px) 46rem, 92vw"
              quality={90}
              className="object-contain"
            />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
      {/* Dua kolom di layar lebar, satu kolom di HP. Panel samping sengaja
          diletakkan SESUDAH artikel dalam urutan HTML supaya di HP dan bagi
          pembaca layar, isi tulisannya yang lebih dulu terbaca. */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article>
          <p className="text-tinta-redup">
            <Link
              href={basis}
              className="tautan-garis hover:text-hijau-utama"
            >
              {kategori?.label}
            </Link>
            {artikel.tanggalTerbit &&
              ` · ${tanggalPanjang(artikel.tanggalTerbit)}`}
            {artikel.namaPenulis && ` · ${artikel.namaPenulis}`}
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {artikel.judul}
          </h1>

          <p className="mt-4 text-lg text-tinta-redup">{artikel.ringkasan}</p>

          {artikel.gambarSampulUrl && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-permukaan">
              <Image
                src={artikel.gambarSampulUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 46rem, 92vw"
                quality={80}
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-8">
            <KontenAman html={artikel.konten} />
          </div>

          <KotakLampiran berkas={artikel.lampiran} />
        </article>

        {serupa.length > 0 && (
          <aside aria-labelledby="judul-serupa">
            {/* Menempel saat digulir, tapi hanya di layar lebar. Di HP,
                panel lengket memakan tinggi layar yang sudah sempit. */}
            <div className="lg:sticky lg:top-[calc(var(--tinggi-header)+1.5rem)]">
              <h2 id="judul-serupa" className="text-lg font-semibold">
                Tulisan lain di {kategori?.label}
              </h2>
              <ul className="mt-4 space-y-4 border-t border-garis pt-4">
                {serupa.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/informasi/${artikel.kategori}/${s.slug}`}
                      className="group block"
                    >
                      <span className="block font-medium group-hover:underline">
                        {s.judul}
                      </span>
                      {s.tanggalTerbit && (
                        <span className="block text-tinta-redup">
                          {tanggalPendek(s.tanggalTerbit)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
