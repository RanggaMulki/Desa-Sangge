import type { MetadataRoute } from "next";
import { alamatSitus } from "@/lib/situs";
import { ambilSlugArtikelTerbit } from "@/features/artikel/queries";
import { ambilKategori } from "@/features/artikel/kategori";
import { jenisKontenSah } from "@/features/artikel/jenis";

export const revalidate = 3600;

/** Halaman tetap situs, dengan bobot prioritas relatifnya. */
const HALAMAN_TETAP: { jalur: string; prioritas: number }[] = [
  { jalur: "", prioritas: 1 },
  { jalur: "/profil", prioritas: 0.8 },
  { jalur: "/profil/pemerintahan", prioritas: 0.7 },
  { jalur: "/infografis", prioritas: 0.7 },
  { jalur: "/infografis/stunting", prioritas: 0.6 },
  { jalur: "/informasi", prioritas: 0.7 },
  { jalur: "/agenda", prioritas: 0.6 },
  { jalur: "/galeri", prioritas: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sekarang = new Date();

  const tetap: MetadataRoute.Sitemap = HALAMAN_TETAP.map(
    ({ jalur, prioritas }) => ({
      url: `${alamatSitus}${jalur}`,
      lastModified: sekarang,
      changeFrequency: jalur === "" ? "weekly" : "monthly",
      priority: prioritas,
    }),
  );

  // Tiap poster informasi yang sudah terbit ikut dimasukkan supaya terindeks
  // sebagai halaman tersendiri. Dibungkus try/catch: jika database sedang tidur
  // (Neon free tier) peta situs tetap terbit dengan halaman tetapnya.
  let poster: MetadataRoute.Sitemap = [];
  try {
    const semua = await ambilSlugArtikelTerbit();
    poster = semua
      .filter(
        (a) =>
          ambilKategori(a.kategori)?.kanalInformasi &&
          jenisKontenSah(a.kategori, a.jenisKonten),
      )
      .map((a) => ({
        url: `${alamatSitus}/informasi/${a.kategori}/${a.slug}`,
        lastModified: sekarang,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
  } catch {
    poster = [];
  }

  return [...tetap, ...poster];
}
