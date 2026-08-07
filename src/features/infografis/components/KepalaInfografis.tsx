"use client";

import { usePathname } from "next/navigation";
import { Baby, Database } from "lucide-react";
import { IDENTITAS } from "@/features/tata-letak/navigasi";
import { tab, type KunciTab } from "../tab";
import { TabInfografis } from "./TabInfografis";

/**
 * Kepala bersama untuk seluruh infografis publik.
 *
 * Komponen ini berada di layout agar pilihan kategori dan identitas data tidak
 * digandakan pada setiap halaman. Judul dan isi di bawahnya mengikuti alamat
 * aktif, sedangkan navigasinya tetap berada pada posisi yang sama.
 */
export function KepalaInfografis() {
  const pathname = usePathname();
  const aktif: KunciTab = pathname.startsWith("/infografis/stunting")
    ? "stunting"
    : "penduduk";
  const informasi = tab(aktif);
  const IkonJudul = aktif === "stunting" ? Baby : Database;

  return (
    <>
      <TabInfografis aktif={aktif} tampilan="toolbar" />

      <section
        aria-labelledby="judul-infografis-aktif"
        className="mt-4 overflow-hidden rounded-lg border border-garis sm:mt-5"
      >
        <header className="bg-hijau-utama px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/15 [&_svg]:size-7"
            >
              <IkonJudul />
            </span>
            <div className="min-w-0">
              <h1
                id="judul-infografis-aktif"
                className="text-2xl font-extrabold leading-tight text-white sm:text-3xl"
              >
                {informasi.judul} {IDENTITAS.nama}
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-white/85">
                {informasi.keterangan}
              </p>
            </div>
          </div>
        </header>
      </section>
    </>
  );
}
