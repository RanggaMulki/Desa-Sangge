import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Di-host sendiri oleh Next.js saat build, tidak ada permintaan ke
// server Google saat halaman dibuka.
//
// preload dimatikan dengan sengaja. Fontnya dipasang lewat CSS variable
// (--font-jakarta), dan dengan pola itu peramban sering telat mengenali bahwa
// font yang di-preload benar-benar terpakai — memunculkan peringatan konsol
// "preloaded but not used within a few seconds", terutama saat Fast Refresh di
// mode dev. Tanpa preload, peringatan itu hilang dan font tetap dimuat begitu
// dibutuhkan; `display: swap` + fallback yang metriknya disamakan (bawaan
// next/font) membuat pergantiannya tanpa geser tata letak.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});

/**
 * Alamat dasar untuk merakit URL absolut di metadata (gambar Open Graph,
 * canonical). Tanpa ini, tautan yang dibagikan ke WhatsApp/Facebook membawa
 * URL gambar localhost dan pratinjaunya kosong.
 *
 * Urutan pilihan:
 *   1. SITUS_URL — diisi manual saat sudah punya domain (sangge.desa.id).
 *   2. Domain produksi Vercel — otomatis tersedia saat deploy.
 *   3. localhost — pengembangan di komputer sendiri.
 */
const alamatSitus =
  process.env.SITUS_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(alamatSitus),
  title: {
    default: "Website Resmi Desa Sangge",
    template: "%s | Desa Sangge",
  },
  description:
    "Informasi resmi Desa Sangge, Kecamatan Klego, Kabupaten Boyolali. " +
    "Profil dan sejarah, informasi kesehatan, agenda, serta layanan warga.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
