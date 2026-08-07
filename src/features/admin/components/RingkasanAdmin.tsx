import Link from "next/link";
import {
  CalendarPlus,
  FileText,
  HeartPulse,
  ImagePlus,
  Phone,
  ArrowRight,
} from "lucide-react";
import { ambilPenggunaSaatIni } from "@/features/auth/queries";
import { ambilRingkasanDashboard } from "../queries";

/**
 * Beranda halaman pengelolaan.
 *
 * Dua lapis: pekerjaan yang paling sering dilakukan (menulis, menambah
 * jadwal, mengunggah foto) sebagai kartu besar yang bisa langsung diklik,
 * lalu angka ringkas isi website di bawahnya. Pengurus desa membuka halaman
 * ini untuk MENGERJAKAN sesuatu, bukan untuk membaca statistik — makanya
 * tombol aksi di atas, angka di bawah.
 */
export async function RingkasanAdmin() {
  const [akun, ringkas] = await Promise.all([
    ambilPenggunaSaatIni(),
    ambilRingkasanDashboard(),
  ]);

  const aksiCepat = [
    {
      href: "/admin/artikel/baru",
      label: "Tulis informasi",
      keterangan: "Artikel Kesehatan atau Perawatan Alat",
      Ikon: HeartPulse,
    },
    {
      href: "/admin/agenda",
      label: "Tambah agenda",
      keterangan: "Posyandu, kerja bakti, musyawarah",
      Ikon: CalendarPlus,
    },
    {
      href: "/admin/galeri",
      label: "Unggah foto",
      keterangan: "Dokumentasi kegiatan ke galeri",
      Ikon: ImagePlus,
    },
  ];

  const angka = [
    {
      href: "/admin/artikel",
      label: "Informasi terbit",
      nilai: ringkas.informasi.terbit,
      catatan:
        ringkas.informasi.draf > 0
          ? `${ringkas.informasi.draf} draf menunggu`
          : null,
      Ikon: FileText,
    },
    {
      href: "/admin/agenda",
      label: "Agenda akan datang",
      nilai: ringkas.agendaMendatang,
      catatan: null,
      Ikon: CalendarPlus,
    },
    {
      href: "/admin/kontak",
      label: "Kontak aktif",
      nilai: ringkas.kontakAktif,
      catatan: null,
      Ikon: Phone,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="masuk-halus">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Selamat datang{akun ? `, ${akun.nama}` : ""}
        </h1>
        <p className="mt-1.5 text-tinta-redup">
          Dari halaman ini Anda bisa mengisi dan memperbarui seluruh isi
          website desa.
        </p>
      </div>

      {/* Aksi cepat: pekerjaan harian, satu klik dari sini. */}
      <div>
        <h2 className="mb-3 font-bold text-tinta-redup">Sering dipakai</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {aksiCepat.map(({ href, label, keterangan, Ikon }, i) => (
            <Link
              key={href + label}
              href={href}
              className="kartu-interaktif masuk-halus group rounded-xl border border-garis bg-white p-5"
              style={{ "--jeda-masuk": `${i * 70}ms` } as React.CSSProperties}
            >
              <span className="grid size-11 place-items-center rounded-lg bg-hijau-muda text-hijau-utama">
                <Ikon size={22} aria-hidden="true" />
              </span>
              <p className="mt-3 flex items-center gap-1.5 font-bold">
                {label}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="text-hijau-utama opacity-0 transition-opacity group-hover:opacity-100"
                />
              </p>
              <p className="mt-0.5 text-sm leading-snug text-tinta-redup">
                {keterangan}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Angka ringkas: kondisi isi website saat ini. */}
      <div>
        <h2 className="mb-3 font-bold text-tinta-redup">Isi website saat ini</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {angka.map(({ href, label, nilai, catatan, Ikon }, i) => (
            <Link
              key={href + label}
              href={href}
              className="kartu-interaktif masuk-halus rounded-xl border border-garis bg-white p-5"
              style={
                { "--jeda-masuk": `${280 + i * 70}ms` } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-3xl font-bold">{nilai}</p>
                <Ikon
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-hijau-utama/60"
                />
              </div>
              <p className="mt-1 text-sm font-medium leading-snug">{label}</p>
              {catatan && (
                <p className="mt-0.5 text-sm text-oranye-data">{catatan}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
