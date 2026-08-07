import Link from "next/link";
import {
  FileImage,
  FileText,
  HeartPulse,
  Megaphone,
  Newspaper,
  Plus,
  Search,
  Wrench,
} from "lucide-react";
import { ambilArtikelAdmin, hitungArtikelPerKategoriKanal } from "../queries";
import {
  KATEGORI,
  KATEGORI_PER_KANAL,
  urlAdminKanal,
  urlPublikArtikel,
  type KanalKelola,
  type KodeKategori,
} from "../kategori";
import { JENIS_KONTEN, type JenisKonten } from "../jenis";
import { DaftarArtikelAdmin } from "./DaftarArtikelAdmin";

export type ParameterKelolaArtikel = {
  cari?: string;
  kategori?: string;
  jenis?: string;
  status?: string;
  hasil?: string;
  id?: string;
  slug?: string;
};

/** Ikon kecil penanda tiap jenis isi, supaya kartunya mudah dibedakan. */
const IKON_KATEGORI: Partial<
  Record<KodeKategori, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" }>>
> = {
  kesehatan: HeartPulse,
  "perawatan-alat": Wrench,
  berita: Newspaper,
  pengumuman: Megaphone,
};

const TEKS_KANAL: Record<
  KanalKelola,
  { judul: string; keterangan: string; tombolTulis: string }
> = {
  informasi: {
    judul: "Informasi",
    keterangan:
      "Kelola materi Kesehatan serta poster Kesehatan dan Perawatan Alat.",
    tombolTulis: "Tambah informasi",
  },
  berita: {
    judul: "Berita & Pengumuman",
    keterangan: "Kabar kegiatan desa dan pengumuman resmi untuk warga.",
    tombolTulis: "Tulis berita baru",
  },
};

/**
 * Halaman daftar artikel untuk satu pintu pengelolaan (Informasi / Berita).
 *
 * Kartu jenis isi di atas bukan hiasan: tiap jenis punya tujuan berbeda,
 * jadi pengurus memilih dulu MAU MENULIS APA — bukan menghafal beda
 * kategori di dalam form. Tombol "Tulis" pada kartu langsung membuka
 * editor dengan jenis isi yang sudah terpilih.
 */
export async function HalamanKelolaArtikel({
  parameter,
  kanal = "informasi",
}: {
  parameter: ParameterKelolaArtikel;
  kanal?: KanalKelola;
}) {
  const pilihanKanal = KATEGORI_PER_KANAL[kanal];
  const teks = TEKS_KANAL[kanal];
  const urlDasar = urlAdminKanal(kanal);
  const urlTulis = `${urlDasar === "/admin/berita" ? "/admin/berita" : "/admin/artikel"}/baru`;

  const kategori = pilihanKanal.includes(parameter.kategori as KodeKategori)
    ? (parameter.kategori as KodeKategori)
    : undefined;
  const status =
    parameter.status === "draf" || parameter.status === "terbit"
      ? parameter.status
      : undefined;
  const jenisKonten =
    kanal === "informasi" &&
    (parameter.jenis === "materi" || parameter.jenis === "poster")
      ? (parameter.jenis as JenisKonten)
      : undefined;
  const cari = parameter.cari?.trim() || undefined;

  const [daftar, jumlahPerKategori] = await Promise.all([
    ambilArtikelAdmin({ kanal, cari, kategori, jenisKonten, status }),
    hitungArtikelPerKategoriKanal(kanal),
  ]);
  const sedangDisaring = Boolean(cari || kategori || jenisKonten || status);

  const kategoriHasil = parameter.kategori as KodeKategori | undefined;
  const urlHasil =
    parameter.hasil === "terbit" && parameter.slug && kategoriHasil
      ? urlPublikArtikel(kategoriHasil, parameter.slug)
      : null;
  const urlLanjutan =
    urlHasil ??
    (parameter.hasil === "draf" && parameter.id
      ? `/admin/artikel/${parameter.id}`
      : null);

  return (
    <div className="masuk-halus">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hijau-utama sm:text-3xl">
            {teks.judul}
          </h1>
          <p className="mt-1 text-tinta-redup">{teks.keterangan}</p>
        </div>
        <Link
          href={urlTulis}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat"
        >
          <Plus size={19} aria-hidden="true" />
          {teks.tombolTulis}
        </Link>
      </div>

      {(parameter.hasil === "draf" || parameter.hasil === "terbit") && (
        <div
          role="status"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hijau-utama/30 bg-hijau-muda px-4 py-3 text-sm font-medium text-hijau-utama"
        >
          <span>
            {parameter.hasil === "terbit"
              ? "Tulisan berhasil diterbitkan."
              : "Tulisan berhasil disimpan sebagai draf."}
          </span>
          {urlLanjutan && (
            <Link
              href={urlLanjutan}
              target={urlHasil ? "_blank" : undefined}
              className="font-bold underline underline-offset-4"
            >
              {urlHasil ? "Lihat hasilnya" : "Lanjutkan menulis"}
            </Link>
          )}
        </div>
      )}

      {/* Kartu jenis isi: pintu masuk utama, satu kartu satu tujuan. */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {jumlahPerKategori.map((item, i) => {
          const info = KATEGORI[item.kode];
          const Ikon = IKON_KATEGORI[item.kode];
          const aktif = kategori === item.kode;
          return (
            <div
              key={item.kode}
              className={`kartu-interaktif masuk-halus rounded-xl border bg-white p-5 ${
                aktif ? "border-hijau-utama" : "border-garis"
              }`}
              style={{ "--jeda-masuk": `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-hijau-muda text-hijau-utama">
                  {Ikon && <Ikon size={22} aria-hidden="true" />}
                </span>
                <div className="min-w-0">
                  <h2 className="font-bold">{info.label}</h2>
                  <p className="mt-0.5 text-sm leading-snug text-tinta-redup">
                    {info.deskripsi}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-garis pt-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p className="font-medium text-tinta">
                    {kanal === "informasi" ? (
                      item.kode === "kesehatan" ? (
                        <>
                          {item.materi} materi · {item.poster} poster
                        </>
                      ) : (
                        <>{item.poster} poster</>
                      )
                    ) : (
                      <>{item.terbit + item.draf} tulisan</>
                    )}
                  </p>
                  <p className="text-tinta-redup">
                    {item.terbit} terbit
                    {item.draf > 0 && ` · ${item.draf} draf`}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`${urlDasar}?kategori=${item.kode}`}
                    className="inline-flex min-h-9 items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-hijau-utama hover:bg-hijau-muda"
                  >
                    Lihat daftar
                  </Link>
                  {kanal === "informasi" && (
                    <Link
                      href={`${urlTulis}?kategori=${item.kode}&jenis=poster`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-hijau-utama px-3 py-1.5 text-sm font-semibold text-hijau-utama hover:bg-hijau-muda"
                    >
                      <FileImage size={16} aria-hidden="true" />
                      Tambah poster
                    </Link>
                  )}
                  {(kanal !== "informasi" || item.kode === "kesehatan") && (
                    <Link
                      href={`${urlTulis}?kategori=${item.kode}${kanal === "informasi" ? "&jenis=materi" : ""}`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-hijau-utama px-3 py-1.5 text-sm font-semibold text-hijau-utama hover:bg-hijau-muda"
                    >
                      {kanal === "informasi" ? (
                        <FileText size={16} aria-hidden="true" />
                      ) : (
                        <Plus size={15} aria-hidden="true" />
                      )}
                      {kanal === "informasi" ? "Tulis materi" : "Tulis"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        method="get"
        action={urlDasar}
        className="mb-5 rounded-lg border border-garis bg-white p-4"
      >
        <div
          className={
            kanal === "informasi"
              ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(13rem,1fr)_10rem_10rem_9rem_auto]"
              : "grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_12rem_10rem_auto]"
          }
        >
          <div>
            <label htmlFor="cari-artikel" className="text-sm font-semibold">
              Cari judul
            </label>
            <div className="relative mt-1">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-redup"
              />
              <input
                id="cari-artikel"
                name="cari"
                type="search"
                defaultValue={cari}
                placeholder={
                  kanal === "berita" ? "Contoh: kerja bakti" : "Contoh: stunting"
                }
                className="w-full rounded-lg border border-garis bg-white py-2.5 pl-10 pr-3 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
              />
            </div>
          </div>
          <div>
            <label htmlFor="kategori-artikel" className="text-sm font-semibold">
              {kanal === "informasi" ? "Topik" : "Jenis isi"}
            </label>
            <select
              id="kategori-artikel"
              name="kategori"
              defaultValue={kategori ?? ""}
              className="mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            >
              <option value="">
                {kanal === "informasi" ? "Semua topik" : "Semua jenis"}
              </option>
              {pilihanKanal.map((kode) => (
                <option key={kode} value={kode}>
                  {KATEGORI[kode].label}
                </option>
              ))}
            </select>
          </div>
          {kanal === "informasi" && (
            <div>
              <label
                htmlFor="jenis-konten-artikel"
                className="text-sm font-semibold"
              >
                Bentuk
              </label>
              <select
                id="jenis-konten-artikel"
                name="jenis"
                defaultValue={jenisKonten ?? ""}
                className="mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
              >
                <option value="">Semua bentuk</option>
                <option value="materi">{JENIS_KONTEN.materi.labelSingkat}</option>
                <option value="poster">{JENIS_KONTEN.poster.labelSingkat}</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor="status-artikel" className="text-sm font-semibold">
              Status
            </label>
            <select
              id="status-artikel"
              name="status"
              defaultValue={status ?? ""}
              className="mt-1 w-full rounded-lg border border-garis bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda"
            >
              <option value="">Semua status</option>
              <option value="draf">Draf</option>
              <option value="terbit">Terbit</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="min-h-11 flex-1 rounded-lg border border-hijau-utama px-4 py-2.5 font-semibold text-hijau-utama hover:bg-hijau-muda"
            >
              Terapkan
            </button>
            {sedangDisaring && (
              <Link
                href={urlDasar}
                className="inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-tinta-redup hover:bg-permukaan"
              >
                Hapus saringan
              </Link>
            )}
          </div>
        </div>
      </form>

      <DaftarArtikelAdmin
        artikel={daftar}
        sedangDisaring={sedangDisaring}
        kanal={kanal}
      />
    </div>
  );
}
