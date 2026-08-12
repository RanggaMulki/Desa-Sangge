import { IDENTITAS } from "../navigasi";
import { alamatSitus } from "@/lib/situs";

/**
 * Data terstruktur (JSON-LD) tentang identitas resmi desa.
 *
 * Ini memberi tahu mesin pencari bahwa situs ini adalah situs RESMI Pemerintah
 * Desa Sangge — lengkap dengan nama, alamat, dan wilayah layanannya. Sinyal
 * inilah yang membantu Google menampilkan situs ini sebagai tautan resmi saat
 * orang mencari "desa sangge", alih-alih hanya memunculkan Wikipedia.
 *
 * Ditanam sekali di beranda (entitas utama situs). Tidak tampak oleh pengguna,
 * hanya dibaca mesin pencari.
 */
export function SkemaOrganisasi() {
  const skema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: `Pemerintah ${IDENTITAS.nama}`,
    alternateName: IDENTITAS.nama,
    url: alamatSitus,
    logo: `${alamatSitus}/gambar/lambang-boyolali.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: IDENTITAS.alamatJalan,
      addressLocality: "Klego",
      addressRegion: IDENTITAS.provinsi,
      postalCode: IDENTITAS.kodePos,
      addressCountry: "ID",
    },
    areaServed: `${IDENTITAS.nama}, ${IDENTITAS.wilayah}`,
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify aman: nilainya konstanta identitas desa, bukan input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(skema) }}
    />
  );
}
