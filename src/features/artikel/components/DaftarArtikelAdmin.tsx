import Link from "next/link";
import { tanggalPendek } from "@/lib/format";
import {
  KATEGORI,
  urlPublikArtikel,
  type KanalKelola,
  type KodeKategori,
} from "../kategori";
import { JENIS_KONTEN, type JenisKonten } from "../jenis";
import { AksiArtikelAdmin } from "./AksiArtikelAdmin";

type BarisArtikelAdmin = {
  id: string;
  judul: string;
  slug: string;
  kategori: KodeKategori;
  jenisKonten: JenisKonten;
  ringkasan: string;
  status: "draf" | "terbit";
  tanggalTerbit: Date | null;
  diperbaruiPada: Date;
};

function LencanaStatus({ status }: { status: "draf" | "terbit" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        status === "terbit"
          ? "bg-hijau-muda text-hijau-utama"
          : "bg-permukaan text-tinta-redup"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${
          status === "terbit" ? "bg-hijau-utama" : "bg-tinta-redup"
        }`}
      />
      {status === "terbit" ? "Terbit" : "Draf"}
    </span>
  );
}

function urlPublik(item: BarisArtikelAdmin) {
  return urlPublikArtikel(item.kategori, item.slug);
}

export function DaftarArtikelAdmin({
  artikel,
  sedangDisaring,
  kanal = "informasi",
}: {
  artikel: BarisArtikelAdmin[];
  sedangDisaring: boolean;
  kanal?: KanalKelola;
}) {
  const urlTulis =
    kanal === "berita" ? "/admin/berita/baru" : "/admin/artikel/baru";

  if (artikel.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-garis bg-white px-5 py-12 text-center">
        <p className="font-semibold">
          {sedangDisaring
            ? "Tidak ada tulisan yang cocok."
            : kanal === "berita"
              ? "Belum ada berita atau pengumuman."
              : "Belum ada materi atau poster."}
        </p>
        <p className="mx-auto mt-1 max-w-md text-tinta-redup">
          {sedangDisaring
            ? "Ubah kata pencarian atau pilihan penyaring, lalu coba lagi."
            : kanal === "berita"
              ? "Mulai dengan kabar kegiatan desa atau pengumuman pertama."
              : "Mulai dengan materi Kesehatan atau poster Kesehatan dan Perawatan Alat."}
        </p>
        {!sedangDisaring && (
          <Link
            href={urlTulis}
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat"
          >
            {kanal === "berita"
              ? "Tulis berita pertama"
              : "Tambah informasi pertama"}
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {artikel.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-garis bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <LencanaStatus status={item.status} />
              <span className="text-sm text-tinta-redup">
                {tanggalPendek(item.diperbaruiPada)}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug">{item.judul}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-full bg-permukaan px-2.5 py-1 text-tinta-redup">
                {KATEGORI[item.kategori].label}
              </span>
              {kanal === "informasi" && (
                <span className="rounded-full bg-hijau-muda px-2.5 py-1 text-hijau-utama">
                  {JENIS_KONTEN[item.jenisKonten].labelSingkat}
                </span>
              )}
            </div>
            <div className="mt-3 border-t border-garis pt-2">
              <AksiArtikelAdmin
                id={item.id}
                judul={item.judul}
                kategori={item.kategori}
                jenisKonten={item.jenisKonten}
                status={item.status}
                urlPublik={urlPublik(item)}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-lg border border-garis bg-white md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-permukaan/70 text-sm">
            <tr>
              <th
                className={`${kanal === "informasi" ? "w-[31%]" : "w-[42%]"} px-4 py-3 font-semibold`}
              >
                {kanal === "informasi" ? "Judul" : "Artikel"}
              </th>
              <th className="w-[15%] px-4 py-3 font-semibold">
                {kanal === "informasi" ? "Topik" : "Jenis isi"}
              </th>
              {kanal === "informasi" && (
                <th className="w-[12%] px-4 py-3 font-semibold">Bentuk</th>
              )}
              <th className="w-[12%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[30%] px-4 py-3 font-semibold">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {artikel.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-bold leading-snug">{item.judul}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-tinta-redup">
                    Diperbarui {tanggalPendek(item.diperbaruiPada)}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  {KATEGORI[item.kategori].label}
                </td>
                {kanal === "informasi" && (
                  <td className="px-4 py-4 text-sm font-medium">
                    {JENIS_KONTEN[item.jenisKonten].labelSingkat}
                  </td>
                )}
                <td className="px-4 py-4">
                  <LencanaStatus status={item.status} />
                </td>
                <td className="px-2 py-2">
                  <AksiArtikelAdmin
                    id={item.id}
                    judul={item.judul}
                    kategori={item.kategori}
                    jenisKonten={item.jenisKonten}
                    status={item.status}
                    urlPublik={urlPublik(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
