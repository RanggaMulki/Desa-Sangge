"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { pengguna } from "@/db/schema";
import { skemaMasuk } from "./validasi";
import { buatSesi, hapusSesi } from "./session";

export type StatusMasuk = {
  pesan?: string;
  galatEmail?: string;
  galatKataSandi?: string;
};

export async function masuk(
  _sebelumnya: StatusMasuk,
  formData: FormData,
): Promise<StatusMasuk> {
  const hasil = skemaMasuk.safeParse({
    email: formData.get("email"),
    kataSandi: formData.get("kataSandi"),
  });

  if (!hasil.success) {
    const galat: StatusMasuk = {};
    for (const isu of hasil.error.issues) {
      if (isu.path[0] === "email" && !galat.galatEmail) {
        galat.galatEmail = isu.message;
      }
      if (isu.path[0] === "kataSandi" && !galat.galatKataSandi) {
        galat.galatKataSandi = isu.message;
      }
    }
    return galat;
  }

  const [akun] = await db
    .select()
    .from(pengguna)
    .where(eq(pengguna.email, hasil.data.email.toLowerCase()))
    .limit(1);

  /**
   * Pesan yang sama untuk "nama pengguna tidak terdaftar" dan "kata sandi
   * salah". Kalau dibedakan, orang luar bisa memakai halaman ini untuk
   * menebak nama pengguna mana yang punya akun admin.
   */
  const pesanGagal = "Nama pengguna atau kata sandi salah. Coba periksa lagi.";

  if (!akun || !akun.aktif) return { pesan: pesanGagal };

  const cocok = await bcrypt.compare(hasil.data.kataSandi, akun.kataSandiHash);
  if (!cocok) return { pesan: pesanGagal };

  await buatSesi({ penggunaId: akun.id, nama: akun.nama });

  // Kembali ke halaman admin yang tadi dituju (disetel middleware sebagai
  // ?lanjut), tapi hanya kalau alamatnya benar-benar di dalam /admin. Tanpa
  // pemeriksaan ini, `lanjut` yang dikarang bisa dipakai mengalihkan ke situs
  // luar (open redirect). "//..." ditolak karena browser memperlakukannya
  // sebagai alamat absolut ke domain lain.
  const lanjut = formData.get("lanjut");
  const tujuan =
    typeof lanjut === "string" &&
    lanjut.startsWith("/admin") &&
    !lanjut.startsWith("//") &&
    lanjut !== "/admin/masuk"
      ? lanjut
      : "/admin";

  // redirect() bekerja dengan melempar, jadi harus di luar blok try/catch.
  redirect(tujuan);
}

export async function keluar(): Promise<void> {
  await hapusSesi();
  redirect("/admin/masuk");
}
