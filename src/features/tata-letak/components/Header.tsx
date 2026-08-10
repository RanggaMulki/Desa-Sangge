"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IDENTITAS } from "../navigasi";
import { NavigasiDesktop } from "./NavigasiDesktop";
import { MenuMobile } from "./MenuMobile";

/**
 * Header dibagi tiga blok: kiri, tengah, kanan.
 *
 * Blok tengah sengaja dibiarkan kosong sebagai ruang cadangan. Lebar kolom
 * auto-1fr-auto supaya logo di kiri dan menu di kanan, tanpa saling mendorong.
 *
 * DI BERANDA header mengambang TRANSPARAN di atas foto hero, lalu berganti
 * mulus jadi hijau solid begitu digulir melewati hero. Di halaman lain header
 * selalu solid. Warna solidnya sama persis dengan sebelumnya — yang berubah
 * cuma latarnya yang memudar; teks tetap putih.
 *
 * Butuh sedikit JavaScript karena posisi gulir hanya diketahui di peramban.
 * Keadaan awalnya SOLID, jadi kalau JS lambat atau dimatikan, header tetap
 * tampil solid dan terbaca — bukan transparan menggantung di atas teks.
 */
export function Header() {
  const pathname = usePathname();
  const diBeranda = pathname === "/";
  const [solid, setSolid] = useState(true);

  useEffect(() => {
    // Di luar beranda tidak ada hero — header selalu solid.
    if (!diBeranda) {
      setSolid(true);
      return;
    }
    // Jadi solid begitu gulir mendekati ujung bawah hero (±setinggi layar).
    const cek = () => setSolid(window.scrollY > window.innerHeight - 96);
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    window.addEventListener("resize", cek);
    return () => {
      window.removeEventListener("scroll", cek);
      window.removeEventListener("resize", cek);
    };
  }, [diBeranda]);

  return (
    <header className="sticky top-0 z-50 h-[var(--tinggi-header)] text-white">
      {/* Latar SOLID hijau — muncul saat digulir / di halaman lain. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 border-b border-white/15 [background:var(--gradien-header)] shadow-[0_4px_8px_rgb(46_48_62/0.14)] transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Selubung gelap tipis saat transparan — menjaga teks putih tetap
          terbaca di atas langit hero yang terang. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-gradient-to-b from-black/35 to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 lg:px-8 2xl:px-10">
        {/* KIRI: lambang + identitas desa */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full md:size-12 xl:size-13 2xl:size-14">
            <Image
              src="/gambar/lambang-boyolali.png"
              alt=""
              fill
              sizes="56px"
              priority
              className="object-cover"
            />
          </span>

          <span className="leading-tight">
            <span className="block font-bold xl:text-lg 2xl:text-xl">
              {IDENTITAS.nama}
            </span>
            <span className="block text-sm text-white/80 2xl:text-base">
              Kecamatan Klego · {IDENTITAS.kabupaten}
            </span>
          </span>
        </Link>

        {/* TENGAH: sengaja kosong, ruang cadangan */}
        <div aria-hidden="true" />

        {/* KANAN: menu layar lebar, tombol menu di HP */}
        <div className="flex items-center justify-end">
          <NavigasiDesktop />
          <MenuMobile />
        </div>
      </div>
    </header>
  );
}
