import { z } from "zod";

/**
 * Pesan error ditulis dengan bahasa yang dipahami pengurus desa.
 * Hindari istilah teknis seperti "invalid", "required", atau "format".
 */
export const skemaMasuk = z.object({
  /**
   * Login memakai NAMA PENGGUNA biasa (mis. "sangge"), bukan alamat email.
   * Kolom penyimpanannya di database secara historis masih bernama `email`,
   * jadi kunci field ini tetap `email` agar sejalan dengan query — tapi
   * isinya teks bebas, TIDAK divalidasi sebagai email. Huruf besar/kecil
   * diseragamkan ke huruf kecil oleh action `masuk` saat mencocokkan.
   */
  email: z.string().trim().min(1, "Nama pengguna belum diisi."),
  kataSandi: z.string().min(1, "Kata sandi belum diisi."),
});

export type DataMasuk = z.infer<typeof skemaMasuk>;

export const skemaGantiKataSandi = z
  .object({
    kataSandiLama: z.string().min(1, "Kata sandi lama belum diisi."),
    kataSandiBaru: z
      .string()
      .min(8, "Kata sandi baru minimal 8 huruf atau angka."),
    ulangiKataSandi: z.string().min(1, "Ulangi kata sandi barunya."),
  })
  .refine((d) => d.kataSandiBaru === d.ulangiKataSandi, {
    path: ["ulangiKataSandi"],
    message: "Kata sandi barunya belum sama. Coba ketik ulang.",
  });
