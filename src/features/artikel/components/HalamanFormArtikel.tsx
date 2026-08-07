import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ambilArtikelAdminById } from "../queries";
import {
  kanalDariKategori,
  urlAdminKanal,
  type KanalKelola,
  type KodeKategori,
} from "../kategori";
import { JENIS_KONTEN, type JenisKonten } from "../jenis";
import { FormArtikel, type ArtikelUntukForm } from "./FormArtikel";

/**
 * Satu halaman editor untuk dua pintu pengelolaan.
 *
 * Saat mengubah artikel lama, kanal ditentukan dari kategorinya sendiri —
 * artikel Berita selalu kembali ke daftar Berita walau dibuka lewat alamat
 * editor Informasi. Prop `kanal` hanya dipakai untuk artikel baru.
 */
export async function HalamanFormArtikel({
  id,
  kanal: kanalProp,
  kategoriAwal,
  jenisAwal,
}: {
  id?: string;
  kanal?: KanalKelola;
  kategoriAwal?: string;
  jenisAwal?: string;
}) {
  const data = id ? await ambilArtikelAdminById(id) : null;
  if (id && !data) notFound();

  const kanal: KanalKelola = data
    ? kanalDariKategori(data.kategori as KodeKategori)
    : (kanalProp ?? "informasi");
  const namaKanal = kanal === "berita" ? "Berita" : "Informasi";
  const jenisKonten: JenisKonten =
    data?.jenisKonten ?? (jenisAwal === "poster" ? "poster" : "materi");
  const kategoriIsian = data?.kategori ?? kategoriAwal;
  const namaIsian =
    kanal === "berita"
      ? "berita atau pengumuman"
      : jenisKonten === "poster"
        ? kategoriIsian === "perawatan-alat"
          ? "poster perawatan alat"
          : "poster kesehatan"
        : "materi";

  return (
    <div className="masuk-halus">
      <Link
        href={urlAdminKanal(kanal)}
        className="mb-4 inline-flex min-h-11 items-center gap-2 font-semibold text-hijau-utama hover:underline"
      >
        <ArrowLeft size={19} aria-hidden="true" />
        Kembali ke daftar {namaKanal}
      </Link>
      <div className="mb-7">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-hijau-utama sm:text-3xl">
            {data
              ? `Ubah ${namaIsian}`
              : jenisAwal
                ? `Tambah ${namaIsian}`
                : `Tambah ${namaKanal.toLowerCase()}`}
          </h1>
          {data && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                data.status === "terbit"
                  ? "bg-hijau-muda text-hijau-utama"
                  : "bg-white text-tinta-redup"
              }`}
            >
              {data.status === "terbit" ? "Sudah terbit" : "Masih draf"}
            </span>
          )}
        </div>
        <p className="mt-1 text-tinta-redup">
          {kanal === "informasi"
            ? `${JENIS_KONTEN[jenisKonten].deskripsi} Tanggal terbit diatur otomatis.`
            : "Tanggal terbit dan nama penulis diatur otomatis."}
        </p>
      </div>

      <FormArtikel
        kanal={kanal}
        kategoriAwal={kategoriAwal}
        jenisAwal={jenisAwal}
        awal={
          data
            ? {
                id: data.id,
                judul: data.judul,
                kategori: data.kategori as ArtikelUntukForm["kategori"],
                jenisKonten: data.jenisKonten,
                ringkasan: data.ringkasan,
                konten: data.konten,
                gambarSampulUrl: data.gambarSampulUrl,
                status: data.status,
                lampiran: data.lampiran,
              }
            : undefined
        }
      />
    </div>
  );
}
