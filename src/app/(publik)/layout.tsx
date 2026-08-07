import { Header } from "@/features/tata-letak/components/Header";
import { Footer } from "@/features/tata-letak/components/Footer";

/**
 * Kerangka semua halaman publik. Halaman admin punya kerangkanya sendiri
 * dan sengaja tidak memakai header/footer ini.
 */
export default function TataLetakPublik({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Tautan lewati, muncul saat pengguna keyboard menekan Tab pertama kali. */}
      <a
        href="#isi-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-hijau-utama"
      >
        Lewati ke isi utama
      </a>
      <Header />
      <main id="isi-utama">{children}</main>
      <Footer />
    </>
  );
}
