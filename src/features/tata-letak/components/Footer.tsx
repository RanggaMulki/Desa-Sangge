import Link from "next/link";
import Image from "next/image";
import { MENU_UTAMA, IDENTITAS } from "../navigasi";
import { ambilKontakPerJenis } from "@/features/kontak-layanan/queries";
import { tautanWhatsApp, nomorTampil } from "@/lib/format";

/**
 * Footer tiga kolom: identitas desa, navigasi ringkas, serta layanan.
 *
 * Layanan penting sengaja ditempatkan di sini supaya navigasi utama tetap
 * ringkas. Setiap baris kontak menghilang sendiri bila datanya belum diisi.
 */

function IkonTelepon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function IkonSurel() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
      <path d="M3 7l9 6l9 -6" />
    </svg>
  );
}

function IkonJam() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export async function Footer() {
  const kontak = await ambilKontakPerJenis();
  const kantor = kontak.find((k) => k.jenis === "umum");

  // Nomor yang perlu cepat ditemukan warga: KPPA, kesehatan, darurat.
  const nomorPenting = kontak.filter((k) =>
    ["kppa", "kesehatan", "darurat"].includes(k.jenis),
  );

  /**
   * `leading-normal` menimpa line-height 1.7 dari body.
   *
   * Tinggi baris longgar itu dipilih untuk isi artikel yang dibaca panjang,
   * termasuk oleh lansia. Footer berisi potongan pendek, dan jarak baris
   * yang sama membuatnya terasa melebar tanpa alasan.
   */
  const adaKontak =
    !!kantor?.nomorWa || !!IDENTITAS.email || nomorPenting.length > 0;

  return (
    <footer className="latar-footer-earthy text-[0.9375rem] leading-normal text-white">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:pt-14 lg:px-8">
        {/* Tiga kolom seimbang: identitas (paling lebar) · navigasi · layanan.
            Jam pelayanan digabung ke kolom layanan supaya tidak ada kolom
            tipis yang berdiri sendiri. */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[1.6fr_1fr_1.3fr] lg:gap-x-16">
          {/* Kolom 1 — identitas desa */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/gambar/lambang-boyolali.png"
                alt=""
                width={200}
                height={200}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <p className="text-base font-extrabold leading-tight text-white">
                Pemerintah {IDENTITAS.nama}
              </p>
            </div>

            <address className="mt-4 space-y-1 not-italic text-white/75">
              {IDENTITAS.alamatJalan && <p>{IDENTITAS.alamatJalan}</p>}
              <p>{IDENTITAS.wilayah}</p>
              <p>
                Provinsi {IDENTITAS.provinsi}
                {IDENTITAS.kodePos && `, ${IDENTITAS.kodePos}`}
              </p>
            </address>

            {IDENTITAS.kodeWilayah && (
              <p className="mt-3 text-white/75">
                <span className="font-semibold text-white">
                  Kode Wilayah:{" "}
                </span>
                {IDENTITAS.kodeWilayah}
              </p>
            )}
          </div>

          {/* Kolom 2 — navigasi. Judul "Jelajahi" dipusatkan di atas dua kolom
              tautannya; blok tautannya ikut dipusatkan (w-fit + mx-auto) supaya
              judul benar-benar berada di tengah di antara kolom kiri & kanan,
              sedangkan teks tiap tautan tetap rata kiri di dalam kolomnya. */}
          <nav aria-label="Tautan footer" className="text-center">
            <h2 className="text-base font-extrabold text-hijau-muda">
              Jelajahi
            </h2>
            <ul className="mx-auto mt-4 grid w-fit grid-cols-2 gap-x-10 gap-y-2.5 text-left text-white/75">
              {MENU_UTAMA.map((halaman) => (
                <li key={halaman.href}>
                  <Link
                    href={halaman.href}
                    className="inline-flex py-0.5 hover:text-white"
                  >
                    {halaman.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kolom 3 — layanan, kontak, dan jam pelayanan */}
          <div>
            <h2 className="text-base font-extrabold text-hijau-muda">
              Layanan &amp; Kontak
            </h2>

            {adaKontak && (
              <ul className="mt-4 space-y-2.5 text-white/75">
                {kantor?.nomorWa && (
                  <li className="flex items-start gap-2.5">
                    <IkonTelepon />
                    <a
                      href={`tel:${kantor.nomorWa}`}
                      className="hover:text-white"
                    >
                      {nomorTampil(kantor.nomorWa)}
                    </a>
                  </li>
                )}
                {IDENTITAS.email && (
                  <li className="flex items-start gap-2.5">
                    <IkonSurel />
                    <a
                      href={`mailto:${IDENTITAS.email}`}
                      className="break-all hover:text-white"
                    >
                      {IDENTITAS.email}
                    </a>
                  </li>
                )}
                {nomorPenting.map((k) => (
                  <li key={k.id}>
                    {k.nomorWa ? (
                      <a
                        href={tautanWhatsApp(k.nomorWa)}
                        className="flex items-start gap-2.5 hover:text-white"
                      >
                        <IkonTelepon />
                        <span>{k.namaLayanan}</span>
                      </a>
                    ) : (
                      <span className="flex items-start gap-2.5">
                        <IkonTelepon />
                        <span>{k.namaLayanan}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {kantor?.jamLayanan && (
              <p
                className={`flex items-start gap-2.5 text-white/75 ${
                  adaKontak ? "mt-5" : "mt-4"
                }`}
              >
                <IkonJam />
                <span>
                  <span className="font-semibold text-white">
                    Jam Pelayanan
                  </span>
                  <br />
                  {kantor.jamLayanan}
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Pemerintah {IDENTITAS.nama}
        </p>
      </div>
    </footer>
  );
}
