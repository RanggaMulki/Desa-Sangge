import Image from "next/image";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilPerangkatAktif } from "../queries";

/**
 * Katalog aparat desa: kartu berfoto dengan bilah nama hijau di bawahnya,
 * meniru gaya situs desa rujukan.
 *
 * Ditaruh di halaman detail (/profil/pemerintahan), bukan di beranda profil,
 * supaya halaman profil tetap ringkas: bagan struktur dulu, katalog wajah
 * lengkapnya menyusul sekali klik.
 *
 * Foto boleh kosong. Kalau kosong, ruangnya diisi inisial nama pada latar
 * hijau muda — bukan siluet abu-abu yang membuat semua kartu tampak sama, dan
 * bukan kotak kosong yang terlihat seperti gambar gagal dimuat.
 */
export async function KatalogPerangkat({
  batas,
}: {
  /** Batasi jumlah kartu yang tampil (mis. 4 untuk cuplikan di beranda). */
  batas?: number;
} = {}) {
  const semua = await ambilPerangkatAktif();
  const perangkat = batas ? semua.slice(0, batas) : semua;

  if (perangkat.length === 0) {
    return (
      <KotakKosong
        judul="Data perangkat desa belum diisi"
        pesan="Nama dan foto perangkat Desa Sangge akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {perangkat.map((p) => (
        <li key={p.id}>
          <figure className="flex h-full flex-col overflow-hidden rounded-lg border border-garis bg-white">
            <div className="relative aspect-[4/5] bg-hijau-muda">
              {p.fotoUrl ? (
                <Image
                  src={p.fotoUrl}
                  alt={p.nama}
                  fill
                  sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 92vw"
                  /**
                   * unoptimized: browser memuat foto langsung dari R2, tanpa
                   * lewat pengoptimal gambar Next.js. Pengoptimal harus
                   * mengambil dulu foto dari r2.dev di sisi server, dan langkah
                   * itu tidak andal untuk URL r2.dev sehingga fotonya gagal
                   * tampil. Foto sudah dikecilkan saat diunggah, jadi optimasi
                   * ulang memang tidak diperlukan.
                   */
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-full w-full place-items-center text-6xl font-bold text-hijau-utama/30"
                >
                  {p.nama.charAt(0)}
                </span>
              )}
            </div>

            <figcaption className="flex flex-1 flex-col justify-center bg-hijau-utama px-4 py-4 text-center text-white">
              <p className="text-lg font-bold uppercase leading-tight sm:text-xl">
                {p.nama}
              </p>
              <p className="mt-1.5 text-base text-white/90">{p.jabatan}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
