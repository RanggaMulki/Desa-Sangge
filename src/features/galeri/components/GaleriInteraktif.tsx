"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { tanggalPendek } from "@/lib/format";

type Foto = {
  id: string;
  judul: string;
  gambarUrl: string;
  keterangan?: string | null;
  tanggal?: string | null;
};

/**
 * Kisi dokumentasi + lightbox.
 *
 * Tata letaknya mengadaptasi Gallery Grid with Lightbox dari 21st.dev, tetapi
 * tidak membawa Framer Motion. CSS, Next Image, dan sedikit state React sudah
 * cukup untuk grid, filter tahun, navigasi, fokus, Back HP, dan swipe.
 */
export function GaleriInteraktif({ foto }: { foto: Foto[] }) {
  const [bukaId, setBukaId] = useState<string | null>(null);
  const [tahunAktif, setTahunAktif] = useState("semua");
  const [dipasang, setDipasang] = useState(false);
  useEffect(() => setDipasang(true), []);

  const tahun = useMemo(
    () =>
      Array.from(
        new Set(
          foto
            .map((item) => item.tanggal?.slice(0, 4))
            .filter((item): item is string => Boolean(item)),
        ),
      ).sort((a, b) => Number(b) - Number(a)),
    [foto],
  );

  const tersaring = useMemo(
    () =>
      tahunAktif === "semua"
        ? foto
        : foto.filter((item) => item.tanggal?.startsWith(tahunAktif)),
    [foto, tahunAktif],
  );

  const aktifIndex = tersaring.findIndex((item) => item.id === bukaId);
  const aktif = aktifIndex >= 0 ? tersaring[aktifIndex] : null;
  const terbuka = aktif !== null;
  const banyak = tersaring.length > 1;

  const dialogRef = useRef<HTMLDivElement>(null);
  const tutupRef = useRef<HTMLButtonElement>(null);
  const pemicuRef = useRef<HTMLButtonElement | null>(null);

  const tutup = useCallback(() => setBukaId(null), []);
  const maju = useCallback(() => {
    setBukaId((id) => {
      const index = tersaring.findIndex((item) => item.id === id);
      return tersaring[(index + 1) % tersaring.length]?.id ?? null;
    });
  }, [tersaring]);
  const mundur = useCallback(() => {
    setBukaId((id) => {
      const index = tersaring.findIndex((item) => item.id === id);
      return (
        tersaring[(index - 1 + tersaring.length) % tersaring.length]?.id ??
        null
      );
    });
  }, [tersaring]);

  useEffect(() => {
    if (!terbuka) return;

    const gulirLama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    tutupRef.current?.focus();

    window.history.pushState({ galeriLightbox: true }, "");
    const saatBack = () => setBukaId(null);
    window.addEventListener("popstate", saatBack);

    return () => {
      document.body.style.overflow = gulirLama;
      window.removeEventListener("popstate", saatBack);
      if (window.history.state?.galeriLightbox) window.history.back();
      pemicuRef.current?.focus();
    };
  }, [terbuka]);

  useEffect(() => {
    if (!terbuka) return;
    const saatTekan = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
      else if (event.key === "ArrowRight") maju();
      else if (event.key === "ArrowLeft") mundur();
    };
    document.addEventListener("keydown", saatTekan);
    return () => document.removeEventListener("keydown", saatTekan);
  }, [terbuka, tutup, maju, mundur]);

  const sentuhX = useRef<number | null>(null);
  const onSentuhMulai = (event: React.TouchEvent) => {
    sentuhX.current = event.touches[0].clientX;
  };
  const onSentuhAkhir = (event: React.TouchEvent) => {
    if (sentuhX.current === null) return;
    const beda = event.changedTouches[0].clientX - sentuhX.current;
    if (banyak && Math.abs(beda) > 50) (beda < 0 ? maju : mundur)();
    sentuhX.current = null;
  };

  const jagaFokus = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const tombol =
      dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!tombol || tombol.length === 0) return;
    const pertama = tombol[0];
    const terakhir = tombol[tombol.length - 1];

    if (event.shiftKey && document.activeElement === pertama) {
      event.preventDefault();
      terakhir.focus();
    } else if (!event.shiftKey && document.activeElement === terakhir) {
      event.preventDefault();
      pertama.focus();
    }
  };

  return (
    <>
      {/* Filter tahun hanya muncul bila foto tersebar di lebih dari satu tahun.
          Bar hitungan "N foto dokumentasi" dihapus — seksi ini murni foto. */}
      {tahun.length > 1 && (
        <div
          role="group"
          aria-label="Saring galeri berdasarkan tahun"
          className="mb-5 flex max-w-full gap-1 overflow-x-auto rounded-lg border border-garis bg-white p-1"
        >
          {["semua", ...tahun].map((item) => {
            const aktif = tahunAktif === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={aktif}
                onClick={() => {
                  setBukaId(null);
                  setTahunAktif(item);
                }}
                className={`min-h-11 shrink-0 rounded-md px-3.5 text-sm font-bold ${
                  aktif
                    ? "bg-hijau-utama text-white"
                    : "text-tinta hover:bg-permukaan"
                }`}
              >
                {item === "semua" ? "Semua tahun" : item}
              </button>
            );
          })}
        </div>
      )}

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Foto kegiatan Desa Sangge"
      >
        {tersaring.map((item, index) => (
          <li key={item.id} className="min-w-0">
            <figure className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_12px_28px_rgba(46,48,62,0.12)] ring-1 ring-garis">
              {/* Area foto — rasio tetap supaya semua kartu seragam. */}
              <div className="relative aspect-[4/3] bg-permukaan">
                <Image
                  src={item.gambarUrl}
                  alt={
                    item.judul ||
                    item.keterangan ||
                    "Dokumentasi kegiatan Desa Sangge"
                  }
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                  quality={80}
                  priority={index < 2}
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />

                <button
                  type="button"
                  onClick={(event) => {
                    pemicuRef.current = event.currentTarget;
                    setBukaId(item.id);
                  }}
                  aria-label={
                    item.judul
                      ? `Lihat foto: ${item.judul}`
                      : "Lihat foto kegiatan Desa Sangge"
                  }
                  className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                >
                  <span className="sr-only">Buka pratinjau foto</span>
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-tinta/80 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                  >
                    <ZoomIn size={20} />
                  </span>
                </button>
              </div>

              {/* Nama kegiatan + tanggal DI BAWAH foto. Ukuran & font seragam;
                  judul dijaga maksimal dua baris supaya tinggi kartu sama. */}
              <figcaption className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-tinta">
                  {item.judul || "Dokumentasi kegiatan Desa Sangge"}
                </p>
                {item.tanggal && (
                  <p className="mt-1 text-sm text-tinta-redup">
                    {tanggalPendek(item.tanggal)}
                  </p>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {aktif &&
        dipasang &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-foto-galeri"
            aria-describedby={
              aktif.keterangan ? "keterangan-foto-galeri" : undefined
            }
            onClick={tutup}
            onKeyDown={jagaFokus}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141518]/95 p-4 sm:p-6"
          >
            <button
              ref={tutupRef}
              type="button"
              onClick={tutup}
              aria-label="Tutup pratinjau"
              title="Tutup"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={23} aria-hidden="true" />
            </button>

            {banyak && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    mundur();
                  }}
                  aria-label="Foto sebelumnya"
                  title="Foto sebelumnya"
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
                >
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    maju();
                  }}
                  aria-label="Foto berikutnya"
                  title="Foto berikutnya"
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </button>
              </>
            )}

            <figure
              onClick={(event) => event.stopPropagation()}
              onTouchStart={onSentuhMulai}
              onTouchEnd={onSentuhAkhir}
              className="flex max-h-full max-w-full flex-col items-center"
            >
              {/* Ukuran asli diperlukan agar foto potret maupun lanskap dapat
                  memenuhi ruang lightbox tanpa dipotong. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aktif.gambarUrl}
                alt={
                  aktif.judul ||
                  aktif.keterangan ||
                  "Dokumentasi kegiatan Desa Sangge"
                }
                className="max-h-[76vh] max-w-[90vw] rounded-lg object-contain"
              />

              <figcaption className="mt-3 max-w-2xl text-center text-white">
                <h2 id="judul-foto-galeri" className="font-bold sm:text-lg">
                  {aktif.judul || "Dokumentasi kegiatan Desa Sangge"}
                </h2>
                {aktif.tanggal && (
                  <p className="mt-1 text-sm text-white/70">
                    {tanggalPendek(aktif.tanggal)}
                  </p>
                )}
                {aktif.keterangan && (
                  <p
                    id="keterangan-foto-galeri"
                    className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base"
                  >
                    {aktif.keterangan}
                  </p>
                )}
                {banyak && (
                  <p className="mt-2 text-sm font-semibold text-hijau-muda">
                    {aktifIndex + 1} / {tersaring.length}
                  </p>
                )}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </>
  );
}
