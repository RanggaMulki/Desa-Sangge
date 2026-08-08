import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { MENU_UTAMA, IDENTITAS, TAUTAN_LEMBAGA } from "../navigasi";
import { ambilKontakPerJenis } from "@/features/kontak-layanan/queries";
import { tautanWhatsApp, nomorTampil } from "@/lib/format";

/**
 * Footer empat kolom: brand · navigasi · pemerintahan & akses · kantor.
 *
 * Tata letaknya mengambil ide dari portal desa rujukan yang lebih rapi —
 * kolom seimbang, judul seksi bergaris, ikon di depan tiap butir — tetapi
 * memakai palet hijau earthy dan DATA ASLI Desa Sangge, bukan menyalin warna
 * navy maupun daftar fitur milik desa lain.
 *
 * Mobile-first: satu kolom di HP (semua rata kiri, konsisten), dua kolom di
 * tablet, empat kolom di desktop. Setiap baris kontak menghilang sendiri bila
 * datanya belum diisi lewat Pengelolaan.
 *
 * `leading-normal` menimpa line-height 1.7 dari body: footer berisi potongan
 * pendek, jarak baris longgar untuk artikel justru membuatnya terasa melebar.
 */

/** Judul kolom: kapital, tebal, bergaris bawah tipis. */
function JudulKolom({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-b border-white/15 pb-2 text-sm font-bold uppercase tracking-wider text-white">
      {children}
    </h2>
  );
}

export async function Footer() {
  const kontak = await ambilKontakPerJenis();
  const kantor = kontak.find((k) => k.jenis === "umum");

  // Nomor yang perlu cepat ditemukan warga: KPPA, kesehatan, darurat.
  const nomorPenting = kontak.filter((k) =>
    ["kppa", "kesehatan", "darurat"].includes(k.jenis),
  );

  return (
    <footer className="latar-footer-earthy text-[0.9375rem] leading-normal text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:pt-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
          {/* Kolom 1 — brand & pengantar */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white p-1.5 shadow-md">
                <Image
                  src="/gambar/lambang-boyolali.png"
                  alt=""
                  width={200}
                  height={200}
                  className="size-full object-contain"
                />
              </span>
              <span className="block">
                <span className="block text-base font-extrabold uppercase leading-tight tracking-wide text-white">
                  {IDENTITAS.nama}
                </span>
                <span className="text-xs font-medium text-hijau-muda">
                  {IDENTITAS.wilayah}
                </span>
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Portal informasi dan layanan resmi Pemerintah {IDENTITAS.nama},{" "}
              {IDENTITAS.wilayah}, {IDENTITAS.provinsi}.
            </p>

            <p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-hijau-muda">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Portal Resmi Pemerintah Desa
              </span>
            </p>
          </div>

          {/* Kolom 2 — navigasi halaman */}
          <nav aria-label="Tautan halaman">
            <JudulKolom>Jelajahi Desa</JudulKolom>
            <ul className="mt-4 space-y-2.5 text-white/70">
              {MENU_UTAMA.map((halaman) => (
                <li key={halaman.href}>
                  <Link
                    href={halaman.href}
                    className="group inline-flex items-center gap-2 hover:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-hijau-muda/70 transition-transform group-hover:scale-125"
                    />
                    {halaman.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kolom 3 — akses pemerintahan & tautan lembaga */}
          <div>
            <JudulKolom>Pemerintahan &amp; Akses</JudulKolom>
            <ul className="mt-4 space-y-2.5 text-white/70">
              <li>
                <Link
                  href="/admin/masuk"
                  className="group inline-flex items-center gap-2 hover:text-white"
                >
                  <LogIn
                    className="size-3.5 shrink-0 text-hijau-muda"
                    aria-hidden="true"
                  />
                  Login Perangkat Desa
                </Link>
              </li>
              {TAUTAN_LEMBAGA.map((tautan) => (
                <li key={tautan.href}>
                  <a
                    href={tautan.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 hover:text-white"
                  >
                    {tautan.label}
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-white/40 transition-colors group-hover:text-hijau-muda"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — kantor, kontak, jam, layanan penting */}
          <div>
            <JudulKolom>Kantor {IDENTITAS.nama}</JudulKolom>
            <div className="mt-4 space-y-3 text-white/70">
              {IDENTITAS.alamatJalan && (
                <p className="flex items-start gap-2.5">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-hijau-muda"
                    aria-hidden="true"
                  />
                  <span>
                    {IDENTITAS.alamatJalan}, {IDENTITAS.wilayah}
                    {IDENTITAS.kodePos && ` ${IDENTITAS.kodePos}`}
                  </span>
                </p>
              )}

              {kantor?.nomorWa && (
                <a
                  href={tautanWhatsApp(kantor.nomorWa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 hover:text-white"
                >
                  <Phone
                    className="mt-0.5 size-4 shrink-0 text-hijau-muda transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span>
                    {nomorTampil(kantor.nomorWa)}{" "}
                    <span className="text-white/50">(WhatsApp)</span>
                  </span>
                </a>
              )}

              {IDENTITAS.email && (
                <a
                  href={`mailto:${IDENTITAS.email}`}
                  className="group flex items-start gap-2.5 hover:text-white"
                >
                  <Mail
                    className="mt-0.5 size-4 shrink-0 text-hijau-muda transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="break-all">{IDENTITAS.email}</span>
                </a>
              )}

              {kantor?.jamLayanan && (
                <p className="flex items-start gap-2.5">
                  <Clock
                    className="mt-0.5 size-4 shrink-0 text-hijau-muda"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-semibold text-white">
                      Jam Pelayanan
                    </span>
                    <br />
                    {kantor.jamLayanan}
                  </span>
                </p>
              )}

              {nomorPenting.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                    Layanan Penting
                  </p>
                  <ul className="space-y-2">
                    {nomorPenting.map((k) => (
                      <li key={k.id}>
                        {k.nomorWa ? (
                          <a
                            href={tautanWhatsApp(k.nomorWa)}
                            className="group flex items-start gap-2.5 hover:text-white"
                          >
                            <Phone
                              className="mt-0.5 size-4 shrink-0 text-hijau-muda"
                              aria-hidden="true"
                            />
                            <span>{k.namaLayanan}</span>
                          </a>
                        ) : (
                          <span className="flex items-start gap-2.5">
                            <Phone
                              className="mt-0.5 size-4 shrink-0 text-hijau-muda"
                              aria-hidden="true"
                            />
                            <span>{k.namaLayanan}</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bar bawah: hak cipta kiri, kode wilayah kanan (menumpuk di HP) */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Pemerintah {IDENTITAS.nama}. Hak
            Cipta Dilindungi.
          </p>
          {IDENTITAS.kodeWilayah && (
            <p>Kode Wilayah {IDENTITAS.kodeWilayah}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
