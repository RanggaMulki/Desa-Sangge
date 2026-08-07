import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { tanggalPanjang } from "@/lib/format";
import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { ambilArtikelAdminById } from "../queries";
import { KATEGORI, urlPublikArtikel } from "../kategori";
import { JENIS_KONTEN } from "../jenis";
import { KotakLampiran } from "./KotakLampiran";

export async function PratinjauArtikelAdmin({ id }: { id: string }) {
  const data = await ambilArtikelAdminById(id);
  if (!data) notFound();
  const urlPublik = urlPublikArtikel(data.kategori, data.slug);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/artikel/${data.id}`}
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-hijau-utama hover:underline"
        >
          <ArrowLeft size={19} aria-hidden="true" />
          Kembali mengubah
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/artikel/${data.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-hijau-utama px-4 py-2 font-semibold text-hijau-utama hover:bg-hijau-muda"
          >
            <Pencil size={18} aria-hidden="true" />
            Ubah artikel
          </Link>
          {data.status === "terbit" && (
            <Link
              href={urlPublik}
              target="_blank"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-hijau-utama px-4 py-2 font-semibold text-white hover:bg-hijau-pekat"
            >
              <ExternalLink size={18} aria-hidden="true" />
              Lihat halaman warga
            </Link>
          )}
        </div>
      </div>

      <div
        role="status"
        className="mb-6 rounded-lg border border-garis bg-permukaan px-4 py-3 text-sm font-medium"
      >
        {data.status === "draf"
          ? "Ini hanya pratinjau. Artikel masih berupa draf dan belum terlihat oleh warga."
          : "Ini pratinjau artikel yang sudah diterbitkan."}
      </div>

      <article className="rounded-lg border border-garis bg-white px-5 py-8 sm:px-8 lg:px-12">
        <p className="text-tinta-redup">
          {data.jenisKonten === "poster"
            ? `${JENIS_KONTEN.poster.labelSingkat} · ${KATEGORI[data.kategori].label}`
            : KATEGORI[data.kategori].label}
          {data.tanggalTerbit && ` · ${tanggalPanjang(data.tanggalTerbit)}`}
          {data.namaPenulis && ` · ${data.namaPenulis}`}
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{data.judul}</h1>
        {data.jenisKonten === "materi" && (
          <p className="mt-4 text-lg text-tinta-redup">{data.ringkasan}</p>
        )}

        {data.gambarSampulUrl && (
          <div
            className={`relative mt-8 overflow-hidden rounded-lg bg-permukaan ${
              data.jenisKonten === "poster"
                ? "mx-auto aspect-[3/4] max-w-2xl border border-garis bg-white"
                : "aspect-[16/9]"
            }`}
          >
            <Image
              src={data.gambarSampulUrl}
              alt={data.jenisKonten === "poster" ? data.judul : ""}
              fill
              sizes="(min-width: 1024px) 46rem, 90vw"
              quality={80}
              className={
                data.jenisKonten === "poster" ? "object-contain" : "object-cover"
              }
            />
          </div>
        )}

        {data.jenisKonten === "materi" && (
          <>
            <div className="mt-8">
              <KontenAman html={data.konten} />
            </div>
            <KotakLampiran berkas={data.lampiran} />
          </>
        )}
      </article>
    </div>
  );
}
