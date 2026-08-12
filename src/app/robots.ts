import type { MetadataRoute } from "next";
import { alamatSitus } from "@/lib/situs";

/**
 * Aturan perayapan untuk mesin pencari. Semua halaman publik boleh diindeks;
 * area /admin ditutup karena tidak untuk umum. Baris sitemap menunjuk ke peta
 * situs supaya Google menemukan seluruh halaman sekaligus.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${alamatSitus}/sitemap.xml`,
  };
}
