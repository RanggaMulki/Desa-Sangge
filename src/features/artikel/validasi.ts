import { z } from "zod";
import { jenisKontenSah } from "./jenis";

/**
 * Aturan formulir artikel informasi.
 *
 * Pesannya sengaja memakai bahasa yang bisa langsung ditindaklanjuti oleh
 * pengurus desa. Slug, penulis, dan tanggal terbit tidak ikut formulir karena
 * semuanya diatur otomatis oleh sistem.
 */
export const formulirArtikelSchema = z
  .object({
    judul: z
      .string()
      .trim()
      .min(5, "Judul masih terlalu pendek. Tulis sedikitnya 5 huruf.")
      .max(
        200,
        "Judul terlalu panjang. Ringkas menjadi paling banyak 200 huruf.",
      ),
    kategori: z.enum(
      ["kesehatan", "perawatan-alat", "berita", "pengumuman"],
      {
        error: "Pilih dulu topik informasinya.",
      },
    ),
    jenisKonten: z.enum(["materi", "poster"], {
      error: "Pilih apakah informasi ini berupa materi atau poster.",
    }),
    ringkasan: z
      .string()
      .trim()
      .max(
        300,
        "Ringkasan terlalu panjang. Ringkas menjadi paling banyak 300 huruf.",
      ),
    konten: z.string(),
  })
  .superRefine((nilai, konteks) => {
    if (!jenisKontenSah(nilai.kategori, nilai.jenisKonten)) {
      konteks.addIssue({
        code: "custom",
        path: ["kategori"],
        message:
          nilai.kategori === "perawatan-alat"
            ? "Perawatan Alat hanya menerima informasi berbentuk poster."
            : "Bentuk informasi tidak sesuai dengan topik yang dipilih.",
      });
      return;
    }

    if (nilai.jenisKonten === "poster") {
      return;
    }

    if (nilai.ringkasan.length < 20) {
      konteks.addIssue({
        code: "custom",
        path: ["ringkasan"],
        message: "Ringkasan masih terlalu pendek. Tulis 1-2 kalimat singkat.",
      });
    }

    const teks = nilai.konten
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (teks.length < 20) {
      konteks.addIssue({
        code: "custom",
        path: ["konten"],
        message:
          "Isi materi masih kosong atau terlalu pendek. Tambahkan penjelasan terlebih dahulu.",
      });
    }
  });

export type NilaiFormulirArtikel = z.infer<typeof formulirArtikelSchema>;

export const tujuanSimpanSchema = z.enum([
  "draf",
  "terbit",
  "simpan",
  "pratinjau",
]);

export type TujuanSimpanArtikel = z.infer<typeof tujuanSimpanSchema>;

export function bacaDaftarId(nilai: FormDataEntryValue | null): string[] {
  if (typeof nilai !== "string" || !nilai) return [];

  try {
    const hasil = JSON.parse(nilai);
    if (!Array.isArray(hasil)) return [];
    return hasil.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
  } catch {
    return [];
  }
}
