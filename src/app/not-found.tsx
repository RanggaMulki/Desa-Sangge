import Link from "next/link";
import { Header } from "@/features/tata-letak/components/Header";
import { Footer } from "@/features/tata-letak/components/Footer";

export const metadata = { title: "Halaman tidak ditemukan" };

/**
 * Halaman 404.
 *
 * Ditaruh di app/, bukan di dalam grup (publik), supaya ikut menangani
 * alamat salah ketik yang tidak cocok dengan rute mana pun. Karena berada
 * di luar grup itu, header dan footernya dipasang sendiri di sini — bukan
 * kelalaian, dan bukan pula duplikasi: tata letak (publik) memang tidak
 * berlaku di jalur ini.
 */
export default function TidakDitemukan() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-semibold text-hijau-utama">404</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-tinta-redup">
          Alamat yang Anda buka mungkin salah ketik, atau halamannya sudah
          tidak ada. Coba mulai lagi dari beranda.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-hijau-utama px-6 py-3.5 font-semibold text-white hover:opacity-90"
          >
            Kembali ke beranda
          </Link>
          <Link
            href="/profil"
            className="inline-flex items-center rounded-lg border border-garis px-6 py-3.5 font-semibold hover:border-hijau-utama"
          >
            Lihat profil desa
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
