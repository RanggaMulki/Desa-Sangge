"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ADMIN, IKON } from "../menu";

/**
 * Menu sisi halaman pengelolaan.
 *
 * Komponen klien karena butuh `usePathname` untuk menandai halaman yang sedang
 * dibuka — tanpa penanda itu pengurus desa gampang tersesat antar sub-fitur.
 *
 * Butir yang halamannya belum siap diberi label "segera" supaya jelas mana
 * yang sudah bisa diisi dan mana yang menyusul, bukan tampak seakan rusak saat
 * diklik.
 */
export function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu pengelolaan" className="space-y-7">
      {MENU_ADMIN.map((kelompok, i) => (
        <div key={kelompok.judul ?? i}>
          {kelompok.judul && (
            <p className="mb-2 px-3.5 text-[0.8125rem] font-semibold uppercase tracking-wide text-tinta-redup">
              {kelompok.judul}
            </p>
          )}
          <ul className="space-y-1.5">
            {kelompok.butir.map((b) => {
              const aktif =
                b.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(b.href);
              return (
                <li key={b.href}>
                  <Link
                    href={b.href}
                    aria-current={aktif ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-base font-medium ${
                      aktif
                        ? "bg-hijau-muda text-hijau-utama"
                        : "text-tinta hover:bg-permukaan"
                    }`}
                  >
                    <svg
                      className={`h-6 w-6 shrink-0 ${aktif ? "text-hijau-utama" : "text-tinta-redup"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={IKON[b.ikon]}
                      />
                    </svg>
                    <span className="flex-1">{b.label}</span>
                    {!b.siap && (
                      <span className="rounded bg-permukaan px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase text-tinta-redup">
                        segera
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
