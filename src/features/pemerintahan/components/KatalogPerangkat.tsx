import Image from "next/image";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilPerangkatAktif } from "../queries";

/**
 * Katalog aparat desa: kartu berfoto dengan bilah nama hijau di bawahnya,
 * meniru gaya situs desa rujukan.
 *
 * Ditaruh di halaman detail (/profil/pemerintahan), serta cuplikan di beranda.
 *
 * Menggunakan grid 2 kolom di HP dan 4 kolom di desktop dengan layout vertikal
 * seragam (foto di atas, nama & jabatan di bawah) agar konsisten dan nyaman
 * dilihat di semua ukuran layar.
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
    <ul className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
      {perangkat.map((p) => (
        <li key={p.id}>
          <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-garis bg-white shadow-xs">
            <div className="relative aspect-[3/4] bg-hijau-muda">
              {p.fotoUrl ? (
                <Image
                  src={p.fotoUrl}
                  alt={p.nama}
                  fill
                  sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 48vw"
                  unoptimized
                  className="object-cover object-top"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-full w-full place-items-center text-4xl font-bold text-hijau-utama/30 sm:text-5xl"
                >
                  {p.nama.charAt(0)}
                </span>
              )}
            </div>

            <figcaption className="flex min-w-0 flex-1 flex-col justify-center bg-hijau-utama px-3 py-3 text-center text-white sm:px-4 sm:py-3.5">
              <p className="text-xs font-bold uppercase leading-tight sm:text-base">
                {p.nama}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-white/90 sm:text-sm">
                {p.jabatan}
              </p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}


