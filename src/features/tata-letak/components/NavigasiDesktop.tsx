"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_UTAMA, menuSedangAktif } from "../navigasi";

/**
 * Menu utama untuk layar lebar.
 *
 * Komponen klien karena butuh `usePathname` untuk menandai halaman yang
 * sedang dibuka. Tanpa penanda itu, pengunjung kehilangan jejak posisinya
 * begitu masuk ke halaman dalam.
 */

export function NavigasiDesktop() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu utama" className="hidden xl:block">
      <ul className="flex items-center gap-4 2xl:gap-6">
        {MENU_UTAMA.map((butir, indeks) => {
          const aktif = menuSedangAktif(pathname, butir);
          const rataKanan = indeks >= MENU_UTAMA.length - 2;
          return (
            <li key={butir.href} className="group relative">
              <Link
                href={butir.href}
                aria-current={aktif ? "page" : undefined}
                className={[
                  "flex items-center gap-1 py-2 text-[0.9375rem] font-bold 2xl:text-base",
                  "border-b-2 transition-colors",
                  aktif
                    ? "border-white text-white"
                    : "border-transparent text-white/85 hover:border-white/60 hover:text-white",
                ].join(" ")}
              >
                {butir.label}
                {butir.anak && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="opacity-80 transition-transform group-hover:rotate-180"
                  >
                    <path d="M6 9l6 6l6 -6" />
                  </svg>
                )}
              </Link>

              {butir.anak && (
                <ul
                  className={[
                    "invisible absolute top-full z-10 min-w-64 -translate-y-1 rounded-lg bg-white py-2 opacity-0 shadow-[0_6px_8px_rgb(46_48_62/0.18)]",
                    "transition-[opacity,transform,visibility] duration-150",
                    "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                    "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                    rataKanan ? "right-0" : "left-0",
                  ].join(" ")}
                >
                  {butir.anak.map((anak) => {
                    const anakAktif =
                      pathname === anak.href ||
                      pathname.startsWith(anak.href + "/");
                    return (
                      <li key={anak.href}>
                        <Link
                          href={anak.href}
                          aria-current={anakAktif ? "page" : undefined}
                          className={[
                            "block px-4 py-2.5 hover:bg-hijau-muda/70",
                            anakAktif
                              ? "bg-hijau-muda/50 font-semibold text-hijau-pekat"
                              : "text-tinta",
                          ].join(" ")}
                        >
                          {anak.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
