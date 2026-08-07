import Link from "next/link";
import type { ReactNode } from "react";
import { TAB_INFOGRAFIS, type KunciTab } from "../tab";
import { IkonOrang, IkonGrafikBatang } from "../ikon";

/**
 * Navigasi tab kategori infografis. Tampilan publik memakai kontrol horizontal
 * ringkas, sementara halaman pengelolaan memakai ikon di atas label.
 *
 * Komponen yang sama dipakai di kepala publik dan halaman pengelolaan. Di
 * layar sempit barisnya dapat digulir di dalam kotaknya sendiri agar badan
 * halaman tidak ikut bergeser.
 */
const IKON: Record<KunciTab, ReactNode> = {
  penduduk: <IkonOrang />,
  stunting: <IkonGrafikBatang />,
};

export function TabInfografis({
  aktif,
  tautan,
  tampilan = "halaman",
}: {
  aktif: KunciTab;
  /**
   * Pengubah alamat tiap tab. Halaman publik memakai bawaannya (satu rute per
   * kategori); halaman pengelolaan mengoperkan fungsi sendiri supaya semua
   * kategori tetap berada di SATU alamat `/admin/infografis?tab=…`.
   */
  tautan?: (kunci: KunciTab) => string;
  /** Bentuk ringkas untuk kepala infografis publik. */
  tampilan?: "halaman" | "toolbar";
}) {
  const toolbar = tampilan === "toolbar";

  return (
    <nav
      aria-label="Kategori infografis"
      className={toolbar ? "overflow-x-auto" : "border-b border-garis"}
    >
      <div className="overflow-x-auto">
        <ul
          className={
            toolbar
              ? "inline-flex min-w-max gap-1 rounded-lg border border-garis bg-white p-1"
              : "flex min-w-max justify-center gap-1 sm:gap-3"
          }
        >
          {TAB_INFOGRAFIS.map((t) => {
            const ini = t.kunci === aktif;
            return (
              <li key={t.kunci}>
                <Link
                  href={tautan ? tautan(t.kunci) : t.href}
                  aria-current={ini ? "page" : undefined}
                  className={
                    toolbar
                      ? `flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                          ini
                            ? "bg-hijau-utama text-white"
                            : "text-tinta-redup hover:bg-permukaan hover:text-tinta"
                        }`
                      : `flex flex-col items-center gap-2 border-b-[3px] px-2 py-3 sm:px-6 ${
                          ini
                            ? "border-hijau-utama text-hijau-utama"
                            : "border-transparent text-tinta-redup hover:text-tinta"
                        }`
                  }
                >
                  <span
                    className={
                      toolbar
                        ? "[&_svg]:size-5"
                        : "[&_svg]:size-6 sm:[&_svg]:size-7"
                    }
                  >
                    {IKON[t.kunci]}
                  </span>
                  <span
                    className={
                      toolbar ? "whitespace-nowrap" : "text-xs font-semibold sm:text-sm"
                    }
                  >
                    {t.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
